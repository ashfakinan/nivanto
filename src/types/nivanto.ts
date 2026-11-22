export interface HomeContent {
  hero_headline: string;
  hero_subtext: string;
  intro_paragraph: string;
  cta_text: string;
  updated_at?: unknown;
}

export interface AboutContent {
  who_we_are: string;
  vision: string;
  wings_summary: string;
  updated_at?: unknown;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  features: string[];
  wing: string;
  featured: boolean;
  order: number;
  active: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  live_url: string;
  category: string;
  featured: boolean;
  order: number;
  active: boolean;
}

export interface TemplateItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  live_url: string;
  price: string;
  currency: string;
  whatsapp_number: string;
  active: boolean;
  order: number;
}

export interface InquiryItem {
  id: string;
  name: string;
  business_name: string;
  phone: string;
  service: string;
  message: string;
  timestamp: unknown;
  read: boolean;
}

export interface WingOverview {
  code: string;
  subBrand: string;
  name: string;
  description: string;
  status: 'Active' | 'Expanding';
}

/**
 * Validates that a URL is safe for navigation or iframe embedding
 * (allows same-origin relative paths starting with '/' or http/https URLs).
 */
export function isSafeUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return true;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function formatWhatsAppUrl(phone: string, message: string): string {
  const digits = phone.replace(/[^\d]/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${encoded}`;
}
