import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types based on your schema
export interface Apartment {
  id: number
  email: string
  left_wall_color: string
  right_wall_color: string
  selected_sofa: string
  selected_mirror: string
  votes: number
  created_at: string
  updated_at: string
}

export interface ApartmentVote {
  id: number
  voter_email: string
  apartment_email: string
  created_at: string
}

// Database operations
export const upsertApartment = async (apartment: {
  email: string
  left_wall_color: string
  right_wall_color: string
  selected_sofa: string
  selected_mirror: string
}) => {
  const { data, error } = await supabase
    .from('apartments')
    .upsert(apartment, { 
      onConflict: 'email',
      ignoreDuplicates: false 
    })
    .select()
  
  if (error) console.error('Error upserting apartment:', error)
  return { data, error }
}

export const getApartments = async () => {
  const { data, error } = await supabase
    .from('apartments')
    .select('*')
    .order('votes', { ascending: false })
  
  if (error) console.error('Error fetching apartments:', error)
  return { data, error }
}

export const voteForApartment = async (voterEmail: string, apartmentEmail: string) => {
  console.log('Attempting to vote:', { voterEmail, apartmentEmail });
  
  const { data, error } = await supabase
    .from('apartment_votes')
    .insert({
      voter_email: voterEmail,
      apartment_email: apartmentEmail
    })
    .select()
  
  if (error) {
    console.error('Error voting:', error);
  } else {
    console.log('Vote successful:', data);
  }
  
  return { data, error }
}

export const removeVoteForApartment = async (voterEmail: string, apartmentEmail: string) => {
  console.log('Attempting to remove vote:', { voterEmail, apartmentEmail });
  
  const { data, error } = await supabase
    .from('apartment_votes')
    .delete()
    .eq('voter_email', voterEmail)
    .eq('apartment_email', apartmentEmail)
    .select()
  
  if (error) {
    console.error('Error removing vote:', error);
  } else {
    console.log('Vote removal successful:', data);
  }
  
  return { data, error }
}

export const getUserVotes = async (voterEmail: string) => {
  const { data, error } = await supabase
    .from('apartment_votes')
    .select('apartment_email')
    .eq('voter_email', voterEmail)
  
  if (error) console.error('Error fetching votes:', error)
  return { data, error }
}

export const subscribeToApartments = (callback: (apartments: Apartment[]) => void) => {
  return supabase
    .channel('apartments_channel')
    .on(
      'postgres_changes',
      { 
        event: '*', 
        schema: 'public', 
        table: 'apartments' 
      },
      async (payload) => {
        console.log('Real-time update received:', payload);
        const { data } = await getApartments();
        if (data) {
          console.log('Updating apartments:', data.length);
          callback(data);
        }
      }
    )
    .subscribe((status) => {
      console.log('Subscription status:', status);
    });
}