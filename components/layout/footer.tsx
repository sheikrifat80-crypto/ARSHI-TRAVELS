import Link from 'next/link';
import {
  Plane,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
} from 'lucide-react';

const footerLinks = {
  services: [
    { label: 'Flight Booking', href: '/flights' },
    { label: 'Domestic Tours', href: '/tours?category=domestic' },
    { label: 'International Tours', href: '/tours?category=international' },
    { label: 'Hajj Packages', href: '/hajj-umrah?type=hajj' },
    { label: 'Umrah Packages', href: '/hajj-umrah?type=umrah' },
    { label: 'Custom Tour Builder', href: '/tours/custom' },
  ],
  destinations: [
    { label: "Cox's Bazar", href: '/tours?destination=coxs-bazar' },
    { label: 'Sylhet', href: '/tours?destination=sylhet' },
    { label: 'Thailand', href: '/tours?destination=thailand' },
    { label: 'Malaysia', href: '/tours?destination=malaysia' },
    { label: 'Dubai', href: '/tours?destination=dubai' },
    { label: 'Maldives', href: '/tours?destination=maldives' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Refund Policy', href: '/refund' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[hsl(215,25%,12%)] text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Plane className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">ARSHI</span>
                <span className="text-xl font-light text-primary"> TRAVELS</span>
              </div>
            </Link>
            <p className="mb-6 text-sm leading-relaxed text-white/60">
              Your trusted international tour operator, delivering premium travel
              experiences for flights, holiday packages, and spiritual pilgrimages
              since 2015.
            </p>
            <div className="space-y-3">
              <a
                href="tel:01790678917"
                className="flex items-center gap-2.5 text-sm transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4 text-primary" />
                01790678917
              </a>
              <a
                href="mailto:info@arshitravels.com"
                className="flex items-center gap-2.5 text-sm transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 text-primary" />
                info@arshitravels.com
              </a>
              <div className="flex items-start gap-2.5 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Services
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Popular Destinations
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.destinations.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wider text-white">
              Follow Us
            </h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-primary"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-primary"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-primary"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} Arshi Travels. All rights reserved.
            Licensed International Tour Operator.
          </p>
          <div className="flex items-center gap-3 text-xs text-white/50">
            <span>Accepted Payments:</span>
            <span className="rounded bg-white/10 px-2 py-1 text-[10px] font-medium text-white/70">
              bKash
            </span>
            <span className="rounded bg-white/10 px-2 py-1 text-[10px] font-medium text-white/70">
              Nagad
            </span>
            <span className="rounded bg-white/10 px-2 py-1 text-[10px] font-medium text-white/70">
              VISA
            </span>
            <span className="rounded bg-white/10 px-2 py-1 text-[10px] font-medium text-white/70">
              Mastercard
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
