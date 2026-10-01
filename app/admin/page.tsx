'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Plane,
  MapPin,
  Moon,
  MessageSquare,
  CreditCard,
  Settings,
  BarChart3,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Phone,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/supabase';
import { formatBDT } from '@/lib/format';

type AdminTab = 'dashboard' | 'bookings' | 'tours' | 'hajj' | 'inquiries' | 'payments';

const navItems: { id: AdminTab; label: string; icon: any }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'bookings', label: 'Bookings', icon: Plane },
  { id: 'tours', label: 'Tour Packages', icon: MapPin },
  { id: 'hajj', label: 'Hajj & Umrah', icon: Moon },
  { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
  { id: 'payments', label: 'Payments', icon: CreditCard },
];

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-rose-100 text-rose-700',
  completed: 'bg-sky-100 text-sky-700',
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-amber-100 text-amber-700',
  resolved: 'bg-emerald-100 text-emerald-700',
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [bookings, setBookings] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [tours, setTours] = useState<any[]>([]);
  const [hajjPkgs, setHajjPkgs] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileNav, setShowMobileNav] = useState(false);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      const [bRes, iRes, tRes, hRes, pRes] = await Promise.all([
        supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(50),
        supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(50),
        supabase.from('tour_packages').select('*').order('created_at', { ascending: false }),
        supabase.from('hajj_umrah_packages').select('*').order('created_at', { ascending: false }),
        supabase.from('payments').select('*').order('created_at', { ascending: false }).limit(50),
      ]);
      setBookings(bRes.data || []);
      setInquiries(iRes.data || []);
      setTours(tRes.data || []);
      setHajjPkgs(hRes.data || []);
      setPayments(pRes.data || []);
      setLoading(false);
    }
    fetchAll();
  }, []);

  const updateBookingStatus = async (id: string, status: string) => {
    await supabase.from('bookings').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const updateInquiryStatus = async (id: string, status: string) => {
    await supabase.from('inquiries').update({ status }).eq('id', id);
    setInquiries(inquiries.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: Plane, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Pending Bookings', value: bookings.filter((b) => b.status === 'pending').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'New Inquiries', value: inquiries.filter((i) => i.status === 'new').length, icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Active Packages', value: tours.length + hajjPkgs.length, icon: MapPin, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-60 transform border-r bg-white transition-transform lg:relative lg:translate-x-0 ${showMobileNav ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <Plane className="h-5 w-5 text-primary" />
          <span className="font-bold text-foreground">Admin Panel</span>
        </div>
        <nav className="p-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setShowMobileNav(false); }}
              className={`mb-0.5 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === item.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
          <Separator className="my-3" />
          <Link href="/" className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Site
          </Link>
        </nav>
      </aside>

      {showMobileNav && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setShowMobileNav(false)} />
      )}

      {/* Main */}
      <div className="flex-1">
        <header className="flex h-14 items-center gap-3 border-b bg-white px-4">
          <button onClick={() => setShowMobileNav(true)} className="rounded-lg p-2 hover:bg-muted lg:hidden">
            <LayoutDashboard className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold capitalize">{activeTab}</h1>
        </header>

        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((s) => (
                      <div key={s.label} className="flex items-center gap-4 rounded-xl border bg-white p-5">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${s.bg}`}>
                          <s.icon className={`h-6 w-6 ${s.color}`} />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{s.value}</p>
                          <p className="text-xs text-muted-foreground">{s.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border bg-white p-5">
                      <h3 className="mb-4 font-semibold">Recent Bookings</h3>
                      {bookings.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">No bookings yet</p>
                      ) : (
                        <div className="space-y-2">
                          {bookings.slice(0, 5).map((b) => (
                            <div key={b.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                              <div>
                                <p className="text-sm font-medium">{b.customer_name}</p>
                                <p className="text-xs text-muted-foreground">{b.booking_ref} &middot; {b.booking_type}</p>
                              </div>
                              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[b.status] || ''}`}>
                                {b.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="rounded-xl border bg-white p-5">
                      <h3 className="mb-4 font-semibold">Recent Inquiries</h3>
                      {inquiries.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">No inquiries yet</p>
                      ) : (
                        <div className="space-y-2">
                          {inquiries.slice(0, 5).map((inq) => (
                            <div key={inq.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                              <div>
                                <p className="text-sm font-medium">{inq.name}</p>
                                <p className="text-xs text-muted-foreground">{inq.inquiry_type} &middot; {inq.phone}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[inq.status] || ''}`}>
                                  {inq.status}
                                </span>
                                {inq.status === 'new' && (
                                  <button onClick={() => updateInquiryStatus(inq.id, 'contacted')} className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/20">
                                    Mark Contacted
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'bookings' && (
                <div className="rounded-xl border bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="px-4 py-3 text-left font-medium">Ref</th>
                          <th className="px-4 py-3 text-left font-medium">Customer</th>
                          <th className="px-4 py-3 text-left font-medium">Type</th>
                          <th className="px-4 py-3 text-left font-medium">Amount</th>
                          <th className="px-4 py-3 text-left font-medium">Status</th>
                          <th className="px-4 py-3 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.length === 0 ? (
                          <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No bookings yet. Bookings will appear here once customers make reservations.</td></tr>
                        ) : bookings.map((b) => (
                          <tr key={b.id} className="border-b last:border-0 hover:bg-muted/30">
                            <td className="px-4 py-3 font-medium">{b.booking_ref}</td>
                            <td className="px-4 py-3">
                              <p>{b.customer_name}</p>
                              <p className="text-xs text-muted-foreground">{b.customer_phone}</p>
                            </td>
                            <td className="px-4 py-3 capitalize">{b.booking_type}</td>
                            <td className="px-4 py-3 font-medium">{formatBDT(b.total_amount_bdt)}</td>
                            <td className="px-4 py-3">
                              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[b.status] || ''}`}>{b.status}</span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1">
                                {b.status === 'pending' && (
                                  <>
                                    <button onClick={() => updateBookingStatus(b.id, 'confirmed')} className="rounded bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-200">Confirm</button>
                                    <button onClick={() => updateBookingStatus(b.id, 'cancelled')} className="rounded bg-rose-100 px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-200">Cancel</button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'tours' && (
                <div className="rounded-xl border bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="px-4 py-3 text-left font-medium">Package</th>
                          <th className="px-4 py-3 text-left font-medium">Category</th>
                          <th className="px-4 py-3 text-left font-medium">Destination</th>
                          <th className="px-4 py-3 text-left font-medium">Duration</th>
                          <th className="px-4 py-3 text-left font-medium">Price</th>
                          <th className="px-4 py-3 text-left font-medium">Featured</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tours.map((t) => (
                          <tr key={t.id} className="border-b last:border-0 hover:bg-muted/30">
                            <td className="px-4 py-3 font-medium">{t.title}</td>
                            <td className="px-4 py-3 capitalize">{t.category}</td>
                            <td className="px-4 py-3">{t.destination}</td>
                            <td className="px-4 py-3">{t.duration_days}D/{t.duration_nights}N</td>
                            <td className="px-4 py-3 font-medium">{formatBDT(t.base_price_bdt)}</td>
                            <td className="px-4 py-3">{t.is_featured ? <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'hajj' && (
                <div className="rounded-xl border bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="px-4 py-3 text-left font-medium">Package</th>
                          <th className="px-4 py-3 text-left font-medium">Type</th>
                          <th className="px-4 py-3 text-left font-medium">Tier</th>
                          <th className="px-4 py-3 text-left font-medium">Duration</th>
                          <th className="px-4 py-3 text-left font-medium">Price</th>
                          <th className="px-4 py-3 text-left font-medium">Makkah Hotel</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hajjPkgs.map((p) => (
                          <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                            <td className="px-4 py-3 font-medium">{p.title}</td>
                            <td className="px-4 py-3 capitalize">{p.package_type}</td>
                            <td className="px-4 py-3 capitalize">{p.tier}</td>
                            <td className="px-4 py-3">{p.duration_days} Days</td>
                            <td className="px-4 py-3 font-medium">{formatBDT(p.base_price_bdt)}</td>
                            <td className="px-4 py-3">{p.makkah_hotel}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'inquiries' && (
                <div className="rounded-xl border bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="px-4 py-3 text-left font-medium">Name</th>
                          <th className="px-4 py-3 text-left font-medium">Type</th>
                          <th className="px-4 py-3 text-left font-medium">Contact</th>
                          <th className="px-4 py-3 text-left font-medium">Message</th>
                          <th className="px-4 py-3 text-left font-medium">Status</th>
                          <th className="px-4 py-3 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inquiries.length === 0 ? (
                          <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No inquiries yet</td></tr>
                        ) : inquiries.map((inq) => (
                          <tr key={inq.id} className="border-b last:border-0 hover:bg-muted/30">
                            <td className="px-4 py-3 font-medium">{inq.name}</td>
                            <td className="px-4 py-3 capitalize">{inq.inquiry_type}</td>
                            <td className="px-4 py-3"><p>{inq.phone}</p><p className="text-xs text-muted-foreground">{inq.email}</p></td>
                            <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">{inq.message}</td>
                            <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[inq.status] || ''}`}>{inq.status}</span></td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1">
                                {inq.status === 'new' && <button onClick={() => updateInquiryStatus(inq.id, 'contacted')} className="rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 hover:bg-amber-200">Contacted</button>}
                                {inq.status !== 'resolved' && <button onClick={() => updateInquiryStatus(inq.id, 'resolved')} className="rounded bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-200">Resolve</button>}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="rounded-xl border bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="px-4 py-3 text-left font-medium">Transaction ID</th>
                          <th className="px-4 py-3 text-left font-medium">Amount</th>
                          <th className="px-4 py-3 text-left font-medium">Gateway</th>
                          <th className="px-4 py-3 text-left font-medium">Status</th>
                          <th className="px-4 py-3 text-left font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.length === 0 ? (
                          <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">No payment records yet</td></tr>
                        ) : payments.map((p) => (
                          <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                            <td className="px-4 py-3 font-medium">{p.transaction_id || '-'}</td>
                            <td className="px-4 py-3 font-medium">{formatBDT(p.amount_bdt)}</td>
                            <td className="px-4 py-3 capitalize">{p.gateway}</td>
                            <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[p.status] || ''}`}>{p.status}</span></td>
                            <td className="px-4 py-3 text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Star(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
