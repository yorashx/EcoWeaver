'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Overview', href: '/' },
  { name: 'Eco Map', href: '/map' },
  { name: '196 Species', href: '/species' },
  { name: 'Habitat Simulator', href: '/simulator' },
  { name: "Nature's Domino", href: '/domino' },
  { name: 'Canopy Guardian', href: '/canopy-guardian' },
  { name: 'Reports', href: '/reports' },
  { name: 'Philosophy', href: '/about' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#283618]/92 backdrop-blur-md border-b border-[#FEFAE0]/15 text-[#FEFAE0] shadow-xl">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Park Badge */}
          <div className="flex items-center space-x-2.5">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#606C38] via-[#DDA15E] to-[#BC6C25] p-0.5 shadow-md group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#283618] rounded-[7px] flex items-center justify-center">
                  <span className="text-lg">🌿</span>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-serif text-lg font-bold tracking-tight text-[#FEFAE0]">
                    EcoWeaver
                  </span>
                  <span className="text-xs uppercase font-mono px-1.5 py-0.5 bg-[#606C38]/40 text-[#DDA15E] rounded border border-[#DDA15E]/30 font-semibold">
                    AI
                  </span>
                </div>
                <div className="hidden sm:block text-[9px] text-[#FEFAE0]/70 tracking-wide font-mono -mt-0.5">
                  Cubbon Park Multispecies Twin
                </div>
              </div>
            </Link>

            {/* Live Connectivity Indicator Pill */}
            <div className="hidden 2xl:flex items-center space-x-2 px-2 py-1 rounded-full bg-[#FEFAE0]/10 border border-[#FEFAE0]/15 text-xs text-[#FEFAE0]/90">
              <span className="w-2 h-2 rounded-full bg-[#DDA15E] animate-ping"></span>
              <span className="font-mono text-[11px] text-[#DDA15E]">86% Continuous Canopy</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 rounded-md text-xs font-medium tracking-wide transition-colors',
                    isActive
                      ? 'bg-[#606C38] text-[#FEFAE0] shadow-sm font-semibold border border-[#FEFAE0]/20'
                      : 'text-[#FEFAE0]/80 hover:text-[#FEFAE0] hover:bg-[#FEFAE0]/10'
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Action CTAs */}
          <div className="hidden xl:flex items-center ml-3 pl-3 border-l border-[#FEFAE0]/15">
            <Link
              href="/simulator"
              className="px-3.5 py-2 text-xs font-semibold rounded-md bg-[#DDA15E] hover:bg-[#e5b377] text-[#283618] shadow-md transition-colors flex items-center space-x-1.5"
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
              className="p-2 rounded-lg text-[#FEFAE0] hover:bg-[#FEFAE0]/10 focus:outline-none"
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
        <div id="mobile-navigation" className="xl:hidden bg-[#283618] border-b border-[#FEFAE0]/15 px-4 pt-3 pb-4 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'block px-3 py-2 rounded-md text-sm font-medium',
                pathname === item.href
                  ? 'bg-[#606C38] text-[#FEFAE0]'
                  : 'text-[#FEFAE0]/80 hover:bg-[#FEFAE0]/10 hover:text-[#FEFAE0]'
              )}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-3 mt-2 border-t border-[#FEFAE0]/15 flex flex-col space-y-2">
            <Link
              href="/simulator"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-2.5 rounded-md bg-[#DDA15E] text-[#283618] font-bold text-sm"
            >
              Run Habitat Simulation
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
