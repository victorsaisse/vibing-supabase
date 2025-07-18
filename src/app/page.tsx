"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    router.push("/create");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold text-center mb-4">Vibing with Supabase</h1>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xs flex flex-col gap-4 bg-card p-6 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-bold mb-2 text-center">Enter your email</h2>
        <Input
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
          <Button type="submit" className="w-full mt-2">
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
