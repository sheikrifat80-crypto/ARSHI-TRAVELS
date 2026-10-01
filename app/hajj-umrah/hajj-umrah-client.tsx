'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Moon,
  Star,
  Shield,
  CheckCircle,
  Hotel,
  Bus,
  Clock,
  ArrowRight,
  Phone,
  FileText,
  Heart,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatBDT } from '@/lib/format';
import { supabase } from '@/lib/supabase';

interface HajjPackage {
  id: string;
  title: string;
  slug: string;
  package_type: string;
  tier: string;
  duration_days: number;
  base_price_bdt: number;
  description: string;
  makkah_hotel: string;
  madinah_hotel: string;
  makkah_distance: string;
  madinah_distance: string;
  transport_type: string;
  includes_ziyarah: boolean;
  inclusions: string[];
  exclusions: string[];
}

const tierConfig: Record<string, { color: string; bg: string; icon: any; label: string }> = {
  vip: { color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', icon: Star, label: 'VIP Premium' },
  executive: { color: 'text-primary', bg: 'bg-sky-50 border-sky-200', icon: Shield, label: 'Executive' },
  economy: { color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', icon: CheckCircle, label: 'Economy' },
};

const visaChecklist = [
  { step: 1, title: 'Valid Passport', description: 'Machine-readable passport valid for at least 6 months beyond travel date' },
  { step: 2, title: 'Passport Photos', description: 'Recent passport-size photographs with white background (4 copies)' },
  { step: 3, title: 'Meningitis Vaccination', description: 'ACWY meningococcal vaccination certificate (required by Saudi Arabia)' },
  { step: 4, title: 'COVID-19 Vaccination', description: 'Full COVID-19 vaccination certificate as per current Saudi requirements' },
  { step: 5, title: 'Biometric Enrollment', description: 'Fingerprint and photo capture at the designated VFS/embassy center' },
  { step: 6, title: 'Mahram Document', description: 'For female travelers under 45: authorized mahram (male guardian) documentation' },
  { step: 7, title: 'Application Form', description: 'Completed Hajj/Umrah visa application with all required signatures' },
  { step: 8, title: 'Travel Insurance', description: 'Comprehensive travel and health insurance covering Saudi Arabia' },
];

export default function HajjUmrahClient() {
  const searchParams = useSearchParams();
  const [packages, setPackages] = useState<HajjPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get('type') || 'hajj');
  const [showVisa, setShowVisa] = useState(false);

  useEffect(() => {
    async function fetchPackages() {
      setLoading(true);
      const { data } = await supabase
        .from('hajj_umrah_packages')
        .select('*')
        .eq('is_active', true)
        .eq('package_type', activeTab)
        .order('base_price_bdt', { ascending: true });
      setPackages(data || []);
      setLoading(false);
    }
    fetchPackages();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero */}
      <div className="relative overflow-hidden bg-[hsl(215,25%,12%)] py-16 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-amber-500/30 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <Moon className="mx-auto mb-4 h-12 w-12 text-amber-400" />
          <h1 className="mb-3 text-3xl font-bold sm:text-5xl">Hajj & Umrah Packages</h1>
          <p className="mx-auto max-w-2xl text-white/60">
            Embark on the most sacred journey of your life. Our carefully curated packages ensure comfort, convenience, and spiritual fulfillment.
          </p>
          <div className="mt-8 inline-flex rounded-xl bg-white/10 p-1 backdrop-blur-sm">
            <button onClick={() => setActiveTab('hajj')} className={`rounded-lg px-6 py-2.5 text-sm font-medium transition-all ${activeTab === 'hajj' ? 'bg-amber-500 text-white shadow-lg' : 'text-white/70 hover:text-white'}`}>
              Hajj Packages
            </button>
            <button onClick={() => setActiveTab('umrah')} className={`rounded-lg px-6 py-2.5 text-sm font-medium transition-all ${activeTab === 'umrah' ? 'bg-amber-500 text-white shadow-lg' : 'text-white/70 hover:text-white'}`}>
              Umrah Packages
            </button>
          </div>
        </div>
      </div>

      {/* Packages */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (<div key={i} className="h-96 animate-pulse rounded-2xl bg-white" />))}
          </div>
        ) : packages.length === 0 ? (
          <div className="py-16 text-center">
            <Moon className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
            <p className="text-lg font-medium">No packages available at this time</p>
            <p className="text-muted-foreground">Please check back later or contact us for custom arrangements</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {packages.map((pkg) => {
              const config = tierConfig[pkg.tier] || tierConfig.economy;
              const TierIcon = config.icon;
              return (
                <div key={pkg.id} className={`overflow-hidden rounded-2xl border ${config.bg} transition-all hover:shadow-lg`}>
                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <span className={`flex items-center gap-1.5 text-sm font-bold ${config.color}`}>
                        <TierIcon className="h-4 w-4" /> {config.label}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                        {pkg.duration_days} Days
                      </span>
                    </div>

                    <h3 className="mb-2 text-xl font-bold text-foreground">{pkg.title}</h3>
                    <p className="mb-4 text-sm text-muted-foreground">{pkg.description}</p>

                    <div className="mb-4 space-y-3 rounded-xl bg-white p-4">
                      <div className="flex items-start gap-3">
                        <Hotel className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Makkah</p>
                          <p className="text-sm font-medium">{pkg.makkah_hotel}</p>
                          <p className={`text-xs font-medium ${config.color}`}>{pkg.makkah_distance}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Hotel className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Madinah</p>
                          <p className="text-sm font-medium">{pkg.madinah_hotel}</p>
                          <p className={`text-xs font-medium ${config.color}`}>{pkg.madinah_distance}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Bus className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Transport</p>
                          <p className="text-sm font-medium capitalize">{pkg.transport_type}</p>
                        </div>
                      </div>
                    </div>

                    <ul className="mb-4 space-y-1.5">
                      {(pkg.inclusions as string[]).slice(0, 5).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="border-t pt-4">
                      <div className="mb-3 flex items-baseline justify-between">
                        <span className="text-xs text-muted-foreground">Starting from</span>
                        <span className={`text-2xl font-bold ${config.color}`}>
                          {formatBDT(pkg.base_price_bdt)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/hajj-umrah/${pkg.slug}`} className="flex-1">
                          <Button className="w-full gap-2 bg-amber-500 text-white hover:bg-amber-600" size="sm">
                            Details <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                        <a href="tel:01790678917">
                          <Button variant="outline" size="sm"><Phone className="h-4 w-4" /></Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Visa Checklist */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1 text-sm font-medium text-amber-700">
              <FileText className="h-4 w-4" /> Document Preparation
            </span>
            <h2 className="mb-2 text-3xl font-bold">Visa & Health Checklist</h2>
            <p className="text-muted-foreground">Essential documents and requirements for your pilgrimage</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visaChecklist.map((item) => (
              <div key={item.step} className="group rounded-xl border p-5 transition-all hover:border-primary/30 hover:shadow-md">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  {item.step}
                </div>
                <h4 className="mb-1 font-semibold">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Consultation CTA */}
      <div className="gradient-hero py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Heart className="mx-auto mb-4 h-10 w-10 text-amber-400" />
          <h2 className="mb-3 text-2xl font-bold sm:text-3xl">
            Need Guidance for Your Pilgrimage?
          </h2>
          <p className="mb-6 text-white/70">
            Our religious travel consultants are here to help you plan every detail of your sacred journey. Get personalized advice on packages, visa, and preparation.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="tel:01790678917" className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-8 py-3 font-semibold text-white transition-all hover:bg-amber-600 hover:shadow-lg">
              <Phone className="h-5 w-5" /> Call Our Consultant
            </a>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-8 py-3 font-semibold text-white transition-all hover:bg-white/10">
              Book a Consultation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
