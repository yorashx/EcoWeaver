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
    <div className="min-h-screen bg-[#F4F7FA] text-[#01295F] pt-18">
      <Navigation />

      {/* Header Banner */}
      <section className="bg-[#01295F] text-white px-4 sm:px-6 lg:px-8 py-12 border-b border-[#437F97]/30">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#FFB30F] mb-2">
            <span>REAL-TIME CANOPY INTEGRITY MONITORING</span>
            <span>&bull;</span>
            <span>CUBBON PARK SENSORS</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Canopy Guardian Dashboard
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-3xl mt-2 leading-relaxed font-sans">
            Continuous surveillance of arboreal connectivity, canopy health, and wildlife movement corridors.
            Identifies branch degradation and construction threats before habitat severance occurs.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* Core Vitals Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-[#437F97]/20 shadow-sm">
            <span className="text-[11px] font-mono text-[#01295F]/60 uppercase tracking-wider block">Canopy Coverage</span>
            <div className="text-3xl font-serif font-bold text-[#849324] mt-1">86%</div>
            <span className="text-[11px] text-[#01295F]/70 block mt-0.5">Continuous park crown</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#FFB30F]/40 shadow-sm">
            <span className="text-[11px] font-mono text-[#01295F]/60 uppercase tracking-wider block">Overall Health</span>
            <div className="text-3xl font-serif font-bold text-[#FFB30F] mt-1">92.4</div>
            <span className="text-[11px] text-[#01295F]/70 block mt-0.5">Chlorophyll &amp; vitality</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#FD151B]/30 shadow-sm">
            <span className="text-[11px] font-mono text-[#01295F]/60 uppercase tracking-wider block">Keystone Nodes</span>
            <div className="text-3xl font-serif font-bold text-[#FD151B] mt-1">42</div>
            <span className="text-[11px] text-[#01295F]/70 block mt-0.5">Centennial anchors</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#437F97]/20 shadow-sm">
            <span className="text-[11px] font-mono text-[#01295F]/60 uppercase tracking-wider block">High-Threat Links</span>
            <div className="text-3xl font-serif font-bold text-[#FD151B] mt-1">2</div>
            <span className="text-[11px] text-[#01295F]/70 block mt-0.5">Urgent mitigation needed</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#437F97]/20 shadow-sm col-span-2 md:col-span-1">
            <span className="text-[11px] font-mono text-[#01295F]/60 uppercase tracking-wider block">Species Supported</span>
            <div className="text-3xl font-serif font-bold text-[#01295F] mt-1">196</div>
            <span className="text-[11px] text-[#01295F]/70 block mt-0.5">Documented flora</span>
          </div>
        </div>

        {/* Wildlife Corridors Surveillance Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#FFB30F] uppercase tracking-wider">Corridor Health</span>
              <h2 className="font-serif text-2xl font-bold text-[#01295F]">Active Wildlife Arboreal Arteries</h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-[#437F97]/20 text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  filter === 'all' ? 'bg-[#01295F] text-white' : 'text-[#01295F]/70 hover:text-[#01295F]'
                }`}
              >
                All (4)
              </button>
              <button
                onClick={() => setFilter('high')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  filter === 'high' ? 'bg-[#FD151B] text-white' : 'text-[#01295F]/70 hover:text-[#01295F]'
                }`}
              >
                High Threat (2)
              </button>
              <button
                onClick={() => setFilter('intact')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  filter === 'intact' ? 'bg-[#849324] text-white' : 'text-[#01295F]/70 hover:text-[#01295F]'
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
                className="p-6 rounded-3xl bg-white border border-[#437F97]/20 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-[#01295F]/50 uppercase">
                        Corridor #0{corr.id} &bull; {corr.species?.commonName}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-[#01295F] mt-0.5">{corr.name}</h3>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                        corr.threatLevel === 'high'
                          ? 'bg-[#FD151B]/10 text-[#FD151B] border border-[#FD151B]/30'
                          : corr.threatLevel === 'medium'
                          ? 'bg-[#FFB30F]/15 text-[#01295F] border border-[#FFB30F]/40'
                          : 'bg-[#849324]/10 text-[#849324] border border-[#849324]/30'
                      }`}
                    >
                      {corr.threatLevel} Threat
                    </span>
                  </div>

                  <p className="text-xs text-[#01295F]/75 leading-relaxed font-sans">{corr.species?.description}</p>

                  <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#F4F7FA] border border-[#437F97]/15 text-xs text-[#01295F]">
                    <div>
                      <span className="text-[10px] font-mono text-[#01295F]/50 block">Connectivity</span>
                      <span className="font-serif font-bold text-base text-[#849324]">{corr.connectivityScore}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#01295F]/50 block">Length</span>
                      <span className="font-serif font-bold text-base text-[#01295F]">{corr.length} km</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#01295F]/50 block">Frag. Risk</span>
                      <span className="font-serif font-bold text-base text-[#FD151B]">{corr.potentialFragmentation}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#437F97]/15 flex items-center justify-between">
                  <span className="text-xs font-mono text-[#01295F]/60">
                    🌲 {corr.criticalTreeCount} Keystone Trees Anchor This Link
                  </span>
                  <Link
                    href={`/map?mode=simulator&treeId=${corr.id === 1 ? 21 : 1}`}
                    className="px-3 py-1.5 rounded-lg bg-[#849324] hover:bg-[#9db02e] text-white text-xs font-bold transition-colors"
                  >
                    Simulate &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Five Park Zones Resilience Table */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#437F97]/20 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono font-bold text-[#849324] uppercase tracking-wider">Zone Breakdown</span>
              <h3 className="font-serif text-2xl font-bold text-[#01295F]">Canopy Integrity Across Cubbon Park</h3>
            </div>
            <span className="text-xs font-mono text-[#01295F]/50">Audited March 2026</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="border-b border-[#437F97]/20 text-[11px] font-mono text-[#01295F]/50 uppercase">
                <tr>
                  <th className="py-3 px-2">Park Zone</th>
                  <th className="py-3 px-2">Key Flora</th>
                  <th className="py-3 px-2">Canopy Density</th>
                  <th className="py-3 px-2">Primary Fauna Risk</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#437F97]/10 text-xs">
                {CUBBON_ZONES.map((z) => (
                  <tr key={z.id} className="hover:bg-[#F4F7FA] transition-colors">
                    <td className="py-3.5 px-2 font-bold text-[#01295F]">{z.name}</td>
                    <td className="py-3.5 px-2 text-[#01295F]/70">Ficus, Rain Tree, Mahua</td>
                    <td className="py-3.5 px-2">
                      <span className="font-serif font-bold text-[#849324]">88%</span>
                    </td>
                    <td className="py-3.5 px-2 text-[#FD151B]/80 font-medium">
                      {z.id === 'zone-bandstand'
                        ? 'Loris road crossing'
                        : z.id === 'zone-bamboo'
                        ? 'Understorey amphibian moisture'
                        : 'Pollinator gap severance'}
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <Link href={`/map?zone=${z.id}`} className="font-mono text-[#437F97] hover:text-[#01295F] font-bold transition-colors">
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
