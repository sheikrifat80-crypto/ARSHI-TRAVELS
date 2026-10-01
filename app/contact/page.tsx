'use client';

import { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';

const inquiryTypes = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'flight', label: 'Flight Booking' },
  { value: 'tour', label: 'Tour Package' },
  { value: 'hajj', label: 'Hajj & Umrah' },
  { value: 'custom', label: 'Custom Tour' },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'general',
    message: '',
  });

  const update = (field: string, value: string) => setForm({ ...form, [field]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from('inquiries').insert({
      inquiry_type: form.type,
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
    });
    if (!error) setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="gradient-hero py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="mb-2 text-3xl font-bold sm:text-4xl">Contact Us</h1>
          <p className="text-white/70">Get in touch with our travel experts for any inquiries or assistance</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6">
            <div className="rounded-xl border bg-white p-6">
              <h2 className="mb-4 text-lg font-bold">Get In Touch</h2>
              <div className="space-y-4">
                <a href="tel:01790678917" className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"><Phone className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-xs text-muted-foreground">Phone / WhatsApp</p><p className="font-semibold">01790678917</p></div>
                </a>
                <a href="mailto:info@arshitravels.com" className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"><Mail className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-xs text-muted-foreground">Email</p><p className="font-semibold">info@arshitravels.com</p></div>
                </a>
                <div className="flex items-start gap-3 rounded-lg p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"><MapPin className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-xs text-muted-foreground">Office</p><p className="font-semibold">Dhaka, Bangladesh</p></div>
                </div>
                <div className="flex items-start gap-3 rounded-lg p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"><Clock className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-xs text-muted-foreground">Hours</p><p className="text-sm font-medium">Sat-Thu: 9AM - 9PM</p><p className="text-sm text-muted-foreground">Friday: 2PM - 9PM</p></div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
              <h3 className="mb-2 flex items-center gap-2 font-bold text-amber-800"><MessageSquare className="h-5 w-5" /> Quick Response</h3>
              <p className="text-sm text-amber-700">For urgent flight bookings or changes, call us directly at <a href="tel:01790678917" className="font-bold underline">01790678917</a>. We respond to all inquiries within 2 hours during business hours.</p>
            </div>
          </div>

          <div className="lg:col-span-2">
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center rounded-xl border bg-white p-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100"><CheckCircle className="h-8 w-8 text-emerald-600" /></div>
                <h2 className="mb-2 text-2xl font-bold">Message Sent!</h2>
                <p className="mb-6 max-w-md text-muted-foreground">Thank you for reaching out. Our team will get back to you within 24 hours. For urgent matters, call <a href="tel:01790678917" className="font-semibold text-primary">01790678917</a>.</p>
                <Button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', type: 'general', message: '' }); }}>Send Another Message</Button>
              </div>
            ) : (
              <div className="rounded-xl border bg-white p-6 sm:p-8">
                <h2 className="mb-6 text-xl font-bold">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><Label>Full Name *</Label><Input required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your full name" /></div>
                    <div><Label>Phone *</Label><Input required value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="e.g., 01XXXXXXXXX" /></div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="your@email.com" /></div>
                    <div>
                      <Label>Inquiry Type</Label>
                      <select value={form.type} onChange={(e) => update('type', e.target.value)} className="mt-2 h-10 w-full rounded-lg border px-3 text-sm">
                        {inquiryTypes.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
                      </select>
                    </div>
                  </div>
                  <div><Label>Message *</Label><Textarea required value={form.message} onChange={(e) => update('message', e.target.value)} placeholder="Tell us about your travel plans or questions..." rows={5} /></div>
                  <Button type="submit" disabled={submitting} className="w-full gap-2 gradient-primary text-white" size="lg">
                    <Send className="h-4 w-4" />{submitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
