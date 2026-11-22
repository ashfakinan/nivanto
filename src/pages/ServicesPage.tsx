import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { CustomerLayout } from '../components/Layout';
import { SEED_SERVICES } from '../data/seedData';
import { subscribePublicServices } from '../lib/firestoreService';
import type { ServiceItem } from '../types/nivanto';

export function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>(
    SEED_SERVICES.map((s, i) => ({ ...s, id: `seed_svc_${i + 1}` }))
  );
  const [selectedWing, setSelectedWing] = useState<string>('All');

  useEffect(() => {
    const unsub = subscribePublicServices((items) => setServices(items));
    return () => unsub();
  }, []);

  const wings = useMemo(() => {
    const unique = Array.from(new Set(services.map((s) => s.wing).filter(Boolean)));
    return ['All', ...unique];
  }, [services]);

  const filteredServices = useMemo(() => {
    if (selectedWing === 'All') return services;
    return services.filter((s) => s.wing === selectedWing);
  }, [services, selectedWing]);

  return (
    <CustomerLayout>
      {/* Header */}
      <section className="bg-[#1C2440] text-white py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-6 space-y-4">
          <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#E8900A]">
            Nivanto Ecosystem Services
          </p>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white text-balance">
            Structured support for every stage of growth
          </h1>
          <p className="text-base text-white/65 max-w-2xl leading-relaxed">
            Transparent pricing in Bangladeshi Taka with clear deliverables. Pick a single service or combine wings for full-stack business momentum.
          </p>
        </div>
      </section>

      {/* Filter & Grid */}
      <section className="max-w-[1200px] mx-auto px-6 py-16">
        {/* Wing Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-6 border-b border-[#E5E1D8]">
          {wings.map((wing) => (
            <button
              key={wing}
              type="button"
              onClick={() => setSelectedWing(wing)}
              className={`px-4 py-2 rounded-[12px] text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                selectedWing === wing
                  ? 'bg-[#2B5FAA] text-white'
                  : 'bg-white border border-[#E5E1D8] text-[#6B7280] hover:text-[#1C2440]'
              }`}
            >
              {wing === 'All' ? 'All Wings' : wing}
            </button>
          ))}
        </div>

        {filteredServices.length === 0 ? (
          <div className="rounded-[22px] bg-white border border-[#E5E1D8] p-12 text-center">
            <p className="font-display font-bold text-lg text-[#1C2440]">
              No active services in this wing yet
            </p>
            <p className="text-sm text-[#6B7280] mt-2">
              Select another wing or reach out directly for custom requirements.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="rounded-[22px] bg-white border border-[#E5E1D8] p-7 flex flex-col justify-between gap-6 transition-colors duration-200 hover:border-[#2B5FAA]/45"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="font-semibold text-[#2B5FAA]">
                      {service.wing}
                    </span>
                    {service.featured && (
                      <span className="text-[#E8900A] font-semibold">
                        Popular
                      </span>
                    )}
                  </div>

                  <div>
                    <h2 className="font-display font-bold text-xl text-[#1C2440] mb-2">
                      {service.title}
                    </h2>
                    <div className="font-display font-extrabold text-3xl text-[#1C2440] tabular-nums">
                      {service.currency}
                      {service.price}
                    </div>
                  </div>

                  <p className="text-sm text-[#6B7280] leading-relaxed">
                    {service.description}
                  </p>

                  {service.features.length > 0 && (
                    <ul className="pt-4 space-y-2.5 border-t border-[#E5E1D8]">
                      {service.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-sm text-[#1C2440]"
                        >
                          <Check className="w-4 h-4 text-[#2B5FAA] shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <Link
                  to={`/contact?service=${encodeURIComponent(service.title)}`}
                  className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-[14px] bg-[#F8F6F2] border border-[#E5E1D8] text-[#1C2440] text-sm font-semibold hover:bg-[#2B5FAA] hover:text-white hover:border-[#2B5FAA] transition-colors"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </CustomerLayout>
  );
}
