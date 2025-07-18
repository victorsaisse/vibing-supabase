"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

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

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs flex flex-col gap-4 bg-card p-6 rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-bold mb-2 text-center">Enter your email</h1>
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
  );
}
