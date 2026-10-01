import Link from 'next/link';
import { Moon, Star, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatBDT } from '@/lib/format';

interface HajjPackage {
  id: string;
  title: string;
  slug: string;
  package_type: string;
  tier: string;
  duration_days: number;
  base_price_bdt: number;
  makkah_hotel: string;
  madinah_hotel: string;
  makkah_distance: string;
  madinah_distance: string;
  transport_type: string;
  inclusions: string[];
}

const tierConfig = {
  vip: { color: 'bg-amber-500', icon: Star, label: 'VIP' },
  executive: { color: 'bg-primary', icon: Shield, label: 'Executive' },
  economy: { color: 'bg-accent', icon: CheckCircle, label: 'Economy' },
};

export default function HajjUmrahSection({ packages }: { packages: HajjPackage[] }) {
  const hajjPackages = packages.filter((p) => p.package_type === 'hajj');

  return (
    <section className="bg-[hsl(215,25%,12%)] py-20 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-4 py-1 text-sm font-medium text-amber-400">
            <Moon className="h-4 w-4" />
            Sacred Pilgrimages
          </span>
          <h2 className="mb-3 text-3xl font-bold sm:text-4xl">
            Hajj & Umrah Packages
          </h2>
          <p className="mx-auto max-w-2xl text-white/60">
            Fulfill your spiritual journey with our carefully curated pilgrimage
            packages. From VIP luxury to affordable economy options, we ensure a
            comfortable and meaningful experience.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {hajjPackages.slice(0, 3).map((pkg) => {
            const config = tierConfig[pkg.tier as keyof typeof tierConfig];
            const TierIcon = config?.icon || CheckCircle;
            return (
              <div
                key={pkg.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className={`flex items-center gap-1.5 rounded-full ${config?.color || 'bg-primary'} px-3 py-1 text-xs font-semibold text-white`}
                  >
                    <TierIcon className="h-3.5 w-3.5" />
                    {config?.label || pkg.tier}
                  </span>
                  <span className="text-sm text-white/50">{pkg.duration_days} Days</span>
                </div>

                <h3 className="mb-2 text-xl font-bold">{pkg.title}</h3>

                <div className="mb-4 space-y-2 text-sm text-white/70">
                  <div className="flex justify-between">
                    <span>Makkah Hotel</span>
                    <span className="font-medium text-white/90">{pkg.makkah_hotel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distance from Haram</span>
                    <span className="font-medium text-amber-400">{pkg.makkah_distance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Madinah Hotel</span>
                    <span className="font-medium text-white/90">{pkg.madinah_hotel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transport</span>
                    <span className="font-medium capitalize text-white/90">
                      {pkg.transport_type}
                    </span>
                  </div>
                </div>

                <ul className="mb-6 space-y-1.5">
                  {(pkg.inclusions as string[]).slice(0, 4).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                      <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto border-t border-white/10 pt-4">
                  <div className="mb-3 flex items-baseline justify-between">
                    <span className="text-xs text-white/50">Starting from</span>
                    <span className="text-2xl font-bold text-amber-400">
                      {formatBDT(pkg.base_price_bdt)}
                    </span>
                  </div>
                  <Link href={`/hajj-umrah/${pkg.slug}`}>
                    <Button className="w-full gap-2 bg-amber-500 text-white hover:bg-amber-600">
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link href="/hajj-umrah">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-white/20 text-white hover:bg-white/10"
            >
              Explore All Packages
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
