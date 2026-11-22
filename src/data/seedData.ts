import type {
  AboutContent,
  HomeContent,
  PortfolioItem,
  ServiceItem,
  TemplateItem,
  WingOverview,
} from '../types/nivanto';

export const DEFAULT_HOME_CONTENT: HomeContent = {
  hero_headline: 'Your dream, fully powered.',
  hero_subtext:
    "Bangladesh's AI-powered full business support ecosystem — from brand identity to web architecture, social growth to custom SaaS.",
  intro_paragraph:
    'Nivanto brings brand design, high-converting websites, growth strategy, and digital operations under one trusted roof. Built in Chattogram for ambitious local businesses ready to scale with clarity and confidence.',
  cta_text: 'Ready to grow?',
};

export const DEFAULT_ABOUT_CONTENT: AboutContent = {
  who_we_are:
    'Nivanto is an AI-powered business support ecosystem founded in Chattogram, Bangladesh. Built with the long-term trust and quiet reliability of legacy institutions, we help small and growing businesses look credible online, streamline operations, and turn digital presence into measurable revenue.',
  vision:
    'Our vision is to become the single dependable growth partner for emerging businesses across Bangladesh and South Asia — replacing fragmented freelancers and inflated agency retainers with clear pricing, fast AI-assisted delivery, and human accountability.',
  wings_summary:
    'Nivanto operates as one parent ecosystem divided into ten focused wings. Each wing handles a specialized pillar of business growth — from Nivanto Studio for visual identity and Nivanto Core for web infrastructure, to Nivanto Social, Nivanto Tools, Nivanto Advisory, and Nivanto Academy.',
};

export const NIVANTO_WINGS: WingOverview[] = [
  {
    code: 'W1',
    subBrand: 'Nivanto Studio',
    name: 'Brand Design & Logo',
    description: 'Full visual identities, logo systems, brand guidelines, and social kits engineered to command instant trust.',
    status: 'Active',
  },
  {
    code: 'W2',
    subBrand: 'Nivanto Social',
    name: 'Social Media Management',
    description: 'Consistent content calendars, conversion funnels, and organic audience growth across Instagram and Facebook.',
    status: 'Active',
  },
  {
    code: 'W3',
    subBrand: 'Nivanto Core',
    name: 'Web Service & Management',
    description: 'Fast, mobile-ready websites, readymade industry templates, and ongoing monthly care plans with zero tech headaches.',
    status: 'Active',
  },
  {
    code: 'W4',
    subBrand: 'Nivanto Tools',
    name: 'SaaS Products',
    description: 'Practical business utilities including Nivanto Hisab accounting and niche workflow tools built for local teams.',
    status: 'Active',
  },
  {
    code: 'W5',
    subBrand: 'Nivanto Advisory',
    name: 'Business Consultancy',
    description: 'Idea validation, market research, unit-economics checks, and actionable growth roadmaps before you invest capital.',
    status: 'Active',
  },
  {
    code: 'W6',
    subBrand: 'Nivanto Link',
    name: 'Sourcing & Trade',
    description: 'Trusted wholesale brokerage and verified supplier connections for retail and apparel operators.',
    status: 'Expanding',
  },
  {
    code: 'W7',
    subBrand: 'Nivanto Rise',
    name: 'Business Recovery',
    description: 'Operational audits and turnaround strategies designed for stagnant businesses looking to regain momentum.',
    status: 'Expanding',
  },
  {
    code: 'W8',
    subBrand: 'Nivanto Media',
    name: 'Performance Marketing',
    description: 'Targeted paid acquisition campaigns and multi-channel distribution focused on measurable return on ad spend.',
    status: 'Expanding',
  },
  {
    code: 'W9',
    subBrand: 'Nivanto AI',
    name: 'AI Automation',
    description: 'Custom workflow automations, customer inquiry routing, and digital efficiency tools tailored to your daily stack.',
    status: 'Expanding',
  },
  {
    code: 'W10',
    subBrand: 'Nivanto Academy',
    name: 'Skill & Content',
    description: 'Practical business education, industry economics breakdowns, and creator-led training across Bangladesh.',
    status: 'Active',
  },
];

/**
 * Generates clean, deterministic SVG data-URI preview artwork for fallback thumbnails
 * (strictly adhering to Nivanto's no-stock-photography rule).
 */
