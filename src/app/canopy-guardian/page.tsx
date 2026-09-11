'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { CUBBON_CORRIDORS } from '@/lib/cubbon-tree-inventory';
import { CUBBON_ZONES } from '@/lib/cubbon-species-data';

export default function CanopyGuardianPage() {
  const [filter, setFilter] = useState<'all' | 'high' | 'vulnerable' | 'intact'>('all');

  const filteredCorridors = CUBBON_CORRIDORS.filter((c) => {
    if (filter === 'high') return c.threatLevel === 'high';
    if (filter === 'vulnerable') return c.status === 'vulnerable';
    if (filter === 'intact') return c.status === 'intact';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FEFAE0] text-[#283618] pt-18">
      <Navigation />

      {/* Header Banner */}
      <section className="bg-[#283618] text-[#FEFAE0] px-4 sm:px-6 lg:px-8 py-12 bg-nature-grid-dark border-b border-[#FEFAE0]/15">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#DDA15E] mb-2">
            <span>REAL-TIME CANOPY INTEGRITY MONITORING</span>
            <span>&bull;</span>
            <span>CUBBON PARK SENSORS</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#FEFAE0]">
            Canopy Guardian Dashboard
          </h1>
          <p className="text-sm sm:text-base text-[#FEFAE0]/80 max-w-3xl mt-2 leading-relaxed font-sans">
            Continuous surveillance of arboreal connectivity, canopy health, and wildlife movement corridors. 
            Identifies branch degradation and construction threats before habitat severance occurs.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Core Vitals Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-[#606C38]/20 shadow-sm">
            <span className="text-[11px] font-mono text-[#283618]/60 uppercase tracking-wider block">
              Canopy Coverage
            </span>
            <div className="text-3xl font-serif font-bold text-[#606C38] mt-1">86%</div>
            <span className="text-[11px] text-[#283618]/70 block mt-0.5">Continuous park crown</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#DDA15E]/40 shadow-sm">
            <span className="text-[11px] font-mono text-[#283618]/60 uppercase tracking-wider block">
              Overall Health
            </span>
            <div className="text-3xl font-serif font-bold text-[#DDA15E] mt-1">92.4</div>
            <span className="text-[11px] text-[#283618]/70 block mt-0.5">Chlorophyll & vitality</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#BC6C25]/30 shadow-sm">
            <span className="text-[11px] font-mono text-[#283618]/60 uppercase tracking-wider block">
              Keystone Nodes
            </span>
            <div className="text-3xl font-serif font-bold text-[#BC6C25] mt-1">42</div>
            <span className="text-[11px] text-[#283618]/70 block mt-0.5">Centennial anchors</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#283618]/20 shadow-sm">
            <span className="text-[11px] font-mono text-[#283618]/60 uppercase tracking-wider block">
              High-Threat Links
            </span>
            <div className="text-3xl font-serif font-bold text-red-700 mt-1">2</div>
            <span className="text-[11px] text-[#283618]/70 block mt-0.5">Urgent mitigation needed</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#606C38]/20 shadow-sm col-span-2 md:col-span-1">
            <span className="text-[11px] font-mono text-[#283618]/60 uppercase tracking-wider block">
              Species Supported
            </span>
            <div className="text-3xl font-serif font-bold text-[#283618] mt-1">196</div>
            <span className="text-[11px] text-[#283618]/70 block mt-0.5">Documented flora</span>
          </div>
        </div>

        {/* Wildlife Corridors Surveillance Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#BC6C25] uppercase tracking-wider">
                Corridor Health
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#283618]">
                Active Wildlife Arboreal Arteries
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-[#606C38]/20 text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  filter === 'all' ? 'bg-[#283618] text-[#FEFAE0]' : 'text-[#283618]/70'
                }`}
              >
                All (4)
              </button>
              <button
                onClick={() => setFilter('high')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  filter === 'high' ? 'bg-[#BC6C25] text-white' : 'text-[#283618]/70'
                }`}
              >
                High Threat (2)
              </button>
              <button
                onClick={() => setFilter('intact')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  filter === 'intact' ? 'bg-[#606C38] text-white' : 'text-[#283618]/70'
                }`}
              >
                Intact (2)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCorridors.map((corr) => (
              <article
                key={corr.id}
                className="p-6 rounded-3xl bg-white border border-[#606C38]/20 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-[#283618]/60 uppercase">
                        Corridor #0{corr.id} &bull; {corr.species?.commonName}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-[#283618] mt-0.5">
                        {corr.name}
                      </h3>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                        corr.threatLevel === 'high'
                          ? 'bg-red-100 text-red-900 border border-red-300'
                          : corr.threatLevel === 'medium'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-green-100 text-green-900 border border-green-300'
                      }`}
                    >
                      {corr.threatLevel} Threat
                    </span>
                  </div>

                  <p className="text-xs text-[#283618]/80 leading-relaxed font-sans">
                    {corr.species?.description}
                  </p>

                  <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#FEFAE0] border border-[#606C38]/15 text-xs text-[#283618]">
                    <div>
                      <span className="text-[10px] font-mono text-[#283618]/50 block">Connectivity</span>
                      <span className="font-serif font-bold text-base text-[#606C38]">
                        {corr.connectivityScore}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#283618]/50 block">Length</span>
                      <span className="font-serif font-bold text-base text-[#283618]">
                        {corr.length} km
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#283618]/50 block">Frag. Risk</span>
                      <span className="font-serif font-bold text-base text-[#BC6C25]">
                        {corr.potentialFragmentation}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#606C38]/15 flex items-center justify-between">
                  <span className="text-xs font-mono text-[#283618]/70">
                    🌲 {corr.criticalTreeCount} Keystone Trees Anchor This Link
                  </span>
                  <Link
                    href={`/simulator?treeId=${corr.id === 1 ? 21 : 1}`}
                    className="px-3 py-1.5 rounded-lg bg-[#606C38] hover:bg-[#738244] text-[#FEFAE0] text-xs font-bold transition-colors"
                  >
                    Simulate &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Five Park Zones Resilience Table */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#606C38]/20 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono font-bold text-[#606C38] uppercase tracking-wider">
                Zone Breakdown
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#283618]">
                Canopy Integrity Across Cubbon Park
              </h3>
            </div>
            <span className="text-xs font-mono text-[#283618]/60">Audited March 2026</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="border-b border-[#606C38]/20 text-[11px] font-mono text-[#283618]/60 uppercase">
                <tr>
                  <th className="py-3 px-2">Park Zone</th>
                  <th className="py-3 px-2">Key Flora</th>
                  <th className="py-3 px-2">Canopy Density</th>
                  <th className="py-3 px-2">Primary Fauna Risk</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#606C38]/10 text-xs">
                {CUBBON_ZONES.map((z) => (
                  <tr key={z.id} className="hover:bg-[#FEFAE0]/50 transition-colors">
                    <td className="py-3.5 px-2 font-bold text-[#283618]">{z.name}</td>
                    <td className="py-3.5 px-2 text-[#283618]/80">Ficus, Rain Tree, Mahua</td>
                    <td className="py-3.5 px-2">
                      <span className="font-serif font-bold text-[#606C38]">88%</span>
                    </td>
                    <td className="py-3.5 px-2 text-[#BC6C25] font-medium">
                      {z.id === 'zone-bandstand'
                        ? 'Grey Slender Loris road crossing'
                        : z.id === 'zone-bamboo'
                        ? 'Understorey amphibian moisture'
                        : 'Pollinator gap severance'}
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <Link
                        href={`/map?zone=${z.id}`}
                        className="font-mono text-[#606C38] hover:underline font-bold"
                      >
                        Inspect &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
