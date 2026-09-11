'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import EcoMap from '@/components/EcoMap';
import { dataStore } from '@/lib/data-store';
import { Tree, SimulationAction } from '@/types';
import { SimulationEngine, AdvancedSimulationResult } from '@/lib/simulation-engine';
import { CUBBON_PARK_SPECIES } from '@/lib/cubbon-species-data';

function SimulatorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselectedId = searchParams?.get('treeId') ? parseInt(searchParams.get('treeId')!, 10) : 21;

  const [activeTrees, setActiveTrees] = useState<Tree[]>(() => dataStore.getTrees({ status: 'active' }));
  const [selectedTreeId, setSelectedTreeId] = useState<number | null>(null);
  const [actions, setActions] = useState<SimulationAction[]>([]);
  const [results, setResults] = useState<AdvancedSimulationResult>(() => {
    const initialTrees = dataStore.getTrees({ status: 'active' });
    return new SimulationEngine(initialTrees, dataStore.getCorridors()).simulate([]);
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [actionTab, setActionTab] = useState<'remove' | 'plant' | 'bridge'>('remove');

  // Plant form state
  const [plantSpeciesSerial, setPlantSpeciesSerial] = useState<number>(78); // Ficus benghalensis default
  const [plantCanopyRadius, setPlantCanopyRadius] = useState<number>(8);

  const selectedTree = useMemo(
    () => activeTrees.find((tree) => tree.id === (selectedTreeId ?? preselectedId)) || activeTrees[0] || null,
    [activeTrees, preselectedId, selectedTreeId]
  );

  // Execute an action and re-simulate
  const handleExecuteAction = (action: SimulationAction) => {
    setIsSimulating(true);
    const updatedActions = [...actions, action];
    setActions(updatedActions);

    setTimeout(() => {
      const engine = new SimulationEngine(dataStore.getTrees({ status: 'active' }), dataStore.getCorridors());
      const res = engine.simulate(updatedActions);
      setResults(res);

      if (action.actionType === 'remove_tree') {
        setActiveTrees((prev) => prev.map((t) => (t.id === action.targetId ? { ...t, status: 'removed' } : t)));
      }

      setIsSimulating(false);
    }, 450);
  };

  // Trigger tree removal
  const handleRemoveSelectedTree = () => {
    if (!selectedTree) return;
    const action: SimulationAction = {
      id: Date.now(),
      simulationId: null,
      actionType: 'remove_tree',
      targetId: selectedTree.id,
      parameters: { treeNumber: selectedTree.treeNumber, species: selectedTree.species },
      geometry: null,
    };
    handleExecuteAction(action);
  };

  // Trigger compensatory sapling planting
  const handlePlantSapling = () => {
    if (!selectedTree) return;
    const sp = CUBBON_PARK_SPECIES.find((s) => s.serialNo === plantSpeciesSerial) || CUBBON_PARK_SPECIES[0];
    const action: SimulationAction = {
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
    };
    handleExecuteAction(action);
  };

  // Trigger aerial canopy rope bridge
  const handleAddCanopyBridge = () => {
    if (!selectedTree) return;
    const action: SimulationAction = {
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
    };
    handleExecuteAction(action);
  };

  const handleResetSimulation = () => {
    dataStore.reset();
    const freshTrees = dataStore.getTrees({ status: 'active' });
    setActiveTrees(freshTrees);
    setActions([]);
    const engine = new SimulationEngine(freshTrees, dataStore.getCorridors());
    setResults(engine.simulate([]));
    setSelectedTreeId(null);
  };

  const nativeSpeciesOptions = useMemo(() => {
    return CUBBON_PARK_SPECIES.filter(
      (s) => s.ecologicalRole === 'Mother Tree / Continuous Canopy' || s.ecologicalRole === 'Keystone Food Source'
    ).slice(0, 20);
  }, []);

  return (
    <div className="min-h-screen bg-[#FEFAE0] flex flex-col pt-18 text-[#283618]">
      <Navigation />

      {/* Simulator Action Banner */}
      <div className="bg-[#283618] text-[#FEFAE0] border-b border-[#FEFAE0]/15 px-4 sm:px-6 py-3.5 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#DDA15E]">
              <span>CUBBON PARK IN-SILICO WORKBENCH</span>
              <span>&bull;</span>
              <span>{actions.length} Interventions Active</span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#FEFAE0] mt-0.5">
              Habitat Connectivity Simulator
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            {actions.length > 0 && (
              <button
                onClick={handleResetSimulation}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-white/10 hover:bg-white/20 text-[#FEFAE0] border border-[#FEFAE0]/20 transition-all"
              >
                ↺ Reset Interventions
              </button>
            )}
            <button
              onClick={() => {
                sessionStorage.setItem('ecoweaver-report-actions', JSON.stringify(actions));
                router.push('/domino');
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#BC6C25] hover:bg-[#d07e35] text-[#FEFAE0] shadow-md transition-all flex items-center space-x-1.5"
            >
              <span>⚡</span>
              <span>View Domino Cascade</span>
            </button>
            <button
              onClick={() => {
                sessionStorage.setItem('ecoweaver-report-actions', JSON.stringify(actions));
                router.push('/reports?scenario=current');
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#DDA15E] hover:bg-[#e5b377] text-[#283618] shadow-md transition-all flex items-center space-x-1.5"
            >
              <span>📜</span>
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Simulator Grid */}
      <div className="flex-1 min-h-0 flex overflow-hidden relative">
        {/* Interactive Map Canvas */}
        <div className="flex-1 min-h-0 relative">
          <EcoMap
            trees={activeTrees}
            onTreeSelect={(tree) => setSelectedTreeId(tree.id)}
            selectedTree={selectedTree}
            showCanopyRings={true}
            showCorridors={true}
          />

          {/* Real-time Dynamic Metrics Overlay Card */}
          {results && (
            <div className="absolute top-4 left-4 z-10 glass-panel-forest p-4 rounded-2xl max-w-md w-full border border-[#FEFAE0]/20 shadow-2xl">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#FEFAE0]/15">
                <span className="text-xs font-mono font-bold text-[#DDA15E] uppercase tracking-wider">
                  Live Ecological Delta
                </span>
                <span
                  className={`px-2.5 py-0.5 text-[11px] font-mono font-bold rounded-full uppercase ${
                    results.riskLevel === 'critical'
                      ? 'bg-[#BC6C25] text-white animate-pulse'
                      : results.riskLevel === 'high'
                      ? 'bg-orange-800 text-orange-200'
                      : results.riskLevel === 'medium'
                      ? 'bg-yellow-800 text-yellow-200'
                      : 'bg-[#606C38] text-white'
                  }`}
                >
                  {results.riskLevel} Risk Level
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Connectivity */}
                <div className="p-3 rounded-xl bg-black/25 border border-white/5">
                  <span className="text-[#FEFAE0]/60 block font-mono text-[11px]">Canopy Connectivity</span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-2xl font-serif font-bold text-[#FEFAE0]">
                      {results.connectivityAfter}%
                    </span>
                    <span
                      className={`font-mono text-xs font-bold ${
                        results.connectivityChangePct < 0 ? 'text-[#BC6C25]' : 'text-[#606C38]'
                      }`}
                    >
                      {results.connectivityChangePct > 0 ? '+' : ''}
                      {results.connectivityChangePct}%
                    </span>
                  </div>
                  <span className="text-[10px] text-[#FEFAE0]/50 block mt-0.5">
                    Baseline: {results.connectivityBefore}%
                  </span>
                </div>

                {/* Canopy Shade */}
                <div className="p-3 rounded-xl bg-black/25 border border-white/5">
                  <span className="text-[#FEFAE0]/60 block font-mono text-[11px]">Canopy Shadow Area</span>
                  <div className="text-lg font-serif font-bold text-[#FEFAE0] mt-1">
                    {results.canopyAreaAfterSqM.toLocaleString('en-US')} m²
                  </div>
                  {results.canopyAreaLostSqM > 0 && (
                    <span className="text-[11px] font-mono text-[#BC6C25] font-semibold block">
                      -{results.canopyAreaLostSqM.toLocaleString('en-US')} m² lost
                    </span>
                  )}
                </div>

                {/* Isolated Clusters */}
                <div className="p-3 rounded-xl bg-black/25 border border-white/5">
                  <span className="text-[#FEFAE0]/60 block font-mono text-[11px]">Isolated Clusters</span>
                  <div className="text-lg font-serif font-bold text-[#DDA15E] mt-1">
                    {results.networkTopology.isolatedCanopyIslands} components
                  </div>
                  <span className="text-[10px] text-[#FEFAE0]/50 block">
                    Giant Component: {Math.round(results.networkTopology.giantComponentRatio * 100)}%
                  </span>
                </div>

                {/* Microclimate Impact */}
                <div className="p-3 rounded-xl bg-black/25 border border-white/5">
                  <span className="text-[#FEFAE0]/60 block font-mono text-[11px]">Microclimate Buffer</span>
                  <div className="text-lg font-serif font-bold text-[#FEFAE0] mt-1">
                    +{results.microclimateTempRiseEstimateC}°C
                  </div>
                  <span className="text-[10px] text-[#FEFAE0]/50 block">Localized heat spike</span>
                </div>
              </div>

              {/* Dynamic Impact Summary */}
              <div className="mt-3 text-xs text-[#FEFAE0]/90 leading-relaxed bg-[#606C38]/20 p-2.5 rounded-xl border border-[#606C38]/30">
                {results.impactSummary}
              </div>
            </div>
          )}

          {isSimulating && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-30 flex items-center justify-center">
              <div className="glass-panel-forest p-6 rounded-2xl text-center text-[#FEFAE0] border border-[#FEFAE0]/20 shadow-2xl">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#DDA15E] mx-auto mb-3"></div>
                <div className="font-serif text-lg font-bold text-[#FEFAE0]">Recalculating Spatial Network...</div>
                <div className="text-xs font-mono text-[#DDA15E] mt-1">Measuring Haversine overlaps & centrality</div>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls & Biodata Sidebar */}
        <aside className="w-96 bg-[#283618] text-[#FEFAE0] border-l border-[#FEFAE0]/15 overflow-y-auto p-6 shadow-2xl flex flex-col justify-between z-20">
          <div className="space-y-6">
            {/* Selected Node Header */}
            {selectedTree ? (
              <div className="p-4 rounded-2xl bg-white/5 border border-[#FEFAE0]/15">
                <div className="flex items-center justify-between text-xs font-mono text-[#DDA15E] mb-1">
                  <span>SELECTED TARGET</span>
                  <span>{selectedTree.treeNumber}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#FEFAE0]">
                  {selectedTree.commonName || selectedTree.species}
                </h3>
                <div className="text-xs italic text-[#FEFAE0]/70">{selectedTree.species}</div>
                <div className="text-xs text-[#DDA15E] mt-1">
                  Age ~{selectedTree.age}y &bull; Canopy {selectedTree.canopyRadius}m &bull; Height {selectedTree.height}m
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-white/5 text-center text-xs text-[#FEFAE0]/60">
                Click any tree on the Cubbon Park map to target it for simulation.
              </div>
            )}

            {/* Action Mode Tabs */}
            <div>
              <div className="text-xs font-mono font-bold text-[#DDA15E] uppercase tracking-wider mb-2">
                Choose Intervention
              </div>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-black/30 border border-white/10 text-xs">
                <button
                  onClick={() => setActionTab('remove')}
                  className={`py-1.5 rounded-lg font-semibold transition-all ${
                    actionTab === 'remove'
                      ? 'bg-[#BC6C25] text-white shadow'
                      : 'text-[#FEFAE0]/70 hover:text-white'
                  }`}
                >
                  ✂️ Remove
                </button>
                <button
                  onClick={() => setActionTab('plant')}
                  className={`py-1.5 rounded-lg font-semibold transition-all ${
                    actionTab === 'plant'
                      ? 'bg-[#606C38] text-white shadow'
                      : 'text-[#FEFAE0]/70 hover:text-white'
                  }`}
                >
                  🌱 Plant
                </button>
                <button
                  onClick={() => setActionTab('bridge')}
                  className={`py-1.5 rounded-lg font-semibold transition-all ${
                    actionTab === 'bridge'
                      ? 'bg-[#DDA15E] text-[#283618] shadow font-bold'
                      : 'text-[#FEFAE0]/70 hover:text-white'
                  }`}
                >
                  🌉 Bridge
                </button>
              </div>
            </div>

            {/* Tab 1: Remove Tree */}
            {actionTab === 'remove' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200 leading-relaxed">
                  <strong>Simulate Felling / Construction Clearance:</strong> Removes this node from the living canopy network. 
                  Models branch interruption for Grey Slender Loris and arbor-dwelling wildlife.
                </div>
                <button
                  onClick={handleRemoveSelectedTree}
                  disabled={!selectedTree || selectedTree.status === 'removed'}
                  className="w-full py-3 px-4 rounded-xl bg-[#BC6C25] hover:bg-[#d07e35] disabled:bg-gray-700 disabled:cursor-not-allowed text-[#FEFAE0] font-bold text-xs shadow-lg transition-all"
                >
                  {selectedTree?.status === 'removed' ? 'Already Removed' : 'Simulate Felling Selected Tree'}
                </button>
              </div>
            )}

            {/* Tab 2: Plant Native Sapling */}
            {actionTab === 'plant' && (
              <div className="space-y-3">
                <div className="text-xs text-[#FEFAE0]/80">
                  Select an indigenous Cubbon Park species to plant near this location:
                </div>
                <select
                  value={plantSpeciesSerial}
                  onChange={(e) => setPlantSpeciesSerial(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-[#FEFAE0]/20 text-xs text-[#FEFAE0] focus:outline-none focus:border-[#DDA15E]"
                >
                  {nativeSpeciesOptions.map((s) => (
                    <option key={s.serialNo} value={s.serialNo} className="bg-[#283618] text-[#FEFAE0]">
                      {s.commonName} ({s.scientificName})
                    </option>
                  ))}
                </select>

                <div>
                  <div className="flex justify-between text-xs text-[#FEFAE0]/70 mb-1">
                    <span>Target Canopy Spread:</span>
                    <span className="font-bold text-[#DDA15E]">{plantCanopyRadius} meters</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={18}
                    value={plantCanopyRadius}
                    onChange={(e) => setPlantCanopyRadius(parseInt(e.target.value, 10))}
                    className="w-full accent-[#606C38]"
                  />
                </div>

                <button
                  onClick={handlePlantSapling}
                  className="w-full py-3 px-4 rounded-xl bg-[#606C38] hover:bg-[#738244] text-[#FEFAE0] font-bold text-xs shadow-lg transition-all"
                >
                  Plant Compensatory Native Sapling
                </button>
              </div>
            )}

            {/* Tab 3: Aerial Canopy Bridge */}
            {actionTab === 'bridge' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-[#DDA15E]/20 border border-[#DDA15E]/30 text-xs text-[#FEFAE0] leading-relaxed">
                  <strong>Arboreal Wildlife Crossing:</strong> Installs high-tension natural fiber rope bridges across branch gaps. 
                  Allows Grey Slender Loris and Indian Giant Squirrels to safely cross roadways.
                </div>
                <button
                  onClick={handleAddCanopyBridge}
                  className="w-full py-3 px-4 rounded-xl bg-[#DDA15E] hover:bg-[#e5b377] text-[#283618] font-bold text-xs shadow-lg transition-all"
                >
                  Install Canopy Rope Bridge
                </button>
              </div>
            )}

            {/* Affected Wildlife Feed */}
            {results && results.affectedFauna.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-[#DDA15E] uppercase tracking-wider">
                  Impacted Fauna Guilds
                </div>
                <div className="space-y-2">
                  {results.affectedFauna.map((fauna, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-black/20 border border-white/5 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#FEFAE0] flex items-center space-x-1.5">
                          <span>{fauna.icon}</span>
                          <span>{fauna.speciesName}</span>
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            fauna.impactLevel === 'Critical'
                              ? 'bg-red-900/80 text-red-200'
                              : 'bg-yellow-900/80 text-yellow-200'
                          }`}
                        >
                          {fauna.impactLevel}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#FEFAE0]/70 leading-relaxed">{fauna.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Interventions History */}
            {actions.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-[#DDA15E] uppercase tracking-wider">
                  Applied Interventions ({actions.length})
                </div>
                <div className="space-y-1 text-xs font-mono text-[#FEFAE0]/80 max-h-28 overflow-y-auto">
                  {actions.map((act, i) => (
                    <div key={i} className="p-1.5 rounded bg-white/5 flex items-center justify-between">
                      <span>
                        {act.actionType === 'remove_tree'
                          ? `✂️ Felled Tree #${act.targetId}`
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
        </aside>
      </div>
    </div>
  );
}

export default function SimulatorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#283618] flex items-center justify-center text-[#FEFAE0]">
          <div className="text-center font-mono">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#DDA15E] mx-auto mb-3"></div>
            Loading Habitat Simulator...
          </div>
        </div>
      }
    >
      <SimulatorContent />
    </Suspense>
  );
}
