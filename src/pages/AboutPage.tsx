import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CustomerLayout } from '../components/Layout';
import { BrandGrowthIllustration } from '../components/NivantoLogo';
import { DEFAULT_ABOUT_CONTENT, NIVANTO_WINGS } from '../data/seedData';
import { subscribeAboutContent } from '../lib/firestoreService';
import type { AboutContent } from '../types/nivanto';

export function AboutPage() {
  const [about, setAbout] = useState<AboutContent>(DEFAULT_ABOUT_CONTENT);

  useEffect(() => {
    const unsub = subscribeAboutContent((data) => setAbout(data));
    return () => unsub();
  }, []);

  return (
    <CustomerLayout>
      {/* Header */}
      <section className="bg-[#1C2440] text-white py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-6 space-y-4">
          <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#E8900A]">
            About Nivanto
          </p>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white text-balance">
            Built for enduring business trust
          </h1>
          <p className="text-base text-white/65 max-w-2xl leading-relaxed">
            Grounded in Chattogram, built to scale across Bangladesh and South Asia — human accountability powered by modern AI tools.
          </p>
        </div>
      </section>

      {/* Who We Are & Vision */}
      <section className="max-w-[1200px] mx-auto px-6 py-20 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-3">
              <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#2B5FAA]">
                01. Who We Are
              </p>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1C2440]">
                One ecosystem, built from the ground up
              </h2>
              <p className="text-base text-[#6B7280] leading-relaxed whitespace-pre-line">
                {about.who_we_are}
              </p>
            </div>

            <div className="pt-8 border-t border-[#E5E1D8] space-y-3">
              <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#E8900A]">
                02. Our Vision
              </p>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1C2440]">
                From vendor to long-term growth partner
              </h2>
              <p className="text-base text-[#6B7280] leading-relaxed whitespace-pre-line">
                {about.vision}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-[24px] bg-[#1C2440] p-6">
              <BrandGrowthIllustration className="w-full h-auto" />
            </div>
          </div>
        </div>

        {/* Wings Overview */}
        <div className="pt-14 border-t border-[#E5E1D8] space-y-10">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[#2B5FAA]">
              03. Our Wings Overview
            </p>
            <h2 className="font-display font-extrabold text-3xl text-[#1C2440]">
              Ten specialized wings under one parent brand
            </h2>
            <p className="text-base text-[#6B7280] leading-relaxed whitespace-pre-line">
              {about.wings_summary}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {NIVANTO_WINGS.map((wing) => (
              <div
                key={wing.code}
                className="rounded-[20px] bg-white border border-[#E5E1D8] p-6 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#2B5FAA]">
                      {wing.code} · {wing.subBrand}
                    </span>
                    <span
                      className={
                        wing.status === 'Active'
                          ? 'text-[#16A34A] font-medium'
                          : 'text-[#6B7280] font-medium'
                      }
                    >
                      {wing.status}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#1C2440]">
                    {wing.name}
                  </h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">
                    {wing.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[14px] bg-[#2B5FAA] text-white text-sm font-semibold hover:opacity-95 transition-opacity"
            >
              Explore Active Services
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[14px] bg-white border border-[#E5E1D8] text-[#1C2440] text-sm font-semibold hover:border-[#2B5FAA] transition-colors"
            >
              Talk to Our Team
            </Link>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
}
