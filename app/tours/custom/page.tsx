'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  Hotel,
  Car,
  Utensils,
  Users,
  ArrowLeft,
  Send,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';

const destinations = [
  "Cox's Bazar", 'Sylhet', 'Sajek Valley', 'Sundarbans', 'Rangamati', 'Bandarban',
  'Thailand', 'Malaysia', 'Singapore', 'Dubai', 'Maldives', 'Turkey', 'Europe',
  'India', 'Nepal', 'Sri Lanka', 'Indonesia', 'Vietnam', 'Japan', 'Other',
];

const hotelTypes = ['Budget (2-star)', 'Standard (3-star)', 'Comfort (4-star)', 'Luxury (5-star)'];
const transportModes = ['AC Bus', 'Non-AC Bus', 'Private Car', 'Microbus', 'Air', 'Train'];
const mealPlans = ['No meals', 'Breakfast only', 'Half board', 'Full board'];

export default function CustomTourPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    destination: '',
    duration: '5',
    travelers: '2',
    hotel: 'Standard (3-star)',
    transport: 'AC Bus',
    meals: 'Breakfast only',
    activities: '',
    budget: '',
    notes: '',
  });

  const update = (field: string, value: string) => setForm({ ...form, [field]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await supabase.from('inquiries').insert({
      inquiry_type: 'custom',
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: `Custom Tour Request:\nDestination: ${form.destination}\nDuration: ${form.duration} days\nTravelers: ${form.travelers}\nHotel: ${form.hotel}\nTransport: ${form.transport}\nMeals: ${form.meals}\nActivities: ${form.activities}\nBudget: ${form.budget}\nNotes: ${form.notes}`,
      priority: 'high',
    });
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="mb-2 text-2xl font-bold">Request Submitted!</h2>
        <p className="mb-6 max-w-md text-muted-foreground">
          Our travel experts will review your custom tour request and get back to you within 24 hours. For urgent inquiries, call 01790678917.
        </p>
        <Link href="/tours">
          <Button className="gap-2"><ArrowLeft className="h-4 w-4" /> Back to Tours</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="gradient-hero py-12 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <Link href="/tours" className="mb-3 inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to Tours
          </Link>
          <h1 className="text-3xl font-bold">Custom Tour Builder</h1>
          <p className="text-white/70">Design your perfect trip. Tell us your preferences and we will create a personalized itinerary.</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Users className="h-5 w-5 text-primary" /> Your Details
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div><Label>Full Name *</Label><Input required value={form.name} onChange={(e) => update('name', e.target.value)} /></div>
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} /></div>
              <div><Label>Phone *</Label><Input required value={form.phone} onChange={(e) => update('phone', e.target.value)} /></div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <MapPin className="h-5 w-5 text-primary" /> Trip Preferences
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Destination *</Label>
                <select required value={form.destination} onChange={(e) => update('destination', e.target.value)} className="mt-1 h-10 w-full rounded-lg border px-3 text-sm">
                  <option value="">Select destination</option>
                  {destinations.map((d) => (<option key={d} value={d}>{d}</option>))}
                </select>
              </div>
              <div>
                <Label>Duration (days)</Label>
                <Input type="number" min="1" max="30" value={form.duration} onChange={(e) => update('duration', e.target.value)} />
              </div>
              <div>
                <Label>Number of Travelers</Label>
                <Input type="number" min="1" max="50" value={form.travelers} onChange={(e) => update('travelers', e.target.value)} />
              </div>
              <div>
                <Label>Budget Range (BDT)</Label>
                <Input placeholder="e.g., 50,000 - 100,000" value={form.budget} onChange={(e) => update('budget', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Hotel className="h-5 w-5 text-primary" /> Accommodation & Transport
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label>Hotel Preference</Label>
                <select value={form.hotel} onChange={(e) => update('hotel', e.target.value)} className="mt-1 h-10 w-full rounded-lg border px-3 text-sm">
                  {hotelTypes.map((h) => (<option key={h} value={h}>{h}</option>))}
                </select>
              </div>
              <div>
                <Label>Transport Mode</Label>
                <select value={form.transport} onChange={(e) => update('transport', e.target.value)} className="mt-1 h-10 w-full rounded-lg border px-3 text-sm">
                  {transportModes.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
              </div>
              <div>
                <Label>Meal Plan</Label>
                <select value={form.meals} onChange={(e) => update('meals', e.target.value)} className="mt-1 h-10 w-full rounded-lg border px-3 text-sm">
                  {mealPlans.map((m) => (<option key={m} value={m}>{m}</option>))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <h2 className="mb-4 text-lg font-bold">Additional Preferences</h2>
            <div className="space-y-4">
              <div><Label>Activities & Excursions</Label><Textarea placeholder="e.g., snorkeling, hiking, cultural tours, food tours..." value={form.activities} onChange={(e) => update('activities', e.target.value)} /></div>
              <div><Label>Special Requests / Notes</Label><Textarea placeholder="Any dietary restrictions, accessibility needs, or special occasions..." value={form.notes} onChange={(e) => update('notes', e.target.value)} /></div>
            </div>
          </div>

          <Button type="submit" disabled={submitting} className="w-full gap-2 gradient-primary py-6 text-lg text-white" size="lg">
            <Send className="h-5 w-5" />
            {submitting ? 'Submitting...' : 'Submit Custom Tour Request'}
          </Button>
        </form>
      </div>
    </div>
  );
}
