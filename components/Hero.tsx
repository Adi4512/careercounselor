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
    <div className="h-screen bg-[#01030F] text-white relative overflow-hidden">
      {/* Background Stars */}
      <div className="absolute top-20 right-40 ">
        <Image src="/Stars.webp" alt="stars" width={500} height={500} className="w-[500px] h-[500px]" />
      </div>
      <div className="absolute top-45 left-45 opacity-20">
        <Image src="/Stars.webp" alt="stars" width={300} height={400} className="w-[300px] h-[400px]" />
      </div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-0">
        <div className="relative">
          <Image src="/Elements.webp" alt="Elements" width={500} height={500} className="w-[500px] h-auto" />
          {/* Top fade mask - fades to transparent */}
          <div className="absolute top-20 left-0 right-0 h-52 bg-gradient-to-b from-[#01030F] to-transparent pointer-events-none mix-blend-multiply"></div>
          {/* Bottom fade mask - fades to transparent */}
          <div className="absolute bottom-20 left-0 right-0 h-52 bg-gradient-to-t from-[#01030F] to-transparent pointer-events-none mix-blend-multiply"></div>
        </div>
      </div>
        
      {/* Gradient at bottom left */}
      <div className="absolute bottom-0 left-0 z-0">
        <Image src="/Gradient.webp" alt="Gradient" width={400} height={400} className="w-auto h-auto" />
      </div>
        
      {/* Navigation Bar */}
      <div className="relative z-50">
        <NavbarComponent />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex h-[calc(100vh-80px)] items-center justify-between px-8 pt-20 mt-10">
        {/* Left Side - Text Content */}
        <div className="flex-1 max-w-2xl flex flex-col justify-center h-full ml-20">
          {/* New Tag */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-black/80 backdrop-blur-sm rounded-full text-sm font-medium mb-8 border border-gray-600/50 w-fit shadow-lg">
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
            <span className="text-white">AI-Powered Career Growth Starts Here</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl md:text-6xl font-bold leading-snug md:leading-tight mb-8 text-center md:text-left">
  <span className="block text-white">Transform Your
  </span>
  <span className=" mt-2 text-gray-300 relative inline-block">
    <Image
      src="/TextGlow.webp"
      alt="Text Glow"
      width={500}
      height={300}
      className="absolute top-1/2 left-[40%] transform -translate-x-1/2 -translate-y-1/2 opacity-90 brightness-150 contrast-125 w-[500px] h-[300px] pointer-events-none -z-10"
    />
     Career with AI
  </span>
</h1>

{/* Description */}
<p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-xl text-center md:text-left">
  From career discovery to planning, Elevare AI helps you make confident
  decisions with personalized insights.
</p>


          {/* Get Started Button */}
          <div className="flex justify-start">
            <InteractiveHoverButton 
              className={`text-lg px-8 py-3 dark ${isOpening ? 'pointer-events-none opacity-80' : ''}`}
              onClick={handleGetStarted}
            >
              {session ? (isOpening ? 'Opening chat…' : 'Start Chatting') : 'Unlock Your Future'}
            </InteractiveHoverButton>
          </div>
        </div>

        {/* Right Side - AI Figure */}
        <div className="flex-1 flex  items-center justify-center relative h-full">
          {/* AI Figure Container */}
          <div className="relative   flex items-center justify-center">
            {/* Background Glow Effects - Behind the model */}
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <Image 
                src="/ModelGlow.webp" 
                alt="AI Glow Effect" 
                width={800}
                height={900}
                className="w-[800px] h-[900px] object-contain opacity-90" 
              />
            </div>
            
            {/* AI Model Image */}
            <div className="relative z-20">
              <Image 
                src="/AImodel.webp" 
                alt="Elevare AI" 
                width={700}
                height={800}
                className="w-[700px] h-[800px] object-contain" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
