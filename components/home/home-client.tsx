'use client';

import Link from 'next/link';
import {
  Plane,
  MapPin,
  Moon,
  Phone,
  ArrowRight,
  TrendingUp,
  Users,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import FlightSearchWidget from '@/components/home/flight-search-widget';
import FeaturedTours from '@/components/home/featured-tours';
import HajjUmrahSection from '@/components/home/hajj-umrah-section';
import WhyChooseUs from '@/components/home/why-choose-us';

interface HomeClientProps {
  tours: any[];
  hajjPackages: any[];
}

const stats = [
  { icon: Users, value: '50,000+', label: 'Happy Travelers' },
  { icon: Globe, value: '35+', label: 'Destinations' },
  { icon: TrendingUp, value: '10+', label: 'Years Experience' },
  { icon: Plane, value: '1,200+', label: 'Flights Monthly' },
];

const quickLinks = [
  {
    icon: Plane,
    title: 'Book Flights',
    description: 'Search & book domestic and international flights',
    href: '/flights',
    color: 'bg-sky-500',
  },
  {
    icon: MapPin,
    title: 'Tour Packages',
    description: 'Explore curated holiday packages',
    href: '/tours',
    color: 'bg-emerald-500',
  },
  {
    icon: Moon,
    title: 'Hajj & Umrah',
    description: 'Sacred pilgrimage packages',
    href: '/hajj-umrah',
    color: 'bg-amber-500',
  },
  {
    icon: Phone,
    title: 'Contact Us',
    description: 'Talk to our travel experts',
    href: '/contact',
    color: 'bg-rose-500',
  },
];

export default function HomeClient({ tours, hajjPackages }: HomeClientProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero py-16 text-white sm:py-20 lg:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4">
          <div className="mb-10 max-w-3xl text-center lg:text-left">
            <span className="mb-4 inline-block rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              Bangladesh&apos;s Trusted Tour Operator
            </span>
            <h1 className="mb-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Your Journey Begins
              <span className="block text-amber-400">With Arshi Travels</span>
            </h1>
            <p className="text-lg leading-relaxed text-white/80 sm:text-xl">
              Book flights, discover holiday packages, and embark on sacred
              pilgrimages. Premium travel experiences at the best prices.
            </p>
          </div>

          <FlightSearchWidget />

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-xs text-white/60">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${link.color} text-white transition-transform group-hover:scale-110`}
                >
                  <link.icon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground">{link.title}</h3>
                  <p className="text-xs text-muted-foreground">{link.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <FeaturedTours tours={tours} />

      {/* Hajj & Umrah */}
      <HajjUmrahSection packages={hajjPackages} />

      {/* Why Choose Us + CTA */}
      <WhyChooseUs />
    </>
  );
}
