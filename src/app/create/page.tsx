"use client";

import { ApartmentPreview } from "@/components/ApartmentPreview";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const WALL_COLORS = [
  "#f87171", // red
  "#fbbf24", // yellow
  "#34d399", // green
  "#60a5fa", // blue
  "#a78bfa", // purple
  "#f472b6", // pink
  "#facc15", // gold
  "#38bdf8", // sky
];

const SOFAS = [
  "https://uvvctnndpellvuhctmqh.supabase.co/storage/v1/object/public/my-bucket/sofas/sofa-1.png",
  "https://uvvctnndpellvuhctmqh.supabase.co/storage/v1/object/public/my-bucket/sofas/sofa-2.png",
  "https://uvvctnndpellvuhctmqh.supabase.co/storage/v1/object/public/my-bucket/sofas/sofa-3.png",
  "https://uvvctnndpellvuhctmqh.supabase.co/storage/v1/object/public/my-bucket/sofas/sofa-4.png",
];

const MIRRORS = [
  "https://uvvctnndpellvuhctmqh.supabase.co/storage/v1/object/public/my-bucket/mirrors/mirror-1.png",
  "https://uvvctnndpellvuhctmqh.supabase.co/storage/v1/object/public/my-bucket/mirrors/mirror-2.png",
  "https://uvvctnndpellvuhctmqh.supabase.co/storage/v1/object/public/my-bucket/mirrors/mirror-3.png",
];

export default function CreatePage() {
  const { user, setApartment } = useAuth();
  const router = useRouter();
  const [leftWallColor, setLeftWallColor] = useState("#fbbf24"); // yellow default
  const [rightWallColor, setRightWallColor] = useState("#34d399"); // green default
  const [selectedSofa, setSelectedSofa] = useState(SOFAS[0]);
  const [selectedMirror, setSelectedMirror] = useState(MIRRORS[0]);

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApartment(leftWallColor, rightWallColor, selectedSofa, selectedMirror);
    router.push("/ranking");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row justify-center items-start p-4 gap-8">
      {/* Preview Section */}
      <div className="flex flex-col items-center gap-4 w-full">
        <h2 className="text-xl font-semibold">Preview</h2>
        <div className="w-full aspect-square">
          <ApartmentPreview
            leftWallColor={leftWallColor}
            rightWallColor={rightWallColor}
            selectedSofa={selectedSofa}
            selectedMirror={selectedMirror}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col gap-6 bg-card p-6 rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-bold text-center">Create your apartment</h1>

        {/* Left Wall Color */}
        <div>
          <label className="block text-sm font-medium mb-2">Left Wall Color</label>
          <div className="flex flex-wrap gap-2">
            {WALL_COLORS.map((color) => (
              <button
                type="button"
                key={`left-${color}`}
                className={`w-8 h-8 rounded-full border-2 ${leftWallColor === color ? "border-ring scale-110" : "border-transparent"}`}
                style={{ background: color }}
                onClick={() => setLeftWallColor(color)}
                aria-label={`Pick left wall color ${color}`}
              />
            ))}
          </div>
        </div>

        {/* Right Wall Color */}
        <div>
          <label className="block text-sm font-medium mb-2">Right Wall Color</label>
          <div className="flex flex-wrap gap-2">
            {WALL_COLORS.map((color) => (
              <button
                type="button"
                key={`right-${color}`}
                className={`w-8 h-8 rounded-full border-2 ${rightWallColor === color ? "border-ring scale-110" : "border-transparent"}`}
                style={{ background: color }}
                onClick={() => setRightWallColor(color)}
                aria-label={`Pick right wall color ${color}`}
              />
            ))}
          </div>
        </div>

        {/* Sofa Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Choose Sofa</label>
          <div className="grid grid-cols-2 gap-2">
            {SOFAS.map((sofa, index) => (
              <button
                type="button"
                key={sofa}
                className={`relative aspect-square border-2 rounded-lg overflow-hidden ${selectedSofa === sofa ? "border-ring" : "border-transparent"}`}
                onClick={() => setSelectedSofa(sofa)}
              >
                <Image
                  src={sofa}
                  alt={`Sofa ${index + 1}`}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Mirror Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Choose Mirror</label>
          <div className="grid grid-cols-3 gap-2">
            {MIRRORS.map((mirror, index) => (
              <button
                type="button"
                key={mirror}
                className={`relative aspect-square border-2 rounded-lg overflow-hidden ${selectedMirror === mirror ? "border-ring" : "border-transparent"}`}
                onClick={() => setSelectedMirror(mirror)}
              >
                <Image
                  src={mirror}
                  alt={`Mirror ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full mt-2">
          Save & Proceed to Ranking
        </Button>
      </form>
    </div>
  );
} 