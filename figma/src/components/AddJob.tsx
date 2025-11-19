import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Job } from '../App';

interface AddJobProps {
  onAddJob: (job: Omit<Job, 'id' | 'candidatesCount' | 'datePosted'>) => void;
}

export function AddJob({ onAddJob }: AddJobProps) {
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: '',
    status: 'Draft' as Job['status'],
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.department && formData.location && formData.type) {
      onAddJob({
        title: formData.title,
        department: formData.department,
        location: formData.location,
        type: formData.type,
        status: formData.status
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white mb-2">
          Post New Opportunity
        </h1>
        <p className="text-gray-400">
          Create a new opportunity and our AI will generate a custom technical challenge aligned with your requirements.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Information */}
          <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A]">
            <CardHeader>
              <CardTitle className="text-white">Job Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-300">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Senior Frontend Developer"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                  className="bg-[#0A0A0A] border-[#1A1A1A] text-gray-200 placeholder:text-gray-600 focus:border-[#00ADB5] focus:ring-[#00ADB5]/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-gray-300">Department *</Label>
                <Select onValueChange={(value) => handleInputChange('department', value)}>
                  <SelectTrigger className="bg-[#0A0A0A] border-[#1A1A1A] text-gray-200">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="HR">Human Resources</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-300">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g. San Francisco, CA or Remote"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required
                  className="bg-[#0A0A0A] border-[#1A1A1A] text-gray-200 placeholder:text-gray-600 focus:border-[#00ADB5] focus:ring-[#00ADB5]/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-gray-300">Employment Type *</Label>
                <Select onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger className="bg-[#0A0A0A] border-[#1A1A1A] text-gray-200">
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-gray-300">Status</Label>
                <Select 
                  value={formData.status}
                  onValueChange={(value: Job['status']) => handleInputChange('status', value)}
                >
                  <SelectTrigger className="bg-[#0A0A0A] border-[#1A1A1A] text-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card className="bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A] border-[#1A1A1A]">
            <CardHeader>
              <CardTitle className="text-white">Job Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role, responsibilities, and requirements..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={10}
                  className="resize-none bg-[#0A0A0A] border-[#1A1A1A] text-gray-200 placeholder:text-gray-600 focus:border-[#00ADB5] focus:ring-[#00ADB5]/20"
                />
              </div>

              <div className="text-sm text-gray-600">
                <p className="mb-2 text-gray-500">Tips for a great job description:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Include key responsibilities and requirements</li>
                  <li>Mention required skills and experience</li>
                  <li>Highlight company culture and benefits</li>
                  <li>Be specific about what you're looking for</li>
                </ul>
              </div>

              <div className="mt-4 p-4 bg-gradient-to-r from-[#00ADB5]/10 to-[#008B94]/10 border border-[#00ADB5]/30 rounded-lg shadow-lg shadow-[#00ADB5]/10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#00ADB5] to-[#008B94] rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#00ADB5]/50">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-[#00ADB5] mb-1">AI Challenge Generation</p>
                    <p className="text-gray-400">Our AI will automatically create a custom technical challenge based on this job description, including evaluation rubrics aligned with your role requirements.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => window.history.back()}
            className="border-[#1A1A1A] bg-[#0F0F0F] text-gray-400 hover:bg-[#1A1A1A] hover:text-white hover:border-[#00ADB5]/30 transition-all duration-200"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-gradient-to-r from-[#00ADB5] to-[#008B94] hover:from-[#00BEC7] hover:to-[#009CA5] text-white shadow-lg shadow-[#00ADB5]/30 hover:shadow-[#00ADB5]/50 transition-all duration-200"
          >
            Create Job Position
          </Button>
        </div>
      </form>
    </div>
  );
}
