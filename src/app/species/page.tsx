'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { CUBBON_PARK_SPECIES, CubbonTreeSpecies } from '@/lib/cubbon-species-data';

export default function SpeciesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [nativeOnly, setNativeOnly] = useState(false);

  const families = useMemo(() => {
    return Array.from(new Set(CUBBON_PARK_SPECIES.map((s) => s.family))).sort();
  }, []);

  const roles = useMemo(() => {
    return Array.from(new Set(CUBBON_PARK_SPECIES.map((s) => s.ecologicalRole))).sort();
  }, []);

  const filteredSpecies = useMemo(() => {
    return CUBBON_PARK_SPECIES.filter((sp) => {
      if (selectedFamily !== 'all' && sp.family !== selectedFamily) return false;
      if (selectedRole !== 'all' && sp.ecologicalRole !== selectedRole) return false;
      if (nativeOnly && sp.nativeStatus !== 'Native') return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesSci = sp.scientificName.toLowerCase().includes(q);
        const matchesCom = sp.commonName.toLowerCase().includes(q);
        const matchesKan = sp.kannadaName ? sp.kannadaName.toLowerCase().includes(q) : false;
        const matchesFam = sp.family.toLowerCase().includes(q);
        const matchesFauna = sp.faunaAffinity.some((f) => f.toLowerCase().includes(q));
        if (!matchesSci && !matchesCom && !matchesKan && !matchesFam && !matchesFauna) return false;
      }
      return true;
    });
  }, [searchQuery, selectedFamily, selectedRole, nativeOnly]);

  return (
    <div className="min-h-screen bg-[#F4F7FA] text-[#01295F] pt-18">
      <Navigation />

      {/* Header Banner */}
      <section className="bg-[#01295F] text-white px-4 sm:px-6 lg:px-8 py-14 border-b border-[#437F97]/30">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#FFB30F] mb-3">
            <span>FLORISTIC INVENTORY OF CUBBON PARK</span>
            <span>&bull;</span>
            <span>196 DOCUMENTED SPECIES</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white">
            The 196 Tree Species of Cubbon Park
          </h1>
          <p className="text-sm sm:text-base text-white/80 font-sans max-w-3xl mt-3 leading-relaxed">
            From monumental keystone figs (<em>Ficus benghalensis</em>) to fragrant <em>Sampige</em> (<em>Magnolia champaca</em>)
            and ancient <em>Mahua</em> (<em>Madhuca longifolia</em>). Explore the taxonomy, canopy dimensions,
            and dependent fauna of Bangalore&apos;s primary urban forest.
          </p>

          {/* Search & Filter Controls */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <input
                type="text"
                placeholder="Search scientific, common name, Kannada name, or fauna..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#FFB30F]"
              />
              <span className="absolute left-3.5 top-3 text-xs text-white/50">🔍</span>
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-3 text-xs text-white/70 hover:text-white">
                  &times;
                </button>
              )}
            </div>

            <select
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
              className="px-3 py-2.5 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#FFB30F]"
            >
              <option value="all" className="bg-[#01295F] text-white">All Families ({families.length})</option>
              {families.map((fam) => (
                <option key={fam} value={fam} className="bg-[#01295F] text-white">{fam}</option>
              ))}
            </select>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2.5 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#FFB30F]"
            >
              <option value="all" className="bg-[#01295F] text-white">All Ecological Roles</option>
              {roles.map((role) => (
                <option key={role} value={role} className="bg-[#01295F] text-white">{role}</option>
              ))}
            </select>

            <button
              onClick={() => setNativeOnly(!nativeOnly)}
              aria-pressed={nativeOnly}
              className={`px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                nativeOnly
                  ? 'bg-[#849324] border-white/30 text-white'
                  : 'bg-white/5 border-white/15 text-white/70'
              }`}
            >
              🍃 Native Species Only
            </button>
          </div>
        </div>
      </section>

      {/* Catalog Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#437F97]/20 text-xs font-mono text-[#01295F]/70">
          <span>
            Displaying <strong className="text-[#01295F]">{filteredSpecies.length}</strong> of {CUBBON_PARK_SPECIES.length} species
          </span>
          <Link href="/map" className="text-[#437F97] font-bold hover:text-[#01295F] transition-colors">
            View Geo-Tagged Locations on Eco-Map &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpecies.map((sp: CubbonTreeSpecies) => (
            <article
              key={sp.serialNo}
              className="p-6 rounded-3xl bg-white border border-[#437F97]/20 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#F4F7FA] text-[#01295F] border border-[#437F97]/20">
                    #{String(sp.serialNo).padStart(3, '0')} &bull; {sp.family}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                      sp.nativeStatus === 'Native'
                        ? 'bg-[#849324]/15 text-[#849324]'
                        : 'bg-[#FFB30F]/20 text-[#01295F]'
                    }`}
                  >
                    {sp.nativeStatus}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold text-[#01295F] group-hover:text-[#437F97] transition-colors leading-snug">
                    {sp.commonName}
                  </h3>
                  <div className="text-xs italic text-[#01295F]/60 mt-0.5">{sp.scientificName}</div>
                  {sp.kannadaName && (
                    <div className="text-xs text-[#FFB30F] font-semibold mt-1">
                      ಕನ್ನಡ: {sp.kannadaName}
                    </div>
                  )}
                </div>

                <div className="text-xs">
                  <span className="text-[10px] uppercase font-mono text-[#01295F]/50 block mb-0.5">Ecological Anchor</span>
                  <span className="font-medium text-[#01295F] bg-[#F4F7FA] px-2.5 py-1 rounded-lg border border-[#437F97]/20 inline-block">
                    {sp.ecologicalRole}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#437F97]/10 text-xs text-[#01295F]/80">
                  <div>
                    <span className="text-[10px] font-mono text-[#01295F]/50 block">Typical Height</span>
                    <span className="font-semibold">{sp.typicalHeightM} meters</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#01295F]/50 block">Canopy Spread</span>
                    <span className="font-semibold">{sp.typicalCanopySpreadM} meters</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-mono text-[#01295F]/50 block mb-1">Dependent Wildlife</span>
                  <div className="flex flex-wrap gap-1">
                    {sp.faunaAffinity.map((fauna, fIdx) => (
                      <span key={fIdx} className="px-2 py-0.5 rounded text-[10px] bg-[#437F97]/10 text-[#01295F] font-medium">
                        {fauna}
                      </span>
                    ))}
                  </div>
                </div>

                {sp.conservationNote && (
                  <div className="text-[11px] p-2 rounded-lg bg-[#FFB30F]/15 text-[#01295F] font-medium border border-[#FFB30F]/30">
                    📌 {sp.conservationNote}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-[#437F97]/10 flex items-center justify-between text-xs font-mono">
                <span className="text-[#01295F]/50">{sp.canopyType}</span>
                <Link
                  href={`/map?search=${encodeURIComponent(sp.scientificName.split(' ')[0])}`}
                  className="font-bold text-[#437F97] hover:text-[#01295F] flex items-center space-x-1 transition-colors"
                >
                  <span>Locate</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
