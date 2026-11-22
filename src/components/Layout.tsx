import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NivantoLogoLockup } from './NivantoLogo';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/work', label: 'Our Work' },
  { to: '/templates', label: 'Templates' },
  { to: '/about', label: 'About' },
];

export function CustomerLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F2] text-[#1C2440]">
      {/* Sticky Top Bar — Strict 3-Zone Contract */}
      <header className="sticky top-0 z-40 bg-[#1C2440]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 h-[72px] flex items-center justify-between gap-8">
          {/* Zone 1: Brand Lockup */}
          <Link
            to="/"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8900A] rounded-lg"
            onClick={() => setMobileMenuOpen(false)}
          >
            <NivantoLogoLockup variant="reversed" size="md" />
          </Link>

          {/* Zone 2: Clean Typography Nav Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7"
          >
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 ${
                    isActive
                      ? 'text-white underline underline-offset-8 decoration-[#E8900A] decoration-2'
                      : 'text-white/65 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/contact"
              className="hidden md:inline-flex items-center justify-center px-5 py-2.5 rounded-[14px] bg-[#E8900A] text-white text-sm font-semibold whitespace-nowrap shrink-0 hover:bg-[#d38108] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Start a Project
            </Link>
            <button
              type="button"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-[12px] text-white hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#1C2440] border-t border-white/10 px-6 py-5 space-y-3">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-2.5 text-base font-medium ${
                    isActive ? 'text-[#E8900A]' : 'text-white/80 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="pt-2">
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-5 py-3 rounded-[14px] bg-[#E8900A] text-white text-sm font-semibold"
              >
                Start a Project
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Quiet Dark Brand Footer (zero admin links) */}
      <footer className="bg-[#1C2440] text-white border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
            <div className="md:col-span-2 space-y-4">
              <NivantoLogoLockup variant="reversed" size="md" />
              <p className="text-sm text-[#E8900A] font-medium">
                Your dream, fully powered.
              </p>
              <p className="text-sm text-white/55 max-w-sm leading-relaxed">
                AI-powered business support ecosystem helping companies across Bangladesh build credible brands, fast websites, and reliable growth systems.
              </p>
            </div>

            <div>
              <h4 className="font-display font-bold text-sm text-white mb-4">
                Explore
              </h4>
              <ul className="space-y-2.5 text-sm text-white/60">
                <li>
                  <Link to="/services" className="hover:text-white transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="/work" className="hover:text-white transition-colors">
                    Our Work
                  </Link>
                </li>
                <li>
                  <Link to="/templates" className="hover:text-white transition-colors">
                    Readymade Templates
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    About &amp; Vision
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold text-sm text-white mb-4">
                Connect
              </h4>
              <ul className="space-y-2.5 text-sm text-white/60">
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <a
                    href="https://wa.me/8801720266825"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    WhatsApp Support
                  </a>
                </li>
                <li className="text-white/40">Chattogram, Bangladesh</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
            <p>© {new Date().getFullYear()} NIVANTO. All rights reserved.</p>
            <p>Built for enduring business trust.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
