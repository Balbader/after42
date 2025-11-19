import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const onboardingSteps = [
  {
    title: 'Welcome to After-42',
    description: 'The exclusive hiring marketplace for 42 Network students where AI-powered technical challenges replace traditional résumés.',
    icon: '🚀'
  },
  {
    title: 'AI-Generated Challenges',
    description: 'Our AI creates custom technical challenges based on your job requirements, evaluating candidates through real-world problem-solving.',
    icon: '⚡'
  },
  {
    title: 'Skills Over Résumés',
    description: 'Watch 42 students prove their abilities through hands-on challenges. See their scores, peer evaluations, and campus affiliations.',
    icon: '🎯'
  }
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const step = onboardingSteps[currentStep];
  
  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };
  
  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
      {/* Animated Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#00ADB5] rounded-full blur-[140px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#008B94] rounded-full blur-[140px] opacity-20 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <Card className="w-full max-w-lg shadow-2xl border-[#1A1A1A] bg-[#0A0A0A]/95 backdrop-blur-xl relative z-10">
        <CardHeader className="text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#00ADB5] to-[#008B94] rounded-2xl flex items-center justify-center text-4xl shadow-2xl shadow-[#00ADB5]/50 animate-pulse">
            {step.icon}
          </div>
          <CardTitle className="text-2xl text-white">{step.title}</CardTitle>
          <CardDescription className="text-lg text-gray-400">
            {step.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex justify-center space-x-2">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'w-8 bg-gradient-to-r from-[#00ADB5] to-[#008B94] shadow-lg shadow-[#00ADB5]/50' 
                    : 'w-2 bg-[#1A1A1A]'
                }`}
              />
            ))}
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleSkip}
              className="flex-1 border-[#1A1A1A] bg-[#0F0F0F] text-gray-400 hover:bg-[#1A1A1A] hover:text-white hover:border-[#00ADB5]/30 transition-all duration-200"
            >
              Skip
            </Button>
            <Button 
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-[#00ADB5] to-[#008B94] hover:from-[#00BEC7] hover:to-[#009CA5] text-white shadow-lg shadow-[#00ADB5]/30 hover:shadow-[#00ADB5]/50 transition-all duration-200"
            >
              {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
