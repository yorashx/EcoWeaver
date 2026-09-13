'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Overview', href: '/' },
  { name: 'Map & Simulator', href: '/map' },
  { name: 'Bioacoustic AI', href: '/bioacoustics' },
  { name: '196 Species', href: '/species' },
  { name: 'Canopy Guardian', href: '/canopy-guardian' },
  { name: 'Reports', href: '/reports' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#01295F]/95 backdrop-blur-md border-b border-[#437F97]/25 text-[#F4F7FA] shadow-xl">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Park Badge */}
          <div className="flex items-center space-x-2.5">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#849324] via-[#437F97] to-[#FFB30F] p-0.5 shadow-md group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#01295F] rounded-[7px] flex items-center justify-center">
                  <span className="text-lg">🌿</span>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-serif text-lg font-bold tracking-tight text-white">
                    EcoWeaver
                  </span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-[#849324] text-white rounded font-bold">
                    AI
                  </span>
                </div>
                <div className="hidden sm:block text-[9px] text-[#437F97] tracking-wide font-mono -mt-0.5 font-medium">
                  Bengaluru Multispecies Twin &bull; IISc &amp; Cubbon
                </div>
              </div>
            </Link>

            {/* Live Connectivity Indicator Pill */}
            <div className="hidden 2xl:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-white/90">
              <span className="w-2 h-2 rounded-full bg-[#FFB30F] animate-ping"></span>
              <span className="font-mono text-[11px] text-[#FFB30F] font-semibold">IISc Sanctuary &bull; 94% Intact</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 rounded-lg text-xs font-medium tracking-wide transition-all',
                    isActive
                      ? 'bg-[#849324] text-white shadow-md font-bold'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Action CTAs */}
          <div className="hidden xl:flex items-center ml-3 pl-3 border-l border-white/15">
            <Link
              href="/map?mode=simulator"
              className="px-4 py-2 text-xs font-bold rounded-lg bg-[#FFB30F] hover:bg-[#ffbf33] text-[#01295F] shadow-md hover:scale-105 transition-all flex items-center space-x-1.5"
            >
              <span>🔬</span>
              <span>Test Simulation</span>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex xl:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              className="p-2 rounded-lg text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle navigation"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="xl:hidden bg-[#01295F] border-b border-white/15 px-4 pt-3 pb-4 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'block px-3 py-2 rounded-md text-sm font-medium',
                pathname === item.href
                  ? 'bg-[#849324] text-white'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              )}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-3 mt-2 border-t border-white/15 flex flex-col space-y-2">
            <Link
              href="/map?mode=simulator"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-2.5 rounded-md bg-[#FFB30F] text-[#01295F] font-bold text-sm"
            >
              Run Habitat Simulation
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
