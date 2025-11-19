import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Job, Candidate } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CandidateProfileProps {
  candidate: Candidate;
  job: Job;
  onBack: () => void;
}

export function CandidateProfile({ candidate, job, onBack }: CandidateProfileProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-950/50 text-blue-400 border-blue-900/50';
      case 'Reviewed': return 'bg-yellow-950/50 text-yellow-400 border-yellow-900/50';
      case 'Interview': return 'bg-purple-950/50 text-purple-400 border-purple-900/50';
      case 'Hired': return 'bg-green-950/50 text-green-400 border-green-900/50';
      case 'Rejected': return 'bg-red-950/50 text-red-400 border-red-900/50';
      default: return 'bg-gray-900/50 text-gray-500 border-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            className="p-2 text-gray-400 hover:text-[#00ADB5] hover:bg-[#1A1A1A] transition-all duration-200" 
            onClick={onBack}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <div className="w-10 h-10 bg-gradient-to-br from-[#00ADB5] to-[#008B94] rounded-xl flex items-center justify-center shadow-lg shadow-[#00ADB5]/50">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-white">
              {candidate.name}
            </h1>
            <p className="text-gray-400">
              42 Student applying for {job.title} in {job.department}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A]">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <ImageWithFallback
                    src={candidate.avatar}
                    alt={candidate.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-[#00ADB5]/30"
                  />
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-[#00ADB5] to-[#008B94] rounded-full flex items-center justify-center shadow-lg shadow-[#00ADB5]/50">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white">{candidate.name}</h3>
                  <p className="text-gray-400">{candidate.role}</p>
                  <Badge className={`mt-2 ${getStatusColor(candidate.status)} border font-medium`}>
                    {candidate.status}
                  </Badge>
                </div>
                
                <Separator className="bg-[#1A1A1A]" />
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <svg className="w-4 h-4 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{candidate.email}</span>
                  </div>
                  
                  {candidate.phone && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <svg className="w-4 h-4 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{candidate.phone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-gray-400">
                    <svg className="w-4 h-4 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{candidate.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-400">
                    <svg className="w-4 h-4 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{candidate.experience} experience</span>
                  </div>
                </div>
                
                <Separator className="bg-[#1A1A1A]" />
                
                <div className="flex gap-2">
                  <Button className="flex-1 bg-gradient-to-r from-[#00ADB5] to-[#008B94] hover:from-[#00BEC7] hover:to-[#009CA5] text-white shadow-lg shadow-[#00ADB5]/30 hover:shadow-[#00ADB5]/50 transition-all duration-200">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Schedule Interview
                  </Button>
                  <Button variant="outline" className="flex-1 border-[#1A1A1A] bg-[#0F0F0F] text-gray-400 hover:bg-[#1A1A1A] hover:text-[#00ADB5] hover:border-[#00ADB5]/50 transition-all duration-200">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start border-[#1A1A1A] bg-[#0F0F0F] text-gray-400 hover:bg-[#1A1A1A] hover:text-[#00ADB5] hover:border-[#00ADB5]/50 transition-all duration-200">
                <svg className="w-4 h-4 mr-2 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Challenge Submission
              </Button>
              
              <Button variant="outline" className="w-full justify-start border-[#1A1A1A] bg-[#0F0F0F] text-gray-400 hover:bg-[#1A1A1A] hover:text-[#00ADB5] hover:border-[#00ADB5]/50 transition-all duration-200">
                <svg className="w-4 h-4 mr-2 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Add Notes
              </Button>
              
              <Button variant="outline" className="w-full justify-start border-[#1A1A1A] bg-[#0F0F0F] text-gray-400 hover:bg-[#1A1A1A] hover:text-[#00ADB5] hover:border-[#00ADB5]/50 transition-all duration-200">
                <svg className="w-4 h-4 mr-2 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Save to Favorites
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary */}
          <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                About
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 leading-relaxed">
                {candidate.summary || 'No summary provided.'}
              </p>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Skills & Technologies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {candidate.skills?.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-[#00ADB5]/10 text-[#00ADB5] border border-[#00ADB5]/30 font-medium">
                    {skill}
                  </Badge>
                )) || <p className="text-gray-500">No skills listed.</p>}
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
                Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 bg-[#0A0A0A] rounded-lg border border-[#1A1A1A]">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00ADB5]/20 to-[#008B94]/20 rounded-lg flex items-center justify-center border border-[#00ADB5]/30">
                  <svg className="w-5 h-5 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  </svg>
                </div>
                <span className="text-gray-300">{candidate.education || '42 Network Education Program'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Links */}
          <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Links & Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {candidate.linkedIn && (
                  <a href={candidate.linkedIn} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-[#0A0A0A] rounded-lg border border-[#1A1A1A] hover:border-[#00ADB5]/50 transition-all duration-200 group">
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span className="text-gray-300 group-hover:text-[#00ADB5] transition-colors duration-200">LinkedIn Profile</span>
                  </a>
                )}
                
                {candidate.portfolio && (
                  <a href={candidate.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-[#0A0A0A] rounded-lg border border-[#1A1A1A] hover:border-[#00ADB5]/50 transition-all duration-200 group">
                    <svg className="w-5 h-5 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <span className="text-gray-300 group-hover:text-[#00ADB5] transition-colors duration-200">Portfolio Website</span>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status Change */}
          <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A] relative overflow-hidden">
            {/* Subtle glow effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ADB5] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
            
            <CardHeader className="relative">
              <CardTitle className="text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#00ADB5] to-[#008B94] rounded-lg flex items-center justify-center shadow-lg shadow-[#00ADB5]/50">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
                Change Status
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" variant="outline" className="bg-blue-950/30 text-blue-400 border-blue-900/50 hover:bg-blue-950/50 hover:border-blue-800 transition-all duration-200">
                  Mark as New
                </Button>
                <Button size="sm" variant="outline" className="bg-yellow-950/30 text-yellow-400 border-yellow-900/50 hover:bg-yellow-950/50 hover:border-yellow-800 transition-all duration-200">
                  Mark as Reviewed
                </Button>
                <Button size="sm" variant="outline" className="bg-purple-950/30 text-purple-400 border-purple-900/50 hover:bg-purple-950/50 hover:border-purple-800 transition-all duration-200">
                  Schedule Interview
                </Button>
                <Button size="sm" variant="outline" className="bg-green-950/30 text-green-400 border-green-900/50 hover:bg-green-950/50 hover:border-green-800 transition-all duration-200">
                  Mark as Hired
                </Button>
                <Button size="sm" variant="outline" className="bg-red-950/30 text-red-400 border-red-900/50 hover:bg-red-950/50 hover:border-red-800 transition-all duration-200">
                  Mark as Rejected
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
