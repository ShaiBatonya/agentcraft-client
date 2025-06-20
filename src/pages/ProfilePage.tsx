// Premium Profile Page with account management and preferences
import React, { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/shared/ui/Button';

export const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, logoutAndRedirect } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSave = () => {
    // TODO: Implement save functionality with backend
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="glass-card-subtle p-8">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent-500/20 to-purple-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-3">Sign In Required</h2>
            <p className="text-white/70 mb-6">Please sign in to view your profile.</p>
            <Button variant="primary" onClick={() => window.location.href = '/login'}>
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
          <p className="text-white/70">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="glass-card-subtle p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Basic Information</h2>
                {!isEditing ? (
                  <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" onClick={handleSave}>
                      Save
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&background=6366f1&color=fff&size=80`}
                      alt={user?.name}
                      className="w-20 h-20 rounded-full"
                    />
                    <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-accent-600 hover:bg-accent-700 text-white rounded-full flex items-center justify-center transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{user?.name}</h3>
                    <p className="text-sm text-white/60">Click to change avatar</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="px-3 py-2 text-white bg-white/5 rounded-lg">{user?.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Email Address
                    </label>
                    <p className="px-3 py-2 text-white/70 bg-white/5 rounded-lg">{user?.email}</p>
                    <p className="text-xs text-white/50 mt-1">Email cannot be changed</p>
                  </div>
                </div>


              </div>
            </div>

            {/* Account Stats */}
            <div className="glass-card-subtle p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Account Activity</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-accent-400">42</div>
                  <div className="text-sm text-white/60">Messages Sent</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">7</div>
                  <div className="text-sm text-white/60">Days Active</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">3</div>
                  <div className="text-sm text-white/60">Conversations</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Actions */}
            <div className="glass-card-subtle p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Account Actions</h3>
              <div className="space-y-3">
                <Button variant="secondary" fullWidth className="justify-start">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Change Password
                </Button>
                
                <Button variant="secondary" fullWidth className="justify-start">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Export Data
                </Button>

                <Button variant="danger" fullWidth className="justify-start" onClick={() => logoutAndRedirect()}>
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Member Since */}
            <div className="glass-card-subtle p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Member Since</h3>
              <p className="text-white/70">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Recently'}
              </p>
            </div>

            {/* Privacy */}
            <div className="glass-card-subtle p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Privacy</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3 rounded" defaultChecked />
                  <span className="text-sm text-white/70">Save chat history</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3 rounded" defaultChecked />
                  <span className="text-sm text-white/70">Analytics tracking</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3 rounded" />
                  <span className="text-sm text-white/70">Email notifications</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 