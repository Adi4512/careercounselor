"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useConversations, useCreateConversation, useUpdateConversation, useDeleteConversation } from '@/hooks/use-trpc-conversations';
import { useSettings, useUpdateSettings, Settings as SettingsType } from '@/hooks/use-trpc-settings';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader,
  SidebarProvider
} from '@/components/ui/sidebar';
import { 
  Settings, 
  HelpCircle, 
  LogOut,
  Plus
} from 'lucide-react';
import ChatWindow from '@/components/chat/ChatWindow';
import ConversationHistory from '@/components/chat/ConversationHistory';
import SettingsModal from '@/components/chat/SettingsModal';



export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // TanStack Query hooks
  const { data: conversations = [] } = useConversations();
  const createConversation = useCreateConversation();
  const updateConversation = useUpdateConversation();
  const deleteConversation = useDeleteConversation();
  const { data: settings = { aiPersonality: 'professional', responseLength: 'detailed', enableNotifications: true, autoSave: true, theme: 'dark' } } = useSettings();
  const updateSettings = useUpdateSettings();
  
  // Local state management
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    
    if (!session) {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  const handleNewConversation = () => {
    createConversation.mutate({
      title: 'New Chat',
      lastMessage: 'Start a new conversation...',
      category: 'general'
    }, {
      onSuccess: (newConversation) => {
        setActiveConversationId(newConversation.id);
      }
    });
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  const handleDeleteConversation = (id: string) => {
    deleteConversation.mutate({ id }, {
      onSuccess: () => {
        if (activeConversationId === id) {
          setActiveConversationId(null);
        }
      }
    });
  };

  const handleRenameConversation = (id: string, newTitle: string) => {
    updateConversation.mutate({
      id,
      updates: { title: newTitle }
    });
  };


  const handleSettingsChange = (newSettings: Partial<SettingsType>) => {
    updateSettings.mutate(newSettings);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#303030] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#303030] m-0 p-0">
        {/* Fixed Sidebar - Leftmost */}
        <div className="w-64   flex-shrink-0" style={{ backgroundColor: '#303030' }}>
          <Sidebar className="h-full dark">
            <SidebarHeader className="bg-[#181818] p-4">
              <button 
                onClick={() => router.push('/')}
                className="flex items-center gap-2 hover:bg-[#303030] rounded-lg transition-opacity w-full text-left"
              >
                <div className="flex h-9 w-8 items-center justify-center rounded-lg">
                  <img src="/logo.png" alt="Logo" className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-200">AI Career Counselor</span>
                  <span className="text-xs text-gray-500">Your career guide</span>
                </div>
              </button>
            </SidebarHeader>
            
            <SidebarContent className="bg-[#181818] p-2 overflow-y-auto">
              {/* New Chat Button */}
              <div className="mb-4">
                <button
                  onClick={handleNewConversation}
                  className="text-sm font-medium w-full hover:bg-[#303030] text-white px-4 py-2 hover:rounded-lg flex items-center gap-2 hover:border hover:border-gray-600"
                >
                  <Plus className="h-4 w-4" />
                  New Chat
                </button>
              </div>

              {/* Conversation History */}
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-medium  text-white px-4 py-2 ">Recent Conversations</SidebarGroupLabel>
                <SidebarGroupContent className="px-2">
                  <ConversationHistory
                    conversations={conversations}
                    onSelectConversation={handleSelectConversation}
                    onDeleteConversation={handleDeleteConversation}
                    onRenameConversation={handleRenameConversation}
                    activeConversationId={activeConversationId || undefined}
                  />
                </SidebarGroupContent>
              </SidebarGroup>

              {/* Tools */}
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-medium  text-white px-4 py-2">Tools</SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="space-y-1">
                    <button 
                      className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:bg-[#303030] hover:text-gray-200 rounded-lg transition-colors"
                      onClick={() => setShowSettings(true)}
                    >
                      <Settings className="h-4 w-4 " />
                      <span>Settings</span>
                    </button>
                    <button 
                      className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:bg-[#303030] hover:text-gray-200 rounded-lg transition-colors"
                    >
                      <HelpCircle className="h-4 w-4" />
                      <span>Help & FAQ</span>
                    </button>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="bg-[#181818] border-t border-[#303030] p-4">
              <button 
                className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:bg-[#303030] hover:text-gray-200 rounded-lg transition-colors"
                onClick={() => router.push('/')}
              >
                <LogOut className="h-4 w-4" />
                <span>Back to Home</span>
              </button>
            </SidebarFooter>
          </Sidebar>
        </div>

        {/* Chat Window - Takes remaining space to rightmost edge */}
        <div className="flex-1 flex flex-col min-h-screen w-full">
          {/* Header */}
          {/* <div className="flex h-16 items-center gap-2 border-b border-gray-700 bg-gray-900 px-4 flex-shrink-0 w-full">
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-200">AI Career Counselor</h1>
              <p className="text-sm text-gray-500">Get personalized career guidance and advice</p>
            </div>
          </div> */}
          
          {/* Chat Content */}
          <div className="flex-1 overflow-hidden w-full flex flex-col" style={{ backgroundColor: '#424242' }}>
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 py-3  border-gray-600" style={{ backgroundColor: '#212121' }}>
              <button 
                onClick={() => router.push('/')}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <img src="/logo.png" alt="Logo" className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-normal text-white">AI Career Counselor</p>
              
                </div>
              </button>
              <div className=" flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
            
      <ChatWindow />
    </div>
        </div>

        {/* Settings Modal */}
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          settings={settings}
          onSettingsChange={handleSettingsChange}
        />
      </div>
    </SidebarProvider>
  );
}
