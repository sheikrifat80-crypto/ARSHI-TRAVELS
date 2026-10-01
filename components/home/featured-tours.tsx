'use client';

import Link from 'next/link';
import { MapPin, Clock, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatBDT, getDurationText } from '@/lib/format';

interface Tour {
  id: string;
  title: string;
  slug: string;
  category: string;
  destination: string;
  duration_days: number;
  duration_nights: number;
  base_price_bdt: number;
  description: string;
  highlights: string[];
  images: string[];
  is_featured: boolean;
}

const tourImages: Record<string, string> = {
  "Cox's Bazar": 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Sylhet': 'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Sajek Valley': 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Sundarbans': 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Thailand': 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Malaysia & Singapore': 'https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Dubai': 'https://images.pexels.com/photos/3787839/pexels-photo-3787839.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Maldives': 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Turkey': 'https://images.pexels.com/photos/3889843/pexels-photo-3889843.jpeg?auto=compress&cs=tinysrgb&w=600',
};

export default function FeaturedTours({ tours }: { tours: Tour[] }) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <span className="mb-2 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            Popular Destinations
          </span>
          <h2 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">
            Explore Our Tour Packages
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Handcrafted travel experiences for every type of traveler. From serene
            beaches to cultural marvels, find your perfect getaway.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tours.slice(0, 6).map((tour, index) => (
            <Link
              key={tour.id}
              href={`/tours/${tour.slug}`}
              className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={tourImages[tour.destination] || 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=600'}
                  alt={tour.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                  {tour.category === 'domestic' ? 'Domestic' : 'International'}
                </span>
                {tour.is_featured && (
                  <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-medium text-white">
                    <Star className="h-3 w-3 fill-current" />
                    Featured
                  </span>
                )}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-lg font-bold text-white">{tour.title}</h3>
                </div>
              </div>

              <div className="p-4">
                <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {tour.destination}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {getDurationText(tour.duration_days, tour.duration_nights)}
                  </span>
                </div>

                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                  {tour.description}
                </p>

                <div className="flex items-center justify-between border-t pt-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Starting from</p>
                    <p className="text-lg font-bold text-primary">
                      {formatBDT(tour.base_price_bdt)}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium text-primary transition-colors group-hover:gap-2">
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/tours">
            <Button variant="outline" size="lg" className="gap-2">
              View All Packages
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
