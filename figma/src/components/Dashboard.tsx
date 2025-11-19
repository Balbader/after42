import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Job, User } from '../App';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
  jobs: Job[];
  onViewCandidates: (jobId: string) => void;
  onAddNewJob: () => void;
  currentUser: User | null;
}

export function Dashboard({ jobs, onViewCandidates, onAddNewJob, currentUser }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-950/50 text-green-400 border-green-900/50';
      case 'Draft': return 'bg-yellow-950/50 text-yellow-400 border-yellow-900/50';
      case 'Closed': return 'bg-gray-900/50 text-gray-500 border-gray-800';
      default: return 'bg-gray-900/50 text-gray-500 border-gray-800';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Analytics data
  const applicationsByMonth = [
    { month: 'Nov', applications: 45, hired: 3 },
    { month: 'Dec', applications: 67, hired: 5 },
    { month: 'Jan', applications: 89, hired: 8 },
  ];

  const departmentStats = [
    { name: 'Engineering', applications: 68, color: '#00ADB5' },
    { name: 'Design', applications: 32, color: '#10B981' },
    { name: 'Product', applications: 28, color: '#F59E0B' },
    { name: 'Marketing', applications: 18, color: '#EF4444' },
    { name: 'Sales', applications: 10, color: '#8B5CF6' },
  ];

  const notifications = [
    { id: 1, message: '3 new applications received', time: '2h ago', type: 'info' },
    { id: 2, message: 'Interview scheduled with Sarah Chen', time: '4h ago', type: 'success' },
    { id: 3, message: 'New job posting approved', time: '1d ago', type: 'success' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with Greeting, Add Job Button, and Notifications */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-medium text-white mb-3">
            {getGreeting()}, {currentUser?.name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-base text-gray-400 leading-relaxed">
            You have <span className="font-medium text-[#00ADB5]">{jobs.filter(j => j.status === 'Active').length} active opportunities</span> and{' '}
            <span className="font-medium text-[#00ADB5]">{jobs.reduce((sum, job) => sum + job.candidatesCount, 0)} 42 students</span> proving their skills through AI-powered technical challenges.
          </p>
        </div>
        
        {/* Action Buttons and Notifications */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <Button variant="outline" size="icon" className="relative h-11 w-11 border-[#1A1A1A] bg-[#0F0F0F] hover:bg-[#1A1A1A] hover:border-[#00ADB5]/30 text-gray-400 hover:text-[#00ADB5] transition-all duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-gradient-to-br from-[#00ADB5] to-[#008B94] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-lg shadow-[#00ADB5]/50">
                {notifications.length}
              </span>
            </Button>
          </div>
          
          {/* Add New Opportunity Button with Glow */}
          <Button 
            onClick={onAddNewJob}
            className="h-11 px-6 bg-gradient-to-r from-[#00ADB5] to-[#008B94] hover:from-[#00BEC7] hover:to-[#009CA5] text-white font-medium flex items-center gap-2 shadow-lg shadow-[#00ADB5]/30 hover:shadow-[#00ADB5]/50 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Post New Opportunity
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search opportunities by title or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 bg-[#0F0F0F] border-[#1A1A1A] text-gray-200 placeholder:text-gray-600 focus:border-[#00ADB5] focus:ring-[#00ADB5]/20"
          />
        </div>
        
        <div className="flex gap-2">
          {['all', 'Active', 'Draft', 'Closed'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              onClick={() => setStatusFilter(status)}
              className={`h-11 px-4 font-medium transition-all duration-200 ${statusFilter === status ? 'bg-gradient-to-r from-[#00ADB5] to-[#008B94] hover:from-[#00BEC7] hover:to-[#009CA5] text-white border-[#00ADB5] shadow-lg shadow-[#00ADB5]/20' : 'border-[#1A1A1A] bg-[#0F0F0F] text-gray-400 hover:bg-[#1A1A1A] hover:text-[#00ADB5] hover:border-[#00ADB5]/30'}`}
            >
              {status === 'all' ? 'All' : status}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A] hover:border-[#00ADB5]/30 transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 tracking-wide">Active Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-medium text-white mb-1">
              {jobs.filter(j => j.status === 'Active').length}
            </div>
            <p className="text-sm text-gray-600">With AI challenges</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A] hover:border-[#00ADB5]/30 transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 tracking-wide">42 Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-medium text-white mb-1">
              {jobs.reduce((sum, job) => sum + job.candidatesCount, 0)}
            </div>
            <p className="text-sm text-gray-600">Completing challenges</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A] hover:border-[#00ADB5]/30 transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 tracking-wide">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-medium text-white mb-1">
              {jobs.filter(j => new Date(j.datePosted) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
            </div>
            <p className="text-sm text-gray-600">New opportunities</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A] hover:border-[#00ADB5]/30 transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 tracking-wide">Avg Challenge Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-medium text-white mb-1">
              87.2%
            </div>
            <p className="text-sm font-medium text-[#00ADB5]">+3.4% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts - Side by Side */}
      <div className="mb-8">
        <div className="grid grid-cols-2 gap-6">
          {/* Applications Trend */}
          <Card className="min-h-[400px] bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A]">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-white">Challenge Submissions & Hires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={applicationsByMonth} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
                    <XAxis 
                      dataKey="month" 
                      fontSize={12}
                      fontWeight={500}
                      stroke="#666"
                    />
                    <YAxis 
                      fontSize={12}
                      fontWeight={500}
                      stroke="#666"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0A0A0A', 
                        border: '1px solid #1A1A1A',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 173 181 / 0.2)',
                        color: '#F3F4F6'
                      }}
                    />
                    <Bar dataKey="applications" fill="#00ADB5" name="Submissions" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="hired" fill="#10B981" name="Hired" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Department Distribution */}
          <Card className="min-h-[400px] bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A]">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-white">Students by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <Pie
                      data={departmentStats}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="applications"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                      fontSize={12}
                      fontWeight={500}
                      stroke="#0A0A0A"
                      strokeWidth={2}
                    >
                      {departmentStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0A0A0A', 
                        border: '1px solid #1A1A1A',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 173 181 / 0.2)',
                        color: '#F3F4F6'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        <h2 className="text-xl font-medium text-white mb-6">Hiring Opportunities</h2>
        
        {filteredJobs.length === 0 ? (
          <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A]">
            <CardContent className="text-center py-12">
              <div className="font-medium text-base text-white mb-1">No opportunities found</div>
              <p className="text-sm text-gray-600">No opportunities match your current search criteria.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="group hover:shadow-2xl hover:shadow-[#00ADB5]/20 transition-all duration-300 bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A] hover:border-[#00ADB5]/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-medium text-white group-hover:text-[#00ADB5] transition-colors duration-200">{job.title}</h3>
                        <Badge className={`${getStatusColor(job.status)} font-medium border`}>
                          {job.status}
                        </Badge>
                        {job.aiGenerated && (
                          <Badge className="bg-gradient-to-r from-[#00ADB5]/20 to-[#008B94]/20 text-[#00ADB5] border border-[#00ADB5]/30 font-medium flex items-center gap-1.5 shadow-lg shadow-[#00ADB5]/20">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            AI Challenge
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {job.department}
                        </span>
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {job.location}
                        </span>
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {job.type}
                        </span>
                        {job.difficulty && (
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            {job.difficulty}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <span className="text-gray-600">
                          Posted: {new Date(job.datePosted).toLocaleDateString()}
                        </span>
                        <span className="font-medium text-[#00ADB5]">
                          {job.candidatesCount} students
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => onViewCandidates(job.id)}
                        className="h-10 px-4 font-medium border-[#1A1A1A] bg-[#0F0F0F] text-gray-400 hover:bg-[#1A1A1A] hover:text-[#00ADB5] hover:border-[#00ADB5]/50 transition-all duration-200"
                      >
                        View Students
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
