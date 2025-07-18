"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

// For demo, keep apartments in local state
interface Apartment {
  name: string;
  color: string;
  votes: number;
  owner: string; // email
}

export default function RankingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [hasVoted, setHasVoted] = useState<{ [name: string]: boolean }>({});

  useEffect(() => {
    if (!user || !user.apartmentName || !user.color) {
      router.replace("/");
      return;
    }
    // On mount, add user's apartment if not present
    setApartments((prev) => {
      if (prev.some((a) => a.name === user.apartmentName)) return prev;
      return [
        ...prev,
        {
          name: user.apartmentName!,
          color: user.color!,
          votes: 1,
          owner: user.email,
        },
      ];
    });
  }, [user, router]);

  const handleUpvote = (name: string) => {
    if (hasVoted[name]) return;
    setApartments((prev) =>
      prev.map((a) =>
        a.name === name ? { ...a, votes: a.votes + 1 } : a
      )
    );
    setHasVoted((prev) => ({ ...prev, [name]: true }));
  };

  // Sort apartments by votes descending
  const sorted = [...apartments].sort((a, b) => b.votes - a.votes);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-card p-6 rounded-lg shadow-md flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Apartment Ranking</h1>
        <ul className="flex flex-col gap-3">
          {sorted.map((apt) => (
            <li
              key={apt.name}
              className="flex items-center gap-3 p-3 rounded-lg border bg-muted"
            >
              <span
                className="w-8 h-8 rounded-full border"
                style={{ background: apt.color }}
                aria-label={apt.name}
              />
              <span className="flex-1 font-semibold truncate">{apt.name}</span>
              <span className="font-mono text-lg">{apt.votes}</span>
              <Button
                size="sm"
                variant="outline"
                disabled={hasVoted[apt.name] || apt.owner === user?.email}
                onClick={() => handleUpvote(apt.name)}
              >
                ▲
              </Button>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-center text-xs text-muted-foreground">
          Your apartment: <span className="font-bold">{user?.apartmentName}</span>
        </div>
      </div>
    </div>
  );
} 