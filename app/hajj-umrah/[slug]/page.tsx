'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Moon,
  Star,
  Shield,
  CheckCircle,
  XCircle,
  Hotel,
  Bus,
  ArrowLeft,
  Phone,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { formatBDT } from '@/lib/format';
import { supabase } from '@/lib/supabase';

interface HajjPackage {
  id: string;
  title: string;
  title_bn: string;
  slug: string;
  package_type: string;
  tier: string;
  duration_days: number;
  base_price_bdt: number;
  description: string;
  description_bn: string;
  makkah_hotel: string;
  madinah_hotel: string;
  makkah_distance: string;
  madinah_distance: string;
  transport_type: string;
  includes_ziyarah: boolean;
  itinerary: { day: number; title: string; description: string }[];
  inclusions: string[];
  exclusions: string[];
}

const tierColors: Record<string, string> = {
  vip: 'text-amber-600',
  executive: 'text-primary',
  economy: 'text-emerald-600',
};

export default function HajjDetailPage({ params }: { params: { slug: string } }) {
  const [pkg, setPkg] = useState<HajjPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInquiry, setShowInquiry] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('hajj_umrah_packages')
        .select('*')
        .eq('slug', params.slug)
        .maybeSingle();
      setPkg(data);
      setLoading(false);
    }
    fetch();
  }, [params.slug]);

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('inquiries').insert({
      inquiry_type: 'hajj',
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: `Inquiry for ${pkg?.title}: ${form.message}`,
      priority: 'high',
    });
    setSubmitted(true);
  };

  if (loading) return <div className="flex h-96 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;

  if (!pkg) return (
    <div className="flex h-96 flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold">Package Not Found</h2>
      <Link href="/hajj-umrah"><Button variant="outline" className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Button></Link>
    </div>
  );

  const tierColor = tierColors[pkg.tier] || 'text-primary';

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-[hsl(215,25%,12%)] py-12 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <Link href="/hajj-umrah" className="mb-3 inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> All Packages
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold uppercase">{pkg.package_type}</span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium capitalize">{pkg.tier}</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{pkg.title}</h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border bg-white p-6">
              <h2 className="mb-3 text-xl font-bold">Overview</h2>
              <p className="leading-relaxed text-muted-foreground">{pkg.description}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border bg-white p-5">
                <Hotel className="mb-2 h-5 w-5 text-amber-500" />
                <h3 className="font-semibold">Makkah Accommodation</h3>
                <p className="text-sm font-medium">{pkg.makkah_hotel}</p>
                <p className={`text-sm font-bold ${tierColor}`}>{pkg.makkah_distance}</p>
              </div>
              <div className="rounded-xl border bg-white p-5">
                <Hotel className="mb-2 h-5 w-5 text-emerald-500" />
                <h3 className="font-semibold">Madinah Accommodation</h3>
                <p className="text-sm font-medium">{pkg.madinah_hotel}</p>
                <p className={`text-sm font-bold ${tierColor}`}>{pkg.madinah_distance}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border bg-white p-6">
                <h3 className="mb-3 flex items-center gap-2 font-bold text-emerald-700"><CheckCircle className="h-5 w-5" /> Inclusions</h3>
                <ul className="space-y-2">{(pkg.inclusions || []).map((item, i) => (<li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />{item}</li>))}</ul>
              </div>
              <div className="rounded-xl border bg-white p-6">
                <h3 className="mb-3 flex items-center gap-2 font-bold text-rose-700"><XCircle className="h-5 w-5" /> Exclusions</h3>
                <ul className="space-y-2">{(pkg.exclusions || []).map((item, i) => (<li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-400" />{item}</li>))}</ul>
              </div>
            </div>
          </div>

          <div>
            <div className="sticky top-32 space-y-4">
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <p className="text-sm text-muted-foreground">Package Price</p>
                <p className={`mb-1 text-3xl font-bold ${tierColor}`}>{formatBDT(pkg.base_price_bdt)}</p>
                <p className="mb-2 text-xs text-muted-foreground">per person | {pkg.duration_days} Days</p>
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-muted p-2.5 text-sm"><Bus className="h-4 w-4 text-muted-foreground" /><span className="capitalize">{pkg.transport_type} Transport</span></div>

                <Button onClick={() => setShowInquiry(true)} className="mb-3 w-full gap-2 bg-amber-500 text-white hover:bg-amber-600" size="lg">
                  <Send className="h-4 w-4" /> Inquire Now
                </Button>
                <a href="tel:01790678917" className="block">
                  <Button variant="outline" className="w-full gap-2" size="lg"><Phone className="h-4 w-4" /> Call 01790678917</Button>
                </a>
              </div>

              {showInquiry && !submitted && (
                <div className="rounded-xl border bg-white p-6 shadow-sm animate-fade-in">
                  <h3 className="mb-3 font-bold">Quick Inquiry</h3>
                  <form onSubmit={handleInquiry} className="space-y-3">
                    <div><Label className="text-xs">Name</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                    <div><Label className="text-xs">Phone</Label><Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                    <div><Label className="text-xs">Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                    <div><Label className="text-xs">Message</Label><Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} /></div>
                    <Button type="submit" className="w-full bg-amber-500 text-white hover:bg-amber-600" size="sm">Submit Inquiry</Button>
                  </form>
                </div>
              )}

              {submitted && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center animate-fade-in">
                  <CheckCircle className="mx-auto mb-2 h-8 w-8 text-emerald-600" />
                  <p className="font-semibold text-emerald-800">Inquiry Submitted!</p>
                  <p className="text-sm text-emerald-600">We will contact you within 24 hours.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
