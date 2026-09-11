'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FEFAE0] text-[#283618] pt-18 selection:bg-[#DDA15E] selection:text-[#283618]">
      <Navigation />

      {/* Hero Banner */}
      <section className="bg-[#283618] text-[#FEFAE0] px-4 sm:px-6 lg:px-8 py-20 bg-nature-grid-dark border-b border-[#FEFAE0]/15">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FEFAE0]/10 border border-[#FEFAE0]/20 text-xs font-mono text-[#DDA15E]">
            <span>PLANETARY STEWARDSHIP &bull; MULTISPECIES URBANISM</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#FEFAE0] leading-tight">
            Philosophy of <br />
            <span className="italic text-[#DDA15E] font-normal">Ecological Coexistence</span>
          </h1>
          <p className="text-base sm:text-xl text-[#FEFAE0]/85 font-sans leading-relaxed max-w-2xl mx-auto">
            Inspired by the principles of the <em>Elephant Academy Multispecies Community</em>. 
            EcoWeaver AI shifts urban planning from human-centric extraction to non-human stewardship.
          </p>
        </div>
      </section>

      {/* Main Narrative */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Core Principles */}
        <section className="space-y-6">
          <span className="text-xs font-mono font-bold text-[#BC6C25] uppercase tracking-widest block">
            01 &bull; Non-Human Agency
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#283618]">
            Centering the Needs of Non-Human Lives
          </h2>
          <p className="text-sm sm:text-base text-[#283618]/85 leading-relaxed font-sans">
            In traditional municipal databases, a tree is recorded merely as an asset number, a timber volume, 
            or an obstacle to road expansion. EcoWeaver AI reframes each tree as a sovereign node in an ancient, 
            living ecosystem. A 100-year-old Banyan or Rain Tree in Cubbon Park is simultaneously a home for 
            over 40 bird species, a foraging bridge for the nocturnal Grey Slender Loris, a mycelial nutrient bank, 
            and a microclimate air conditioning system for human city-dwellers.
          </p>
        </section>

        {/* Why Cubbon Park? */}
        <section className="p-8 sm:p-10 rounded-3xl bg-[#283618] text-[#FEFAE0] space-y-6 shadow-xl border border-[#FEFAE0]/15">
          <span className="text-xs font-mono font-bold text-[#DDA15E] uppercase tracking-widest block">
            02 &bull; The Living Lab
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#FEFAE0]">
            Cubbon Park: Bengaluru&apos;s Living Heart
          </h2>
          <p className="text-sm sm:text-base text-[#FEFAE0]/85 leading-relaxed font-sans">
            Spanning approximately 300 acres in the dense epicenter of Bengaluru, Cubbon Park is one of the world&apos;s 
            most remarkable urban refugia. It shelters over <strong>196 verified tree species</strong>, from native 
            dry-deciduous keystones like <em>Aegle marmelos</em> and <em>Butea monosperma</em> to centuries-old 
            heritage plantings like <em>Samanea saman</em> and <em>Agathis robusta</em>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs font-mono">
            <div>
              <span className="text-[#DDA15E] font-bold text-xl font-serif block">196</span>
              <span className="text-[#FEFAE0]/70">Documented Tree Species</span>
            </div>
            <div>
              <span className="text-[#DDA15E] font-bold text-xl font-serif block">~300 Acres</span>
              <span className="text-[#FEFAE0]/70">Urban Forest Sanctuary</span>
            </div>
            <div>
              <span className="text-[#DDA15E] font-bold text-xl font-serif block">Loris Haven</span>
              <span className="text-[#FEFAE0]/70">Arboreal Primate Corridor</span>
            </div>
          </div>
        </section>

        {/* Scientific Methodology */}
        <section className="space-y-6">
          <span className="text-xs font-mono font-bold text-[#606C38] uppercase tracking-widest block">
            03 &bull; The Science
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#283618]">
            Graph-Theory Network Modeling & Spatial Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-6 rounded-2xl bg-white border border-[#606C38]/20 shadow-sm space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#283618]">Haversine Canopy Overlap</h3>
              <p className="text-xs text-[#283618]/80 leading-relaxed font-sans">
                We compute the branch reach (radius in meters) of adjacent crowns. If distance exceeds branch leap thresholds, 
                an edge is broken in the connectivity graph.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#606C38]/20 shadow-sm space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#283618]">Betweenness Centrality</h3>
              <p className="text-xs text-[#283618]/80 leading-relaxed font-sans">
                Keystone trees whose removal fractures the network into isolated components are flagged as Critical Nodes, 
                protecting essential movement pathways.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#606C38]/20 shadow-sm space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#283618]">Microclimate Shading Area</h3>
              <p className="text-xs text-[#283618]/80 leading-relaxed font-sans">
                Every square meter of mature crown buffers ground surface temperatures by up to 3.5°C, preventing dangerous 
                urban heat island thermal pockets.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#606C38]/20 shadow-sm space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#283618]">Artificial Rope Bridges</h3>
              <p className="text-xs text-[#283618]/80 leading-relaxed font-sans">
                When gaps cannot be immediately filled by slow-growing saplings, our engine designs aerial rope crossings 
                to maintain safe arboreal wildlife transit.
              </p>
            </div>
          </div>
        </section>

        {/* The Color Palette */}
        <section className="space-y-6">
          <span className="text-xs font-mono font-bold text-[#BC6C25] uppercase tracking-widest block">
            04 &bull; Visual Identity
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#283618]">
            An Organic Earth-Tones Palette
          </h2>
          <div className="grid grid-cols-5 gap-3">
            {[
              { hex: '#606C38', name: 'Olive Moss', role: 'Canopy Health & Flourishing' },
              { hex: '#283618', name: 'Deep Forest', role: 'Nocturnal Sanctuary & Bark' },
              { hex: '#FEFAE0', name: 'Warm Cream', role: 'Parchment & Sunlight Canvas' },
              { hex: '#DDA15E', name: 'Warm Ochre', role: 'Wildlife Corridors & Amber' },
              { hex: '#BC6C25', name: 'Terracotta', role: 'Critical Keystones & Earth' },
            ].map((c) => (
              <div key={c.hex} className="rounded-2xl p-3 border border-black/10 shadow-sm" style={{ backgroundColor: c.hex }}>
                <div
                  className="text-[10px] font-mono font-bold"
                  style={{ color: c.hex === '#FEFAE0' ? '#283618' : '#FEFAE0' }}
                >
                  {c.hex}
                </div>
                <div
                  className="font-serif font-bold text-xs mt-1"
                  style={{ color: c.hex === '#FEFAE0' ? '#283618' : '#FEFAE0' }}
                >
                  {c.name}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="p-8 rounded-3xl bg-[#606C38] text-[#FEFAE0] text-center space-y-4 shadow-xl">
          <h2 className="font-serif text-3xl font-bold">Experience the Digital Twin</h2>
          <p className="text-sm max-w-xl mx-auto text-[#FEFAE0]/90">
            Interact with the living map, explore all 196 tree species, or simulate habitat interventions now.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/map"
              className="px-6 py-3 rounded-xl bg-[#FEFAE0] text-[#283618] font-bold text-xs shadow-md hover:bg-white transition-all"
            >
              Explore Cubbon Map &rarr;
            </Link>
            <Link
              href="/simulator"
              className="px-6 py-3 rounded-xl bg-[#DDA15E] text-[#283618] font-bold text-xs shadow-md hover:bg-[#e5b377] transition-all"
            >
              Launch Simulator &rarr;
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
