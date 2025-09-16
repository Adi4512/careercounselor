"use client";

import { NavbarComponent } from "@/components/NavbarComponent";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Quote } from "lucide-react";
import Link from "next/link";

export default function TestimonialsPage() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "Google",
      content: "Elevare AI helped me transition from a junior developer to a senior role in just 8 months. The personalized career roadmap was exactly what I needed.",
      rating: 5,
      image: "👩‍💻"
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      company: "Microsoft",
      content: "I was stuck in my career for years. The AI's insights about my strengths and market opportunities opened doors I never knew existed.",
      rating: 5,
      image: "👨‍💼"
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      company: "Figma",
      content: "The interview preparation feature is incredible. I landed my dream job at Figma after using Elevare AI's mock interviews and feedback.",
      rating: 5,
      image: "👩‍🎨"
    },
    {
      name: "David Kim",
      role: "Data Scientist",
      company: "Netflix",
      content: "As someone switching careers from finance to tech, Elevare AI provided the perfect guidance. The AI understood my background and created a realistic transition plan.",
      rating: 5,
      image: "👨‍🔬"
    },
    {
      name: "Lisa Wang",
      role: "Marketing Director",
      company: "Shopify",
      content: "The salary negotiation advice alone paid for the subscription 10x over. I got a 40% raise using the AI's negotiation strategies.",
      rating: 5,
      image: "👩‍💼"
    },
    {
      name: "Alex Thompson",
      role: "Startup Founder",
      company: "TechCorp",
      content: "Elevare AI helped me understand what skills I needed to build a successful startup. The market analysis and skill gap identification were spot-on.",
      rating: 5,
      image: "👨‍🚀"
    }
  ];

  const stats = [
    { number: "50K+", label: "Professionals Helped" },
    { number: "95%", label: "Success Rate" },
    { number: "4.9/5", label: "User Rating" },
    { number: "30%", label: "Average Salary Increase" }
  ];

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
            Success Stories
            <span className="block text-gray-300 mt-2">From Real Users</span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            See how professionals across industries are transforming their careers with AI-powered guidance.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-8 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#10a37f] mb-2">
                {stat.number}
              </div>
              <div className="text-gray-300 text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="max-w-7xl mx-auto px-8 mb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-[#1a1a1a] border-gray-800 hover:border-gray-600 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{testimonial.image}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{testimonial.name}</h3>
                    <p className="text-gray-400 text-sm">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 w-6 h-6 text-[#10a37f] opacity-20" />
                  <p className="text-gray-300 italic pl-4">
                    "{testimonial.content}"
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Video Testimonials Section */}
      {/* <div className="max-w-6xl mx-auto px-8 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-6">Hear From Our Users</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Watch real professionals share their career transformation stories.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#1a1a1a] rounded-lg p-8 border border-gray-800">
            <div className="aspect-video bg-gray-800 rounded-lg mb-6 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#10a37f] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-gray-400">Video Testimonial</p>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Sarah's Career Pivot</h3>
            <p className="text-gray-300">"How I went from marketing to tech in 6 months with Elevare AI's guidance."</p>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-8 border border-gray-800">
            <div className="aspect-video bg-gray-800 rounded-lg mb-6 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#10a37f] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-gray-400">Video Testimonial</p>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Mike's Salary Negotiation</h3>
            <p className="text-gray-300">"I increased my salary by 60% using Elevare AI's negotiation strategies."</p>
          </div>
        </div>
      </div> */}

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-8 text-center mb-20">
        <div className="bg-[#1a1a1a] rounded-2xl p-12 border border-gray-800">
          <h2 className="text-3xl font-bold mb-6">Ready to Write Your Success Story?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already transforming their careers with AI-powered guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat">
            <Button className="bg-[#10a37f] hover:bg-[#0d8a6b] text-white px-8 py-3 text-lg">
              Start Free Trial
            </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 px-8 py-3 text-lg">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
