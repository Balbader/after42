import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

export function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  const reportsData = {
    hiringStats: {
      totalApplications: 156,
      activeJobs: 12,
      interviews: 24,
      hired: 8
    },
    recentReports: [
      {
        id: '1',
        title: 'Monthly AI Challenge Report',
        description: 'Comprehensive overview of AI challenge performance for January 2025',
        date: '2025-01-31',
        status: 'Ready',
        type: 'PDF'
      },
      {
        id: '2',
        title: 'Campus Performance Report',
        description: 'Hiring metrics breakdown by 42 campus location',
        date: '2025-01-30',
        status: 'Ready',
        type: 'Excel'
      },
      {
        id: '3',
        title: 'Student Pipeline Report',
        description: 'Current status of 42 students in the hiring pipeline',
        date: '2025-01-29',
        status: 'Generating',
        type: 'PDF'
      }
    ],
    departmentBreakdown: [
      { department: 'Engineering', applications: 68, hired: 4, percentage: 43.6 },
      { department: 'Design', applications: 32, hired: 2, percentage: 20.5 },
      { department: 'Product', applications: 28, hired: 1, percentage: 17.9 },
      { department: 'Marketing', applications: 18, hired: 1, percentage: 11.5 },
      { department: 'Sales', applications: 10, hired: 0, percentage: 6.4 }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready': return 'bg-green-950/50 text-green-400 border-green-900/50';
      case 'Generating': return 'bg-yellow-950/50 text-yellow-400 border-yellow-900/50';
      case 'Failed': return 'bg-red-950/50 text-red-400 border-red-900/50';
      default: return 'bg-gray-900/50 text-gray-500 border-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00ADB5] to-[#008B94] rounded-xl flex items-center justify-center shadow-lg shadow-[#00ADB5]/50">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-medium text-white">
            AI Challenge Reports
          </h1>
        </div>
        <p className="text-base text-gray-400 leading-relaxed">
          Generate and view detailed reports on AI-powered hiring challenges and performance analytics.
        </p>
      </div>

      {/* Controls */}
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48 h-11 bg-[#0F0F0F] border-[#1A1A1A] text-gray-200">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button className="h-11 px-6 bg-gradient-to-r from-[#00ADB5] to-[#008B94] hover:from-[#00BEC7] hover:to-[#009CA5] text-white font-medium shadow-lg shadow-[#00ADB5]/30 hover:shadow-[#00ADB5]/50 transition-all duration-200 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Generate New Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A] hover:border-[#00ADB5]/30 transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 tracking-wide">Challenge Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-medium text-white mb-1">
              {reportsData.hiringStats.totalApplications}
            </div>
            <p className="text-sm font-medium text-green-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A] hover:border-[#00ADB5]/30 transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 tracking-wide">Active Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-medium text-white mb-1">
              {reportsData.hiringStats.activeJobs}
            </div>
            <p className="text-sm font-medium text-[#00ADB5] flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              +2 new this week
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A] hover:border-[#00ADB5]/30 transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 tracking-wide">Interviews Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-medium text-white mb-1">
              {reportsData.hiringStats.interviews}
            </div>
            <p className="text-sm font-medium text-yellow-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              8 scheduled this week
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A] hover:border-[#00ADB5]/30 transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 tracking-wide">Successfully Hired</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-medium text-white mb-1">
              {reportsData.hiringStats.hired}
            </div>
            <p className="text-sm font-medium text-green-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              3 this week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Reports */}
        <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A]">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Recent Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportsData.recentReports.map((report) => (
                <div key={report.id} className="flex items-start justify-between p-5 border border-[#1A1A1A] rounded-xl bg-[#0A0A0A] hover:border-[#00ADB5]/30 hover:bg-[#0F0F0F] transition-all duration-200 group">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-gray-200 text-base leading-tight group-hover:text-white transition-colors duration-200">{report.title}</h4>
                      <Badge className={`${getStatusColor(report.status)} font-medium border`}>
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{report.description}</p>
                    <div className="flex items-center gap-6 text-xs font-medium text-gray-600 tracking-wide">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(report.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        {report.type}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      disabled={report.status === 'Generating'}
                      className="h-9 px-4 font-medium border-[#1A1A1A] bg-[#0F0F0F] text-gray-400 hover:bg-[#1A1A1A] hover:text-[#00ADB5] hover:border-[#00ADB5]/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Breakdown */}
        <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A]">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Department Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {reportsData.departmentBreakdown.map((dept) => (
                <div key={dept.department} className="space-y-3 p-4 rounded-lg bg-[#0A0A0A] border border-[#1A1A1A] hover:border-[#00ADB5]/30 transition-all duration-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-200 text-base">{dept.department}</span>
                    <span className="text-sm font-medium text-gray-500">{dept.applications} submissions</span>
                  </div>
                  <div className="w-full bg-[#1A1A1A] rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#00ADB5] to-[#008B94] h-2.5 rounded-full transition-all duration-300 shadow-lg shadow-[#00ADB5]/50" 
                      style={{ width: `${dept.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-500 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {dept.hired} hired
                    </span>
                    <span className="font-medium text-[#00ADB5]">{dept.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8 bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A] relative overflow-hidden">
        {/* Subtle glow effect */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00ADB5] rounded-full blur-[140px] opacity-10 pointer-events-none"></div>
        
        <CardHeader className="relative">
          <CardTitle className="text-xl font-medium text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00ADB5] to-[#008B94] rounded-lg flex items-center justify-center shadow-lg shadow-[#00ADB5]/50">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            Quick AI Report Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center gap-3 h-20 justify-start p-6 border-[#1A1A1A] bg-[#0A0A0A] text-gray-300 hover:bg-[#1A1A1A] hover:text-white hover:border-[#00ADB5]/50 transition-all duration-200 group">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00ADB5]/20 to-[#008B94]/20 rounded-lg flex items-center justify-center border border-[#00ADB5]/30 group-hover:shadow-lg group-hover:shadow-[#00ADB5]/30 transition-all duration-200">
                  <svg className="w-5 h-5 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="text-left">
                <div className="font-medium text-base">AI Performance Report</div>
                <div className="text-sm text-gray-500 mt-1">Challenge metrics & insights</div>
              </div>
            </Button>
            
            <Button variant="outline" className="flex items-center gap-3 h-20 justify-start p-6 border-[#1A1A1A] bg-[#0A0A0A] text-gray-300 hover:bg-[#1A1A1A] hover:text-white hover:border-[#00ADB5]/50 transition-all duration-200 group">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00ADB5]/20 to-[#008B94]/20 rounded-lg flex items-center justify-center border border-[#00ADB5]/30 group-hover:shadow-lg group-hover:shadow-[#00ADB5]/30 transition-all duration-200">
                  <svg className="w-5 h-5 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-left">
                <div className="font-medium text-base">Student Pipeline</div>
                <div className="text-sm text-gray-500 mt-1">42 Network pipeline status</div>
              </div>
            </Button>
            
            <Button variant="outline" className="flex items-center gap-3 h-20 justify-start p-6 border-[#1A1A1A] bg-[#0A0A0A] text-gray-300 hover:bg-[#1A1A1A] hover:text-white hover:border-[#00ADB5]/50 transition-all duration-200 group">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00ADB5]/20 to-[#008B94]/20 rounded-lg flex items-center justify-center border border-[#00ADB5]/30 group-hover:shadow-lg group-hover:shadow-[#00ADB5]/30 transition-all duration-200">
                  <svg className="w-5 h-5 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-left">
                <div className="font-medium text-base">Cost Analysis</div>
                <div className="text-sm text-gray-500 mt-1">Hiring costs & ROI</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
