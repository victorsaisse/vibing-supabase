"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { user, login, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if user is already logged in
  useEffect(() => {
    if (!isLoading && user) {
      router.push("/ranking");
    }
  }, [user, isLoading, router]);

  const validateEmail = (email: string) => {
    return /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    login(email);
    router.push("/create");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

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
          {error && <span className="text-destructive text-sm">{error}</span>}
          <Button type="submit" className="w-full mt-2">
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
