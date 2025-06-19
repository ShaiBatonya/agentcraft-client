// Premium Settings Page with comprehensive configuration options
import React, { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { useClearChat } from '@/features/chat/store/chat.store';

interface SettingsSection {
  id: string;
  title: string;
  icon: string;
}

const settingsSections: SettingsSection[] = [
  { id: 'chat', title: 'Chat Preferences', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { id: 'appearance', title: 'Appearance', icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' },
  { id: 'privacy', title: 'Privacy & Data', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  { id: 'notifications', title: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  { id: 'advanced', title: 'Advanced', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
];

export const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('chat');
  const [settings, setSettings] = useState({
    // Chat settings
    autoScroll: true,
    showTimestamps: true,
    messageAnimations: true,
    typingIndicator: true,
    soundEffects: false,
    chatHistory: true,
    
    // Appearance settings
    theme: 'dark',
    fontSize: 'medium',
    compactMode: false,
    colorScheme: 'purple',
    
    // Privacy settings
    saveHistory: true,
    analytics: true,
    dataRetention: 7,
    
    // Notifications
    emailNotifications: false,
    pushNotifications: true,
    desktopNotifications: true,
    
    // Advanced
    developerMode: false,
    betaFeatures: false,
    debugMode: false,
  });

  const clearChat = useClearChat();

  const updateSetting = (key: string, value: unknown) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const renderIcon = (pathData: string) => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={pathData} />
    </svg>
  );

  const renderChatSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Chat Behavior</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Auto-scroll to newest messages</label>
              <p className="text-xs text-white/60">Automatically scroll to the bottom when new messages arrive</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoScroll}
              onChange={(e) => updateSetting('autoScroll', e.target.checked)}
              className="toggle-switch"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Show message timestamps</label>
              <p className="text-xs text-white/60">Display time when each message was sent</p>
            </div>
            <input
              type="checkbox"
              checked={settings.showTimestamps}
              onChange={(e) => updateSetting('showTimestamps', e.target.checked)}
              className="toggle-switch"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Message animations</label>
              <p className="text-xs text-white/60">Animate message appearances and interactions</p>
            </div>
            <input
              type="checkbox"
              checked={settings.messageAnimations}
              onChange={(e) => updateSetting('messageAnimations', e.target.checked)}
              className="toggle-switch"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Typing indicator</label>
              <p className="text-xs text-white/60">Show when AI is generating a response</p>
            </div>
            <input
              type="checkbox"
              checked={settings.typingIndicator}
              onChange={(e) => updateSetting('typingIndicator', e.target.checked)}
              className="toggle-switch"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Sound effects</label>
              <p className="text-xs text-white/60">Play sounds for message notifications</p>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEffects}
              onChange={(e) => updateSetting('soundEffects', e.target.checked)}
              className="toggle-switch"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">History Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Save chat history</label>
              <p className="text-xs text-white/60">Keep your conversations for future reference</p>
            </div>
            <input
              type="checkbox"
              checked={settings.chatHistory}
              onChange={(e) => updateSetting('chatHistory', e.target.checked)}
              className="toggle-switch"
            />
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              size="sm"
              onClick={clearChat}
              className="w-auto"
            >
              Clear All Chat History
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Theme</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Color scheme</label>
            <div className="grid grid-cols-3 gap-3">
              {['purple', 'blue', 'green'].map((color) => (
                <button
                  key={color}
                  onClick={() => updateSetting('colorScheme', color)}
                  className={`p-3 rounded-lg border transition-all ${
                    settings.colorScheme === color
                      ? 'border-accent-500 bg-accent-500/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full mx-auto mb-2 ${
                    color === 'purple' ? 'bg-purple-500' :
                    color === 'blue' ? 'bg-blue-500' : 'bg-green-500'
                  }`} />
                  <span className="text-xs text-white capitalize">{color}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Font size</label>
            <select
              value={settings.fontSize}
              onChange={(e) => updateSetting('fontSize', e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Compact mode</label>
              <p className="text-xs text-white/60">Reduce spacing and padding for denser layout</p>
            </div>
            <input
              type="checkbox"
              checked={settings.compactMode}
              onChange={(e) => updateSetting('compactMode', e.target.checked)}
              className="toggle-switch"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Data Collection</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Save conversation history</label>
              <p className="text-xs text-white/60">Store your messages for personalized experience</p>
            </div>
            <input
              type="checkbox"
              checked={settings.saveHistory}
              onChange={(e) => updateSetting('saveHistory', e.target.checked)}
              className="toggle-switch"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Analytics tracking</label>
              <p className="text-xs text-white/60">Help improve the service with usage analytics</p>
            </div>
            <input
              type="checkbox"
              checked={settings.analytics}
              onChange={(e) => updateSetting('analytics', e.target.checked)}
              className="toggle-switch"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Data retention period</label>
            <select
              value={settings.dataRetention}
              onChange={(e) => updateSetting('dataRetention', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-accent-500"
            >
              <option value={1}>1 day</option>
              <option value={7}>7 days</option>
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Email notifications</label>
              <p className="text-xs text-white/60">Receive updates via email</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
              className="toggle-switch"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Push notifications</label>
              <p className="text-xs text-white/60">Browser notifications for new messages</p>
            </div>
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) => updateSetting('pushNotifications', e.target.checked)}
              className="toggle-switch"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Desktop notifications</label>
              <p className="text-xs text-white/60">System notifications on desktop</p>
            </div>
            <input
              type="checkbox"
              checked={settings.desktopNotifications}
              onChange={(e) => updateSetting('desktopNotifications', e.target.checked)}
              className="toggle-switch"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdvancedSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Developer Options</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Developer mode</label>
              <p className="text-xs text-white/60">Enable advanced debugging features</p>
            </div>
            <input
              type="checkbox"
              checked={settings.developerMode}
              onChange={(e) => updateSetting('developerMode', e.target.checked)}
              className="toggle-switch"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Beta features</label>
              <p className="text-xs text-white/60">Access experimental functionality</p>
            </div>
            <input
              type="checkbox"
              checked={settings.betaFeatures}
              onChange={(e) => updateSetting('betaFeatures', e.target.checked)}
              className="toggle-switch"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Debug mode</label>
              <p className="text-xs text-white/60">Show detailed logs and debug information</p>
            </div>
            <input
              type="checkbox"
              checked={settings.debugMode}
              onChange={(e) => updateSetting('debugMode', e.target.checked)}
              className="toggle-switch"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Export & Import</h3>
        <div className="space-y-3">
          <Button variant="secondary" fullWidth className="justify-start">
            Export Settings
          </Button>
          <Button variant="secondary" fullWidth className="justify-start">
            Import Settings
          </Button>
          <Button variant="danger" fullWidth className="justify-start">
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'chat': return renderChatSettings();
      case 'appearance': return renderAppearanceSettings();
      case 'privacy': return renderPrivacySettings();
      case 'notifications': return renderNotificationSettings();
      case 'advanced': return renderAdvancedSettings();
      default: return renderChatSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 container-content mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-white/70">Customize your AgentCraft experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="glass-card-subtle p-4 sticky top-8">
              <nav className="space-y-2">
                {settingsSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
                      activeSection === section.id
                        ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {renderIcon(section.icon)}
                    <span className="text-sm font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="glass-card-subtle p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 