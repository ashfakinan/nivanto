import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowRight, Check, Clock, Dumbbell, GraduationCap, ShoppingBag, Utensils } from 'lucide-react';

interface DemoConfig {
  brand: string;
  category: string;
  accent: string;
  bg: string;
  headline: string;
  subtext: string;
  cta: string;
  items: { title: string; meta: string; price: string }[];
}

const DEMOS: Record<string, DemoConfig> = {
  'vastra-dhaka': {
    brand: 'VASTRA DHAKA',
    category: 'Menswear & Heritage Apparel',
    accent: '#E8900A',
    bg: '#1C2440',
    headline: 'Tailored cotton & linen built for the Bengal climate.',
    subtext: 'Small-batch panjabis, overshirts, and everyday essentials crafted in Chattogram with nationwide delivery.',
    cta: 'Order on WhatsApp',
    items: [
      { title: 'Indigo Handloom Panjabi', meta: '100% Combed Cotton · S–XXL', price: '৳1,850' },
      { title: 'Sandstone Linen Overshirt', meta: 'Breathable Weave · Relaxed Fit', price: '৳1,600' },
      { title: 'Charcoal Chino Trouser', meta: 'Stretch Twill · Tailored Cut', price: '৳1,450' },
    ],
  },
  'chrono-house': {
    brand: 'CHRONO HOUSE',
    category: 'Curated Timepieces',
    accent: '#2B5FAA',
    bg: '#141B2D',
    headline: 'Precision wristwear with verified authenticity.',
    subtext: 'Official warranty, cash-on-delivery across Dhaka & Chattogram, and same-day dispatch.',
    cta: 'Reserve Timepiece',
    items: [
      { title: 'Seiko 5 Sports Automatic', meta: '40mm · Sapphire · 100m', price: '৳28,500' },
      { title: 'Casio Edifice Chronograph', meta: 'Stainless Steel · Solar', price: '৳14,200' },
      { title: 'Orient Bambino Classic', meta: 'Domed Crystal · Leather Strap', price: '৳22,000' },
    ],
  },
  'scholars-point': {
    brand: 'SCHOLARS POINT',
    category: 'HSC & Admission Academy',
    accent: '#2B5FAA',
    bg: '#1C2440',
    headline: 'Structured mentorship for Science & Commerce batches.',
    subtext: 'Small 25-student batches, weekly written evaluations, and direct parent progress updates.',
    cta: 'Book Free Trial Class',
    items: [
      { title: 'HSC Physics & Higher Math', meta: 'Sun–Tue–Thu · 4:00 PM Batch', price: '৳2,500/mo' },
      { title: 'University Admission Core', meta: 'Daily Mock Tests · Solved Sheet', price: '৳4,500/mo' },
      { title: 'English & ICT Foundation', meta: 'Weekend Intensive · 12 Weeks', price: '৳1,800/mo' },
    ],
  },
  'kinetix-barbell': {
    brand: 'KINETIX BARBELL',
    category: 'Strength & Conditioning',
    accent: '#E8900A',
    bg: '#181D2B',
    headline: 'Train with purpose. Zero crowded machines.',
    subtext: 'Calibrated free weights, certified strength coaches, and flexible morning & evening access.',
    cta: 'Claim 3-Day Trial Pass',
    items: [
      { title: 'Monthly Open Gym Access', meta: '6 AM – 11 PM · All Equipment', price: '৳2,200/mo' },
      { title: 'Guided Transformation Plan', meta: '3x/wk Coaching + Nutrition', price: '৳5,500/mo' },
      { title: 'Quarterly Student Pass', meta: 'Valid Student ID · Full Access', price: '৳5,400/3mo' },
    ],
  },
  'roast-loom': {
    brand: 'ROAST & LOOM',
    category: 'Specialty Coffee & Bakery',
    accent: '#E8900A',
    bg: '#231F20',
    headline: 'Single-origin espresso & warm sourdough daily.',
    subtext: 'Freshly roasted beans every Tuesday in Nasirabad. Quiet workspace tables with fiber Wi-Fi.',
    cta: 'Reserve a Table',
    items: [
      { title: 'Iced Spanish Cortado', meta: 'Double Ristretto · Oat or Dairy', price: '৳320' },
      { title: 'Roasted Chicken Focaccia', meta: 'House Herb Oil · Baked Fresh', price: '৳480' },
      { title: 'Whole Bean House Blend', meta: '250g Bag · Medium Roast', price: '৳850' },
    ],
  },
  'nivanto-hisab': {
    brand: 'NIVANTO HISAB',
    category: 'Retail Cashflow & Ledger',
    accent: '#2B5FAA',
    bg: '#1C2440',
    headline: 'Daily sales, due tracking & profit clarity in 60 seconds.',
    subtext: 'Built by Nivanto Tools for shop owners tired of messy notebooks and lost invoices.',
    cta: 'Start Free Workspace',
    items: [
      { title: 'Today Cash Sales', meta: '18 Completed Receipts', price: '৳42,800' },
      { title: 'Customer Due Collected', meta: '4 Accounts Settled', price: '৳9,450' },
      { title: 'Net Daily Margin', meta: 'Auto-calculated after COGS', price: '৳11,240' },
    ],
  },
};

