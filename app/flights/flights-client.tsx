'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Plane,
  Clock,
  Luggage,
  ArrowRight,
  Filter,
  SortAsc,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { formatBDT } from '@/lib/format';
import { flightService, type FlightResult, type FlightSearchParams } from '@/lib/services/flight-service';

const airportMap: Record<string, string> = {
  DAC: 'Dhaka', CGP: 'Chittagong', CXB: "Cox's Bazar", ZYL: 'Sylhet', SPD: 'Saidpur',
  DXB: 'Dubai', JED: 'Jeddah', SIN: 'Singapore', BKK: 'Bangkok', KUL: 'Kuala Lumpur',
  DEL: 'Delhi', CCU: 'Kolkata', IST: 'Istanbul', MLE: 'Male', MED: 'Medina',
};

const popularAirports = [
  { code: 'DAC', city: 'Dhaka' }, { code: 'CGP', city: 'Chittagong' },
  { code: 'CXB', city: "Cox's Bazar" }, { code: 'ZYL', city: 'Sylhet' },
  { code: 'DXB', city: 'Dubai' }, { code: 'SIN', city: 'Singapore' },
  { code: 'BKK', city: 'Bangkok' }, { code: 'KUL', city: 'Kuala Lumpur' },
  { code: 'JED', city: 'Jeddah' }, { code: 'IST', city: 'Istanbul' },
  { code: 'DEL', city: 'Delhi' }, { code: 'CCU', city: 'Kolkata' },
  { code: 'MLE', city: 'Male' },
];

