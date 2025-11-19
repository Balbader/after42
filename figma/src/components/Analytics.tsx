import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

export function Analytics() {
  const [selectedMetric, setSelectedMetric] = useState('overview');
  
  const analyticsData = {
    overview: {
      totalViews: 2847,
      conversionRate: 12.4,
      averageTimeToHire: 18,
      sourceEffectiveness: 76
    },
    sources: [
      { name: '42 Network', applications: 68, hired: 4, rate: 5.9 },
      { name: 'Direct Referrals', applications: 45, hired: 2, rate: 4.4 },
      { name: 'Company Website', applications: 32, hired: 3, rate: 9.4 },
      { name: '42 Alumni Network', applications: 15, hired: 2, rate: 13.3 },
      { name: 'Tech Communities', applications: 28, hired: 1, rate: 3.6 }
    ],
    timeToHire: [
      { stage: 'Challenge Posted to Review', days: 2.5, target: 3 },
      { stage: 'Review to Interview', days: 5.2, target: 5 },
      { stage: 'Interview to Decision', days: 4.8, target: 4 },
      { stage: 'Decision to Offer', days: 1.8, target: 2 },
      { stage: 'Offer to Acceptance', days: 3.2, target: 3 }
    ],
    topPerformers: [
      { name: 'Sarah Chen', applications: 12, interviews: 8, hired: 3 },
      { name: 'Michael Rodriguez', applications: 8, interviews: 6, hired: 2 },
      { name: 'Emily Johnson', applications: 15, interviews: 10, hired: 4 }
    ]
  };

  const getPerformanceColor = (actual: number, target: number) => {
    if (actual <= target) return 'text-green-400';
    if (actual <= target * 1.2) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSourceColor = (rate: number) => {
    if (rate >= 8) return 'bg-green-950/50 text-green-400 border-green-900/50';
    if (rate >= 5) return 'bg-yellow-950/50 text-yellow-400 border-yellow-900/50';
    return 'bg-red-950/50 text-red-400 border-red-900/50';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00ADB5] to-[#008B94] rounded-xl flex items-center justify-center shadow-lg shadow-[#00ADB5]/50">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-white">
            AI-Powered Analytics
          </h1>
        </div>
        <p className="text-gray-400">
          Deep insights into your hiring process and AI challenge performance metrics.
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-48 bg-[#0F0F0F] border-[#1A1A1A] text-gray-200">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="sources">Source Performance</SelectItem>
              <SelectItem value="time">Time to Hire</SelectItem>
              <SelectItem value="conversion">Conversion Rates</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button className="bg-gradient-to-r from-[#00ADB5] to-[#008B94] hover:from-[#00BEC7] hover:to-[#009CA5] text-white shadow-lg shadow-[#00ADB5]/30 hover:shadow-[#00ADB5]/50 transition-all duration-200">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Analytics
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A] hover:border-[#00ADB5]/30 transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">Total Job Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-white">
              {analyticsData.overview.totalViews.toLocaleString()}
            </div>
            <p className="text-sm text-green-400 mt-1 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +18% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A] hover:border-[#00ADB5]/30 transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">Challenge Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-white">
              {analyticsData.overview.conversionRate}%
            </div>
            <p className="text-sm text-yellow-400 mt-1 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
              -2% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A] hover:border-[#00ADB5]/30 transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">Avg. Time to Hire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-white">
              {analyticsData.overview.averageTimeToHire} days
            </div>
            <p className="text-sm text-green-400 mt-1 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              -3 days improvement
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A] hover:border-[#00ADB5]/30 transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">AI Challenge Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-white">
              {analyticsData.overview.sourceEffectiveness}%
            </div>
            <p className="text-sm text-[#00ADB5] mt-1 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              +5% AI improvement
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Source Performance */}
        <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Source Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.sources.map((source) => (
                <div key={source.name} className="flex items-center justify-between p-4 border border-[#1A1A1A] rounded-lg bg-[#0A0A0A] hover:border-[#00ADB5]/30 transition-all duration-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-200">{source.name}</h4>
                      <Badge className={`${getSourceColor(source.rate)} font-medium border`}>
                        {source.rate}% hire rate
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      {source.applications} applications • {source.hired} hired
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="w-24 bg-[#1A1A1A] rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-[#00ADB5] to-[#008B94] h-2 rounded-full shadow-lg shadow-[#00ADB5]/50" 
                        style={{ width: `${Math.min(source.rate * 5, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time to Hire Analysis */}
        <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Time to Hire Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.timeToHire.map((stage) => (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-200">{stage.stage}</span>
                    <span className={`text-sm font-medium ${getPerformanceColor(stage.days, stage.target)}`}>
                      {stage.days} days
                    </span>
                  </div>
                  <div className="w-full bg-[#1A1A1A] rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        stage.days <= stage.target ? 'bg-green-500 shadow-lg shadow-green-500/50' : 
                        stage.days <= stage.target * 1.2 ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50' : 'bg-red-500 shadow-lg shadow-red-500/50'
                      }`}
                      style={{ width: `${Math.min((stage.days / stage.target) * 50, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Target: {stage.target} days</span>
                    <span className={stage.days <= stage.target ? 'text-green-500' : stage.days <= stage.target * 1.2 ? 'text-yellow-500' : 'text-red-500'}>
                      {stage.days <= stage.target ? 'On track' : 
                       stage.days <= stage.target * 1.2 ? 'Slightly behind' : 'Behind target'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Performance Insights */}
      <Card className="mt-8 bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A] overflow-hidden relative">
        {/* Subtle glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ADB5] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
        
        <CardHeader className="relative">
          <CardTitle className="text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00ADB5] to-[#008B94] rounded-lg flex items-center justify-center shadow-lg shadow-[#00ADB5]/50">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            AI Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-white flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-[#00ADB5] to-[#008B94] rounded-full"></div>
                Key Findings
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2 p-2 rounded-lg hover:bg-[#1A1A1A]/50 transition-colors duration-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0 shadow-lg shadow-green-500/50" />
                  42 Alumni Network has highest conversion at 13.3%
                </li>
                <li className="flex items-start gap-2 p-2 rounded-lg hover:bg-[#1A1A1A]/50 transition-colors duration-200">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0 shadow-lg shadow-yellow-500/50" />
                  Interview to decision stage needs optimization
                </li>
                <li className="flex items-start gap-2 p-2 rounded-lg hover:bg-[#1A1A1A]/50 transition-colors duration-200">
                  <div className="w-2 h-2 bg-[#00ADB5] rounded-full mt-1.5 flex-shrink-0 shadow-lg shadow-[#00ADB5]/50" />
                  AI challenges show 76% accuracy in predicting success
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-white flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-[#00ADB5] to-[#008B94] rounded-full"></div>
                AI Recommendations
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2 p-2 rounded-lg hover:bg-[#1A1A1A]/50 transition-colors duration-200">
                  <div className="w-2 h-2 bg-gradient-to-br from-[#00ADB5] to-[#008B94] rounded-full mt-1.5 flex-shrink-0 shadow-lg shadow-[#00ADB5]/50" />
                  Increase 42 Alumni Network engagement programs
                </li>
                <li className="flex items-start gap-2 p-2 rounded-lg hover:bg-[#1A1A1A]/50 transition-colors duration-200">
                  <div className="w-2 h-2 bg-gradient-to-br from-[#00ADB5] to-[#008B94] rounded-full mt-1.5 flex-shrink-0 shadow-lg shadow-[#00ADB5]/50" />
                  Streamline AI challenge review process
                </li>
                <li className="flex items-start gap-2 p-2 rounded-lg hover:bg-[#1A1A1A]/50 transition-colors duration-200">
                  <div className="w-2 h-2 bg-gradient-to-br from-[#00ADB5] to-[#008B94] rounded-full mt-1.5 flex-shrink-0 shadow-lg shadow-[#00ADB5]/50" />
                  Focus on high-converting 42 campuses
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-white flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-[#00ADB5] to-[#008B94] rounded-full"></div>
                Trending Up
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-[#1A1A1A]/50 transition-colors duration-200">
                  <span className="text-sm text-gray-400">Challenge Completions</span>
                  <span className="text-sm font-medium text-green-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    +24%
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-[#1A1A1A]/50 transition-colors duration-200">
                  <span className="text-sm text-gray-400">Direct Applications</span>
                  <span className="text-sm font-medium text-green-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    +18%
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-[#1A1A1A]/50 transition-colors duration-200">
                  <span className="text-sm text-gray-400">AI Score Accuracy</span>
                  <span className="text-sm font-medium text-[#00ADB5] flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    +32%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
