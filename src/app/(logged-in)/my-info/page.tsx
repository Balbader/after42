import type { Metadata } from 'next';
import { Suspense } from 'react';

import { MyInfoClient } from './my-info-client';

export const metadata: Metadata = {
  title: 'My Info | Oto',
  description: 'Complete your profile for personalized recommendations',
};

export default function MyInfoPage() {
  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Mes Informations
        </h1>
        <p className="text-muted-foreground mt-2">
          Complétez votre profil pour des recommandations personnalisées.
        </p>
      </div>

      <Suspense fallback={<div>Chargement...</div>}>
        <MyInfoClient />
      </Suspense>
    </div>
  );
}
