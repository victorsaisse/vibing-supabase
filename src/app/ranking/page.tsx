"use client";

import { ApartmentModal } from "@/components/ApartmentModal";
import { ApartmentPreview } from "@/components/ApartmentPreview";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// For demo, keep apartments in local state
interface Apartment {
  email: string;
  leftWallColor: string;
  rightWallColor: string;
  selectedSofa: string;
  selectedMirror: string;
  votes: number;
}

export default function RankingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [hasVoted, setHasVoted] = useState<{ [email: string]: boolean }>({});
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user || !user.leftWallColor || !user.rightWallColor || !user.selectedSofa || !user.selectedMirror) {
      router.replace("/");
      return;
    }
    // On mount, add user's apartment if not present
    setApartments((prev) => {
      if (prev.some((a) => a.email === user.email)) return prev;
      return [
        ...prev,
        {
          email: user.email,
          leftWallColor: user.leftWallColor!,
          rightWallColor: user.rightWallColor!,
          selectedSofa: user.selectedSofa!,
          selectedMirror: user.selectedMirror!,
          votes: 1,
        },
      ];
    });
  }, [user, router]);

  const handleUpvote = (email: string) => {
    if (hasVoted[email]) return;
    setApartments((prev) =>
      prev.map((a) =>
        a.email === email ? { ...a, votes: a.votes + 1 } : a
      )
    );
    setHasVoted((prev) => ({ ...prev, [email]: true }));
  };

  const handleApartmentClick = (apartment: Apartment) => {
    setSelectedApartment(apartment);
    setIsModalOpen(true);
  };

  // Sort apartments by votes descending
  const sorted = [...apartments].sort((a, b) => b.votes - a.votes);

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-card p-6 rounded-lg shadow-md flex flex-col gap-4">
          <h1 className="text-2xl font-bold mb-4 text-center">Apartment Ranking</h1>
          <ul className="flex flex-col gap-3">
            {sorted.map((apt) => (
              <li
                key={apt.email}
                className="flex items-center gap-3 p-3 rounded-lg border bg-muted"
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
                  variant="outline"
                  disabled={hasVoted[apt.email] || apt.email === user?.email}
                  onClick={() => handleUpvote(apt.email)}
                >
                  ▲
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