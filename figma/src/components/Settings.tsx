import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { User } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SettingsProps {
  currentUser: User | null;
}

export function Settings({ currentUser }: SettingsProps) {
  const [profile, setProfile] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    role: currentUser?.role || 'HR Manager',
    company: 'Smart Hiring Inc.'
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    newApplications: true,
    interviewReminders: true,
    weeklyReports: false
  });

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  const getProviderLabel = (provider: string) => {
    switch (provider) {
      case 'google': return 'Google';
      case 'github': return 'GitHub';
      case 'microsoft': return 'Microsoft';
      default: return 'Email';
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'google': return 'bg-blue-950/50 text-blue-400 border-blue-900/50';
      case 'github': return 'bg-gray-900/50 text-gray-400 border-gray-800';
      case 'microsoft': return 'bg-orange-950/50 text-orange-400 border-orange-900/50';
      default: return 'bg-[#00ADB5]/10 text-[#00ADB5] border-[#00ADB5]/30';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00ADB5] to-[#008B94] rounded-xl flex items-center justify-center shadow-lg shadow-[#00ADB5]/50">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-white">
            Settings
          </h1>
        </div>
        <p className="text-gray-400">
          Manage your account settings and AI-powered hiring preferences.
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile Settings */}
        <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture and Auth Info */}
            <div className="flex items-center space-x-4">
              {currentUser?.avatar ? (
                <div className="relative">
                  <ImageWithFallback
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-[#00ADB5]/50"
                  />
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0A0A0A] shadow-lg shadow-green-500/50" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-[#00ADB5] to-[#008B94] rounded-full flex items-center justify-center shadow-lg shadow-[#00ADB5]/50">
                  <span className="text-white text-xl font-medium">
                    {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium text-white">{currentUser?.name}</h3>
                  <Badge className={`${getProviderColor(currentUser?.authProvider || 'email')} border font-medium`}>
                    {getProviderLabel(currentUser?.authProvider || 'email')}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">{currentUser?.email}</p>
                <Button variant="outline" size="sm" className="border-[#1A1A1A] bg-[#0F0F0F] text-gray-400 hover:bg-[#1A1A1A] hover:text-[#00ADB5] hover:border-[#00ADB5]/50 transition-all duration-200">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Change Photo
                </Button>
              </div>
            </div>

            <Separator className="bg-[#1A1A1A]" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-400">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className="bg-[#0A0A0A] border-[#1A1A1A] text-gray-200 focus:border-[#00ADB5]/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-400">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  disabled={currentUser?.authProvider !== 'email'}
                  className="bg-[#0A0A0A] border-[#1A1A1A] text-gray-200 focus:border-[#00ADB5]/50 disabled:opacity-50"
                />
                {currentUser?.authProvider !== 'email' && (
                  <p className="text-xs text-gray-600">
                    Email is managed by {getProviderLabel(currentUser?.authProvider || 'email')}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role" className="text-gray-400">Role</Label>
                <Input
                  id="role"
                  value={profile.role}
                  onChange={(e) => handleProfileChange('role', e.target.value)}
                  className="bg-[#0A0A0A] border-[#1A1A1A] text-gray-200 focus:border-[#00ADB5]/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company" className="text-gray-400">Company</Label>
                <Input
                  id="company"
                  value={profile.company}
                  onChange={(e) => handleProfileChange('company', e.target.value)}
                  className="bg-[#0A0A0A] border-[#1A1A1A] text-gray-200 focus:border-[#00ADB5]/50"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button className="bg-gradient-to-r from-[#00ADB5] to-[#008B94] hover:from-[#00BEC7] hover:to-[#009CA5] text-white shadow-lg shadow-[#00ADB5]/30 hover:shadow-[#00ADB5]/50 transition-all duration-200">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Security */}
        {currentUser?.authProvider === 'email' && (
          <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Account Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-400">Password</Label>
                <p className="text-sm text-gray-500 mb-3">
                  Update your password to keep your account secure.
                </p>
                <Button variant="outline" className="border-[#1A1A1A] bg-[#0F0F0F] text-gray-400 hover:bg-[#1A1A1A] hover:text-[#00ADB5] hover:border-[#00ADB5]/50 transition-all duration-200">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Change Password
                </Button>
              </div>
              
              <Separator className="bg-[#1A1A1A]" />
              
              <div className="space-y-2">
                <Label className="text-gray-400">Two-Factor Authentication</Label>
                <p className="text-sm text-gray-500 mb-3">
                  Add an extra layer of security to your account.
                </p>
                <Button variant="outline" className="border-[#1A1A1A] bg-[#0F0F0F] text-gray-400 hover:bg-[#1A1A1A] hover:text-[#00ADB5] hover:border-[#00ADB5]/50 transition-all duration-200">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Enable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Connected Accounts */}
        <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Connected Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {['google', 'github', 'microsoft'].map((provider) => (
                <div key={provider} className="flex items-center justify-between p-4 border border-[#1A1A1A] rounded-lg bg-[#0A0A0A] hover:bg-[#0F0F0F] hover:border-[#00ADB5]/30 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg">
                      {provider === 'google' && (
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      )}
                      {provider === 'github' && (
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      )}
                      {provider === 'microsoft' && (
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#f25022" d="M1 1h10v10H1z"/>
                          <path fill="#00a4ef" d="M13 1h10v10H13z"/>
                          <path fill="#7fba00" d="M1 13h10v10H1z"/>
                          <path fill="#ffb900" d="M13 13h10v10H13z"/>
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-200">{getProviderLabel(provider)}</p>
                      <p className="text-sm text-gray-600">
                        {currentUser?.authProvider === provider ? (
                          <span className="flex items-center gap-1.5 text-green-400">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Connected
                          </span>
                        ) : (
                          'Not connected'
                        )}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant={currentUser?.authProvider === provider ? "destructive" : "outline"}
                    size="sm"
                    className={currentUser?.authProvider === provider 
                      ? "" 
                      : "border-[#1A1A1A] bg-[#0F0F0F] text-gray-400 hover:bg-[#1A1A1A] hover:text-[#00ADB5] hover:border-[#00ADB5]/50 transition-all duration-200"
                    }
                  >
                    {currentUser?.authProvider === provider ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg hover:bg-[#0F0F0F] transition-colors duration-200">
              <div className="space-y-0.5">
                <Label className="text-gray-200">Email Notifications</Label>
                <p className="text-sm text-gray-500">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
              />
            </div>
            
            <Separator className="bg-[#1A1A1A]" />
            
            <div className="flex items-center justify-between p-4 rounded-lg hover:bg-[#0F0F0F] transition-colors duration-200">
              <div className="space-y-0.5">
                <Label className="text-gray-200">New Challenge Submissions</Label>
                <p className="text-sm text-gray-500">
                  Get notified when students submit AI challenges
                </p>
              </div>
              <Switch
                checked={notifications.newApplications}
                onCheckedChange={(checked) => handleNotificationChange('newApplications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg hover:bg-[#0F0F0F] transition-colors duration-200">
              <div className="space-y-0.5">
                <Label className="text-gray-200">Interview Reminders</Label>
                <p className="text-sm text-gray-500">
                  Receive reminders about upcoming interviews
                </p>
              </div>
              <Switch
                checked={notifications.interviewReminders}
                onCheckedChange={(checked) => handleNotificationChange('interviewReminders', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg hover:bg-[#0F0F0F] transition-colors duration-200">
              <div className="space-y-0.5">
                <Label className="text-gray-200">Weekly AI Reports</Label>
                <p className="text-sm text-gray-500">
                  Get weekly summaries of AI-powered hiring activity
                </p>
              </div>
              <Switch
                checked={notifications.weeklyReports}
                onCheckedChange={(checked) => handleNotificationChange('weeklyReports', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A] relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#00ADB5] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
          
          <CardHeader className="relative">
            <CardTitle className="text-white flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00ADB5] to-[#008B94] rounded-lg flex items-center justify-center shadow-lg shadow-[#00ADB5]/50">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              Account Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 relative">
            <div className="space-y-2">
              <Label className="text-gray-400">Export Data</Label>
              <p className="text-sm text-gray-500 mb-3">
                Download a copy of your hiring data and challenge submissions.
              </p>
              <Button variant="outline" className="border-[#1A1A1A] bg-[#0F0F0F] text-gray-400 hover:bg-[#1A1A1A] hover:text-[#00ADB5] hover:border-[#00ADB5]/50 transition-all duration-200">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Data
              </Button>
            </div>
            
            <Separator className="bg-[#1A1A1A]" />
            
            <div className="space-y-2">
              <Label className="text-red-400">Danger Zone</Label>
              <p className="text-sm text-gray-500 mb-3">
                Permanently delete your account and all associated data.
              </p>
              <Button variant="destructive" className="shadow-lg shadow-red-900/30">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
