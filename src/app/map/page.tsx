'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import EcoMap from '@/components/EcoMap';
import { dataStore } from '@/lib/data-store';
import { Tree } from '@/types';
import { CUBBON_ZONES } from '@/lib/cubbon-species-data';

function MapContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialZone = searchParams?.get('zone') || 'all';
  const initialSearch = searchParams?.get('search') || '';

  const [selectedZone, setSelectedZone] = useState<string>(initialZone);
  const [selectedEcologicalValue, setSelectedEcologicalValue] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [showCanopyRings, setShowCanopyRings] = useState<boolean>(true);
  const [showCorridors, setShowCorridors] = useState<boolean>(true);

  // Fetch trees dynamically from dataStore
  const allTrees = useMemo(() => {
    return dataStore.getTrees({ status: 'active' });
  }, []);

  // Filtered trees
  const filteredTrees = useMemo(() => {
    return dataStore.getTrees({
      zone: selectedZone !== 'all' ? selectedZone : undefined,
      ecologicalValue: selectedEcologicalValue !== 'all' ? selectedEcologicalValue : undefined,
      search: searchQuery || undefined,
      status: 'active',
    });
  }, [selectedZone, selectedEcologicalValue, searchQuery]);

  const corridors = useMemo(() => dataStore.getCorridors(), []);

  const handleSimulateInWorkbench = (tree: Tree) => {
    router.push(`/simulator?treeId=${tree.id}`);
  };

  return (
    <div className="min-h-screen bg-[#FEFAE0] flex flex-col pt-18">
      <Navigation />

      {/* Map Control Toolbar */}
      <div className="bg-[#283618] text-[#FEFAE0] border-b border-[#FEFAE0]/15 px-4 sm:px-6 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#FEFAE0] flex items-center space-x-2">
                <span>Cubbon Park Ecological Map</span>
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-[#606C38] text-[#FEFAE0]">
                  Live
                </span>
              </h1>
              <p className="text-xs text-[#FEFAE0]/70 font-mono">
                Showing {filteredTrees.length} of {allTrees.length} trees &bull; 4 active wildlife corridors
              </p>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search tree, species, Kannada name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 pl-8 text-xs rounded-lg bg-white/10 border border-[#FEFAE0]/20 text-[#FEFAE0] placeholder-[#FEFAE0]/50 focus:outline-none focus:border-[#DDA15E] w-48 sm:w-64"
              />
              <span className="absolute left-2.5 top-2 text-xs text-[#FEFAE0]/50">🔍</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-xs text-[#FEFAE0]/70 hover:text-white"
                >
                  &times;
                </button>
              )}
            </div>

            {/* Zone Selector */}
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg bg-white/10 border border-[#FEFAE0]/20 text-[#FEFAE0] focus:outline-none focus:border-[#DDA15E]"
            >
              <option value="all" className="bg-[#283618] text-[#FEFAE0]">All Park Zones</option>
              {CUBBON_ZONES.map((z) => (
                <option key={z.id} value={z.id} className="bg-[#283618] text-[#FEFAE0]">
                  {z.name}
                </option>
              ))}
            </select>

            {/* Ecological Value Selector */}
            <select
              value={selectedEcologicalValue}
              onChange={(e) => setSelectedEcologicalValue(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg bg-white/10 border border-[#FEFAE0]/20 text-[#FEFAE0] focus:outline-none focus:border-[#DDA15E]"
            >
              <option value="all" className="bg-[#283618] text-[#FEFAE0]">All Values</option>
              <option value="critical" className="bg-[#283618] text-[#FEFAE0]">🔴 Critical Keystones</option>
              <option value="high" className="bg-[#283618] text-[#FEFAE0]">🟢 High Connectivity</option>
              <option value="medium" className="bg-[#283618] text-[#FEFAE0]">🟡 Standard Shading</option>
            </select>

            {/* Layer Toggles */}
            <button
              onClick={() => setShowCanopyRings(!showCanopyRings)}
              aria-pressed={showCanopyRings}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors flex items-center space-x-1 ${
                showCanopyRings
                  ? 'bg-[#606C38] border-[#FEFAE0]/30 text-[#FEFAE0]'
                  : 'bg-white/5 border-[#FEFAE0]/15 text-[#FEFAE0]/60'
              }`}
            >
              <span>🌳</span>
              <span>Canopy Rings</span>
            </button>

            <button
              onClick={() => setShowCorridors(!showCorridors)}
              aria-pressed={showCorridors}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors flex items-center space-x-1 ${
                showCorridors
                  ? 'bg-[#BC6C25] border-[#FEFAE0]/30 text-[#FEFAE0]'
                  : 'bg-white/5 border-[#FEFAE0]/15 text-[#FEFAE0]/60'
              }`}
            >
              <span>🛣️</span>
              <span>Corridors</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Map + Inspector View */}
      <div className="flex-1 min-h-0 flex overflow-hidden relative">
        {/* Leaflet Map */}
        <div className="flex-1 min-h-0 relative">
          <EcoMap
            trees={filteredTrees}
            onTreeSelect={setSelectedTree}
            selectedTree={selectedTree}
            corridors={corridors}
            showCanopyRings={showCanopyRings}
            showCorridors={showCorridors}
          />

          {/* Floating Map Legend Overlay */}
          <div className="absolute top-4 left-4 z-10 glass-panel-forest p-3 rounded-xl max-w-[210px] text-xs text-[#FEFAE0] shadow-lg border border-[#FEFAE0]/20 pointer-events-auto hidden sm:block">
            <div className="font-serif font-bold text-sm text-[#DDA15E] mb-2">Canopy Legend</div>
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#BC6C25] border border-[#FEFAE0] inline-block"></span>
                <span>Critical Keystone Node</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#606C38] border border-[#FEFAE0] inline-block"></span>
                <span>High Ecological Value</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#283618] border border-[#FEFAE0] inline-block"></span>
                <span>Standard Canopy</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-0.5 border-t-2 border-dashed border-[#DDA15E] inline-block"></span>
                <span>Wildlife Highway</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tree Biodata Inspector Drawer */}
        {selectedTree ? (
          <aside className="w-96 bg-[#283618] text-[#FEFAE0] border-l border-[#FEFAE0]/15 overflow-y-auto p-6 shadow-2xl flex flex-col justify-between z-20">
            <div className="space-y-5">
              <div className="flex items-start justify-between pb-3 border-b border-[#FEFAE0]/15">
                <div>
                  <span className="text-xs font-mono text-[#DDA15E] font-bold">
                    {selectedTree.treeNumber}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#FEFAE0] leading-tight mt-1">
                    {selectedTree.commonName || selectedTree.species}
                  </h2>
                  <div className="text-xs italic text-[#FEFAE0]/70">
                    {selectedTree.species}
                  </div>
                  {selectedTree.metadata?.kannadaName && (
                    <div className="text-xs text-[#DDA15E] mt-0.5">
                      ಕನ್ನಡ: {selectedTree.metadata.kannadaName}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedTree(null)}
                  className="p-1.5 text-[#FEFAE0]/70 hover:text-white rounded-lg hover:bg-white/10"
                  aria-label="Close inspector"
                >
                  &times;
                </button>
              </div>

              {/* Status & Ecological Badge */}
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md uppercase tracking-wider ${
                    selectedTree.ecologicalValue === 'critical'
                      ? 'bg-[#BC6C25] text-[#FEFAE0]'
                      : selectedTree.ecologicalValue === 'high'
                      ? 'bg-[#606C38] text-[#FEFAE0]'
                      : 'bg-[#FEFAE0]/20 text-[#FEFAE0]'
                  }`}
                >
                  {selectedTree.ecologicalValue} Tier
                </span>
                {selectedTree.isCriticalNode && (
                  <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-md bg-red-900/60 text-red-200 border border-red-500/40">
                    Keystone Arterial
                  </span>
                )}
              </div>

              {/* Botanical Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-white/5 border border-[#FEFAE0]/10 text-xs">
                <div>
                  <span className="text-[#FEFAE0]/60 block">Age</span>
                  <span className="text-base font-serif font-bold text-[#DDA15E]">
                    ~{selectedTree.age || '—'} yrs
                  </span>
                </div>
                <div>
                  <span className="text-[#FEFAE0]/60 block">Canopy Radius</span>
                  <span className="text-base font-serif font-bold text-[#FEFAE0]">
                    {selectedTree.canopyRadius || '—'} m
                  </span>
                </div>
                <div>
                  <span className="text-[#FEFAE0]/60 block">Height</span>
                  <span className="text-base font-serif font-bold text-[#FEFAE0]">
                    {selectedTree.height || '—'} m
                  </span>
                </div>
                <div>
                  <span className="text-[#FEFAE0]/60 block">Connectivity</span>
                  <span className="text-base font-serif font-bold text-[#606C38]">
                    +{selectedTree.connectivityContribution}%
                  </span>
                </div>
              </div>

              {/* Botanical Traits */}
              <div className="space-y-2 text-xs">
                {selectedTree.metadata?.family && (
                  <div>
                    <span className="text-[#FEFAE0]/60">Botanical Family:</span>{' '}
                    <span className="font-semibold text-[#FEFAE0]">{selectedTree.metadata.family}</span>
                  </div>
                )}
                {selectedTree.metadata?.canopyType && (
                  <div>
                    <span className="text-[#FEFAE0]/60">Canopy Architecture:</span>{' '}
                    <span className="font-semibold text-[#FEFAE0]">{selectedTree.metadata.canopyType}</span>
                  </div>
                )}
                {selectedTree.metadata?.ecologicalRole && (
                  <div>
                    <span className="text-[#FEFAE0]/60">Ecological Anchor:</span>{' '}
                    <span className="font-semibold text-[#DDA15E]">{selectedTree.metadata.ecologicalRole}</span>
                  </div>
                )}
                {selectedTree.metadata?.carbonSequestrationKgPerYr && (
                  <div>
                    <span className="text-[#FEFAE0]/60">Carbon Storage:</span>{' '}
                    <span className="font-semibold text-[#FEFAE0]">
                      {selectedTree.metadata.carbonSequestrationKgPerYr} kg CO₂ / year
                    </span>
                  </div>
                )}
              </div>

              {/* Supported Fauna Guilds */}
              {selectedTree.metadata?.faunaAffinity && (
                <div className="p-3.5 rounded-xl bg-[#606C38]/20 border border-[#606C38]/30">
                  <div className="text-xs font-mono font-bold text-[#DDA15E] mb-1.5 flex items-center space-x-1">
                    <span>🐾</span>
                    <span>Dependent Wildlife</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTree.metadata.faunaAffinity.map((fauna: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[11px] bg-white/10 text-[#FEFAE0] border border-[#FEFAE0]/10"
                      >
                        {fauna}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedTree.metadata?.notes && (
                <div className="text-xs text-[#FEFAE0]/80 italic p-3 rounded-lg bg-black/20 border border-white/5">
                  &ldquo;{selectedTree.metadata.notes}&rdquo;
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 mt-4 border-t border-[#FEFAE0]/15 space-y-2">
              <button
                onClick={() => handleSimulateInWorkbench(selectedTree)}
                className="w-full py-2.5 px-4 bg-[#BC6C25] hover:bg-[#d07e35] text-[#FEFAE0] font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>🔬</span>
                <span>Test Removal in Simulator</span>
              </button>
            </div>
          </aside>
        ) : (
          <div className="hidden lg:flex w-80 bg-[#283618]/90 text-[#FEFAE0] border-l border-[#FEFAE0]/15 p-6 flex-col justify-center items-center text-center">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-2xl mb-4 text-[#DDA15E]">
              🌳
            </div>
            <h3 className="font-serif text-lg font-bold text-[#FEFAE0]">Select Any Tree</h3>
            <p className="text-xs text-[#FEFAE0]/70 mt-1 leading-relaxed">
              Click any pin on the Cubbon Park map to inspect species traits, canopy spread, dependent wildlife, and run impact simulations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#283618] flex items-center justify-center text-[#FEFAE0]">
          <div className="text-center font-mono">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#DDA15E] mx-auto mb-3"></div>
            Loading Cubbon Park Map...
          </div>
        </div>
      }
    >
      <MapContent />
    </Suspense>
  );
}
