import { cn } from "@/lib/utils";
import {
  IconBrain,
  IconFileText,
  IconMessageCircle,
  IconTrendingUp,
  IconUsers,
  IconTarget,
  IconBulb,
  IconStar,
} from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/Footer";

export function Bento() {
  const features = [
    {
      title: "AI Career Counselor",
      description:
        "Get personalized career guidance powered by advanced AI that understands your unique background and goals.",
      icon: <IconBrain />,
    },
    {
      title: "Resume Analysis",
      description:
        "Instant feedback on your resume with AI-powered analysis and optimization tips to stand out.",
      icon: <IconFileText />,
    },
    {
      title: "Interview Preparation",
      description:
        "Practice with AI-powered mock interviews tailored to your target role and industry.",
      icon: <IconMessageCircle />,
    },
    {
      title: "Salary Negotiation",
      description: "Learn proven negotiation strategies and get market insights to maximize your earning potential.",
      icon: <IconTrendingUp />,
    },
    {
      title: "Skill Gap Analysis",
      description: "Identify skill gaps and get personalized learning recommendations for your career goals.",
      icon: <IconTarget />,
    },
    {
      title: "Network Strategy",
      description:
        "Build meaningful professional connections with AI-guided networking strategies and tips.",
      icon: <IconUsers />,
    },
    {
      title: "Career Roadmapping",
      description:
        "Get a clear, actionable roadmap from where you are to where you want to be in your career.",
      icon: <IconBulb />,
    },
    {
      title: "Success Tracking",
      description: "Monitor your progress and celebrate milestones as you advance in your professional journey.",
      icon: <IconStar />,
    },
  ];
  
  return (
    <div className="bg-[#01030F] text-white">
      {/* Features Section */}
      <div className="pt-20 pb-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto px-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-black/80 backdrop-blur-sm rounded-full text-sm font-medium mb-8 border border-gray-600/50 w-fit shadow-lg mx-auto">
            <div className="w-2 h-2 bg-[#10a37f] rounded-full animate-pulse"></div>
            <span className="text-white">Comprehensive Career Tools</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything You Need for
            <span className="block text-gray-300 mt-2">Career Success</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            AI-powered tools designed to accelerate your professional growth and unlock new opportunities.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Simple, Transparent
              <span className="block text-gray-300 mt-2">Pricing</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose the plan that fits your career journey. Start free, upgrade when ready.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Free Plan */}
            <Card className="bg-[#1a1a1a] border-gray-800 hover:border-gray-600 transition-colors">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                <p className="text-gray-400 mb-6">Perfect for getting started</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">$0</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">5 conversations per day</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Basic career guidance</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Resume review tips</span>
                  </div>
                </div>
                <Link href="/chat">
                  <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-[#1a1a1a] border-[#10a37f] hover:border-[#0d8a6b] transition-colors relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-[#10a37f] text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              </div>
              <CardContent className="p-8 text-center pt-12">
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <p className="text-gray-400 mb-6">For serious career growth</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">$29</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Unlimited conversations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Advanced AI insights</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Interview preparation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Priority support</span>
                  </div>
                </div>
                <Link href="/chat">
                  <Button className="w-full bg-[#10a37f] hover:bg-[#0d8a6b] text-white">
                    Start Free Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-[#1a1a1a] border-gray-800 hover:border-gray-600 transition-colors">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                <p className="text-gray-400 mb-6">For teams and organizations</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">Custom</span>
                </div>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Everything in Pro</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Team collaboration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Custom integrations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Dedicated support</span>
                  </div>
                </div>
                <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What Our Users
              <span className="block text-gray-300 mt-2">Are Saying</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of professionals who have transformed their careers with Elevare AI.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <Card className="bg-[#1a1a1a] border-gray-800 hover:border-gray-600 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">👩‍💻</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Sarah Johnson</h3>
                    <p className="text-gray-400 text-sm">Software Engineer at Google</p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 italic">
                  "Elevare AI helped me transition from junior to senior role in just 8 months. The personalized roadmap was exactly what I needed."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a1a] border-gray-800 hover:border-gray-600 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">👨‍💼</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Michael Chen</h3>
                    <p className="text-gray-400 text-sm">Product Manager at Microsoft</p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 italic">
                  "The AI's insights about market opportunities opened doors I never knew existed. Career growth has never been clearer."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a1a] border-gray-800 hover:border-gray-600 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">👩‍🎨</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Emily Rodriguez</h3>
                    <p className="text-gray-400 text-sm">UX Designer at Figma</p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 italic">
                  "The interview prep feature is incredible. I landed my dream job at Figma after using the AI's mock interviews."
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link href="/chat">
              <Button className="bg-[#10a37f] hover:bg-[#0d8a6b] text-white px-8 py-4 text-lg">
                Start Your Career Transformation
              </Button>
            </Link>
            <p className="text-gray-400 text-sm mt-4">
              Free to start • No credit card required
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-6 sm:py-8 lg:py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-3 sm:mb-4 relative z-10 px-4 sm:px-6 lg:px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-base sm:text-lg font-bold mb-2 relative z-10 px-4 sm:px-6 lg:px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-4 sm:px-6 lg:px-10">
        {description}
      </p>
    </div>
  );
};
