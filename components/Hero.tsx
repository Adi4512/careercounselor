"use client";

import { NavbarComponent } from "@/components/NavbarComponent";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
export const Hero = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleGetStarted = () => {
    if (session) {
      router.push('/chat');
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
        <img src="./stars.webp" alt="stars" className="w-[500px] h-[500px] " />
      </div>
      <div className="absolute top-45 left-45 opacity-20">
        <img src="./stars.webp" alt="stars" className="w-[300px] h-[400px] " />
      </div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-0">
        <div className="relative">
          <img src="./Elements.webp" alt="Elements" className="w-[500px] h-auto" />
          {/* Top fade mask - fades to transparent */}
          <div className="absolute top-20 left-0 right-0 h-52 bg-gradient-to-b from-[#01030F] to-transparent pointer-events-none mix-blend-multiply"></div>
          {/* Bottom fade mask - fades to transparent */}
          <div className="absolute bottom-20 left-0 right-0 h-52 bg-gradient-to-t from-[#01030F] to-transparent pointer-events-none mix-blend-multiply"></div>
        </div>
      </div>
        
      {/* Gradient at bottom left */}
      <div className="absolute bottom-0 left-0 z-0">
        <img src="./Gradient.webp" alt="Gradient" className="w-auto h-auto" />
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
    <img
      src="./TextGlow.webp"
      alt="Text Glow"
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
              className="text-lg px-8 py-5 dark"
              onClick={handleGetStarted}
            >
              {session ? "Start Chatting" : "Unlock Your Future"}
            </InteractiveHoverButton>
          </div>
        </div>

        {/* Right Side - AI Figure */}
        <div className="flex-1 flex  items-center justify-center relative h-full">
          {/* AI Figure Container */}
          <div className="relative   flex items-center justify-center">
            {/* Background Glow Effects - Behind the model */}
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <img 
                src="./ModelGlow.webp" 
                alt="AI Glow Effect" 
                className="w-[800px] h-[900px] object-contain opacity-90" 
              />
            </div>
            
            {/* AI Model Image */}
            <div className="relative z-20">
              <img 
                src="./AImodel.webp" 
                alt="Elevare AI" 
                className="w-[700px] h-[800px] object-contain" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
