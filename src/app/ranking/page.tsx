"use client";

import { ApartmentModal } from "@/components/ApartmentModal";
import { ApartmentPreview } from "@/components/ApartmentPreview";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getApartments, getUserVotes, removeVoteForApartment, subscribeToApartments, voteForApartment, type Apartment as SupabaseApartment } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Convert Supabase apartment to our component format
interface Apartment {
  email: string;
  leftWallColor: string;
  rightWallColor: string;
  selectedSofa: string;
  selectedMirror: string;
  votes: number;
}

export default function RankingPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [hasVoted, setHasVoted] = useState<{ [email: string]: boolean }>({});
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Convert Supabase apartment to component format
  const convertApartment = (apt: SupabaseApartment): Apartment => ({
    email: apt.email,
    leftWallColor: apt.left_wall_color,
    rightWallColor: apt.right_wall_color,
    selectedSofa: apt.selected_sofa,
    selectedMirror: apt.selected_mirror,
    votes: apt.votes,
  });

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load
    
    if (!user) {
      router.replace("/");
      return;
    }

    // Load apartments and user votes from database
    const loadData = async () => {
      try {
        const [apartmentsResult, votesResult] = await Promise.all([
          getApartments(),
          getUserVotes(user.email)
        ]);

        if (apartmentsResult.data) {
          setApartments(apartmentsResult.data.map(convertApartment));
        }

        if (votesResult.data) {
          const voted: { [email: string]: boolean } = {};
          votesResult.data.forEach(vote => {
            voted[vote.apartment_email] = true;
          });
          setHasVoted(voted);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Subscribe to real-time updates
    const subscription = subscribeToApartments((updatedApartments) => {
      setApartments(updatedApartments.map(convertApartment));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user, authLoading, router]);

  const handleVoteToggle = async (email: string) => {
    if (!user) return;
    
    const isCurrentlyVoted = hasVoted[email];
    const voteChange = isCurrentlyVoted ? -1 : 1;
    
    // Optimistic update - update UI immediately
    setHasVoted((prev) => ({ ...prev, [email]: !isCurrentlyVoted }));
    setApartments((prev) =>
      prev.map((a) =>
        a.email === email ? { ...a, votes: a.votes + voteChange } : a
      )
    );
    
    try {
      const result = isCurrentlyVoted 
        ? await removeVoteForApartment(user.email, email)
        : await voteForApartment(user.email, email);
        
      if (result.error) {
        // Revert optimistic update on error
        setHasVoted((prev) => ({ ...prev, [email]: isCurrentlyVoted }));
        setApartments((prev) =>
          prev.map((a) =>
            a.email === email ? { ...a, votes: a.votes - voteChange } : a
          )
        );
        console.error("Error toggling vote:", result.error);
      }
    } catch (error) {
      // Revert optimistic update on error
      setHasVoted((prev) => ({ ...prev, [email]: isCurrentlyVoted }));
      setApartments((prev) =>
        prev.map((a) =>
          a.email === email ? { ...a, votes: a.votes - voteChange } : a
        )
      );
      console.error("Error toggling vote:", error);
    }
  };

  const handleApartmentClick = (apartment: Apartment) => {
    setSelectedApartment(apartment);
    setIsModalOpen(true);
  };

  const refreshApartments = async () => {
    try {
      const { data } = await getApartments();
      if (data) {
        setApartments(data.map(convertApartment));
      }
    } catch (error) {
      console.error("Error refreshing apartments:", error);
    }
  };

  // Sort apartments by votes descending
  const sorted = [...apartments].sort((a, b) => b.votes - a.votes);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-card p-6 rounded-lg shadow-md flex flex-col gap-4">
          <h1 className="text-2xl font-bold mb-4 text-center">Apartment Ranking</h1>
          <div className="text-center">Loading apartments...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-card p-6 rounded-lg shadow-md flex flex-col gap-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-center flex-1">Apartment Ranking</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshApartments}
              className="ml-2"
            >
              🔄
            </Button>
          </div>
          <ul className="flex flex-col gap-3">
            {sorted.map((apt) => (
              <li
                key={apt.email}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  hasVoted[apt.email] 
                    ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800" 
                    : "bg-muted"
                }`}
              >
                <button
                  className="w-16 h-16 border rounded overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleApartmentClick(apt)}
                  aria-label={`View ${apt.email}'s apartment`}
                >
                  <ApartmentPreview
                    leftWallColor={apt.leftWallColor}
                    rightWallColor={apt.rightWallColor}
                    selectedSofa={apt.selectedSofa}
                    selectedMirror={apt.selectedMirror}
                    className="w-16 h-16"
                  />
                </button>
                <span className="flex-1 font-semibold truncate">{apt.email}</span>
                <span className="font-mono text-lg">{apt.votes}</span>
                <Button
                  size="sm"
                  variant={hasVoted[apt.email] ? "default" : "outline"}
                  disabled={apt.email === user?.email}
                  onClick={() => handleVoteToggle(apt.email)}
                  className={hasVoted[apt.email] ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {hasVoted[apt.email] ? "▼" : "▲"}
                </Button>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-center text-xs text-muted-foreground">
            Your apartment: <span className="font-bold">{user?.email}</span>
          </div>
        </div>
      </div>

      <ApartmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        apartment={selectedApartment}
      />
    </>
  );
} 