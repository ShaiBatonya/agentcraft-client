import React, { useState } from 'react';
import { useChatStore } from '../store/chat.store';

interface ChatSettingsProps {
    onClose: () => void;
}

type SettingsType = {
    autoScroll: boolean;
    showTimestamps: boolean;
    messageAnimations: boolean;
    typingIndicator: boolean;
    soundEffects: boolean;
    chatHistory: boolean;
    theme: string;
    fontSize: string;
    compactMode: boolean;
    colorScheme: string;
    saveHistory: boolean;
    analytics: boolean;
    dataRetention: number;
    emailNotifications: boolean;
    pushNotifications: boolean;
    desktopNotifications: boolean;
};

type SettingsValue = string | number | boolean;

export const ChatSettings: React.FC<ChatSettingsProps> = ({ onClose }) => {
    const [settings, setSettings] = useState<SettingsType>({
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
    });

    const clearChat = useChatStore(state => state.clearChat);

    const handleSettingChange = (key: keyof SettingsType, value: SettingsValue) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="w-full max-w-2xl bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl p-6 space-y-6">
            {/* Settings Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Chat Settings</h2>
                <button
                    onClick={onClose}
                    className="p-1.5 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-200"
                    aria-label="Close settings"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Settings Sections */}
            <div className="space-y-8">
                {/* Chat Settings */}
                <section className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Chat Settings</h3>
                    <div className="space-y-3">
                        <label className="flex items-center justify-between">
                            <span className="text-sm text-white/90">Auto-scroll to bottom</span>
                            <div className="relative inline-flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.autoScroll}
                                    onChange={(e) => handleSettingChange('autoScroll', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500"></div>
                            </div>
                        </label>
                        <label className="flex items-center justify-between">
                            <span className="text-sm text-white/90">Show timestamps</span>
                            <div className="relative inline-flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.showTimestamps}
                                    onChange={(e) => handleSettingChange('showTimestamps', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500"></div>
                            </div>
                        </label>
                        <label className="flex items-center justify-between">
                            <span className="text-sm text-white/90">Message animations</span>
                            <div className="relative inline-flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.messageAnimations}
                                    onChange={(e) => handleSettingChange('messageAnimations', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500"></div>
                            </div>
                        </label>
                        <label className="flex items-center justify-between">
                            <span className="text-sm text-white/90">Typing indicator</span>
                            <div className="relative inline-flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.typingIndicator}
                                    onChange={(e) => handleSettingChange('typingIndicator', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500"></div>
                            </div>
                        </label>
                    </div>
                </section>

                {/* Appearance Settings */}
                <section className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Appearance</h3>
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <label className="text-sm text-white/90">Font Size</label>
                            <select
                                value={settings.fontSize}
                                onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                            >
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                            </select>
                        </div>
                        <label className="flex items-center justify-between">
                            <span className="text-sm text-white/90">Compact Mode</span>
                            <div className="relative inline-flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.compactMode}
                                    onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500"></div>
                            </div>
                        </label>
                    </div>
                </section>

                {/* Privacy Settings */}
                <section className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Privacy</h3>
                    <div className="space-y-3">
                        <label className="flex items-center justify-between">
                            <span className="text-sm text-white/90">Save chat history</span>
                            <div className="relative inline-flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.saveHistory}
                                    onChange={(e) => handleSettingChange('saveHistory', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500"></div>
                            </div>
                        </label>
                        <div className="space-y-2">
                            <label className="text-sm text-white/90">Data Retention (days)</label>
                            <select
                                value={settings.dataRetention}
                                onChange={(e) => handleSettingChange('dataRetention', parseInt(e.target.value))}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                            >
                                <option value={1}>1 day</option>
                                <option value={7}>7 days</option>
                                <option value={30}>30 days</option>
                                <option value={90}>90 days</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Notifications */}
                <section className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Notifications</h3>
                    <div className="space-y-3">
                        <label className="flex items-center justify-between">
                            <span className="text-sm text-white/90">Desktop notifications</span>
                            <div className="relative inline-flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.desktopNotifications}
                                    onChange={(e) => handleSettingChange('desktopNotifications', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500"></div>
                            </div>
                        </label>
                        <label className="flex items-center justify-between">
                            <span className="text-sm text-white/90">Push notifications</span>
                            <div className="relative inline-flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings.pushNotifications}
                                    onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500"></div>
                            </div>
                        </label>
                    </div>
                </section>

                {/* Actions */}
                <section className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Actions</h3>
                    <div className="space-y-3">
                        <button
                            onClick={clearChat}
                            className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-colors text-sm font-medium"
                        >
                            Clear Chat History
                        </button>
                        <button
                            onClick={() => {
                                // Export settings
                                const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = 'chat-settings.json';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                URL.revokeObjectURL(url);
                            }}
                            className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 text-white/90 hover:text-white rounded-lg transition-colors text-sm font-medium"
                        >
                            Export Settings
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}; 