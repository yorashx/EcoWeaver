'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F4F7FA] text-[#01295F] pt-18 selection:bg-[#437F97] selection:text-white">
      <Navigation />

      {/* Hero Banner */}
      <section className="bg-[#01295F] text-white px-4 sm:px-6 lg:px-8 py-20 border-b border-[#437F97]/30">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono text-[#FFB30F]">
            <span>PLANETARY STEWARDSHIP &bull; MULTISPECIES URBANISM</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
            Philosophy of <br />
            <span className="italic text-[#FFB30F] font-normal">Ecological Coexistence</span>
          </h1>
          <p className="text-base sm:text-xl text-white/85 font-sans leading-relaxed max-w-2xl mx-auto">
            Inspired by the principles of the <em>Elephant Academy Multispecies Community</em>.{' '}
            EcoWeaver AI shifts urban planning from human-centric extraction to non-human stewardship.
          </p>
        </div>
      </section>

      {/* Main Narrative */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* Core Principles */}
        <section className="space-y-6">
          <span className="text-xs font-mono font-bold text-[#FFB30F] uppercase tracking-widest block">
            01 &bull; Non-Human Agency
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#01295F]">
            Centering the Needs of Non-Human Lives
          </h2>
          <p className="text-sm sm:text-base text-[#01295F]/80 leading-relaxed font-sans">
            In traditional municipal databases, a tree is recorded merely as an asset number, a timber volume,
            or an obstacle to road expansion. EcoWeaver AI reframes each tree as a sovereign node in an ancient,
            living ecosystem. A 100-year-old Banyan or Rain Tree in Cubbon Park is simultaneously a home for
            over 40 bird species, a foraging bridge for the nocturnal Grey Slender Loris, a mycelial nutrient bank,
            and a microclimate air conditioning system for human city-dwellers.
          </p>
        </section>

        {/* Why Cubbon Park? */}
        <section className="p-8 sm:p-10 rounded-3xl bg-[#01295F] text-white space-y-6 shadow-xl border border-[#437F97]/30">
          <span className="text-xs font-mono font-bold text-[#FFB30F] uppercase tracking-widest block">
            02 &bull; The Living Lab
          </span>
          <h2 className="font-serif text-3xl font-bold text-white">
            Cubbon Park &amp; IISc: Bengaluru&apos;s Living Heart
          </h2>
          <p className="text-sm sm:text-base text-white/85 leading-relaxed font-sans">
            Spanning approximately 300 acres in the dense epicenter of Bengaluru, Cubbon Park is one of the world&apos;s
            most remarkable urban refugia. It shelters over <strong>196 verified tree species</strong>, from native
            dry-deciduous keystones like <em>Aegle marmelos</em> and <em>Butea monosperma</em> to centuries-old
            heritage plantings like <em>Samanea saman</em> and <em>Agathis robusta</em>. IISc, just 6 km away near
            Yeshwantpur, hosts the last surviving urban Grey Slender Loris population in Bengaluru.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs font-mono">
            <div>
              <span className="text-[#FFB30F] font-bold text-xl font-serif block">196</span>
              <span className="text-white/70">Documented Tree Species</span>
            </div>
            <div>
              <span className="text-[#FFB30F] font-bold text-xl font-serif block">~300 Acres</span>
              <span className="text-white/70">Urban Forest Sanctuary</span>
            </div>
            <div>
              <span className="text-[#849324] font-bold text-xl font-serif block">Last Urban Loris</span>
              <span className="text-white/70">Exclusive IISc Sanctuary</span>
            </div>
          </div>
        </section>

        {/* Scientific Methodology */}
        <section className="space-y-6">
          <span className="text-xs font-mono font-bold text-[#849324] uppercase tracking-widest block">
            03 &bull; The Science
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#01295F]">
            Graph-Theory Network Modeling &amp; Spatial Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-6 rounded-2xl bg-white border border-[#437F97]/20 shadow-sm space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#01295F]">Haversine Canopy Overlap</h3>
              <p className="text-xs text-[#01295F]/75 leading-relaxed font-sans">
                We compute the branch reach (radius in meters) of adjacent crowns. If distance exceeds branch leap thresholds,
                an edge is broken in the connectivity graph.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#437F97]/20 shadow-sm space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#01295F]">Betweenness Centrality</h3>
              <p className="text-xs text-[#01295F]/75 leading-relaxed font-sans">
                Keystone trees whose removal fractures the network into isolated components are flagged as Critical Nodes,
                protecting essential movement pathways.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#437F97]/20 shadow-sm space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#01295F]">Microclimate Shading Area</h3>
              <p className="text-xs text-[#01295F]/75 leading-relaxed font-sans">
                Every square meter of mature crown buffers ground surface temperatures by up to 3.5°C, preventing dangerous
                urban heat island thermal pockets.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#437F97]/20 shadow-sm space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#01295F]">Artificial Rope Bridges</h3>
              <p className="text-xs text-[#01295F]/75 leading-relaxed font-sans">
                When gaps cannot be immediately filled by slow-growing saplings, our engine designs aerial rope crossings
                to maintain safe arboreal wildlife transit.
              </p>
            </div>
          </div>
        </section>

        {/* The Color Palette */}
        <section className="space-y-6">
          <span className="text-xs font-mono font-bold text-[#FFB30F] uppercase tracking-widest block">
            04 &bull; Visual Identity
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#01295F]">
            A Modern Conservation Palette
          </h2>
          <div className="grid grid-cols-5 gap-3">
            {[
              { hex: '#01295F', name: 'Imperial Navy', role: 'Depth & Data Authority' },
              { hex: '#437F97', name: 'Steel Blue', role: 'Connectivity & Flow' },
              { hex: '#849324', name: 'Olive Green', role: 'Canopy Health & Life' },
              { hex: '#FFB30F', name: 'Honey Amber', role: 'Wildlife Corridors & Alert' },
              { hex: '#FD151B', name: 'Vivid Crimson', role: 'Critical Risk & Keystone' },
            ].map((c) => (
              <div key={c.hex} className="rounded-2xl p-3 border border-black/10 shadow-sm" style={{ backgroundColor: c.hex }}>
                <div
                  className="text-[10px] font-mono font-bold"
                  style={{ color: c.hex === '#FFB30F' ? '#01295F' : '#FFFFFF' }}
                >
                  {c.hex}
                </div>
                <div
                  className="font-serif font-bold text-xs mt-1"
                  style={{ color: c.hex === '#FFB30F' ? '#01295F' : '#FFFFFF' }}
                >
                  {c.name}
                </div>
                <div
                  className="text-[9px] mt-0.5 opacity-80"
                  style={{ color: c.hex === '#FFB30F' ? '#01295F' : '#FFFFFF' }}
                >
                  {c.role}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="p-8 rounded-3xl bg-gradient-to-br from-[#01295F] to-[#0d3875] text-white text-center space-y-4 shadow-xl border border-[#437F97]/30">
          <h2 className="font-serif text-3xl font-bold">Experience the Digital Twin</h2>
          <p className="text-sm max-w-xl mx-auto text-white/90">
            Interact with the living map, explore all 196 tree species, or simulate habitat interventions now.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/map"
              className="px-6 py-3 rounded-xl bg-[#437F97] hover:bg-[#5896b0] text-white font-bold text-xs shadow-md transition-all hover:scale-105"
            >
              Explore Eco Map &rarr;
            </Link>
            <Link
              href="/map?mode=simulator"
              className="px-6 py-3 rounded-xl bg-[#FFB30F] hover:bg-[#ffbf33] text-[#01295F] font-bold text-xs shadow-md transition-all hover:scale-105"
            >
              Launch Simulator &rarr;
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
