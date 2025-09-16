"use client";

import { Hero } from "@/components/Hero";
import { Bento } from "@/components/Bento";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#01030F]">
      <Hero />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Bento />
      </div>
       <div className="flex-grow">
      <Footer />
      </div>
    </div>
  );
}
