import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Job, Candidate } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CandidateListProps {
  job: Job;
  candidates: Candidate[];
  onViewProfile: (candidateId: string) => void;
}

export function CandidateList({ job, candidates, onViewProfile }: CandidateListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Button 
            variant="ghost" 
            className="p-2 text-gray-400 hover:text-[#00ADB5] hover:bg-[#1A1A1A] transition-all duration-200" 
            onClick={() => window.history.back()}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <div className="w-10 h-10 bg-gradient-to-br from-[#00ADB5] to-[#008B94] rounded-xl flex items-center justify-center shadow-lg shadow-[#00ADB5]/50">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-white">
            Students for {job.title}
          </h1>
        </div>
        
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {job.department}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {candidates.length} 42 students
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <Input
            placeholder="Search 42 students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 pl-10 bg-[#0F0F0F] border-[#1A1A1A] text-gray-200 placeholder:text-gray-600 focus:border-[#00ADB5]/50"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {['all', 'New', 'Reviewed', 'Interview', 'Hired', 'Rejected'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              onClick={() => setStatusFilter(status)}
              className={statusFilter === status 
                ? 'bg-gradient-to-r from-[#00ADB5] to-[#008B94] hover:from-[#00BEC7] hover:to-[#009CA5] text-white shadow-lg shadow-[#00ADB5]/30 border-0' 
                : 'border-[#1A1A1A] bg-[#0F0F0F] text-gray-400 hover:bg-[#1A1A1A] hover:text-[#00ADB5] hover:border-[#00ADB5]/50 transition-all duration-200'
              }
            >
              {status === 'all' ? 'All' : status}
            </Button>
          ))}
        </div>
      </div>

      {/* Candidates Grid */}
      {filteredCandidates.length === 0 ? (
        <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A]">
          <CardContent className="text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-[#00ADB5]/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-gray-500">No 42 students found matching your criteria.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id} className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A] hover:border-[#00ADB5]/50 hover:shadow-lg hover:shadow-[#00ADB5]/20 transition-all duration-200 group">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="relative flex-shrink-0">
                    <ImageWithFallback
                      src={candidate.avatar}
                      alt={candidate.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-[#1A1A1A] group-hover:ring-[#00ADB5]/50 transition-all duration-200"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#0F0F0F] rounded-full flex items-center justify-center border border-[#1A1A1A]">
                      <svg className="w-3 h-3 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-200 truncate group-hover:text-white transition-colors duration-200">
                        {candidate.name}
                      </h3>
                      <Badge className={`${getStatusColor(candidate.status)} border font-medium text-xs`}>
                        {candidate.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-1">{candidate.role}</p>
                    <p className="text-sm text-gray-600 mb-3 truncate">{candidate.email}</p>
                    
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {candidate.experience}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-[#00ADB5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {candidate.location}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-gradient-to-r from-[#00ADB5] to-[#008B94] hover:from-[#00BEC7] hover:to-[#009CA5] text-white shadow-lg shadow-[#00ADB5]/30 hover:shadow-[#00ADB5]/50 transition-all duration-200"
                        onClick={() => onViewProfile(candidate.id)}
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        View Profile
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 border-[#1A1A1A] bg-[#0F0F0F] text-gray-400 hover:bg-[#1A1A1A] hover:text-[#00ADB5] hover:border-[#00ADB5]/50 transition-all duration-200"
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
