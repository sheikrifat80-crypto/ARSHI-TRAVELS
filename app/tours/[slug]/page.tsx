'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Calendar,
  Phone,
  ArrowLeft,
  Star,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { formatBDT, getDurationText } from '@/lib/format';
import { supabase } from '@/lib/supabase';

const tourImages: Record<string, string> = {
  "Cox's Bazar": 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Sylhet': 'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Sajek Valley': 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Sundarbans': 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Thailand': 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Malaysia & Singapore': 'https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Dubai': 'https://images.pexels.com/photos/3787839/pexels-photo-3787839.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Maldives': 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Turkey': 'https://images.pexels.com/photos/3889843/pexels-photo-3889843.jpeg?auto=compress&cs=tinysrgb&w=1200',
};

interface TourPackage {
  id: string;
  title: string;
  title_bn: string;
  slug: string;
  category: string;
  destination: string;
  destination_bn: string;
  duration_days: number;
  duration_nights: number;
  base_price_bdt: number;
  description: string;
  description_bn: string;
  highlights: string[];
  itinerary: { day: number; title: string; description: string }[];
  inclusions: string[];
  exclusions: string[];
  max_group_size: number;
  is_featured: boolean;
}

export default function TourDetailPage({ params }: { params: { slug: string } }) {
  const [tour, setTour] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTour() {
      const { data } = await supabase
        .from('tour_packages')
        .select('*')
        .eq('slug', params.slug)
        .maybeSingle();
      setTour(data);
      setLoading(false);
    }
    fetchTour();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold">Package Not Found</h2>
        <Link href="/tours">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Tours
          </Button>
        </Link>
      </div>
    );
  }

  const heroImage = tourImages[tour.destination] || 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=1200';

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero */}
      <div className="relative h-72 sm:h-96">
        <img src={heroImage} alt={tour.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="mx-auto max-w-7xl">
            <Link href="/tours" className="mb-3 inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> All Tours
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium capitalize text-white backdrop-blur-sm">
                {tour.category}
              </span>
              {tour.is_featured && (
                <span className="flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-medium text-white">
                  <Star className="h-3 w-3 fill-current" /> Featured
                </span>
              )}
            </div>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{tour.title}</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { icon: MapPin, label: 'Destination', value: tour.destination },
                { icon: Clock, label: 'Duration', value: getDurationText(tour.duration_days, tour.duration_nights) },
                { icon: Users, label: 'Group Size', value: `Up to ${tour.max_group_size}` },
                { icon: Calendar, label: 'Category', value: tour.category === 'domestic' ? 'Domestic' : 'International' },
              ].map((info) => (
                <div key={info.label} className="rounded-xl border bg-white p-4">
                  <info.icon className="mb-2 h-5 w-5 text-primary" />
                  <p className="text-xs text-muted-foreground">{info.label}</p>
                  <p className="font-semibold">{info.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="rounded-xl border bg-white p-6">
              <h2 className="mb-3 text-xl font-bold">Overview</h2>
              <p className="leading-relaxed text-muted-foreground">{tour.description}</p>
              {tour.highlights && tour.highlights.length > 0 && (
                <div className="mt-4">
                  <h3 className="mb-2 font-semibold">Highlights</h3>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {tour.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Itinerary */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <div className="rounded-xl border bg-white p-6">
                <h2 className="mb-4 text-xl font-bold">Day-by-Day Itinerary</h2>
                <Accordion type="single" collapsible className="w-full">
                  {tour.itinerary.map((day, i) => (
                    <AccordionItem key={i} value={`day-${i}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                            {day.day || i + 1}
                          </span>
                          <span className="font-semibold">{day.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="ml-11 text-muted-foreground">{day.description}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            {/* Inclusions & Exclusions */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border bg-white p-6">
                <h3 className="mb-3 flex items-center gap-2 font-bold text-emerald-700">
                  <CheckCircle className="h-5 w-5" /> Inclusions
                </h3>
                <ul className="space-y-2">
                  {(tour.inclusions || []).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border bg-white p-6">
                <h3 className="mb-3 flex items-center gap-2 font-bold text-rose-700">
                  <XCircle className="h-5 w-5" /> Exclusions
                </h3>
                <ul className="space-y-2">
                  {(tour.exclusions || []).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-32 space-y-4">
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <p className="text-sm text-muted-foreground">Starting from</p>
                <p className="mb-1 text-3xl font-bold text-primary">{formatBDT(tour.base_price_bdt)}</p>
                <p className="mb-4 text-xs text-muted-foreground">per person</p>
                <Button className="mb-3 w-full gap-2 gradient-primary text-white" size="lg">
                  Book This Package
                </Button>
                <a href="tel:01790678917" className="block">
                  <Button variant="outline" className="w-full gap-2" size="lg">
                    <Phone className="h-4 w-4" /> Call 01790678917
                  </Button>
                </a>
              </div>

              <div className="rounded-xl border bg-amber-50 p-4">
                <h4 className="mb-2 font-semibold text-amber-800">Need a Custom Tour?</h4>
                <p className="mb-3 text-sm text-amber-700">
                  We can customize this package according to your preferences and budget.
                </p>
                <Link href="/tours/custom">
                  <Button variant="outline" className="w-full border-amber-300 text-amber-800 hover:bg-amber-100" size="sm">
                    Build Custom Tour
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
