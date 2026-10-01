import {
  Shield,
  Globe,
  Users,
  Award,
  Plane,
  MapPin,
  Moon,
  Phone,
  Heart,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const milestones = [
  { year: '2015', title: 'Founded', description: 'Arshi Travels established as a domestic tour operator in Dhaka' },
  { year: '2017', title: 'International License', description: 'Received government approval as an international tour operator' },
  { year: '2018', title: 'Hajj & Umrah', description: 'Launched dedicated Hajj and Umrah pilgrimage services' },
  { year: '2020', title: 'Digital Transformation', description: 'Launched online booking platform with GDS integration' },
  { year: '2023', title: 'GDS Partnerships', description: 'Direct partnerships with Sabre, Amadeus, and Travelport' },
  { year: '2024', title: '50,000+ Travelers', description: 'Milestone of serving over 50,000 happy travelers' },
];

const team = [
  { name: 'Travel Operations', count: 15, description: 'Expert agents handling flights, tours, and Hajj/Umrah bookings' },
  { name: 'Customer Support', count: 8, description: '24/7 dedicated support team available via phone, WhatsApp, and email' },
  { name: 'Technology', count: 5, description: 'Building and maintaining our booking platform and GDS integrations' },
  { name: 'Pilgrimage Specialists', count: 4, description: 'Religious travel consultants with deep knowledge of Hajj/Umrah' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="gradient-hero py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <span className="mb-4 inline-block rounded-full bg-white/15 px-4 py-1 text-sm">
            Since 2015
          </span>
          <h1 className="mb-4 text-3xl font-bold sm:text-5xl">
            About Arshi Travels
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/70">
            Bangladesh&apos;s trusted international tour operator, delivering premium
            travel experiences with integrity, transparency, and a passion for excellence.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <span className="mb-2 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
                Our Mission
              </span>
              <h2 className="mb-4 text-3xl font-bold">
                Making Travel Accessible, Safe & Memorable
              </h2>
              <p className="mb-4 text-muted-foreground leading-relaxed">
                At Arshi Travels, we believe every journey should be extraordinary.
                From the excitement of booking your first international flight to
                the profound spiritual experience of Hajj, we are dedicated to making
                every step of your travel journey smooth, affordable, and unforgettable.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                As a government-licensed international tour operator, we combine
                industry expertise with cutting-edge technology to deliver transparent
                pricing, real-time booking, and round-the-clock customer support.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, value: '50,000+', label: 'Happy Travelers' },
                { icon: Globe, value: '35+', label: 'Destinations' },
                { icon: Plane, value: '1,200+', label: 'Flights/Month' },
                { icon: Award, value: '10+', label: 'Years of Trust' },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center rounded-xl border bg-white p-6 text-center shadow-sm">
                  <stat.icon className="mb-3 h-8 w-8 text-primary" />
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-muted/50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-3xl font-bold">Our Journey</h2>
            <p className="text-muted-foreground">Key milestones in our growth story</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {milestones.map((m) => (
              <div key={m.year} className="group rounded-xl border bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
                <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
                  {m.year}
                </span>
                <h3 className="mb-1 font-semibold">{m.title}</h3>
                <p className="text-sm text-muted-foreground">{m.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-3xl font-bold">Our Team</h2>
            <p className="text-muted-foreground">Over 30 dedicated professionals at your service</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((dept) => (
              <div key={dept.name} className="rounded-xl border bg-white p-6 text-center transition-all hover:shadow-md">
                <p className="mb-1 text-3xl font-bold text-primary">{dept.count}+</p>
                <h3 className="mb-2 font-semibold">{dept.name}</h3>
                <p className="text-xs text-muted-foreground">{dept.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="gradient-hero py-16 text-center text-white">
        <div className="mx-auto max-w-2xl px-4">
          <Heart className="mx-auto mb-4 h-10 w-10 text-amber-400" />
          <h2 className="mb-3 text-2xl font-bold sm:text-3xl">
            Ready to Travel With Us?
          </h2>
          <p className="mb-6 text-white/70">
            Join 50,000+ happy travelers who trust Arshi Travels for their journeys.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a href="tel:01790678917" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-primary hover:bg-white/90">
              <Phone className="h-5 w-5" /> Call 01790678917
            </a>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
