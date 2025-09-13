"use client";

import { Hero } from "@/components/Hero";
import { Bento } from "@/components/Bento";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#01030F]">
      <Hero />
      <div className="w-full max-w-7xl mx-auto px-6 py-16">
        <Bento />
      </div>
    </div>
  );
}
