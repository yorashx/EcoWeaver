'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { CUBBON_ZONES } from '@/lib/cubbon-species-data';

export default function Home() {
  const [connectivity, setConnectivity] = useState(0);
  const [speciesCount, setSpeciesCount] = useState(0);
  const [treeCount, setTreeCount] = useState(0);
  const [corridorsActive, setCorridorsActive] = useState(0);

  // Animate counters on mount
  useEffect(() => {
    const animateValue = (setter: (v: number) => void, end: number, duration: number) => {
      let start = 0;
      const stepTime = 20;
      const totalSteps = duration / stepTime;
      const increment = end / totalSteps;
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setter(end);
          clearInterval(timer);
        } else {
          setter(Math.floor(start));
        }
      }, stepTime);
    };

    animateValue(setConnectivity, 86, 1600);
    animateValue(setSpeciesCount, 196, 1800);
    animateValue(setTreeCount, 260, 2000);
    animateValue(setCorridorsActive, 4, 1200);
  }, []);

  return (
    <div className="min-h-screen bg-[#FEFAE0] text-[#283618] selection:bg-[#DDA15E] selection:text-[#283618]">
      <Navigation />

      {/* Hero Section inspired by Elephant Academy Multispecies Hackathon */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-[#283618] text-[#FEFAE0] overflow-hidden bg-nature-grid-dark border-b border-[#FEFAE0]/15">
        {/* Floating Nature Micro-tokens */}
        <div className="absolute top-24 left-[12%] text-2xl animate-bounce duration-1000 select-none opacity-80" style={{ animationDuration: '4s' }}>
          🦋
        </div>
        <div className="absolute top-36 right-[18%] text-3xl select-none opacity-80 animate-pulse">
          🦎
        </div>
        <div className="absolute bottom-20 left-[22%] text-2xl select-none opacity-70">
          🐿️
        </div>
        <div className="absolute bottom-28 right-[10%] text-3xl select-none opacity-80">
          🦉
        </div>
        <div className="absolute top-44 left-[48%] text-xl select-none opacity-60">
          🌸
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#FEFAE0]/10 border border-[#FEFAE0]/20 text-xs font-mono text-[#DDA15E] mb-8">
            <span>📍 Cubbon Park, Bengaluru</span>
            <span className="text-[#FEFAE0]/40">•</span>
            <span>Multispecies Ecological Twin</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#FEFAE0] leading-[1.08]">
                Technology for <br />
                <span className="italic text-[#DDA15E] font-normal">all species.</span>
              </h1>

              <p className="text-lg sm:text-xl text-[#FEFAE0]/85 font-sans leading-relaxed max-w-2xl">
                A planetary stewardship platform modeling the living canopy of Cubbon Park. 
                Understand how urban infrastructure, tree removals, and development ripple through non-human 
                habitats <strong className="text-[#FEFAE0] font-semibold">before decisions become irreversible.</strong>
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/map"
                  className="px-6 py-3.5 bg-[#606C38] hover:bg-[#738244] text-[#FEFAE0] font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <span>🗺️</span>
                  <span>Explore Cubbon Eco-Map</span>
                </Link>
                <Link
                  href="/simulator"
                  className="px-6 py-3.5 bg-[#DDA15E] hover:bg-[#e5b377] text-[#283618] font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <span>🔬</span>
                  <span>Simulate Habitat Changes</span>
                </Link>
                <Link
                  href="/species"
                  className="px-5 py-3.5 bg-white/10 hover:bg-white/15 text-[#FEFAE0] font-medium rounded-xl border border-[#FEFAE0]/20 transition-all flex items-center space-x-2"
                >
                  <span>🌿</span>
                  <span>196 Native Species</span>
                </Link>
              </div>
            </div>

            {/* Living Canopy Stats Card */}
            <div className="lg:col-span-5">
              <div className="glass-panel-forest rounded-3xl p-8 border border-[#FEFAE0]/20 shadow-2xl relative">
                <div className="flex items-center justify-between pb-6 border-b border-[#FEFAE0]/15">
                  <div>
                    <span className="text-xs uppercase font-mono text-[#DDA15E] tracking-wider">Park Vital Signs</span>
                    <h3 className="font-serif text-2xl font-bold text-[#FEFAE0]">Cubbon Urban Forest</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#606C38] text-[#FEFAE0] font-mono text-xs font-bold">
                    ACTIVE SENSING
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6 py-6">
                  <div>
                    <div className="font-serif text-5xl font-bold text-[#DDA15E]">{connectivity}%</div>
                    <div className="text-xs font-mono uppercase text-[#FEFAE0]/70 mt-1">Canopy Connectivity</div>
                    <div className="text-[11px] text-[#FEFAE0]/50 mt-0.5">Continuous branch overlap</div>
                  </div>

                  <div>
                    <div className="font-serif text-5xl font-bold text-[#FEFAE0]">{speciesCount}</div>
                    <div className="text-xs font-mono uppercase text-[#FEFAE0]/70 mt-1">Tree Species</div>
                    <div className="text-[11px] text-[#FEFAE0]/50 mt-0.5">From Acacia to Ziziphus</div>
                  </div>

                  <div>
                    <div className="font-serif text-5xl font-bold text-[#606C38]">{treeCount}+</div>
                    <div className="text-xs font-mono uppercase text-[#FEFAE0]/70 mt-1">Geo-Tagged Trees</div>
                    <div className="text-[11px] text-[#FEFAE0]/50 mt-0.5">Across 5 landmark zones</div>
                  </div>

                  <div>
                    <div className="font-serif text-5xl font-bold text-[#BC6C25]">{corridorsActive}</div>
                    <div className="text-xs font-mono uppercase text-[#FEFAE0]/70 mt-1">Wildlife Corridors</div>
                    <div className="text-[11px] text-[#FEFAE0]/50 mt-0.5">Loris, Squirrel & Birds</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#606C38]/30 border border-[#606C38]/40 flex items-center space-x-3 text-xs text-[#FEFAE0]">
                  <span className="text-xl">🐾</span>
                  <p>
                    <strong className="text-[#DDA15E]">Grey Slender Loris Corridor:</strong> High sensitivity detected along the Queen&apos;s Promenade arterial link.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Multispecies Manifesto Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FEFAE0] bg-nature-grid">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#BC6C25]">
              Multispecies Urbanism
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#283618] leading-tight">
              A city is not just built for humans. <br />
              <span className="italic text-[#606C38] font-normal">It is co-inhabited by millions of lives.</span>
            </h2>
            <p className="text-[#283618]/80 text-lg max-w-2xl mx-auto leading-relaxed">
              When a mature 74-year-old Rain Tree is removed for a parking expansion or roadway, humans see an obstruction gone. 
              The Grey Slender Loris loses a generational highway. Spotted Owlets lose a roost. The mycorrhizal network severs.
            </p>
          </div>

          {/* 4 Pillars of EcoWeaver */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-[#606C38]/20 shadow-md hover:shadow-xl transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#606C38]/20 flex items-center justify-center text-2xl text-[#606C38]">
                🌿
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#283618]">196 Species Botanical Registry</h3>
              <p className="text-[#283618]/80 text-sm leading-relaxed">
                Full taxonomy and ecological profiling of all 196 tree species documented in Cubbon Park. 
                Categorized by canopy architecture, flowering seasonality, and keystone support for urban fauna.
              </p>
              <Link href="/species" className="inline-block text-xs font-mono font-bold text-[#606C38] hover:text-[#283618] tracking-wider uppercase">
                Browse Species Catalog &rarr;
              </Link>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#DDA15E]/40 shadow-md hover:shadow-xl transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#DDA15E]/30 flex items-center justify-center text-2xl text-[#BC6C25]">
                🕸️
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#283618]">Spatial Canopy Graph Engine</h3>
              <p className="text-[#283618]/80 text-sm leading-relaxed">
                Graph-theory network modeling measuring continuous branch overlaps, giant components, and keystone nodes. 
                Detects invisible fragmentation before it becomes permanent.
              </p>
              <Link href="/map" className="inline-block text-xs font-mono font-bold text-[#BC6C25] hover:text-[#283618] tracking-wider uppercase">
                Inspect Interactive Map &rarr;
              </Link>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#BC6C25]/30 shadow-md hover:shadow-xl transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#BC6C25]/20 flex items-center justify-center text-2xl text-[#BC6C25]">
                ⚡
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#283618]">Dynamic In-Silico Simulator</h3>
              <p className="text-[#283618]/80 text-sm leading-relaxed">
                Simulate removing any tree, planting compensatory native saplings, or installing aerial rope bridges. 
                Real-time recalculation of connectivity, carbon sequestration, and microclimate buffering.
              </p>
              <Link href="/simulator" className="inline-block text-xs font-mono font-bold text-[#BC6C25] hover:text-[#283618] tracking-wider uppercase">
                Open Simulator Workbench &rarr;
              </Link>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#283618]/20 shadow-md hover:shadow-xl transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#283618]/15 flex items-center justify-center text-2xl text-[#283618]">
                📜
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#283618]">Nature&apos;s Domino & Report Cards</h3>
              <p className="text-[#283618]/80 text-sm leading-relaxed">
                Visual cascade of secondary ecological consequences, paired with printable environmental impact reports 
                and algorithmic mitigation blueprints for urban planners.
              </p>
              <Link href="/domino" className="inline-block text-xs font-mono font-bold text-[#283618] hover:text-[#606C38] tracking-wider uppercase">
                Explore Cascade & Reports &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cubbon Park Zones Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#283618] text-[#FEFAE0]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-[#DDA15E] tracking-wider">
                Geographical Scope
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FEFAE0] mt-1">
                Five Core Zones of Cubbon Park
              </h2>
            </div>
            <Link
              href="/map"
              className="mt-4 md:mt-0 text-sm font-mono text-[#DDA15E] hover:underline flex items-center space-x-1"
            >
              <span>View all zones on map</span>
              <span>&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {CUBBON_ZONES.map((zone, idx) => (
              <Link
                key={zone.id}
                href={`/map?zone=${zone.id}`}
                className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-[#FEFAE0]/15 hover:border-[#DDA15E] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="text-xs font-mono text-[#DDA15E] font-bold mb-2">ZONE 0{idx + 1}</div>
                  <h4 className="font-serif text-lg font-bold text-[#FEFAE0] group-hover:text-[#DDA15E] transition-colors mb-2">
                    {zone.name}
                  </h4>
                  <p className="text-xs text-[#FEFAE0]/70 line-clamp-3 leading-relaxed">
                    {zone.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#FEFAE0]/10 text-[11px] font-mono text-[#DDA15E]/90 flex items-center justify-between">
                  <span>Explore zone</span>
                  <span>&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-14 px-4 sm:px-6 lg:px-8 bg-[#1b2510] text-[#FEFAE0]/80 border-t border-[#FEFAE0]/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono">
          <div className="flex items-center space-x-3">
            <span className="text-xl">🌿</span>
            <div>
              <span className="font-serif font-bold text-sm text-[#FEFAE0]">EcoWeaver AI</span>
              <span className="block text-[11px] text-[#FEFAE0]/60">Inspired by Elephant Academy Multispecies Community</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-[#FEFAE0]/70">
            <Link href="/map" className="hover:text-[#DDA15E]">Eco Map</Link>
            <Link href="/species" className="hover:text-[#DDA15E]">196 Species</Link>
            <Link href="/simulator" className="hover:text-[#DDA15E]">Simulator</Link>
            <Link href="/domino" className="hover:text-[#DDA15E]">Domino Effect</Link>
            <Link href="/reports" className="hover:text-[#DDA15E]">Impact Reports</Link>
          </div>
          <div className="text-[#FEFAE0]/50">
            &copy; 2026 Cubbon Park Ecological Stewardship Project.
          </div>
        </div>
      </footer>
    </div>
  );
}
