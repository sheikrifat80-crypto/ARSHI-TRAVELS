import { Suspense } from 'react';
import ToursClient from './tours-client';

export const metadata = {
  title: 'Tour Packages | Arshi Travels',
  description: 'Explore our curated domestic and international tour packages. Cox\'s Bazar, Sylhet, Thailand, Dubai, Maldives and more.',
};

export default function ToursPage() {
  return (
    <Suspense fallback={<div className="flex h-96 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}>
      <ToursClient />
    </Suspense>
  );
}
