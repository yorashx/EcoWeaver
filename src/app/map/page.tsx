'use client';

import { useState, useMemo, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import EcoMap from '@/components/EcoMap';
import { dataStore } from '@/lib/data-store';
import { Tree, SimulationAction } from '@/types';
import { SimulationEngine, AdvancedSimulationResult } from '@/lib/simulation-engine';
import { CUBBON_ZONES, CUBBON_PARK_SPECIES } from '@/lib/cubbon-species-data';
import { CUBBON_PARK_GEO } from '@/lib/cubbon-tree-inventory';
import { IISC_ZONES, IISC_GEO } from '@/lib/iisc-tree-inventory';

type PageMode = 'explore' | 'simulate';

function MapContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialZone = searchParams?.get('zone') || 'all';
  const initialSearch = searchParams?.get('search') || '';
  const initialCampus = (searchParams?.get('campus') as 'iisc' | 'cubbon') || 'iisc';
  const initialMode = (searchParams?.get('mode') === 'simulator' ? 'simulate' : 'explore') as PageMode;

  const [mode, setMode] = useState<PageMode>(initialMode);
  const [selectedCampus, setSelectedCampus] = useState<'iisc' | 'cubbon'>(initialCampus);
  const [selectedZone, setSelectedZone] = useState<string>(initialZone);
  const [selectedEcologicalValue, setSelectedEcologicalValue] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [showCanopyRings, setShowCanopyRings] = useState<boolean>(true);
  const [showCorridors, setShowCorridors] = useState<boolean>(true);

  // Simulation state
  const [actions, setActions] = useState<SimulationAction[]>([]);
  const [simulationResults, setSimulationResults] = useState<AdvancedSimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [actionTab, setActionTab] = useState<'remove' | 'plant' | 'bridge'>('remove');
  const [plantSpeciesSerial, setPlantSpeciesSerial] = useState<number>(78);
  const [plantCanopyRadius, setPlantCanopyRadius] = useState<number>(8);
  const [simulatedTrees, setSimulatedTrees] = useState<Tree[] | null>(null);

  // Available zones based on active campus
  const currentZones = useMemo(() => {
    return selectedCampus === 'iisc' ? IISC_ZONES : CUBBON_ZONES;
  }, [selectedCampus]);

  // Center coordinates
  const currentCenter = useMemo(() => {
    return selectedCampus === 'iisc' ? IISC_GEO.center : CUBBON_PARK_GEO.center;
  }, [selectedCampus]);

  // Fetch trees dynamically from dataStore with campus filter
  const filteredTrees = useMemo(() => {
    if (mode === 'simulate' && simulatedTrees) {
      // In simulator mode, use the simulated trees but still apply visual filters
      let result = simulatedTrees;
      if (selectedZone !== 'all') {
        result = result.filter(t => t.metadata?.zone === selectedZone);
      }
      if (selectedEcologicalValue !== 'all') {
        result = result.filter(t => t.ecologicalValue === selectedEcologicalValue);
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        result = result.filter(t =>
          (t.treeNumber && t.treeNumber.toLowerCase().includes(q)) ||
          (t.species && t.species.toLowerCase().includes(q)) ||
          (t.commonName && t.commonName.toLowerCase().includes(q))
        );
      }
      return result;
    }
    return dataStore.getTrees({
      campus: selectedCampus,
      zone: selectedZone !== 'all' ? selectedZone : undefined,
      ecologicalValue: selectedEcologicalValue !== 'all' ? selectedEcologicalValue : undefined,
      search: searchQuery || undefined,
      status: 'active',
    });
  }, [selectedCampus, selectedZone, selectedEcologicalValue, searchQuery, mode, simulatedTrees]);

  // Corridors based on campus
  const corridors = useMemo(() => {
    return dataStore.getCorridors(selectedCampus);
  }, [selectedCampus]);

  // Initialize simulation results when entering simulator mode
  const initializeSimulation = useCallback(() => {
    const campusTrees = dataStore.getTrees({ status: 'active', campus: selectedCampus });
    setSimulatedTrees([...campusTrees]);
    const engine = new SimulationEngine(campusTrees, dataStore.getCorridors(selectedCampus));
    setSimulationResults(engine.simulate([]));
    setActions([]);
  }, [selectedCampus]);

  // Execute simulation action
  const handleExecuteAction = useCallback((action: SimulationAction) => {
    setIsSimulating(true);
    const updatedActions = [...actions, action];
    setActions(updatedActions);

    setTimeout(() => {
      const baseTrees = dataStore.getTrees({ status: 'active', campus: selectedCampus });
      const engine = new SimulationEngine(baseTrees, dataStore.getCorridors(selectedCampus));
      const res = engine.simulate(updatedActions);
      setSimulationResults(res);

      if (action.actionType === 'remove_tree') {
        setSimulatedTrees(prev =>
          (prev || baseTrees).map(t => (t.id === action.targetId ? { ...t, status: 'removed' } : t))
        );
      } else {
        setSimulatedTrees([...baseTrees]);
      }

      setIsSimulating(false);
    }, 400);
  }, [actions, selectedCampus]);

  // Trigger tree removal
  const handleRemoveSelectedTree = () => {
    if (!selectedTree) return;
    handleExecuteAction({
      id: Date.now(),
      simulationId: null,
      actionType: 'remove_tree',
      targetId: selectedTree.id,
      parameters: { treeNumber: selectedTree.treeNumber, species: selectedTree.species },
      geometry: null,
    });
  };

  // Trigger compensatory sapling planting
  const handlePlantSapling = () => {
    if (!selectedTree) return;
    const sp = CUBBON_PARK_SPECIES.find(s => s.serialNo === plantSpeciesSerial) || CUBBON_PARK_SPECIES[0];
    handleExecuteAction({
      id: Date.now(),
      simulationId: null,
      actionType: 'plant_tree',
      targetId: null,
      parameters: {
        species: sp.scientificName,
        commonName: sp.commonName,
        canopyRadius: plantCanopyRadius,
        age: 4,
        height: 8.5,
        lat: selectedTree.lat + 0.00015,
        lng: selectedTree.lng + 0.00015,
      },
      geometry: null,
    });
  };

  // Trigger aerial canopy rope bridge
  const handleAddCanopyBridge = () => {
    if (!selectedTree) return;
    handleExecuteAction({
      id: Date.now(),
      simulationId: null,
      actionType: 'add_bridge',
      targetId: selectedTree.id,
      parameters: {
        treeId1: selectedTree.id,
        treeId2: selectedTree.id === 21 ? 1 : 21,
        lengthMeters: 14,
        type: 'Arboreal Coir Rope Bridge',
      },
      geometry: null,
    });
  };

  const handleResetSimulation = () => {
    const freshTrees = dataStore.getTrees({ status: 'active', campus: selectedCampus });
    setSimulatedTrees([...freshTrees]);
    setActions([]);
    const engine = new SimulationEngine(freshTrees, dataStore.getCorridors(selectedCampus));
    setSimulationResults(engine.simulate([]));
    setSelectedTree(null);
  };

  const nativeSpeciesOptions = useMemo(() => {
    return CUBBON_PARK_SPECIES.filter(
      s => s.ecologicalRole === 'Mother Tree / Continuous Canopy' || s.ecologicalRole === 'Keystone Food Source'
    ).slice(0, 20);
  }, []);

  const handleModeSwitch = (newMode: PageMode) => {
    setMode(newMode);
    setSelectedTree(null);
    if (newMode === 'simulate') {
      initializeSimulation();
    } else {
      setSimulatedTrees(null);
      setActions([]);
      setSimulationResults(null);
    }
  };

  const handleCampusSwitch = (campus: 'iisc' | 'cubbon') => {
    setSelectedCampus(campus);
    setSelectedZone('all');
    setSelectedTree(null);
    if (mode === 'simulate') {
      // Re-init simulation for new campus
      setTimeout(() => {
        const campusTrees = dataStore.getTrees({ status: 'active', campus });
        setSimulatedTrees([...campusTrees]);
        setActions([]);
        const engine = new SimulationEngine(campusTrees, dataStore.getCorridors(campus));
        setSimulationResults(engine.simulate([]));
      }, 50);
    }
  };

  const totalTreeCount = useMemo(() => {
    return dataStore.getTrees({ status: 'active', campus: selectedCampus }).length;
  }, [selectedCampus]);

  return (
    <div className="h-screen bg-[#F4F7FA] flex flex-col pt-18">
      <Navigation />

      {/* Unified Control Toolbar */}
      <div className="bg-[#01295F] text-[#F4F7FA] border-b border-[#437F97]/25 px-4 sm:px-6 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Title + Campus Info */}
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center space-x-2">
                  <span>{selectedCampus === 'iisc' ? 'IISc Bangalore' : 'Cubbon Park'}</span>
                  <span className="text-[#FFB30F]">•</span>
                  <span className="text-base font-sans font-medium text-white/80">
                    {mode === 'simulate' ? 'Habitat Simulator' : 'Ecological Map'}
                  </span>
                </h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#849324] text-white">
                  {selectedCampus === 'iisc' ? 'Last Loris Sanctuary' : 'Urban Core'}
                </span>
              </div>
              <p className="text-xs text-[#437F97] font-mono mt-0.5">
                {filteredTrees.length}/{totalTreeCount} trees • {corridors.length} corridors • {selectedCampus === 'iisc' ? 'Near Yeshwantpur' : 'Central Bengaluru'}
                {mode === 'simulate' && actions.length > 0 && (
                  <span className="text-[#FFB30F] ml-2">• {actions.length} interventions active</span>
                )}
              </p>
            </div>

            {/* Mode Toggle */}
            <div className="flex items-center bg-black/20 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => handleModeSwitch('explore')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${mode === 'explore'
                    ? 'bg-[#437F97] text-white shadow-md'
                    : 'text-white/70 hover:text-white'
                  }`}
              >
                <span>🗺️</span>
                <span>Explore</span>
              </button>
              <button
                onClick={() => handleModeSwitch('simulate')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${mode === 'simulate'
                    ? 'bg-[#FFB30F] text-[#01295F] shadow-md'
                    : 'text-white/70 hover:text-white'
                  }`}
              >
                <span>🔬</span>
                <span>Simulate</span>
              </button>
            </div>

            {/* Campus Switcher Pill */}
            <div className="flex items-center bg-black/20 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => handleCampusSwitch('iisc')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${selectedCampus === 'iisc'
                    ? 'bg-[#849324] text-white shadow-md'
                    : 'text-white/70 hover:text-white'
                  }`}
              >
                <span>🦎</span>
                <span>IISc</span>
              </button>
              <button
                onClick={() => handleCampusSwitch('cubbon')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${selectedCampus === 'cubbon'
                    ? 'bg-[#437F97] text-white shadow-md'
                    : 'text-white/70 hover:text-white'
                  }`}
              >
                <span>🌳</span>
                <span>Cubbon Park</span>
              </button>
            </div>
          </div>

          {/* Quick Filters + Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search tree, species..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 pl-8 text-xs rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#FFB30F] w-40 sm:w-48"
              />
              <span className="absolute left-2.5 top-2 text-xs text-white/50">🔍</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-xs text-white/70 hover:text-white"
                >
                  &times;
                </button>
              )}
            </div>

            {/* Zone Selector */}
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#FFB30F]"
            >
              <option value="all" className="bg-[#01295F] text-white">All Zones</option>
              {currentZones.map((z) => (
                <option key={z.id} value={z.id} className="bg-[#01295F] text-white">
                  {z.name}
                </option>
              ))}
            </select>

            {/* Ecological Value Selector */}
            <select
              value={selectedEcologicalValue}
              onChange={(e) => setSelectedEcologicalValue(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#FFB30F]"
            >
              <option value="all" className="bg-[#01295F] text-white">All Values</option>
              <option value="critical" className="bg-[#01295F] text-white">🔴 Critical</option>
              <option value="high" className="bg-[#01295F] text-white">🟢 High</option>
              <option value="medium" className="bg-[#01295F] text-white">🟡 Standard</option>
            </select>

            {/* Layer Toggles */}
            <button
              onClick={() => setShowCanopyRings(!showCanopyRings)}
              aria-pressed={showCanopyRings}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors flex items-center space-x-1 ${showCanopyRings
                  ? 'bg-[#849324] border-white/30 text-white font-bold'
                  : 'bg-white/5 border-white/15 text-white/60'
                }`}
            >
              <span>🌳</span>
              <span>Canopy</span>
            </button>

            <button
              onClick={() => setShowCorridors(!showCorridors)}
              aria-pressed={showCorridors}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors flex items-center space-x-1 ${showCorridors
                  ? 'bg-[#FFB30F] border-white/30 text-[#01295F] font-bold'
                  : 'bg-white/5 border-white/15 text-white/60'
                }`}
            >
              <span>🛣️</span>
              <span>Corridors</span>
            </button>

            {/* Simulator-specific actions */}
            {mode === 'simulate' && (
              <>
                {actions.length > 0 && (
                  <button
                    onClick={handleResetSimulation}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
                  >
                    ↺ Reset
                  </button>
                )}
                <button
                  onClick={() => {
                    sessionStorage.setItem('ecoweaver-report-actions', JSON.stringify(actions));
                    router.push('/reports?scenario=current');
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FFB30F] hover:bg-[#ffbf33] text-[#01295F] shadow-md transition-all flex items-center space-x-1"
                >
                  <span>📜</span>
                  <span>Report</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Map + Sidebar */}
      <div className="flex-1 min-h-0 flex overflow-hidden relative">
        {/* Leaflet Map */}
        <div className="flex-1 min-h-0 relative">
          <EcoMap
            trees={filteredTrees}
            center={currentCenter}
            onTreeSelect={setSelectedTree}
            selectedTree={selectedTree}
            corridors={corridors}
            showCanopyRings={showCanopyRings}
            showCorridors={showCorridors}
          />

          {/* Floating Map Legend Overlay */}
          <div className="absolute top-4 left-4 z-10 glass-panel-forest p-3.5 rounded-xl max-w-[240px] text-xs text-white shadow-xl border border-[#437F97]/30 pointer-events-auto hidden sm:block">
            <div className="flex items-center justify-between mb-2">
              <span className="font-serif font-bold text-sm text-[#FFB30F]">Canopy Legend</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-white/80">
                {selectedCampus.toUpperCase()}
              </span>
            </div>
            <div className="space-y-1.5">
              {selectedCampus === 'iisc' && (
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#849324] border-2 border-[#FFB30F] inline-block"></span>
                  <span className="font-semibold text-[#FFB30F]">Grey Slender Loris Tree</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#FD151B] border border-white inline-block"></span>
                <span>Critical Keystone Node</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#437F97] border border-white inline-block"></span>
                <span>High Connectivity</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#01295F] border border-white inline-block"></span>
                <span>Standard Canopy</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-0.5 border-t-2 border-dashed border-[#FFB30F] inline-block"></span>
                <span>Wildlife Corridor</span>
              </div>
            </div>

            {selectedCampus === 'iisc' && (
              <div className="mt-3 pt-2 border-t border-white/10 text-[10px] text-white/70 font-sans leading-tight">
                ℹ️ Grey Slender Lorises in Bengaluru survive exclusively in IISc near Yeshwantpur due to continuous canopies.
              </div>
            )}
          </div>

          {/* Simulation Metrics Overlay (only in simulate mode) */}
          {mode === 'simulate' && simulationResults && (
            <div className="absolute top-4 right-4 z-10 glass-panel-forest p-4 rounded-2xl max-w-[320px] w-full border border-[#437F97]/30 shadow-2xl hidden lg:block">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/15">
                <span className="text-xs font-mono font-bold text-[#FFB30F] uppercase tracking-wider">
                  Live Ecological Delta
                </span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-full uppercase ${simulationResults.riskLevel === 'critical'
                      ? 'bg-[#FD151B] text-white animate-pulse'
                      : simulationResults.riskLevel === 'high'
                        ? 'bg-orange-700 text-orange-100'
                        : simulationResults.riskLevel === 'medium'
                          ? 'bg-[#FFB30F] text-[#01295F]'
                          : 'bg-[#849324] text-white'
                    }`}
                >
                  {simulationResults.riskLevel}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-black/25 border border-white/5">
                  <span className="text-white/60 block font-mono text-[10px]">Connectivity</span>
                  <div className="flex items-baseline space-x-1.5 mt-0.5">
                    <span className="text-lg font-serif font-bold text-white">{simulationResults.connectivityAfter}%</span>
                    <span className={`font-mono text-[10px] font-bold ${simulationResults.connectivityChangePct < 0 ? 'text-[#FD151B]' : 'text-[#849324]'}`}>
                      {simulationResults.connectivityChangePct > 0 ? '+' : ''}{simulationResults.connectivityChangePct}%
                    </span>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-black/25 border border-white/5">
                  <span className="text-white/60 block font-mono text-[10px]">Canopy Area</span>
                  <div className="text-sm font-serif font-bold text-white mt-0.5">
                    {simulationResults.canopyAreaAfterSqM.toLocaleString('en-US')} m²
                  </div>
                  {simulationResults.canopyAreaLostSqM > 0 && (
                    <span className="text-[10px] font-mono text-[#FD151B] font-semibold">
                      -{simulationResults.canopyAreaLostSqM.toLocaleString('en-US')} m²
                    </span>
                  )}
                </div>

                <div className="p-2 rounded-lg bg-black/25 border border-white/5">
                  <span className="text-white/60 block font-mono text-[10px]">Isolated Clusters</span>
                  <div className="text-sm font-serif font-bold text-[#FFB30F] mt-0.5">
                    {simulationResults.networkTopology.isolatedCanopyIslands}
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-black/25 border border-white/5">
                  <span className="text-white/60 block font-mono text-[10px]">Temp Rise</span>
                  <div className="text-sm font-serif font-bold text-white mt-0.5">
                    +{simulationResults.microclimateTempRiseEstimateC}°C
                  </div>
                </div>
              </div>

              {simulationResults.impactSummary && (
                <div className="mt-2 text-[10px] text-white/80 leading-relaxed bg-black/20 p-2 rounded-lg border border-white/5">
                  {simulationResults.impactSummary}
                </div>
              )}
            </div>
          )}

          {/* Simulating overlay */}
          {isSimulating && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-30 flex items-center justify-center">
              <div className="glass-panel-forest p-6 rounded-2xl text-center text-white border border-[#437F97]/30 shadow-2xl">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FFB30F] mx-auto mb-3"></div>
                <div className="font-serif text-lg font-bold">Recalculating Spatial Network...</div>
                <div className="text-xs font-mono text-[#FFB30F] mt-1">Measuring Haversine overlaps & centrality</div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Tree Inspector + Simulator Controls */}
        {selectedTree ? (
          <aside className="w-96 bg-[#01295F] text-white border-l border-[#437F97]/30 overflow-y-auto p-6 shadow-2xl flex flex-col justify-between z-20">
            <div className="space-y-5">
              {/* Tree Header */}
              <div className="flex items-start justify-between pb-3 border-b border-white/15">
                <div>
                  <span className="text-xs font-mono text-[#FFB30F] font-bold">
                    {selectedTree.treeNumber}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-white leading-tight mt-1">
                    {selectedTree.commonName || selectedTree.species}
                  </h2>
                  <div className="text-xs italic text-white/70">
                    {selectedTree.species}
                  </div>
                  {selectedTree.metadata?.kannadaName && (
                    <div className="text-xs text-[#FFB30F] mt-0.5">
                      ಕನ್ನಡ: {selectedTree.metadata.kannadaName}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedTree(null)}
                  className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
                  aria-label="Close inspector"
                >
                  &times;
                </button>
              </div>

              {/* Status & Ecological Badge */}
              <div className="flex items-center flex-wrap gap-1.5">
                {selectedTree.metadata?.hasLorisSighting && (
                  <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-md bg-[#849324] text-white border border-[#FFB30F]">
                    🦎 Loris Resident ({selectedTree.metadata.residentLorisCount || 2})
                  </span>
                )}
                <span
                  className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md uppercase tracking-wider ${selectedTree.ecologicalValue === 'critical'
                      ? 'bg-[#FD151B] text-white'
                      : selectedTree.ecologicalValue === 'high'
                        ? 'bg-[#437F97] text-white'
                        : 'bg-white/20 text-white'
                    }`}
                >
                  {selectedTree.ecologicalValue} Tier
                </span>
                {selectedTree.isCriticalNode && (
                  <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-md bg-red-900/80 text-red-200 border border-red-500/40">
                    Keystone
                  </span>
                )}
              </div>

              {/* Botanical Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-black/20 border border-white/10 text-xs">
                <div>
                  <span className="text-white/60 block">Age</span>
                  <span className="text-base font-serif font-bold text-[#FFB30F]">
                    ~{selectedTree.age || '—'} yrs
                  </span>
                </div>
                <div>
                  <span className="text-white/60 block">Canopy Radius</span>
                  <span className="text-base font-serif font-bold text-white">
                    {selectedTree.canopyRadius || '—'} m
                  </span>
                </div>
                <div>
                  <span className="text-white/60 block">Height</span>
                  <span className="text-base font-serif font-bold text-white">
                    {selectedTree.height || '—'} m
                  </span>
                </div>
                <div>
                  <span className="text-white/60 block">Connectivity</span>
                  <span className="text-base font-serif font-bold text-[#849324]">
                    +{selectedTree.connectivityContribution}%
                  </span>
                </div>
              </div>

              {/* Botanical Traits */}
              <div className="space-y-2 text-xs">
                {selectedTree.metadata?.family && (
                  <div>
                    <span className="text-white/60">Family:</span>{' '}
                    <span className="font-semibold text-white">{selectedTree.metadata.family}</span>
                  </div>
                )}
                {selectedTree.metadata?.canopyType && (
                  <div>
                    <span className="text-white/60">Canopy:</span>{' '}
                    <span className="font-semibold text-white">{selectedTree.metadata.canopyType}</span>
                  </div>
                )}
                {selectedTree.metadata?.ecologicalRole && (
                  <div>
                    <span className="text-white/60">Role:</span>{' '}
                    <span className="font-semibold text-[#FFB30F]">{selectedTree.metadata.ecologicalRole}</span>
                  </div>
                )}
              </div>

              {/* Supported Fauna Guilds */}
              {selectedTree.metadata?.faunaAffinity && (
                <div className="p-3.5 rounded-xl bg-black/20 border border-white/10">
                  <div className="text-xs font-mono font-bold text-[#FFB30F] mb-1.5 flex items-center space-x-1">
                    <span>🐾</span>
                    <span>Dependent Wildlife</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTree.metadata.faunaAffinity.map((fauna: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[11px] bg-white/10 text-white border border-white/10"
                      >
                        {fauna}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedTree.metadata?.notes && (
                <div className="text-xs text-white/80 italic p-3 rounded-lg bg-black/30 border border-white/10">
                  &ldquo;{selectedTree.metadata.notes}&rdquo;
                </div>
              )}

              {/* ===== SIMULATION CONTROLS (only in simulate mode) ===== */}
              {mode === 'simulate' && (
                <div className="space-y-4 pt-4 border-t border-white/15">
                  <div className="text-xs font-mono font-bold text-[#FFB30F] uppercase tracking-wider">
                    Simulation Tools
                  </div>

                  {/* Action Mode Tabs */}
                  <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-black/30 border border-white/10 text-xs">
                    <button
                      onClick={() => setActionTab('remove')}
                      className={`py-1.5 rounded-lg font-semibold transition-all ${actionTab === 'remove'
                          ? 'bg-[#FD151B] text-white shadow'
                          : 'text-white/70 hover:text-white'
                        }`}
                    >
                      ✂️ Remove
                    </button>
                    <button
                      onClick={() => setActionTab('plant')}
                      className={`py-1.5 rounded-lg font-semibold transition-all ${actionTab === 'plant'
                          ? 'bg-[#849324] text-white shadow'
                          : 'text-white/70 hover:text-white'
                        }`}
                    >
                      🌱 Plant
                    </button>
                    <button
                      onClick={() => setActionTab('bridge')}
                      className={`py-1.5 rounded-lg font-semibold transition-all ${actionTab === 'bridge'
                          ? 'bg-[#FFB30F] text-[#01295F] shadow font-bold'
                          : 'text-white/70 hover:text-white'
                        }`}
                    >
                      🌉 Bridge
                    </button>
                  </div>

                  {/* Remove */}
                  {actionTab === 'remove' && (
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200 leading-relaxed">
                        <strong>Simulate Felling / Clearance:</strong> Removes this node from the canopy network. Models branch interruption for Grey Slender Loris and arboreal wildlife.
                      </div>
                      <button
                        onClick={handleRemoveSelectedTree}
                        disabled={!selectedTree || selectedTree.status === 'removed'}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#FD151B] hover:bg-[#ff3b40] disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold text-xs shadow-lg transition-all"
                      >
                        {selectedTree?.status === 'removed' ? 'Already Removed' : 'Simulate Felling'}
                      </button>
                    </div>
                  )}

                  {/* Plant */}
                  {actionTab === 'plant' && (
                    <div className="space-y-3">
                      <div className="text-xs text-white/80">
                        Select a native species to plant near this location:
                      </div>
                      <select
                        value={plantSpeciesSerial}
                        onChange={(e) => setPlantSpeciesSerial(parseInt(e.target.value, 10))}
                        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white focus:outline-none focus:border-[#FFB30F]"
                      >
                        {nativeSpeciesOptions.map((s) => (
                          <option key={s.serialNo} value={s.serialNo} className="bg-[#01295F] text-white">
                            {s.commonName} ({s.scientificName})
                          </option>
                        ))}
                      </select>

                      <div>
                        <div className="flex justify-between text-xs text-white/70 mb-1">
                          <span>Target Canopy:</span>
                          <span className="font-bold text-[#FFB30F]">{plantCanopyRadius} m</span>
                        </div>
                        <input
                          type="range"
                          min={5}
                          max={18}
                          value={plantCanopyRadius}
                          onChange={(e) => setPlantCanopyRadius(parseInt(e.target.value, 10))}
                          className="w-full accent-[#849324]"
                        />
                      </div>

                      <button
                        onClick={handlePlantSapling}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#849324] hover:bg-[#9db02e] text-white font-bold text-xs shadow-lg transition-all"
                      >
                        Plant Native Sapling
                      </button>
                    </div>
                  )}

                  {/* Bridge */}
                  {actionTab === 'bridge' && (
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-[#FFB30F]/15 border border-[#FFB30F]/30 text-xs text-white leading-relaxed">
                        <strong>Arboreal Wildlife Crossing:</strong> Installs fiber rope bridges across branch gaps for Grey Slender Loris and Indian Giant Squirrels.
                      </div>
                      <button
                        onClick={handleAddCanopyBridge}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#FFB30F] hover:bg-[#ffbf33] text-[#01295F] font-bold text-xs shadow-lg transition-all"
                      >
                        Install Canopy Bridge
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Affected Fauna (simulator mode) */}
              {mode === 'simulate' && simulationResults && simulationResults.affectedFauna.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-mono font-bold text-[#FFB30F] uppercase tracking-wider">
                    Impacted Fauna
                  </div>
                  <div className="space-y-1.5">
                    {simulationResults.affectedFauna.slice(0, 4).map((fauna, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-black/20 border border-white/5 text-xs">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-white flex items-center space-x-1.5">
                            <span>{fauna.icon}</span>
                            <span>{fauna.speciesName}</span>
                          </span>
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${fauna.impactLevel === 'Critical'
                                ? 'bg-red-900/80 text-red-200'
                                : 'bg-yellow-900/80 text-yellow-200'
                              }`}
                          >
                            {fauna.impactLevel}
                          </span>
                        </div>
                        <p className="text-[10px] text-white/70 leading-relaxed">{fauna.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Interventions History */}
              {mode === 'simulate' && actions.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-mono font-bold text-[#FFB30F] uppercase tracking-wider">
                    Interventions ({actions.length})
                  </div>
                  <div className="space-y-1 text-xs font-mono text-white/80 max-h-24 overflow-y-auto">
                    {actions.map((act, i) => (
                      <div key={i} className="p-1.5 rounded bg-white/5 flex items-center justify-between">
                        <span>
                          {act.actionType === 'remove_tree'
                            ? `✂️ Felled #${act.targetId}`
                            : act.actionType === 'plant_tree'
                              ? `🌱 Planted Sapling`
                              : `🌉 Canopy Bridge`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-4 border-t border-white/15 space-y-2">
              {mode === 'explore' && (
                <button
                  onClick={() => {
                    handleModeSwitch('simulate');
                  }}
                  className="w-full py-2.5 px-4 bg-[#FFB30F] hover:bg-[#ffbf33] text-[#01295F] font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <span>🔬</span>
                  <span>Simulate This Tree</span>
                </button>
              )}
            </div>
          </aside>
        ) : (
          <aside className="hidden lg:flex w-80 bg-[#01295F]/95 text-white border-l border-[#437F97]/30 p-6 flex-col justify-center items-center text-center space-y-3 z-20">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-3xl">
              {mode === 'simulate' ? '🔬' : selectedCampus === 'iisc' ? '🦎' : '🌳'}
            </div>
            <h3 className="font-serif text-lg font-bold text-white">
              {mode === 'simulate'
                ? 'Habitat Connectivity Simulator'
                : selectedCampus === 'iisc'
                  ? 'IISc Loris Sanctuary Map'
                  : 'Cubbon Park Ecological Map'}
            </h3>
            <p className="text-xs text-white/70 font-sans leading-relaxed">
              {mode === 'simulate'
                ? 'Click on any tree on the map to select it for simulation. Test removal, planting, and bridge installation interventions.'
                : selectedCampus === 'iisc'
                  ? 'Click on any tree pin on the IISc campus to inspect Grey Slender Loris sightings, canopy connections, and botanical health.'
                  : 'Click on any tree pin in Cubbon Park to inspect its age, canopy spread, and species data.'}
            </p>
          </aside>
        )}
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F7FA] flex items-center justify-center text-[#01295F]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#01295F]" />
        </div>
      }
    >
      <MapContent />
    </Suspense>
  );
}
