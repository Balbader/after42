import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Team() {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [expandedDepartments, setExpandedDepartments] = useState<string[]>(['Human Resources']);
  
  const teamData = {
    members: [
      {
        id: '1',
        name: 'Aleksa Petrović',
        role: 'HR Manager',
        department: 'Human Resources',
        email: 'aleksa.petrovic@company.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        status: 'Active',
        joinDate: '2024-01-15',
        permissions: ['Full Access'],
        stats: { jobsPosted: 15, candidatesReviewed: 89, interviews: 34 }
      },
      {
        id: '2',
        name: 'Jennifer Smith',
        role: 'Senior Recruiter',
        department: 'Human Resources',
        email: 'jennifer.smith@company.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1c9?w=150&h=150&fit=crop&crop=face',
        status: 'Active',
        joinDate: '2023-08-22',
        permissions: ['Recruiting', 'Candidate Management'],
        stats: { jobsPosted: 8, candidatesReviewed: 127, interviews: 45 }
      },
      {
        id: '3',
        name: 'Emily Davis',
        role: 'Talent Coordinator',
        department: 'Human Resources',
        email: 'emily.davis@company.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
        status: 'Inactive',
        joinDate: '2023-09-15',
        permissions: ['Scheduling', 'Candidate Communication'],
        stats: { jobsPosted: 2, candidatesReviewed: 56, interviews: 78 }
      },
      {
        id: '4',
        name: 'David Chen',
        role: 'Engineering Manager',
        department: 'Engineering',
        email: 'david.chen@company.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        status: 'Active',
        joinDate: '2023-03-10',
        permissions: ['Technical Interviews', 'Engineering Jobs'],
        stats: { jobsPosted: 6, candidatesReviewed: 45, interviews: 28 }
      },
      {
        id: '5',
        name: 'Alex Thompson',
        role: 'Senior Developer',
        department: 'Engineering',
        email: 'alex.thompson@company.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        status: 'Active',
        joinDate: '2023-07-20',
        permissions: ['Technical Reviews'],
        stats: { jobsPosted: 2, candidatesReviewed: 23, interviews: 12 }
      },
      {
        id: '6',
        name: 'Sarah Johnson',
        role: 'Design Lead',
        department: 'Design',
        email: 'sarah.johnson@company.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        status: 'Active',
        joinDate: '2023-11-05',
        permissions: ['Design Interviews', 'Design Jobs'],
        stats: { jobsPosted: 4, candidatesReviewed: 32, interviews: 18 }
      },
      {
        id: '7',
        name: 'Lisa Wang',
        role: 'UX Designer',
        department: 'Design',
        email: 'lisa.wang@company.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1c9?w=150&h=150&fit=crop&crop=face',
        status: 'Active',
        joinDate: '2024-01-10',
        permissions: ['Design Reviews'],
        stats: { jobsPosted: 1, candidatesReviewed: 18, interviews: 8 }
      },
      {
        id: '8',
        name: 'Michael Rodriguez',
        role: 'Product Manager',
        department: 'Product',
        email: 'michael.rodriguez@company.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        status: 'Active',
        joinDate: '2024-02-01',
        permissions: ['Product Interviews', 'Product Jobs'],
        stats: { jobsPosted: 3, candidatesReviewed: 28, interviews: 15 }
      },
      {
        id: '9',
        name: 'Rachel Green',
        role: 'Product Designer',
        department: 'Product',
        email: 'rachel.green@company.com',
        avatar: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&h=150&fit=crop&crop=face',
        status: 'Active',
        joinDate: '2023-12-05',
        permissions: ['Product Design Reviews'],
        stats: { jobsPosted: 1, candidatesReviewed: 15, interviews: 7 }
      }
    ]
  };

  const departmentGroups = teamData.members.reduce((groups, member) => {
    const dept = member.department;
    if (!groups[dept]) {
      groups[dept] = [];
    }
    groups[dept].push(member);
    return groups;
  }, {} as Record<string, typeof teamData.members>);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-950/50 text-green-400 border-green-900/50';
      case 'Inactive': return 'bg-gray-900/50 text-gray-500 border-gray-800';
      case 'Pending': return 'bg-yellow-950/50 text-yellow-400 border-yellow-900/50';
      default: return 'bg-gray-900/50 text-gray-500 border-gray-800';
    }
  };

  const toggleDepartment = (department: string) => {
    setExpandedDepartments(prev => 
      prev.includes(department) 
        ? prev.filter(d => d !== department)
        : [...prev, department]
    );
  };

  const getDepartmentStats = (department: string) => {
    const members = departmentGroups[department] || [];
    const activeMembers = members.filter(m => m.status === 'Active').length;
    const totalInterviews = members.reduce((sum, m) => sum + m.stats.interviews, 0);
    return { total: members.length, active: activeMembers, interviews: totalInterviews };
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00ADB5] to-[#008B94] rounded-xl flex items-center justify-center shadow-lg shadow-[#00ADB5]/50">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-medium text-white">
            Team Management
          </h1>
        </div>
        <p className="text-base text-gray-400 leading-relaxed">
          Manage your hiring team members, roles, and permissions for AI challenge reviews.
        </p>
      </div>

      {/* Controls */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <Input
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 h-11 pl-10 bg-[#0F0F0F] border-[#1A1A1A] text-gray-200 placeholder:text-gray-600 focus:border-[#00ADB5]/50"
            />
          </div>
          
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-48 h-11 bg-[#0F0F0F] border-[#1A1A1A] text-gray-200">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Human Resources">Human Resources</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Product">Product</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button className="h-11 px-6 bg-gradient-to-r from-[#00ADB5] to-[#008B94] hover:from-[#00BEC7] hover:to-[#009CA5] text-white font-medium shadow-lg shadow-[#00ADB5]/30 hover:shadow-[#00ADB5]/50 transition-all duration-200 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Invite Team Member
        </Button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A] hover:border-[#00ADB5]/30 transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 tracking-wide">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-medium text-white mb-1">
              {teamData.members.length}
            </div>
            <p className="text-sm font-medium text-green-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +2 this month
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A] hover:border-[#00ADB5]/30 transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 tracking-wide">Active Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-medium text-white mb-1">
              {teamData.members.filter(m => m.status === 'Active').length}
            </div>
            <p className="text-sm font-medium text-[#00ADB5] flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              89% active rate
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A] hover:border-[#00ADB5]/30 transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 tracking-wide">Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-medium text-white mb-1">
              {Object.keys(departmentGroups).length}
            </div>
            <p className="text-sm text-gray-500">Represented</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A] hover:border-[#00ADB5]/30 transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 tracking-wide">Total Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-medium text-white mb-1">
              {teamData.members.reduce((sum, m) => sum + m.stats.interviews, 0)}
            </div>
            <p className="text-sm text-gray-500">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Department Sections */}
      <div className="space-y-4">
        {Object.entries(departmentGroups).map(([department, members]) => {
          const stats = getDepartmentStats(department);
          const isExpanded = expandedDepartments.includes(department);
          const shouldShow = departmentFilter === 'all' || departmentFilter === department;
          
          if (!shouldShow) return null;

          // Filter members within department based on search
          const filteredDeptMembers = members.filter(member => 
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase())
          );

          return (
            <Card key={department} className="overflow-hidden border-[#1A1A1A] bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A]">
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <CardHeader 
                    className="cursor-pointer hover:bg-[#1A1A1A]/50 transition-colors duration-200 p-6"
                    onClick={() => toggleDepartment(department)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <svg 
                          className={`w-5 h-5 text-[#00ADB5] transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-lg font-medium text-white">{department}</CardTitle>
                          <Badge variant="secondary" className="bg-[#00ADB5]/10 text-[#00ADB5] border border-[#00ADB5]/30 font-medium px-3 py-1">
                            {stats.total} members
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-8 text-sm">
                        <div className="text-center">
                          <div className="font-medium text-white">{stats.active}</div>
                          <div className="text-gray-500">active</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-white">{stats.interviews}</div>
                          <div className="text-gray-500">interviews</div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0 pb-6 px-6">
                    <div className="border-t border-[#1A1A1A] pt-6">
                      <div className="space-y-4">
                        {filteredDeptMembers.map((member) => (
                          <div key={member.id} className="flex items-center justify-between p-5 border border-[#1A1A1A] rounded-xl bg-[#0A0A0A] hover:bg-[#0F0F0F] hover:border-[#00ADB5]/30 transition-all duration-200 group">
                            <div className="flex items-center space-x-4">
                              <div className="relative">
                                <ImageWithFallback
                                  src={member.avatar}
                                  alt={member.name}
                                  className="w-12 h-12 rounded-full object-cover ring-2 ring-[#1A1A1A] group-hover:ring-[#00ADB5]/50 transition-all duration-200"
                                />
                                {member.status === 'Active' && (
                                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0A0A0A] shadow-lg shadow-green-500/50" />
                                )}
                              </div>
                              
                              <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                  <h4 className="font-medium text-gray-200 text-base group-hover:text-white transition-colors duration-200">{member.name}</h4>
                                  <Badge className={`${getStatusColor(member.status)} font-medium text-xs px-2 py-1 border`}>
                                    {member.status}
                                  </Badge>
                                </div>
                                <p className="text-sm font-medium text-gray-500">{member.role}</p>
                                <p className="text-sm text-gray-600">{member.email}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-8">
                              <div className="flex items-center gap-6 text-sm">
                                <div className="text-center">
                                  <div className="font-medium text-gray-200 text-base">{member.stats.jobsPosted}</div>
                                  <div className="text-gray-600 text-xs tracking-wide">Opportunities</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-medium text-gray-200 text-base">{member.stats.candidatesReviewed}</div>
                                  <div className="text-gray-600 text-xs tracking-wide">Reviewed</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-medium text-gray-200 text-base">{member.stats.interviews}</div>
                                  <div className="text-gray-600 text-xs tracking-wide">Interviews</div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="h-9 px-4 font-medium border-[#1A1A1A] bg-[#0F0F0F] text-gray-400 hover:bg-[#1A1A1A] hover:text-[#00ADB5] hover:border-[#00ADB5]/50 transition-all duration-200">
                                  Edit
                                </Button>
                                <Button size="sm" variant="ghost" className="h-9 w-9 p-0 text-gray-500 hover:text-[#00ADB5] hover:bg-[#1A1A1A] transition-all duration-200">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                  </svg>
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {filteredDeptMembers.length === 0 && (
                          <div className="text-center py-12 text-gray-500">
                            <div className="font-medium text-base mb-1">No team members found</div>
                            <div className="text-sm">No members in {department} match your search criteria.</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="mt-8 bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A] relative overflow-hidden">
        {/* Subtle glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ADB5] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
        
        <CardHeader className="relative">
          <CardTitle className="text-xl font-medium text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00ADB5] to-[#008B94] rounded-lg flex items-center justify-center shadow-lg shadow-[#00ADB5]/50">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            Recent Team Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="space-y-4">
            <div className="flex items-center gap-4 py-3 px-4 rounded-lg hover:bg-[#1A1A1A]/50 transition-colors duration-200">
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 shadow-lg shadow-green-500/50" />
              <div className="flex-1">
                <div className="text-sm">
                  <span className="font-medium text-gray-200">Jennifer Smith</span> 
                  <span className="text-gray-500"> reviewed 5 new challenge submissions for Frontend Developer role</span>
                </div>
              </div>
              <span className="text-xs font-medium text-gray-600 tracking-wide">2h ago</span>
            </div>
            <div className="flex items-center gap-4 py-3 px-4 rounded-lg hover:bg-[#1A1A1A]/50 transition-colors duration-200">
              <div className="w-2 h-2 bg-[#00ADB5] rounded-full flex-shrink-0 shadow-lg shadow-[#00ADB5]/50" />
              <div className="flex-1">
                <div className="text-sm">
                  <span className="font-medium text-gray-200">David Chen</span> 
                  <span className="text-gray-500"> scheduled 3 technical interviews for this week</span>
                </div>
              </div>
              <span className="text-xs font-medium text-gray-600 tracking-wide">4h ago</span>
            </div>
            <div className="flex items-center gap-4 py-3 px-4 rounded-lg hover:bg-[#1A1A1A]/50 transition-colors duration-200">
              <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 shadow-lg shadow-purple-500/50" />
              <div className="flex-1">
                <div className="text-sm">
                  <span className="font-medium text-gray-200">Sarah Johnson</span> 
                  <span className="text-gray-500"> posted new AI-powered UX Designer opportunity</span>
                </div>
              </div>
              <span className="text-xs font-medium text-gray-600 tracking-wide">1d ago</span>
            </div>
            <div className="flex items-center gap-4 py-3 px-4 rounded-lg hover:bg-[#1A1A1A]/50 transition-colors duration-200">
              <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0 shadow-lg shadow-yellow-500/50" />
              <div className="flex-1">
                <div className="text-sm">
                  <span className="font-medium text-gray-200">Michael Rodriguez</span> 
                  <span className="text-gray-500"> updated AI challenge requirements for Product Manager role</span>
                </div>
              </div>
              <span className="text-xs font-medium text-gray-600 tracking-wide">2d ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
