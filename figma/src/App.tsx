import React, { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { Dashboard } from './components/Dashboard';
import { CandidateList } from './components/CandidateList';
import { CandidateProfile } from './components/CandidateProfile';
import { AddJob } from './components/AddJob';
import { Settings } from './components/Settings';
import { Reports } from './components/Reports';
import { Analytics } from './components/Analytics';
import { Team } from './components/Team';
import { Sidebar } from './components/Sidebar';

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: 'Active' | 'Draft' | 'Closed';
  candidatesCount: number;
  datePosted: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  techStack?: string[];
  aiGenerated?: boolean;
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  jobId: string;
  email: string;
  status: 'New' | 'Reviewed' | 'Interview' | 'Rejected' | 'Hired';
  avatar: string;
  experience: string;
  location: string;
  phone?: string;
  resume?: string;
  skills?: string[];
  education?: string;
  summary?: string;
  linkedIn?: string;
  portfolio?: string;
  campus42?: string;
  challengeScore?: number;
  peerEvaluation?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  authProvider: 'email' | 'google' | 'github' | 'microsoft';
}

export type Screen = 'login' | 'onboarding' | 'dashboard' | 'candidates' | 'candidate-profile' | 'add-job' | 'settings' | 'reports' | 'analytics' | 'team';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: '1',
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      type: 'Full-time',
      status: 'Active',
      candidatesCount: 12,
      datePosted: '2025-01-25',
      difficulty: 'Advanced',
      techStack: ['React', 'TypeScript', 'Next.js', 'GraphQL'],
      aiGenerated: true
    },
    {
      id: '2',
      title: 'UX Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      status: 'Active',
      candidatesCount: 8,
      datePosted: '2025-01-23',
      difficulty: 'Intermediate',
      techStack: ['Figma', 'Design Systems', 'Prototyping'],
      aiGenerated: true
    },
    {
      id: '3',
      title: 'Product Manager',
      department: 'Product',
      location: 'New York, NY',
      type: 'Full-time',
      status: 'Draft',
      candidatesCount: 3,
      datePosted: '2025-01-20',
      difficulty: 'Intermediate',
      aiGenerated: false
    },
    {
      id: '4',
      title: 'Backend Engineer',
      department: 'Engineering',
      location: 'Austin, TX',
      type: 'Full-time',
      status: 'Active',
      candidatesCount: 15,
      datePosted: '2025-01-18',
      difficulty: 'Advanced',
      techStack: ['Node.js', 'PostgreSQL', 'Docker', 'AWS'],
      aiGenerated: true
    }
  ]);

  const [candidates, setCandidates] = useState<Candidate[]>([
    // Frontend Developer candidates
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'Senior Frontend Developer',
      jobId: '1',
      email: 'sarah.chen@email.com',
      status: 'Interview',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1c9?w=150&h=150&fit=crop&crop=face',
      experience: '5+ years',
      location: 'San Francisco, CA',
      phone: '+1 (555) 123-4567',
      skills: ['React', 'TypeScript', 'Next.js', 'Node.js', 'GraphQL'],
      education: '42 Silicon Valley',
      summary: 'Experienced frontend developer with a passion for creating user-friendly applications. Skilled in React, TypeScript, and modern web technologies.',
      linkedIn: 'https://linkedin.com/in/sarahchen',
      portfolio: 'https://sarahchen.dev',
      campus42: '42 Silicon Valley',
      challengeScore: 94,
      peerEvaluation: 4.8
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      role: 'Senior Frontend Developer',
      jobId: '1',
      email: 'michael.r@email.com',
      status: 'Reviewed',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      experience: '6+ years',
      location: 'Los Angeles, CA',
      phone: '+1 (555) 234-5678',
      skills: ['Vue.js', 'JavaScript', 'CSS', 'Python', 'Docker'],
      education: '42 Paris',
      summary: 'Full-stack developer specializing in frontend technologies. Strong background in Vue.js and modern JavaScript frameworks.',
      linkedIn: 'https://linkedin.com/in/michaelrodriguez',
      portfolio: 'https://mrodriguez.dev',
      campus42: '42 Paris',
      challengeScore: 88,
      peerEvaluation: 4.6
    },
    {
      id: '3',
      name: 'Emily Johnson',
      role: 'Senior Frontend Developer',
      jobId: '1',
      email: 'emily.j@email.com',
      status: 'New',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      experience: '4+ years',
      location: 'Seattle, WA',
      phone: '+1 (555) 345-6789',
      skills: ['React', 'Angular', 'JavaScript', 'CSS', 'AWS'],
      education: '42 USA',
      summary: 'Creative frontend developer with expertise in React and Angular. Passionate about building accessible and performant web applications.',
      linkedIn: 'https://linkedin.com/in/emilyjohnson',
      portfolio: 'https://emilyjohnson.dev',
      campus42: '42 USA',
      challengeScore: 91,
      peerEvaluation: 4.9
    },
    // UX Designer candidates
    {
      id: '4',
      name: 'David Kim',
      role: 'UX Designer',
      jobId: '2',
      email: 'david.kim@email.com',
      status: 'Interview',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      experience: '3+ years',
      location: 'Remote',
      phone: '+1 (555) 456-7890',
      skills: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research'],
      education: '42 Seoul',
      summary: 'User-centered designer with a focus on creating intuitive and engaging digital experiences. Experienced in design systems and prototyping.',
      linkedIn: 'https://linkedin.com/in/davidkim',
      portfolio: 'https://davidkim.design',
      campus42: '42 Seoul',
      challengeScore: 86,
      peerEvaluation: 4.7
    },
    {
      id: '5',
      name: 'Lisa Wang',
      role: 'UX Designer',
      jobId: '2',
      email: 'lisa.wang@email.com',
      status: 'Reviewed',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      experience: '5+ years',
      location: 'New York, NY',
      phone: '+1 (555) 567-8901',
      skills: ['UI/UX Design', 'Figma', 'User Research', 'Wireframing', 'Design Systems'],
      education: '42 Barcelona',
      summary: 'Senior UX designer with extensive experience in user research and design systems. Skilled in creating cohesive and scalable design solutions.',
      linkedIn: 'https://linkedin.com/in/lisawang',
      portfolio: 'https://lisawang.design',
      campus42: '42 Barcelona',
      challengeScore: 92,
      peerEvaluation: 4.9
    },
    // Backend Engineer candidates
    {
      id: '6',
      name: 'Alex Thompson',
      role: 'Backend Engineer',
      jobId: '4',
      email: 'alex.t@email.com',
      status: 'New',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      experience: '7+ years',
      location: 'Austin, TX',
      phone: '+1 (555) 678-9012',
      skills: ['Node.js', 'Python', 'PostgreSQL', 'AWS', 'Docker'],
      education: '42 Silicon Valley',
      summary: 'Senior backend engineer with expertise in scalable system design and cloud architecture. Experienced in building high-performance APIs.',
      linkedIn: 'https://linkedin.com/in/alexthompson',
      portfolio: 'https://alexthompson.dev',
      campus42: '42 Silicon Valley',
      challengeScore: 96,
      peerEvaluation: 5.0
    },
    {
      id: '7',
      name: 'Rachel Green',
      role: 'Backend Engineer',
      jobId: '4',
      email: 'rachel.g@email.com',
      status: 'Interview',
      avatar: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&h=150&fit=crop&crop=face',
      experience: '4+ years',
      location: 'Denver, CO',
      phone: '+1 (555) 789-0123',
      skills: ['Java', 'Spring Boot', 'MySQL', 'Kubernetes', 'GraphQL'],
      education: '42 Tokyo',
      summary: 'Backend developer specializing in Java and Spring Boot. Strong experience in microservices architecture and database design.',
      linkedIn: 'https://linkedin.com/in/rachelgreen',
      portfolio: 'https://rachelgreen.dev',
      campus42: '42 Tokyo',
      challengeScore: 89,
      peerEvaluation: 4.7
    }
  ]);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('currentUser');
    const savedOnboarding = localStorage.getItem('hasCompletedOnboarding');
    
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsLoggedIn(true);
      
      if (savedOnboarding === 'true') {
        setHasCompletedOnboarding(true);
        setCurrentScreen('dashboard');
      } else {
        setCurrentScreen('onboarding');
      }
    }
  }, []);

  const handleLogin = (email: string, password: string) => {
    // Simulate login with saved users or default demo user
    const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = savedUsers.find((u: User) => u.email === email) || {
      id: Date.now().toString(),
      name: email.split('@')[0] || 'Demo User',
      email,
      role: 'HR Manager',
      authProvider: 'email' as const
    };

    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    if (hasCompletedOnboarding || localStorage.getItem('hasCompletedOnboarding') === 'true') {
      setHasCompletedOnboarding(true);
      setCurrentScreen('dashboard');
    } else {
      setCurrentScreen('onboarding');
    }
  };

  const handleSignUp = (name: string, email: string, password: string) => {
    // Save new user to localStorage
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: 'HR Manager',
      authProvider: 'email'
    };

    const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    savedUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(savedUsers));

    setCurrentUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setCurrentScreen('onboarding');
  };

  const handleSocialLogin = (provider: 'google' | 'github' | 'microsoft', userData: Partial<User>) => {
    const user: User = {
      id: Date.now().toString(),
      name: userData.name || 'User',
      email: userData.email || `user@${provider}.com`,
      avatar: userData.avatar,
      role: 'HR Manager',
      authProvider: provider
    };

    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    if (hasCompletedOnboarding || localStorage.getItem('hasCompletedOnboarding') === 'true') {
      setHasCompletedOnboarding(true);
      setCurrentScreen('dashboard');
    } else {
      setCurrentScreen('onboarding');
    }
  };

  const handleCompleteOnboarding = () => {
    setHasCompletedOnboarding(true);
    localStorage.setItem('hasCompletedOnboarding', 'true');
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentScreen('login');
    localStorage.removeItem('currentUser');
  };

  const handleNavigate = (screen: Screen, jobId?: string, candidateId?: string) => {
    setCurrentScreen(screen);
    if (jobId) {
      setSelectedJobId(jobId);
    }
    if (candidateId) {
      setSelectedCandidateId(candidateId);
    }
  };

  const addJob = (newJob: Omit<Job, 'id' | 'candidatesCount' | 'datePosted'>) => {
    const job: Job = {
      ...newJob,
      id: Date.now().toString(),
      candidatesCount: 0,
      datePosted: new Date().toISOString().split('T')[0]
    };
    setJobs(prev => [...prev, job]);
    setCurrentScreen('dashboard');
  };

  const handleAddNewJob = () => {
    setCurrentScreen('add-job');
  };

  if (!isLoggedIn) {
    return (
      <LoginScreen 
        onLogin={handleLogin} 
        onSignUp={handleSignUp}
        onSocialLogin={handleSocialLogin}
      />
    );
  }

  if (currentScreen === 'onboarding') {
    return <OnboardingScreen onComplete={handleCompleteOnboarding} />;
  }

  return (
    <div className="flex h-screen bg-black">
      <Sidebar 
        currentScreen={currentScreen} 
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        currentUser={currentUser}
      />
      
      <main className="flex-1 overflow-auto bg-gradient-to-br from-black via-[#0A0A0A] to-black">
        {currentScreen === 'dashboard' && (
          <Dashboard 
            jobs={jobs} 
            onViewCandidates={(jobId) => handleNavigate('candidates', jobId)}
            onAddNewJob={handleAddNewJob}
            currentUser={currentUser}
          />
        )}
        
        {currentScreen === 'candidates' && selectedJobId && (
          <CandidateList 
            job={jobs.find(j => j.id === selectedJobId)!}
            candidates={candidates.filter(c => c.jobId === selectedJobId)}
            onViewProfile={(candidateId) => handleNavigate('candidate-profile', selectedJobId, candidateId)}
          />
        )}

        {currentScreen === 'candidate-profile' && selectedCandidateId && (
          <CandidateProfile 
            candidate={candidates.find(c => c.id === selectedCandidateId)!}
            job={jobs.find(j => j.id === selectedJobId)!}
            onBack={() => handleNavigate('candidates', selectedJobId)}
          />
        )}
        
        {currentScreen === 'add-job' && (
          <AddJob onAddJob={addJob} />
        )}
        
        {currentScreen === 'settings' && (
          <Settings currentUser={currentUser} />
        )}

        {currentScreen === 'reports' && (
          <Reports />
        )}

        {currentScreen === 'analytics' && (
          <Analytics />
        )}

        {currentScreen === 'team' && (
          <Team />
        )}
      </main>
    </div>
  );
}