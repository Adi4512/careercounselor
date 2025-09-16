"use client";

import { NavbarComponent } from "@/components/NavbarComponent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Target, Lightbulb, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#01030F] text-white">
      {/* Navigation */}
      <div className="relative z-50">
        <NavbarComponent />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 pt-32 pb-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Empowering Careers
            <span className="block text-gray-300 mt-2">Through AI</span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            We believe everyone deserves personalized career guidance. Our AI-powered platform makes professional development accessible, insightful, and actionable.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-6xl mx-auto px-8 mb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-300 mb-6">
              To democratize career guidance by making personalized, AI-powered career counseling accessible to everyone, regardless of their background or financial situation.
            </p>
            <p className="text-lg text-gray-300">
              We're building the future where career decisions are data-driven, personalized, and empowering for every professional.
            </p>
          </div>
          <div className="bg-[#1a1a1a] rounded-lg p-8 border border-gray-800">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-[#10a37f] p-3 rounded-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Clear Direction</h3>
                  <p className="text-gray-300">Help professionals find their true career path with data-driven insights.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-[#10a37f] p-3 rounded-lg">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Smart Guidance</h3>
                  <p className="text-gray-300">Leverage AI to provide personalized, actionable career advice.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-[#10a37f] p-3 rounded-lg">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Empowerment</h3>
                  <p className="text-gray-300">Give everyone the tools to build the career they truly want.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      

      {/* Values Section */}
      <div className="max-w-6xl mx-auto px-8 mb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">Our Values</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            The principles that guide everything we do at Elevare AI.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-[#10a37f] w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Transparency</h3>
            <p className="text-gray-300">Clear, honest communication about how our AI works and makes decisions.</p>
          </div>

          <div className="text-center">
            <div className="bg-[#10a37f] w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Inclusivity</h3>
            <p className="text-gray-300">Career guidance accessible to everyone, regardless of background or circumstances.</p>
          </div>

          <div className="text-center">
            <div className="bg-[#10a37f] w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Innovation</h3>
            <p className="text-gray-300">Continuously improving our AI to provide better, more personalized guidance.</p>
          </div>

          <div className="text-center">
            <div className="bg-[#10a37f] w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Empathy</h3>
            <p className="text-gray-300">Understanding that career decisions are deeply personal and emotional.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-8 text-center">
        <div className="bg-[#1a1a1a] rounded-2xl p-12 border border-gray-800">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Career?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already using AI to accelerate their career growth.
          </p>
          <Button className="bg-[#10a37f] hover:bg-[#0d8a6b] text-white px-8 py-3 text-lg">
            Start Your Journey
          </Button>
        </div>
      </div>
    </div>
  );
}
