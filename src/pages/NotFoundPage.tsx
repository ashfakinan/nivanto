import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CustomerLayout } from '../components/Layout';

export function NotFoundPage() {
  return (
    <CustomerLayout>
      <section className="max-w-[1200px] mx-auto px-6 py-28 text-center">
        <div className="max-w-md mx-auto space-y-5">
          <p className="font-display font-extrabold text-6xl text-[#2B5FAA] tabular-nums">
            404
          </p>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#1C2440]">
            Page not found
          </h1>
          <p className="text-sm text-[#6B7280] leading-relaxed">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[14px] bg-[#2B5FAA] text-white text-sm font-semibold hover:opacity-95 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
}
