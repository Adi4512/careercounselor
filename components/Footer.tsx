"use client";

import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full bg-[#01030F] text-white relative">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="text-2xl">
              <span className="text-white">Where </span>
              <span className="text-orange-500">AI-powered</span>
              <span className="text-white"> & </span>
              <span className="text-cyan-400">career growth</span>
              <span className="text-white"> meet</span>
            </div>
          </div>

          {/* Explore Section */}
          <div className="space-y-4">
            <h3 className="text-orange-500 font-semibold text-lg">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Me
                </Link>
              </li>
              <li>
                <Link href="/chat" className="text-gray-300 hover:text-white transition-colors">
                  AI Counselor
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Me Section */}
          <div className="space-y-4">
            <h3 className="text-cyan-400 font-semibold text-lg">Follow Me</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">in</span>
                </div>
                <a href="https://www.linkedin.com/in/adityasharma14" target="_blank" rel="noopener noreferrer">
                <span className="text-gray-300">LinkedIn</span>
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-pink-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs">○</span>
                </div>
                <span className="text-gray-300">Dribbble</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center">
                  <span className="text-white text-xs">⚡</span>
                </div>
                <a href="https://github.com/Adi4512/careercounselor" target="_blank" rel="noopener noreferrer">
                <span className="text-gray-300">Github</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-white font-semibold text-lg">Contact Me</h3>
              <span className="text-green-400">→</span>
            </div>
            <p className="text-gray-400 text-sm">Say Hello !</p>
            
            <div className="mt-6">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-white font-semibold text-lg">My Projects</h3>
                <span className="text-green-400">→</span>
              </div>
              <p className="text-gray-400 text-sm">Explore Projects</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section with brand text */}
      <div className="w-full flex items-center justify-center mt-8">
        <div className=" w-full px-6 flex items-center justify-center">
          <h1 className="text-[300px] font-bold text-[#FFFFE3]">
            Elevare AI
          </h1>
        </div>
      </div>
    </footer>
  );
};
