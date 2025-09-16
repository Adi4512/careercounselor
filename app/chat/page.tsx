"use client";

import { useSession, signOut } from 'next-auth/react';
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
  const { data: conversationsData } = useConversations();
  const conversations = conversationsData?.pages.flatMap(page => page.items) || [];
  const createConversation = useCreateConversation();
  const updateConversation = useUpdateConversation();
  const deleteConversation = useDeleteConversation();
  const { data: settings = { aiPersonality: 'professional', responseLength: 'detailed', enableNotifications: true, autoSave: true, theme: 'dark' } } = useSettings();
  const updateSettings = useUpdateSettings();
  
  // Local state management
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileConversations, setShowMobileConversations] = useState(false);

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    
    if (!session) {
      router.push('/');
      return;
    }
  }, [session, status, router]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };
    
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  const handleNewConversation = () => {
    // Don't create conversation yet - wait for first message
    // This will show the welcome screen and let ChatWindow create the conversation
    setActiveConversationId(null);
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
      <div className="flex min-h-screen w-full bg-[#212121] m-0 p-0">
        {/* Fixed Sidebar - Leftmost - Hidden on mobile */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <Sidebar className="h-full dark border-r-0 w-64">
            <SidebarHeader className="bg-[#181818] p-4">
              <button 
                onClick={() => router.push('/')}
                className="flex items-center gap-2 hover:bg-[#303030] rounded-lg transition-opacity w-full text-left"
              >
                <div className="flex h-9 w-8 items-center justify-center rounded-lg">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-[#181818] rounded-full"></div>
                  </div>
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
        <div className="flex-1 flex flex-col min-h-screen max-w-full lg:ml-0">
          {/* Chat Content */}
          <div className="flex-1 overflow-hidden flex flex-col bg-[#212121]">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#212121]">
              {/* Mobile header with logo and buttons */}
              <div className="lg:hidden flex items-center gap-2">
                <button 
                  onClick={() => router.push('/')}
                  className="flex items-center gap-2 hover:bg-[#303030] rounded-lg transition-opacity p-2"
                >
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-[#181818] rounded-full"></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-200">AI Career Counselor</span>
                </button>
                
                {/* Mobile Conversations Button */}
                <button
                  onClick={() => setShowMobileConversations(!showMobileConversations)}
                  className="flex items-center gap-2 px-3 py-2 bg-[#303030] hover:bg-[#404040] text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Chats
                </button>
                
                {/* Mobile New Chat Button */}
                <button
                  onClick={handleNewConversation}
                  className="flex items-center gap-2 px-3 py-2 bg-[#10a37f] hover:bg-[#0d8a6b] text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  New
                </button>
              </div>
              
              <div className="flex items-center space-x-2 relative dropdown-container ml-auto">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#303030] rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute top-12 right-0 bg-[#181818] rounded-lg shadow-lg box-shadow-lg py-2 w-48 z-50">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        router.push('/');
                      }}
                      className="w-full px-4 py-2 text-left text-gray-300 hover:bg-[#303030] hover:text-white transition-colors flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span>Home</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="w-full px-4 py-2 text-left text-gray-300 hover:bg-[#303030] hover:text-white transition-colors flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <ChatWindow 
              conversationId={activeConversationId}
              onConversationCreate={(id) => setActiveConversationId(id)}
            />
          </div>
        </div>
        {/* Mobile Conversation History Panel */}
        {showMobileConversations && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
            <div className="absolute right-0 top-0 h-full w-80 bg-[#181818] border-l border-gray-700 shadow-xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">Recent Chats</h2>
                <button
                  onClick={() => setShowMobileConversations(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#303030] rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                <ConversationHistory
                  conversations={conversations}
                  onSelectConversation={(id) => {
                    setActiveConversationId(id);
                    setShowMobileConversations(false);
                  }}
                  onDeleteConversation={handleDeleteConversation}
                  onRenameConversation={handleRenameConversation}
                  activeConversationId={activeConversationId || undefined}
                />
              </div>
            </div>
          </div>
        )}

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
