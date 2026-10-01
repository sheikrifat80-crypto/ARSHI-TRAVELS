'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Plane,
  MapPin,
  Moon,
  Phone,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  {
    label: 'Flights',
    href: '/flights',
    icon: Plane,
  },
  {
    label: 'Tour Packages',
    href: '/tours',
    icon: MapPin,
    children: [
      { label: 'Domestic Tours', href: '/tours?category=domestic' },
      { label: 'International Tours', href: '/tours?category=international' },
      { label: 'Custom Tour Builder', href: '/tours/custom' },
    ],
  },
  {
    label: 'Hajj & Umrah',
    href: '/hajj-umrah',
    icon: Moon,
  },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs sm:text-sm">
          <div className="flex items-center gap-4">
            <a
              href="tel:01790678917"
              className="flex items-center gap-1.5 transition-colors hover:text-white/80"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>01790678917</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">Your Trusted Travel Partner</span>
            <span className="rounded bg-white/15 px-2 py-0.5 text-[11px] font-medium">
              BDT
            </span>
          </div>
        </div>
      </div>

      <nav className="glass border-b shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Plane className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                ARSHI
              </span>
              <span className="text-xl font-light text-primary"> TRAVELS</span>
              <p className="text-[10px] leading-none text-muted-foreground">
                International Tour Operator
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() =>
                  link.children && setActiveDropdown(link.label)
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
                >
                  {link.icon && <link.icon className="h-4 w-4" />}
                  {link.label}
                  {link.children && <ChevronDown className="h-3.5 w-3.5" />}
                </Link>
                {link.children && activeDropdown === link.label && (
                  <div className="absolute left-0 top-full z-50 mt-0 w-52 rounded-lg border bg-white p-1.5 shadow-lg animate-scale-in">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted hover:text-primary"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                Admin
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="sm" className="gradient-primary text-white">
                Get a Quote
              </Button>
            </Link>
          </div>

          <button
            className="rounded-lg p-2 hover:bg-muted lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t bg-white px-4 pb-4 pt-2 lg:hidden animate-fade-in">
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.icon && <link.icon className="h-4 w-4 text-primary" />}
                  {link.label}
                </Link>
                {link.children?.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block rounded-lg py-2 pl-10 pr-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
            <div className="mt-3 flex gap-2">
              <Link href="/admin" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  Admin
                </Button>
              </Link>
              <Link href="/contact" className="flex-1">
                <Button size="sm" className="w-full gradient-primary text-white">
                  Get a Quote
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
