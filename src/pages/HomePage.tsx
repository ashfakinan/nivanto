import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { BrowserPreviewFrame } from '../components/BrowserPreviewFrame';
import { CustomerLayout } from '../components/Layout';
import { BrandGrowthIllustration, NivantoLogoMark } from '../components/NivantoLogo';
import {
  DEFAULT_HOME_CONTENT,
  SEED_PORTFOLIO,
  SEED_SERVICES,
} from '../data/seedData';
import {
  subscribeHomeContent,
  subscribePublicPortfolio,
  subscribePublicServices,
} from '../lib/firestoreService';
import type { HomeContent, PortfolioItem, ServiceItem } from '../types/nivanto';

export function HomePage() {
  const [content, setContent] = useState<HomeContent>(DEFAULT_HOME_CONTENT);
  const [services, setServices] = useState<ServiceItem[]>(
    SEED_SERVICES.map((s, i) => ({ ...s, id: `seed_svc_${i + 1}` }))
  );
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(
    SEED_PORTFOLIO.map((p, i) => ({ ...p, id: `seed_port_${i + 1}` }))
  );

  useEffect(() => {
    const unsubHome = subscribeHomeContent((data) => setContent(data));
    const unsubSvc = subscribePublicServices((items) => setServices(items));
    const unsubPort = subscribePublicPortfolio((items) => setPortfolio(items));
    return () => {
      unsubHome();
      unsubSvc();
      unsubPort();
    };
  }, []);

  const featuredServices = services.filter((s) => s.featured).slice(0, 4);
  const featuredPortfolio = portfolio.filter((p) => p.featured).slice(0, 3);

  return (
    <CustomerLayout>
      {/* Hero Section */}
      <section className="relative bg-[#1C2440] text-white overflow-hidden">
        <NivantoLogoMark
          className="pointer-events-none select-none absolute -right-16 top-1/2 -translate-y-1/2 w-[480px] text-white opacity-[0.04]"
          strokeWidth={6}
        />
        <div className="max-w-[1200px] mx-auto px-6 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#E8900A]">
                AI-Powered Business Ecosystem · Bangladesh
              </p>
              <h1 className="font-display font-extrabold text-[clamp(2.5rem,5vw,4.25rem)] leading-[0.98] tracking-tight text-white text-balance">
                {content.hero_headline}
              </h1>
              <p className="text-base sm:text-lg text-white/70 max-w-xl leading-relaxed">
                {content.hero_subtext}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[14px] bg-[#E8900A] text-white text-sm font-semibold hover:bg-[#d38108] transition-colors whitespace-nowrap"
                >
                  Start a Project
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/work"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[14px] border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-colors whitespace-nowrap"
                >
                  Explore Our Work
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <BrandGrowthIllustration className="w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Brief Intro Paragraph */}
      <section className="border-b border-[#E5E1D8] bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4">
              <h2 className="font-display font-bold text-2xl text-[#1C2440] text-balance">
                Built on trust. Measured by clarity.
              </h2>
            </div>
            <div className="md:col-span-8">
              <p className="text-base sm:text-lg text-[#6B7280] leading-relaxed max-w-2xl">
                {content.intro_paragraph}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Grid */}
      <section className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#2B5FAA] mb-2">
              Core Capabilities
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1C2440] text-balance">
              Services designed to grow with you
            </h2>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2B5FAA] hover:text-[#1C2440] transition-colors whitespace-nowrap shrink-0"
          >
            View all services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredServices.map((service) => (
            <div
              key={service.id}
              className="rounded-[22px] bg-white border border-[#E5E1D8] p-8 flex flex-col justify-between gap-6 transition-colors duration-200 hover:border-[#2B5FAA]/40"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 text-xs text-[#6B7280]">
                  <span className="font-semibold text-[#2B5FAA]">{service.wing}</span>
                  <span className="font-display font-bold text-lg text-[#1C2440] tabular-nums">
                    {service.currency}
                    {service.price}
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl text-[#1C2440]">
                  {service.title}
                </h3>

                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {service.description}
                </p>

                {service.features.length > 0 && (
                  <ul className="pt-2 space-y-2 border-t border-[#E5E1D8]">
                    {service.features.slice(0, 3).map((feat, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-sm text-[#1C2440]"
                      >
                        <Check className="w-4 h-4 text-[#2B5FAA] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-2">
                <Link
                  to={`/contact?service=${encodeURIComponent(service.title)}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2B5FAA] hover:text-[#E8900A] transition-colors"
                >
                  Request this service
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Portfolio Pieces */}
      <section className="bg-[#EDEAE4]/60 border-y border-[#E5E1D8]">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#2B5FAA] mb-2">
                Selected Work
              </p>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1C2440] text-balance">
                Live digital products built by Nivanto
              </h2>
            </div>
            <Link
              to="/work"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2B5FAA] hover:text-[#1C2440] transition-colors whitespace-nowrap shrink-0"
            >
              See all projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPortfolio.map((item) => (
              <BrowserPreviewFrame
                key={item.id}
                title={item.title}
                category={item.category}
                liveUrl={item.live_url}
                imageUrl={item.image_url}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="relative rounded-[24px] bg-[#1C2440] text-white p-10 sm:p-14 overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <NivantoLogoMark
            className="pointer-events-none select-none absolute -right-12 -bottom-12 w-72 text-white opacity-[0.05]"
            strokeWidth={6.5}
          />
          <div className="space-y-3 max-w-xl relative">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white text-balance">
              {content.cta_text}
            </h2>
            <p className="text-base text-white/65 leading-relaxed">
              Tell us about your business goals. We will recommend the clearest path forward with transparent pricing and realistic timelines.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0 relative">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[14px] bg-[#E8900A] text-white text-sm font-semibold hover:bg-[#d38108] transition-colors whitespace-nowrap"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/templates"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[14px] border border-white/25 text-white text-sm font-semibold hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              Browse Templates
            </Link>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
}
