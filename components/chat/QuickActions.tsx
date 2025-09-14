"use client";

import { 
  Briefcase, 
  Target, 
  GraduationCap, 
  TrendingUp, 
  Users, 
  FileText,
  Lightbulb,
  Star
} from 'lucide-react';

interface QuickActionsProps {
  onActionClick: (action: string) => void;
}

const quickActions = [
  {
    id: 'career-assessment',
    title: 'Career Assessment',
    description: 'Evaluate your skills and interests',
    icon: Target,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10'
  },
  {
    id: 'resume-review',
    title: 'Resume Review',
    description: 'Get feedback on your resume',
    icon: FileText,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10'
  },
  {
    id: 'interview-prep',
    title: 'Interview Prep',
    description: 'Practice common questions',
    icon: Users,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10'
  },
  {
    id: 'skill-gap',
    title: 'Skill Gap Analysis',
    description: 'Identify missing skills',
    icon: TrendingUp,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10'
  },
  {
    id: 'networking',
    title: 'Networking Tips',
    description: 'Build professional connections',
    icon: Users,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10'
  },
  {
    id: 'salary-negotiation',
    title: 'Salary Negotiation',
    description: 'Learn negotiation strategies',
    icon: Briefcase,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10'
  },
  {
    id: 'career-change',
    title: 'Career Change',
    description: 'Navigate career transitions',
    icon: GraduationCap,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10'
  },
  {
    id: 'leadership',
    title: 'Leadership Development',
    description: 'Build leadership skills',
    icon: Star,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10'
  }
];

export default function QuickActions({ onActionClick }: QuickActionsProps) {
  return (
    <div className="space-y-3 max-h-80 overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-medium text-white">Quick Actions</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              className={`w-full justify-start p-3 h-auto text-left hover:bg-gray-800/50 rounded-lg transition-colors ${action.bgColor}`}
              onClick={() => onActionClick(action.id)}
            >
              <div className="flex items-start gap-3 w-full">
                <div className={`p-2 rounded-lg ${action.bgColor}`}>
                  <IconComponent className={`w-4 h-4 ${action.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white">
                    {action.title}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {action.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
