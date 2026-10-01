import {
  Shield,
  Clock,
  Headphones,
  CreditCard,
  Globe,
  Award,
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Trusted & Licensed',
    description:
      'Government-approved tour operator with 10+ years of excellence in the travel industry.',
  },
  {
    icon: Clock,
    title: 'Instant Booking',
    description:
      'Real-time availability and instant confirmation for flights, hotels, and tour packages.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description:
      'Round-the-clock customer support. Call us anytime at 01790678917 for assistance.',
  },
  {
    icon: CreditCard,
    title: '0% EMI Available',
    description:
      'Pay in easy installments with 0% interest through our partner banks.',
  },
  {
    icon: Globe,
    title: 'Global Network',
    description:
      'Partnerships with major airlines, hotel chains, and GDS providers worldwide.',
  },
  {
    icon: Award,
    title: 'Best Price Guarantee',
    description:
      'We match or beat any comparable price. Transparent pricing with no hidden charges.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-muted/50 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <span className="mb-2 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            Why Arshi Travels
          </span>
          <h2 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">
            Travel with Confidence
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Thousands of travelers trust us to deliver exceptional service, competitive
            pricing, and unforgettable experiences.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl gradient-hero p-8 text-center text-white sm:p-12">
          <h3 className="mb-3 text-2xl font-bold sm:text-3xl">
            Ready to Plan Your Next Adventure?
          </h3>
          <p className="mx-auto mb-6 max-w-xl text-white/80">
            Speak to our travel experts and get a customized itinerary tailored to
            your preferences and budget.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="tel:01790678917"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-primary transition-all hover:bg-white/90 hover:shadow-lg"
            >
              <Headphones className="h-5 w-5" />
              Call 01790678917
            </a>
            <span className="text-sm text-white/60">or</span>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-6 py-3 font-semibold text-white transition-all hover:bg-white/10"
            >
              Send an Inquiry
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
