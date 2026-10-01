import { Suspense } from 'react';
import HajjUmrahClient from './hajj-umrah-client';

export const metadata = {
  title: 'Hajj & Umrah Packages | Arshi Travels',
  description: 'Fulfill your spiritual journey with our VIP, Executive, and Economy Hajj & Umrah packages. Premium accommodation near Haram.',
};

export default function HajjUmrahPage() {
  return (
    <Suspense fallback={<div className="flex h-96 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}>
      <HajjUmrahClient />
    </Suspense>
  );
}
