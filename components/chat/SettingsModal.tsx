"use client";

import { useState } from 'react';
import { X, Bot, Palette, Volume2, Clock, Zap } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    aiPersonality: 'professional' | 'friendly' | 'direct';
    responseLength: 'brief' | 'detailed' | 'comprehensive';
    enableNotifications: boolean;
    autoSave: boolean;
    theme: 'dark' | 'light';
  };
  onSettingsChange: (settings: any) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSettingsChange
}: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const handleReset = () => {
    setLocalSettings(settings);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* AI Personality */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-medium text-white">AI Personality</h3>
            </div>
            <div className="space-y-2">
              {[
                { value: 'professional', label: 'Professional', desc: 'Formal and business-focused' },
                { value: 'friendly', label: 'Friendly', desc: 'Warm and approachable' },
                { value: 'direct', label: 'Direct', desc: 'Straightforward and concise' }
              ].map((option) => (
                <label key={option.value} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="personality"
                    value={option.value}
                    checked={localSettings.aiPersonality === option.value}
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, aiPersonality: e.target.value as any }))}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-sm text-white">{option.label}</div>
                    <div className="text-xs text-gray-400">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-800"></div>

          {/* Response Length */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-medium text-white">Response Length</h3>
            </div>
            <div className="space-y-2">
              {[
                { value: 'brief', label: 'Brief', desc: 'Quick, concise answers' },
                { value: 'detailed', label: 'Detailed', desc: 'Thorough explanations' },
                { value: 'comprehensive', label: 'Comprehensive', desc: 'In-depth analysis' }
              ].map((option) => (
                <label key={option.value} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="responseLength"
                    value={option.value}
                    checked={localSettings.responseLength === option.value}
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, responseLength: e.target.value as any }))}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-sm text-white">{option.label}</div>
                    <div className="text-xs text-gray-400">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-800"></div>

          {/* Preferences */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-medium text-white">Preferences</h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Enable Notifications</span>
                <input
                  type="checkbox"
                  checked={localSettings.enableNotifications}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, enableNotifications: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Auto-save Conversations</span>
                <input
                  type="checkbox"
                  checked={localSettings.autoSave}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, autoSave: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-800">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