export function DemoSitePage() {
  const { slug = 'vastra-dhaka' } = useParams();
  const demo = DEMOS[slug] || DEMOS['vastra-dhaka'];
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const Icon =
    slug === 'kinetix-barbell'
      ? Dumbbell
      : slug === 'scholars-point'
        ? GraduationCap
        : slug === 'roast-loom'
          ? Utensils
          : slug === 'chrono-house'
            ? Clock
            : ShoppingBag;

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#1C2440] font-body">
      {/* Demo Navbar */}
      <header
        style={{ backgroundColor: demo.bg }}
        className="text-white px-6 py-4 border-b border-white/10"
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Icon className="w-5 h-5" style={{ color: demo.accent }} />
            <span className="font-display font-extrabold text-base tracking-[3px]">
              {demo.brand}
            </span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-xs text-white/70">
            <a href="#catalog" className="hover:text-white">Collection</a>
            <a href="#features" className="hover:text-white">Standards</a>
          </nav>
          <button
            type="button"
            onClick={() => setSelectedItem(demo.cta)}
            style={{ backgroundColor: demo.accent }}
            className="px-4 py-2 rounded-[10px] text-xs font-semibold text-white hover:opacity-90 transition-opacity"
          >
            {demo.cta}
          </button>
        </div>
      </header>

      {/* Demo Hero */}
      <section style={{ backgroundColor: demo.bg }} className="text-white px-6 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto space-y-5">
          <p
            style={{ color: demo.accent }}
            className="text-xs font-semibold uppercase tracking-[0.14em]"
          >
            {demo.category}
          </p>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl leading-[1.05] max-w-2xl">
            {demo.headline}
          </h1>
          <p className="text-sm sm:text-base text-white/70 max-w-xl leading-relaxed">
            {demo.subtext}
          </p>
          <div className="pt-2">
            <a
              href="#catalog"
              style={{ backgroundColor: demo.accent }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[12px] text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Explore Offerings
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Interactive Selection Banner */}
      {selectedItem && (
        <div className="bg-[#2B5FAA] text-white px-6 py-3 text-center text-xs sm:text-sm font-medium">
          Interactive preview action triggered: <strong>{selectedItem}</strong> — Built with Nivanto Core.
        </div>
      )}

      {/* Demo Catalog */}
      <section id="catalog" className="max-w-5xl mx-auto px-6 py-14">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display font-bold text-2xl text-[#1C2440]">
            Featured Selection
          </h2>
          <span className="text-xs text-[#6B7280]">Live Interactive Demo</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {demo.items.map((item) => (
            <div
              key={item.title}
              className="rounded-[18px] bg-white border border-[#E5E1D8] p-6 flex flex-col justify-between gap-5"
            >
              <div className="space-y-2">
                <p className="text-xs text-[#6B7280]">{item.meta}</p>
                <h3 className="font-display font-bold text-lg text-[#1C2440]">
                  {item.title}
                </h3>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#E5E1D8]">
                <span className="font-display font-extrabold text-lg text-[#1C2440] tabular-nums">
                  {item.price}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedItem(item.title)}
                  className="px-3.5 py-1.5 rounded-[10px] bg-[#F8F6F2] border border-[#E5E1D8] text-xs font-semibold text-[#1C2440] hover:bg-[#1C2440] hover:text-white transition-colors"
                >
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Standards strip */}
      <section id="features" className="max-w-5xl mx-auto px-6 pb-14">
        <div className="rounded-[20px] bg-white border border-[#E5E1D8] p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            'Fast mobile-first layout',
            'Direct WhatsApp inquiry flow',
            'Powered by Nivanto Core',
          ].map((point) => (
            <div key={point} className="flex items-center gap-3 text-sm font-medium text-[#1C2440]">
              <Check className="w-4 h-4 text-[#2B5FAA] shrink-0" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
