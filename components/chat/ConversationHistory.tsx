"use client";

import { useState } from 'react';
import { MessageSquare, Clock, Trash2, Edit3 } from 'lucide-react';

interface Conversation {
  id: string;
  title: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: string;
}

interface ConversationHistoryProps {
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  activeConversationId?: string;
}

// Removed category-related constants since categories are no longer in the schema

export default function ConversationHistory({
  conversations,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  activeConversationId
}: ConversationHistoryProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleEditStart = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
  };

  const handleEditSave = () => {
    if (editingId && editTitle.trim()) {
      onRenameConversation(editingId, editTitle.trim());
      setEditingId(null);
      setEditTitle('');
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const formatTime = (date: Date | string) => {
    const now = new Date();
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const diff = now.getTime() - dateObj.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return dateObj.toLocaleDateString();
  };

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {conversations.length === 0 ? (
        <div className="text-center py-6 px-2">
          <MessageSquare className="w-6 h-6 text-gray-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No conversations yet</p>
          <p className="text-xs text-gray-600">Start a new chat to begin</p>
        </div>
      ) : (
        conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`group relative rounded-lg p-3 cursor-pointer transition-colors ${
              activeConversationId === conversation.id
                ? 'hover:bg-[#303030]'
                : 'hover:bg-[#303030]'
            }`}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">💬</span>
                  {editingId === conversation.id ? (
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={handleEditSave}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleEditSave();
                        if (e.key === 'Escape') handleEditCancel();
                      }}
                      className="bg-gray-700 text-white text-sm px-2 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <h4 className="text-sm font-medium text-gray-200 truncate">
                      {conversation.title}
                    </h4>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(conversation.createdAt)}</span>
                </div>
              </div>
              
              {editingId !== conversation.id && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <button
                    className="h-6 w-6 p-0 text-gray-500 hover:text-gray-200 hover:bg-[#303030] rounded flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditStart(conversation);
                    }}
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    className="h-6 w-6 p-0 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conversation.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
