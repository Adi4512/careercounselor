"use client";

import { useState } from 'react';
import { trpc } from '@/lib/trpc-client';

export default function TrpcExample() {
  const [newTitle, setNewTitle] = useState('');
  
  // tRPC queries
  const { data: conversations, isLoading, error } = trpc.conversations.getAll.useQuery();
  const { data: settings } = trpc.settings.get.useQuery();
  
  // tRPC mutations
  const createConversation = trpc.conversations.create.useMutation({
    onSuccess: () => {
      setNewTitle('');
      // Invalidate and refetch conversations
      trpc.useUtils().conversations.getAll.invalidate();
    },
  });
  
  const updateSettings = trpc.settings.update.useMutation({
    onSuccess: () => {
      trpc.useUtils().settings.get.invalidate();
    },
  });
  
  const handleCreateConversation = () => {
    if (newTitle.trim()) {
      createConversation.mutate({
        title: newTitle,
        lastMessage: 'Start a new conversation...',
        category: 'general',
      });
    }
  };
  
  const handleToggleTheme = () => {
    updateSettings.mutate({
      theme: settings?.theme === 'dark' ? 'light' : 'dark',
    });
  };
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">tRPC Example</h2>
      
      {/* Settings */}
      <div className="p-4 border rounded">
        <h3 className="text-lg font-semibold mb-2">Settings</h3>
        <p>Current theme: {settings?.theme}</p>
        <button 
          onClick={handleToggleTheme}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Toggle Theme
        </button>
      </div>
      
      {/* Create Conversation */}
      <div className="p-4 border rounded">
        <h3 className="text-lg font-semibold mb-2">Create Conversation</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Conversation title"
            className="px-3 py-2 border rounded flex-1"
          />
          <button
            onClick={handleCreateConversation}
            disabled={createConversation.isPending}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {createConversation.isPending ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
      
      {/* Conversations List */}
      <div className="p-4 border rounded">
        <h3 className="text-lg font-semibold mb-2">Conversations</h3>
        {conversations?.length === 0 ? (
          <p>No conversations yet</p>
        ) : (
          <ul className="space-y-2">
            {conversations?.map((conv) => (
              <li key={conv.id} className="p-2 bg-gray-100 rounded">
                <div className="font-medium">{conv.title}</div>
                <div className="text-sm text-gray-600">{conv.category}</div>
                <div className="text-xs text-gray-500">
                  {new Date(conv.timestamp).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