export default function FlightsClient() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<FlightResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<FlightResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFlight, setExpandedFlight] = useState<string | null>(null);

  const [origin, setOrigin] = useState(searchParams.get('origin') || 'DAC');
  const [destination, setDestination] = useState(searchParams.get('destination') || '');
  const [departDate, setDepartDate] = useState(searchParams.get('departDate') || '');
  const [tripType] = useState(searchParams.get('tripType') || 'roundtrip');
  const [returnDate, setReturnDate] = useState(searchParams.get('returnDate') || '');
  const [adults] = useState(Number(searchParams.get('adults')) || 1);
  const [cabinClass, setCabinClass] = useState(searchParams.get('cabinClass') || 'economy');

  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price');
  const [filterStops, setFilterStops] = useState<number | null>(null);
  const [filterAirline, setFilterAirline] = useState<string>('');
  const [filterRefundable, setFilterRefundable] = useState<boolean | null>(null);

  const handleSearch = useCallback(async () => {
    if (!origin || !destination || !departDate) return;
    setLoading(true);
    setSearched(true);
    try {
      const params: FlightSearchParams = {
        tripType: tripType as FlightSearchParams['tripType'],
        origin,
        destination,
        departureDate: departDate,
        returnDate: tripType === 'roundtrip' ? returnDate : undefined,
        adults,
        children: 0,
        infants: 0,
        cabinClass: cabinClass as FlightSearchParams['cabinClass'],
      };
      const data = await flightService.search(params);
      setResults(data);
      setFilteredResults(data);
    } finally {
      setLoading(false);
    }
  }, [origin, destination, departDate, tripType, returnDate, adults, cabinClass]);

  useEffect(() => {
    if (searchParams.get('origin') && searchParams.get('destination') && searchParams.get('departDate')) {
      handleSearch();
    }
  }, []);

  useEffect(() => {
    let filtered = [...results];
    if (filterStops !== null) filtered = filtered.filter((f) => f.stops === filterStops);
    if (filterAirline) filtered = filtered.filter((f) => f.airline === filterAirline);
    if (filterRefundable !== null) filtered = filtered.filter((f) => f.isRefundable === filterRefundable);

    filtered.sort((a, b) => {
      if (sortBy === 'price') return a.totalFare - b.totalFare;
      if (sortBy === 'departure') return a.departureTime.localeCompare(b.departureTime);
      return a.duration.localeCompare(b.duration);
    });

    setFilteredResults(filtered);
  }, [results, filterStops, filterAirline, filterRefundable, sortBy]);

  const uniqueAirlines = Array.from(new Set(results.map((f) => f.airline)));

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="gradient-hero py-8 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="mb-6 text-2xl font-bold">Search Flights</h1>
          <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              <div>
                <Label className="text-xs text-white/70">From</Label>
                <select value={origin} onChange={(e) => setOrigin(e.target.value)} className="mt-1 h-10 w-full rounded-lg border-0 bg-white/20 px-3 text-sm text-white backdrop-blur-sm focus:ring-2 focus:ring-white/30">
                  {popularAirports.map((a) => (<option key={a.code} value={a.code} className="text-foreground">{a.city} ({a.code})</option>))}
                </select>
              </div>
              <div>
                <Label className="text-xs text-white/70">To</Label>
                <select value={destination} onChange={(e) => setDestination(e.target.value)} className="mt-1 h-10 w-full rounded-lg border-0 bg-white/20 px-3 text-sm text-white backdrop-blur-sm focus:ring-2 focus:ring-white/30">
                  <option value="" className="text-foreground">Select</option>
                  {popularAirports.map((a) => (<option key={a.code} value={a.code} className="text-foreground">{a.city} ({a.code})</option>))}
                </select>
              </div>
              <div>
                <Label className="text-xs text-white/70">Departure</Label>
                <Input type="date" value={departDate} onChange={(e) => setDepartDate(e.target.value)} className="mt-1 h-10 border-0 bg-white/20 text-white" />
              </div>
              <div>
                <Label className="text-xs text-white/70">Return</Label>
                <Input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="mt-1 h-10 border-0 bg-white/20 text-white" disabled={tripType === 'oneway'} />
              </div>
              <div>
                <Label className="text-xs text-white/70">Class</Label>
                <select value={cabinClass} onChange={(e) => setCabinClass(e.target.value)} className="mt-1 h-10 w-full rounded-lg border-0 bg-white/20 px-3 text-sm text-white backdrop-blur-sm focus:ring-2 focus:ring-white/30">
                  <option value="economy" className="text-foreground">Economy</option>
                  <option value="business" className="text-foreground">Business</option>
                  <option value="first" className="text-foreground">First Class</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch} disabled={loading} className="h-10 w-full gap-2 bg-amber-500 text-white hover:bg-amber-600">
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plane className="h-4 w-4" />}
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {!searched && (
          <div className="py-20 text-center">
            <Plane className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
            <h2 className="mb-2 text-xl font-semibold text-foreground">Search for Flights</h2>
            <p className="text-muted-foreground">Enter your travel details above to find available flights.</p>
          </div>
        )}

        {searched && !loading && (
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className={`w-full shrink-0 lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="sticky top-32 space-y-4 rounded-xl border bg-white p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Filters</h3>
                  <button onClick={() => { setFilterStops(null); setFilterAirline(''); setFilterRefundable(null); }} className="text-xs text-primary hover:underline">Clear All</button>
                </div>
                <Separator />
                <div>
                  <p className="mb-2 text-sm font-medium">Stops</p>
                  <div className="space-y-1.5">
                    {[{ value: null, label: 'Any' }, { value: 0, label: 'Non-stop' }, { value: 1, label: '1 Stop' }].map((opt) => (
                      <button key={String(opt.value)} onClick={() => setFilterStops(opt.value)} className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${filterStops === opt.value ? 'bg-primary/10 font-medium text-primary' : 'hover:bg-muted'}`}>{opt.label}</button>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="mb-2 text-sm font-medium">Airlines</p>
                  <div className="space-y-1.5">
                    <button onClick={() => setFilterAirline('')} className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${!filterAirline ? 'bg-primary/10 font-medium text-primary' : 'hover:bg-muted'}`}>All Airlines</button>
                    {uniqueAirlines.map((airline) => (
                      <button key={airline} onClick={() => setFilterAirline(airline)} className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${filterAirline === airline ? 'bg-primary/10 font-medium text-primary' : 'hover:bg-muted'}`}>{airline}</button>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="mb-2 text-sm font-medium">Refundable</p>
                  <div className="space-y-1.5">
                    {[{ value: null, label: 'Any' }, { value: true, label: 'Refundable' }, { value: false, label: 'Non-refundable' }].map((opt) => (
                      <button key={String(opt.value)} onClick={() => setFilterRefundable(opt.value)} className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${filterRefundable === opt.value ? 'bg-primary/10 font-medium text-primary' : 'hover:bg-muted'}`}>{opt.label}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm lg:hidden">
                    <Filter className="h-4 w-4" /> Filters
                  </button>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{filteredResults.length}</span> flights found
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <SortAsc className="h-4 w-4 text-muted-foreground" />
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="rounded-lg border px-3 py-2 text-sm">
                    <option value="price">Cheapest</option>
                    <option value="duration">Shortest</option>
                    <option value="departure">Earliest</option>
                  </select>
                </div>
              </div>

              {filteredResults.length === 0 ? (
                <div className="rounded-xl border bg-white py-16 text-center">
                  <AlertCircle className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
                  <p className="font-medium">No flights match your criteria</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your filters or search parameters</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredResults.map((flight) => (
                    <div key={flight.id} className="overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md">
                      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
                        <div className="flex items-center gap-3 sm:w-36">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold text-primary">{flight.airlineCode}</div>
                          <div>
                            <p className="text-sm font-medium">{flight.airline}</p>
                            <p className="text-xs text-muted-foreground">{flight.flightNumber}</p>
                          </div>
                        </div>
                        <div className="flex flex-1 items-center gap-4">
                          <div className="text-center">
                            <p className="text-lg font-bold">{flight.departureTime}</p>
                            <p className="text-xs text-muted-foreground">{airportMap[flight.origin] || flight.origin}</p>
                          </div>
                          <div className="flex flex-1 flex-col items-center">
                            <p className="text-xs text-muted-foreground">{flight.duration}</p>
                            <div className="relative my-1 h-px w-full bg-border">
                              <div className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary" />
                              {flight.stops > 0 && <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-500 bg-white" />}
                              <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary" />
                            </div>
                            <p className="text-xs text-muted-foreground">{flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop`}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold">{flight.arrivalTime}</p>
                            <p className="text-xs text-muted-foreground">{airportMap[flight.destination] || flight.destination}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                          <div className="text-right">
                            <p className="text-xl font-bold text-primary">{formatBDT(flight.totalFare)}</p>
                            <p className="text-xs text-muted-foreground">per person</p>
                          </div>
                          <Button size="sm" className="gradient-primary text-white" onClick={() => setExpandedFlight(expandedFlight === flight.id ? null : flight.id)}>
                            {expandedFlight === flight.id ? 'Hide' : 'Details'}
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 border-t bg-muted/30 px-4 py-2 sm:px-5">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground"><Luggage className="h-3.5 w-3.5" /> {flight.baggage}</span>
                        <span className={`flex items-center gap-1 text-xs ${flight.isRefundable ? 'text-emerald-600' : 'text-muted-foreground'}`}><CheckCircle className="h-3.5 w-3.5" /> {flight.isRefundable ? 'Refundable' : 'Non-refundable'}</span>
                        <span className="text-xs text-muted-foreground">{flight.seatsAvailable} seats left</span>
                      </div>
                      {expandedFlight === flight.id && (
                        <div className="border-t bg-muted/20 p-4 animate-fade-in sm:p-5">
                          <h4 className="mb-3 font-semibold">Fare Breakdown</h4>
                          <div className="grid gap-2 text-sm sm:grid-cols-2">
                            <div className="flex justify-between rounded-lg bg-white p-3"><span className="text-muted-foreground">Base Fare</span><span className="font-medium">{formatBDT(flight.baseFare)}</span></div>
                            <div className="flex justify-between rounded-lg bg-white p-3"><span className="text-muted-foreground">Taxes & Fees</span><span className="font-medium">{formatBDT(flight.taxes)}</span></div>
                            <div className="flex justify-between rounded-lg bg-white p-3"><span className="text-muted-foreground">Fuel Surcharge</span><span className="font-medium">{formatBDT(flight.fuelSurcharge)}</span></div>
                            <div className="flex justify-between rounded-lg bg-primary/5 p-3"><span className="font-semibold">Total</span><span className="font-bold text-primary">{formatBDT(flight.totalFare)}</span></div>
                          </div>
                          <div className="mt-4 flex gap-3">
                            <Button className="gradient-primary flex-1 gap-2 text-white"><Plane className="h-4 w-4" /> Book Now</Button>
                            <a href="tel:01790678917"><Button variant="outline" className="gap-2"><Phone className="h-4 w-4" /> Call to Book</Button></a>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
