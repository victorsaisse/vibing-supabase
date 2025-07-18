"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export const Header = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="w-full bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <span className="text-sm text-muted-foreground">
            {user.email}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="h-8"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}; 