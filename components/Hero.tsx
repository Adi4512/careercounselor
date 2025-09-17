"use client";

import { NavbarComponent } from "@/components/NavbarComponent";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
export const Hero = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpening, setIsOpening] = useState(false);

  const handleGetStarted = async () => {
    if (session) {
      try {
        setIsOpening(true);
        await router.push('/chat');
      } finally {
        // Keep the loading state until route transition completes (Next will replace the page)
      }
    } else {
      // If not signed in, the navbar will handle the sign-in flow
      // which will redirect to chat after successful authentication
      const signInButton = document.querySelector('[data-signin-button]') as HTMLButtonElement;
      signInButton?.click();
    }
  };

  return (
    <div className="min-h-screen bg-[#01030F] text-white relative overflow-hidden">
      {/* Background Stars - Hidden on mobile */}
      <div className="hidden lg:block absolute top-20 right-40">
        <Image src="/Stars.webp" alt="stars" width={500} height={500} className="w-[500px] h-[500px]" />
      </div>
      <div className="hidden lg:block absolute top-45 left-45 opacity-20">
        <Image src="/Stars.webp" alt="stars" width={300} height={400} className="w-[300px] h-[400px]" />
      </div>
      <div className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 z-0">
        <div className="relative">
          <Image src="/Elements.webp" alt="Elements" width={500} height={500} className="w-[500px] h-auto" />
          {/* Top fade mask - fades to transparent */}
          <div className="absolute top-20 left-0 right-0 h-52 bg-gradient-to-b from-[#01030F] to-transparent pointer-events-none mix-blend-multiply"></div>
          {/* Bottom fade mask - fades to transparent */}
          <div className="absolute bottom-20 left-0 right-0 h-52 bg-gradient-to-t from-[#01030F] to-transparent pointer-events-none mix-blend-multiply"></div>
        </div>
      </div>
        
      {/* Gradient at bottom left - Responsive sizing */}
      <div className="absolute bottom-0 left-0 z-0">
        <Image src="/Gradient.webp" alt="Gradient" width={400} height={400} className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] lg:w-[400px] lg:h-[400px]" />
      </div>
        
      {/* Navigation Bar */}
      <div className="relative z-50">
        <NavbarComponent />
      </div>

      {/* Main Content - Responsive layout */}
      <div className="relative z-10 flex flex-col lg:flex-row h-[calc(100vh-80px)] items-center justify-between px-4 sm:px-6 lg:px-8 pt-20 mt-10">
        {/* Left Side - Text Content */}
        <div className="relative z-20 flex-1 max-w-2xl flex flex-col justify-start lg:justify-center h-full lg:ml-20 text-center lg:text-left pt-16 sm:pt-20 lg:pt-0">
          {/* Mobile background overlay for better text readability */}
          <div className="absolute inset-0 bg-transparent  rounded-2xl lg:bg-transparent lg:backdrop-blur-none -z-10"></div>
          
          {/* New Tag */}
          <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-black/80 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8 border border-gray-600/50 w-fit shadow-lg mx-auto lg:mx-0 relative z-10">
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
            <span className="text-white">AI-Powered Career Growth Starts Here</span>
          </div>

          {/* Main Headline */}
          <h1 className="relative z-10 text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold leading-snug md:leading-tight mb-6 sm:mb-8">
            <span className="block text-white">Transform Your</span>
            <span className="mt-2 text-gray-300 relative inline-block">
              <Image
                src="/TextGlow.webp"
                alt="Text Glow"
                width={500}
                height={300}
                className="hidden lg:block absolute top-1/2 left-[40%] transform -translate-x-1/2 -translate-y-1/2 opacity-90 brightness-150 contrast-125 w-[500px] h-[300px] pointer-events-none -z-10"
              />
              Career with AI
            </span>
          </h1>

          {/* Description */}
          <p className="relative z-10 text-base sm:text-lg md:text-xl text-[#FFFFE3] sm:text-gray-300 mb-8 sm:mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
            From career discovery to planning, Elevare AI helps you make confident
            decisions with personalized insights.
          </p>

          {/* Get Started Button */}
          <div className="relative z-10 flex justify-center lg:justify-start">
            <InteractiveHoverButton 
              className={`text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-2 sm:py-3 dark ${isOpening ? 'pointer-events-none opacity-80' : ''}`}
              onClick={handleGetStarted}
            >
              {session ? (isOpening ? 'Opening chat…' : 'Start Chatting') : 'Unlock Your Future'}
            </InteractiveHoverButton>
          </div>
        </div>

        {/* Right Side - AI Figure - Full coverage background on mobile, visible on larger screens */}
        <div className="absolute inset-0 lg:relative lg:flex lg:flex-1 lg:items-center lg:justify-center lg:h-full -z-10 lg:z-auto">
          {/* AI Figure Container */}
          <div className="relative flex items-end justify-center w-full h-full pt-20 sm:pt-24 lg:pt-0 lg:items-center">
            {/* Background Glow Effects - Behind the model */}
            <div className="absolute inset-0 z-10 flex items-end justify-center pt-20 sm:pt-24 lg:pt-0 lg:items-center">
              <Image
                src="/ModelGlow.webp" 
                alt="AI Glow Effect" 
                width={800}
                height={900}
                className="w-full h-full sm:w-[500px] sm:h-[600px] lg:w-[600px] lg:h-[700px] xl:w-[800px] xl:h-[900px] object-cover sm:object-contain opacity-60 lg:opacity-90" 
              />
            </div>
            
            {/* AI Model Image */}
            <div className="relative z-20">
              <Image 
                src="/AImodel.webp" 
                alt="Elevare AI" 
                width={700}
                height={800}
                className="w-full h-full sm:w-[400px] sm:h-[500px] lg:w-[500px] lg:h-[600px] xl:w-[700px] xl:h-[800px] object-cover sm:object-contain opacity-80 lg:opacity-100" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
