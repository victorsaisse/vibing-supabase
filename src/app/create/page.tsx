"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const COLORS = [
  "#f87171", // red
  "#fbbf24", // yellow
  "#34d399", // green
  "#60a5fa", // blue
  "#a78bfa", // purple
  "#f472b6", // pink
  "#facc15", // gold
  "#38bdf8", // sky
];

export default function CreatePage() {
  const { user, setApartment } = useAuth();
  const router = useRouter();
  const [apartment, setApartmentName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apartment.trim()) {
      setError("Please enter an apartment name.");
      return;
    }
    setError("");
    setApartment(apartment, color);
    router.push("/ranking");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs flex flex-col gap-4 bg-card p-6 rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-bold mb-2 text-center">Create your apartment</h1>
        <Input
          type="text"
          placeholder="Apartment name"
          value={apartment}
          onChange={(e) => setApartmentName(e.target.value)}
          required
        />
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          {COLORS.map((c) => (
            <button
              type="button"
              key={c}
              className={`w-8 h-8 rounded-full border-2 ${color === c ? "border-ring scale-110" : "border-transparent"}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
              aria-label={`Pick color ${c}`}
            />
          ))}
        </div>
        {error && <span className="text-destructive text-sm">{error}</span>}
        <Button type="submit" className="w-full mt-2">
          Proceed to Ranking
        </Button>
      </form>
    </div>
  );
} 