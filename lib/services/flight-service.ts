export interface FlightSearchParams {
  tripType: 'oneway' | 'roundtrip' | 'multicity';
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  cabinClass: 'economy' | 'premium_economy' | 'business' | 'first';
}

export interface FlightResult {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  stopCities: string[];
  baseFare: number;
  taxes: number;
  fuelSurcharge: number;
  totalFare: number;
  currency: string;
  cabinClass: string;
  seatsAvailable: number;
  baggage: string;
  isRefundable: boolean;
  fareRules: string;
}

export interface GDSProvider {
  name: string;
  search(params: FlightSearchParams): Promise<FlightResult[]>;
  book(flightId: string, passengers: unknown[]): Promise<{ pnr: string }>;
  cancel(pnr: string): Promise<{ status: string }>;
}

function generateMockFlights(params: FlightSearchParams): FlightResult[] {
  const airlines = [
    { name: 'Biman Bangladesh Airlines', code: 'BG' },
    { name: 'US-Bangla Airlines', code: 'BS' },
    { name: 'Air Astra', code: 'AZ' },
    { name: 'Emirates', code: 'EK' },
    { name: 'Qatar Airways', code: 'QR' },
    { name: 'Singapore Airlines', code: 'SQ' },
    { name: 'Flydubai', code: 'FZ' },
    { name: 'IndiGo', code: '6E' },
    { name: 'Turkish Airlines', code: 'TK' },
    { name: 'Air Arabia', code: 'G9' },
  ];

  const results: FlightResult[] = [];
  const baseMultiplier = params.cabinClass === 'business' ? 3.2 : params.cabinClass === 'first' ? 5.5 : 1;

  for (let i = 0; i < 8; i++) {
    const airline = airlines[i % airlines.length];
    const baseFare = Math.round((3500 + Math.random() * 12000) * baseMultiplier);
    const taxes = Math.round(baseFare * 0.12);
    const fuelSurcharge = Math.round(baseFare * 0.08);
    const depHour = 6 + Math.floor(Math.random() * 14);
    const durationHours = 1 + Math.floor(Math.random() * 8);
    const stops = Math.random() > 0.6 ? 1 : 0;

    results.push({
      id: `FL-${Date.now()}-${i}`,
      airline: airline.name,
      airlineCode: airline.code,
      flightNumber: `${airline.code}${100 + Math.floor(Math.random() * 900)}`,
      origin: params.origin,
      originCity: params.origin,
      destination: params.destination,
      destinationCity: params.destination,
      departureTime: `${String(depHour).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      arrivalTime: `${String((depHour + durationHours) % 24).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      duration: `${durationHours}h ${Math.floor(Math.random() * 50) + 10}m`,
      stops,
      stopCities: stops > 0 ? ['DXB'] : [],
      baseFare,
      taxes,
      fuelSurcharge,
      totalFare: baseFare + taxes + fuelSurcharge,
      currency: 'BDT',
      cabinClass: params.cabinClass,
      seatsAvailable: Math.floor(Math.random() * 15) + 1,
      baggage: params.cabinClass === 'economy' ? '20 kg' : '30 kg',
      isRefundable: Math.random() > 0.5,
      fareRules: 'Standard fare rules apply. Cancellation charges may apply.',
    });
  }

  return results.sort((a, b) => a.totalFare - b.totalFare);
}

function generatePNR(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

class MockGDSProvider implements GDSProvider {
  name = 'MockGDS';

  async search(params: FlightSearchParams): Promise<FlightResult[]> {
    await new Promise((r) => setTimeout(r, 800));
    return generateMockFlights(params);
  }

  async book(_flightId: string, _passengers: unknown[]): Promise<{ pnr: string }> {
    await new Promise((r) => setTimeout(r, 500));
    return { pnr: generatePNR() };
  }

  async cancel(_pnr: string): Promise<{ status: string }> {
    await new Promise((r) => setTimeout(r, 300));
    return { status: 'cancelled' };
  }
}

export const flightService: GDSProvider = new MockGDSProvider();