export function makeSvgArtwork(
  title: string,
  subtitle: string,
  primary: string,
  accent: string,
  bg: string = '#F8F6F2'
): string {
  const safeTitle = title.replace(/[<>&"']/g, '');
  const safeSub = subtitle.replace(/[<>&"']/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
    <rect width="800" height="500" fill="${bg}"/>
    <rect x="36" y="34" width="728" height="432" rx="22" fill="#FFFFFF" stroke="#E5E1D8" stroke-width="2"/>
    <rect x="36" y="34" width="728" height="44" rx="22" fill="${primary}"/>
    <rect x="36" y="56" width="728" height="22" fill="${primary}"/>
    <circle cx="64" cy="56" r="5" fill="#FFFFFF" opacity="0.45"/>
    <circle cx="82" cy="56" r="5" fill="#FFFFFF" opacity="0.45"/>
    <circle cx="100" cy="56" r="5" fill="#FFFFFF" opacity="0.45"/>
    <rect x="72" y="114" width="120" height="10" rx="5" fill="${accent}"/>
    <text x="72" y="172" font-family="sans-serif" font-weight="800" font-size="34" fill="#1C2440">${safeTitle}</text>
    <text x="72" y="206" font-family="sans-serif" font-weight="500" font-size="17" fill="#6B7280">${safeSub}</text>
    <rect x="72" y="246" width="170" height="42" rx="12" fill="${primary}"/>
    <rect x="258" y="246" width="130" height="42" rx="12" fill="#F8F6F2" stroke="#E5E1D8" stroke-width="1.5"/>
    <rect x="72" y="324" width="205" height="108" rx="16" fill="#F8F6F2" stroke="#E5E1D8" stroke-width="1.5"/>
    <rect x="297" y="324" width="205" height="108" rx="16" fill="#F8F6F2" stroke="#E5E1D8" stroke-width="1.5"/>
    <rect x="522" y="324" width="205" height="108" rx="16" fill="${primary}" opacity="0.08" stroke="${primary}" stroke-opacity="0.2" stroke-width="1.5"/>
    <rect x="522" y="114" width="205" height="174" rx="18" fill="${primary}" opacity="0.06"/>
    <path d="M 556,238 A 66,66 0 0,1 605,172" stroke="${primary}" stroke-width="7" stroke-linecap="round" fill="none"/>
    <path d="M 643,172 A 66,66 0 0,1 692,238" stroke="${primary}" stroke-width="7" stroke-linecap="round" fill="none"/>
    <circle cx="624" cy="168" r="10" fill="${accent}"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SEED_SERVICES: Omit<ServiceItem, 'id'>[] = [
  {
    title: 'Business Website Build (One-Time)',
    description:
      'Complete custom website built for clothing stores, watch shops, gyms, and coaching centers — fast, mobile-first, and ready to convert.',
    price: '5,000',
    currency: '৳',
    features: [
      'Full source code ownership included',
      'Mobile-responsive modern storefront or showcase',
      'Basic on-page SEO & WhatsApp order integration',
      '30-day post-launch bug-fix warranty',
    ],
    wing: 'Nivanto Core',
    featured: true,
    order: 1,
    active: true,
  },
  {
    title: 'Rent-First Website Plan',
    description:
      'Launch a professional business website with zero heavy upfront cost. Month 1 is free, followed by ৳100/month for months 2–4.',
    price: '100/mo',
    currency: '৳',
    features: [
      'Month 1 completely free to test & validate',
      'Months 2–4 at ৳100/month intro rate',
      'Hosting, SSL, and basic updates included',
      'Upgrade to full ownership anytime',
    ],
    wing: 'Nivanto Core',
    featured: true,
    order: 2,
    active: true,
  },
  {
    title: 'Peace of Mind Web Care',
    description:
      'Dedicated monthly website maintenance, speed checks, and content updates with guaranteed 24-hour turnaround.',
    price: '1,500/mo',
    currency: '৳',
    features: [
      '3 hours of monthly maintenance & edits',
      'Priority 24-hour response turnaround',
      'Monthly uptime, speed & security health check',
      'Flexible 7-day cancellation notice',
    ],
    wing: 'Nivanto Core',
    featured: false,
    order: 3,
    active: true,
  },
  {
    title: 'Brand Identity & Logo System',
    description:
      'A complete visual identity built to command trust — custom SVG logo mark, color architecture, typography pairing, and social assets.',
    price: '6,500',
    currency: '৳',
    features: [
      'Primary, reversed & symbol-only logo lockups',
      'Profile picture, cover photo & post templates',
      'Complete color & typography brand guide',
      'Vector SVG + print-ready exports',
    ],
    wing: 'Nivanto Studio',
    featured: true,
    order: 4,
    active: true,
  },
  {
    title: 'Social Media Growth Retainer',
    description:
      'Consistent, trust-building social media management for Facebook and Instagram so your business stays visible and converts followers.',
    price: '3,500/mo',
    currency: '৳',
    features: [
      'Monthly content calendar & Banglish/English copy',
      'Branded post & Reel cover templates',
      'DM funnel optimization for WhatsApp & web',
      'Monthly reach & inquiry insights',
    ],
    wing: 'Nivanto Social',
    featured: true,
    order: 5,
    active: true,
  },
  {
    title: 'Business Roadmap Advisory',
    description:
      '1-on-1 validation, positioning, and growth roadmap for founders launching or restructuring a business in Bangladesh.',
    price: '500',
    currency: '৳',
    features: [
      'Refundable filter consultation session',
      'Target market & pricing structure review',
      '5-stage digital growth action plan',
      'Clear next-step tool & wing recommendations',
    ],
    wing: 'Nivanto Advisory',
    featured: false,
    order: 6,
    active: true,
  },
];

export const SEED_PORTFOLIO: Omit<PortfolioItem, 'id'>[] = [
  {
    title: 'Vastra Dhaka — Menswear Lookbook',
    description:
      'Editorial clothing storefront and WhatsApp direct-order catalog built for an independent Chattogram apparel label.',
    image_url: makeSvgArtwork('Vastra Dhaka', 'Apparel Storefront · Chattogram', '#1C2440', '#E8900A'),
    live_url: '/demo/vastra-dhaka',
    category: 'Clothing & Retail',
    featured: true,
    order: 1,
    active: true,
  },
  {
    title: 'Chrono House — Timepiece Boutique',
    description:
      'Minimalist watch showcase with instant specification cards, authenticity guarantee, and one-tap WhatsApp booking.',
    image_url: makeSvgArtwork('Chrono House', 'Watch Boutique · Heritage Series', '#2B5FAA', '#E8900A'),
    live_url: '/demo/chrono-house',
    category: 'Watch & Accessories',
    featured: true,
    order: 2,
    active: true,
  },
  {
    title: 'Scholars Point — HSC Academy',
    description:
      'Clean student enrollment portal featuring batch schedules, instructor profiles, and mobile-first inquiry capture.',
    image_url: makeSvgArtwork('Scholars Point', 'Coaching Center · Batch Portal', '#1C2440', '#2B5FAA'),
    live_url: '/demo/scholars-point',
    category: 'Coaching & Education',
    featured: true,
    order: 3,
    active: true,
  },
  {
    title: 'Kinetix Barbell — Strength Studio',
    description:
      'High-contrast gym membership site highlighting training programs, monthly passes, and trainer schedules.',
    image_url: makeSvgArtwork('Kinetix Barbell', 'Fitness Studio · Membership Hub', '#2B5FAA', '#E8900A'),
    live_url: '/demo/kinetix-barbell',
    category: 'Gym & Fitness',
    featured: false,
    order: 4,
    active: true,
  },
  {
    title: 'Roast & Loom — Specialty Cafe',
    description:
      'Warm digital menu and table reservation experience crafted for an artisanal coffee roastery and bakery.',
    image_url: makeSvgArtwork('Roast & Loom', 'Artisanal Cafe · Digital Menu', '#1C2440', '#E8900A'),
    live_url: '/demo/roast-loom',
    category: 'Cafe & Dining',
    featured: false,
    order: 5,
    active: true,
  },
  {
    title: 'Nivanto Hisab — Ledger Preview',
    description:
      'Streamlined daily cashflow and invoice tracker built under Nivanto Tools for retail store owners.',
    image_url: makeSvgArtwork('Nivanto Hisab', 'SaaS Ledger · Cashflow Tracker', '#2B5FAA', '#1C2440'),
    live_url: '/demo/nivanto-hisab',
    category: 'SaaS & Tools',
    featured: false,
    order: 6,
    active: true,
  },
];

export const SEED_TEMPLATES: Omit<TemplateItem, 'id'>[] = [
  {
    title: 'Dhaka Thread — Clothing Store',
    description:
      'Ready-to-launch apparel & fashion storefront with lookbook grid, size guide, and instant WhatsApp order checkout.',
    image_url: makeSvgArtwork('Dhaka Thread', 'Readymade Clothing Template', '#1C2440', '#E8900A'),
    live_url: '/demo/vastra-dhaka',
    price: '5,000',
    currency: '৳',
    whatsapp_number: '+8801720266825',
    active: true,
    order: 1,
  },
  {
    title: 'IronPulse — Gym & Fitness Club',
    description:
      'Conversion-ready fitness template featuring membership tiers, class timetable, and trial pass booking.',
    image_url: makeSvgArtwork('IronPulse', 'Readymade Gym & Fitness Template', '#2B5FAA', '#E8900A'),
    live_url: '/demo/kinetix-barbell',
    price: '5,500',
    currency: '৳',
    whatsapp_number: '+8801720266825',
    active: true,
    order: 2,
  },
  {
    title: 'Beacon Batch — Coaching Center',
    description:
      'Structured academic & coaching template with batch schedules, faculty highlights, and student admission form.',
    image_url: makeSvgArtwork('Beacon Batch', 'Readymade Coaching Template', '#1C2440', '#2B5FAA'),
    live_url: '/demo/scholars-point',
    price: '6,000',
    currency: '৳',
    whatsapp_number: '+8801720266825',
    active: true,
    order: 3,
  },
  {
    title: 'BrewCraft — Cafe & Watch Shop',
    description:
      'Clean catalog layout adaptable for specialty cafes, watch boutiques, or curated lifestyle stores.',
    image_url: makeSvgArtwork('BrewCraft', 'Readymade Catalog Template', '#2B5FAA', '#E8900A'),
    live_url: '/demo/roast-loom',
    price: '5,000',
    currency: '৳',
    whatsapp_number: '+8801720266825',
    active: true,
    order: 4,
  },
];
