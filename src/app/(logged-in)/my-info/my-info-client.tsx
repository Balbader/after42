'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { BasicProfileForm } from '@/components/forms/basic-profile-form';
import { HealthSafetyForm } from '@/components/forms/health-safety-form';
import { DietaryProfileForm } from '@/components/forms/dietary-profile-form';
import { LifestyleSection } from '@/components/forms/lifestyle-section';

type Section = 'basic' | 'health' | 'dietary' | 'lifestyle';

interface SectionConfig {
  id: Section;
  label: string;
  description: string;
  required: boolean;
}

const sections: SectionConfig[] = [
  {
    id: 'basic',
    label: 'Profil de base',
    description: 'Informations personnelles et démographiques',
    required: true,
  },
  {
    id: 'health',
    label: 'Santé & Sécurité',
    description: 'Allergies, intolérances et restrictions alimentaires',
    required: true,
  },
  {
    id: 'dietary',
    label: 'Habitudes Alimentaires',
    description: 'Votre régime alimentaire et préférences',
    required: false,
  },
  {
    id: 'lifestyle',
    label: 'Mode de Vie',
    description: 'Sommeil, activité physique et bien-être',
    required: false,
  },
];

export function MyInfoClient() {
  const [activeTab, setActiveTab] = useState<Section>('basic');
  const [completedSections, setCompletedSections] = useState<Set<Section>>(
    new Set()
  );

  const handleSectionComplete = (section: Section) => {
    setCompletedSections((prev) => new Set(prev).add(section));

    // Auto-navigate to next section
    const currentIndex = sections.findIndex((s) => s.id === section);
    if (currentIndex < sections.length - 1) {
      setActiveTab(sections[currentIndex + 1].id);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Section)}>
      <TabsList className="grid w-full grid-cols-4 mb-8">
        {sections.map((section) => {
          const isCompleted = completedSections.has(section.id);
          return (
            <TabsTrigger
              key={section.id}
              value={section.id}
              className={cn(
                'relative',
                isCompleted && 'data-[state=inactive]:text-primary'
              )}
            >
              <span className="flex items-center gap-2">
                {isCompleted && (
                  <Check className="size-4 text-primary" />
                )}
                <span className="hidden sm:inline">{section.label}</span>
                <span className="sm:hidden">
                  {section.label.split(' ')[0]}
                </span>
                {section.required && (
                  <span className="text-destructive">*</span>
                )}
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      <TabsContent value="basic" className="space-y-4">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Profil de Base</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Informations de base sur votre situation personnelle et familiale.
          </p>
        </div>
        <BasicProfileForm onComplete={() => handleSectionComplete('basic')} />
      </TabsContent>

      <TabsContent value="health" className="space-y-4">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Santé & Sécurité</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Informations critiques pour votre sécurité alimentaire.
          </p>
        </div>
        <HealthSafetyForm onComplete={() => handleSectionComplete('health')} />
      </TabsContent>

      <TabsContent value="dietary" className="space-y-4">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Habitudes Alimentaires</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Décrivez vos habitudes alimentaires et préférences.
          </p>
        </div>
        <DietaryProfileForm onComplete={() => handleSectionComplete('dietary')} />
      </TabsContent>

      <TabsContent value="lifestyle" className="space-y-4">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Mode de Vie</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Informations sur votre sommeil, activité physique et bien-être général.
          </p>
        </div>
        <LifestyleSection onComplete={() => handleSectionComplete('lifestyle')} />
      </TabsContent>
    </Tabs>
  );
}
