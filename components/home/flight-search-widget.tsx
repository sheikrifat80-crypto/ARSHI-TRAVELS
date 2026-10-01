'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plane,
  ArrowRightLeft,
  Calendar,
  Users,
  Search,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const tripTypes = [
  { value: 'oneway', label: 'One Way' },
  { value: 'roundtrip', label: 'Round Trip' },
  { value: 'multicity', label: 'Multi City' },
] as const;

const cabinClasses = [
  { value: 'economy', label: 'Economy' },
  { value: 'premium_economy', label: 'Premium Economy' },
  { value: 'business', label: 'Business' },
  { value: 'first', label: 'First Class' },
] as const;

const popularAirports = [
  { code: 'DAC', city: 'Dhaka' },
  { code: 'CGP', city: 'Chittagong' },
  { code: 'CXB', city: "Cox's Bazar" },
  { code: 'ZYL', city: 'Sylhet' },
  { code: 'DXB', city: 'Dubai' },
  { code: 'SIN', city: 'Singapore' },
  { code: 'BKK', city: 'Bangkok' },
  { code: 'KUL', city: 'Kuala Lumpur' },
  { code: 'JED', city: 'Jeddah' },
  { code: 'IST', city: 'Istanbul' },
  { code: 'DEL', city: 'Delhi' },
  { code: 'CCU', city: 'Kolkata' },
  { code: 'MLE', city: 'Male' },
];

export default function FlightSearchWidget() {
  const router = useRouter();
  const [tripType, setTripType] = useState<string>('roundtrip');
  const [origin, setOrigin] = useState('DAC');
  const [destination, setDestination] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState('economy');
  const [showPassengers, setShowPassengers] = useState(false);

  const swapCities = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = () => {
    const params = new URLSearchParams({
      tripType,
      origin,
      destination,
      departDate,
      ...(returnDate && tripType === 'roundtrip' ? { returnDate } : {}),
      adults: String(adults),
      children: String(children),
      infants: String(infants),
      cabinClass,
    });
    router.push(`/flights?${params.toString()}`);
  };

  const totalPassengers = adults + children + infants;

  return (
    <div className="w-full rounded-2xl bg-white p-4 shadow-2xl sm:p-6">
      <div className="mb-4 flex flex-wrap gap-2">
        {tripTypes.map((t) => (
          <button
            key={t.value}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              tripType === t.value
                ? 'bg-primary text-white shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
            onClick={() => setTripType(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-[1fr_auto_1fr_1fr_1fr_auto]">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">From</Label>
          <div className="relative">
            <Plane className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="h-11 w-full rounded-lg border bg-background pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select City</option>
              {popularAirports.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.city} ({a.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-end justify-center">
          <button
            onClick={swapCities}
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-primary/20 text-primary transition-all hover:border-primary hover:bg-primary hover:text-white"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">To</Label>
          <div className="relative">
            <Plane className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-muted-foreground" />
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="h-11 w-full rounded-lg border bg-background pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select City</option>
              {popularAirports.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.city} ({a.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={`grid gap-3 ${tripType === 'roundtrip' ? 'grid-cols-2' : 'grid-cols-1'}`}>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Departure</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="date"
                value={departDate}
                onChange={(e) => setDepartDate(e.target.value)}
                className="h-11 pl-9"
              />
            </div>
          </div>
          {tripType === 'roundtrip' && (
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Return</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="h-11 pl-9"
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Passengers & Class
          </Label>
          <div className="relative">
            <button
              onClick={() => setShowPassengers(!showPassengers)}
              className="flex h-11 w-full items-center gap-2 rounded-lg border bg-background px-3 text-sm hover:border-primary/50"
            >
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                {totalPassengers} Traveler{totalPassengers > 1 ? 's' : ''}
              </span>
              <ChevronDown className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
            </button>
            {showPassengers && (
              <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-xl border bg-white p-4 shadow-lg animate-scale-in">
                <div className="space-y-3">
                  {[
                    { label: 'Adults', desc: '12+ years', value: adults, set: setAdults, min: 1 },
                    { label: 'Children', desc: '2-11 years', value: children, set: setChildren, min: 0 },
                    { label: 'Infants', desc: 'Under 2', value: infants, set: setInfants, min: 0 },
                  ].map((p) => (
                    <div key={p.label} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{p.label}</p>
                        <p className="text-xs text-muted-foreground">{p.desc}</p>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => p.set(Math.max(p.min, p.value - 1))}
                          className="flex h-8 w-8 items-center justify-center rounded-full border text-sm hover:bg-muted"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-sm font-medium">{p.value}</span>
                        <button
                          onClick={() => p.set(Math.min(9, p.value + 1))}
                          className="flex h-8 w-8 items-center justify-center rounded-full border text-sm hover:bg-muted"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 border-t pt-3">
                  <select
                    value={cabinClass}
                    onChange={(e) => setCabinClass(e.target.value)}
                    className="w-full rounded-lg border p-2 text-sm"
                  >
                    {cabinClasses.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => setShowPassengers(false)}
                >
                  Done
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-end">
          <Button
            onClick={handleSearch}
            className="h-11 gap-2 gradient-primary px-6 text-white shadow-lg transition-all hover:shadow-xl"
          >
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
