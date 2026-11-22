import React, { useEffect, useMemo, useState } from 'react';
import { BrowserPreviewFrame } from '../components/BrowserPreviewFrame';
import { CustomerLayout } from '../components/Layout';
import { SEED_PORTFOLIO } from '../data/seedData';
import { subscribePublicPortfolio } from '../lib/firestoreService';
import type { PortfolioItem } from '../types/nivanto';

export function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>(
    SEED_PORTFOLIO.map((p, i) => ({ ...p, id: `seed_port_${i + 1}` }))
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    const unsub = subscribePublicPortfolio((data) => setItems(data));
    return () => unsub();
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(items.map((item) => item.category).filter(Boolean))
    );
    return ['All', ...unique];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return items;
    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  return (
    <CustomerLayout>
      {/* Header */}
      <section className="bg-[#1C2440] text-white py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-6 space-y-4">
          <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#E8900A]">
            Our Work
          </p>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white text-balance">
            Real client builds &amp; live previews
          </h1>
          <p className="text-base text-white/65 max-w-2xl leading-relaxed">
            Every card below renders a live interactive preview of the deployed site on desktop. Click any project card to open and explore the full live site in a new tab.
          </p>
        </div>
      </section>

      {/* Filter & Grid */}
      <section className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-6 border-b border-[#E5E1D8]">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-[12px] text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#2B5FAA] text-white'
                  : 'bg-white border border-[#E5E1D8] text-[#6B7280] hover:text-[#1C2440]'
              }`}
            >
              {cat === 'All' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        {filteredItems.length === 0 ? (
          <div className="rounded-[22px] bg-white border border-[#E5E1D8] p-12 text-center">
            <p className="font-display font-bold text-lg text-[#1C2440]">
              No projects found in this category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
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
        )}
      </section>
    </CustomerLayout>
  );
}
