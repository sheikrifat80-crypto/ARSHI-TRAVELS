import { Suspense } from 'react';
import FlightsClient from './flights-client';

export const metadata = {
  title: 'Search Flights | Arshi Travels',
  description: 'Search and book domestic and international flights at the best prices. Compare fares from all major airlines.',
};

export default function FlightsPage() {
  return (
    <Suspense fallback={<div className="flex h-96 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}>
      <FlightsClient />
    </Suspense>
  );
}
