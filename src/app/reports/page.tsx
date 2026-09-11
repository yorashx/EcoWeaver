'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { SimulationEngine } from '@/lib/simulation-engine';
import { dataStore } from '@/lib/data-store';
import { SimulationAction } from '@/types';

function ReportsContent() {
  const searchParams = useSearchParams();
  const [selectedScenario, setSelectedScenario] = useState<'current' | 'tree21' | 'avenue' | 'restoration'>(
    searchParams.get('scenario') === 'current' ? 'current' : 'tree21'
  );
  const [currentActions] = useState<SimulationAction[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = sessionStorage.getItem('ecoweaver-report-actions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Compute live report data dynamically
  const reportData = (() => {
    const trees = dataStore.getTrees({ status: 'active' });
    const corridors = dataStore.getCorridors();
    const engine = new SimulationEngine(trees, corridors);

    if (selectedScenario === 'current') {
      const sim = engine.simulate(currentActions);
      const removedTrees = currentActions
        .filter((action) => action.actionType === 'remove_tree')
        .map((action) => trees.find((tree) => tree.id === action.targetId)?.treeNumber)
        .filter(Boolean);
      const plantedTrees = currentActions.filter(
        (action) => action.actionType === 'plant_tree' || action.actionType === 'add_tree'
      ).length;
      const bridgeCount = currentActions.filter((action) => action.actionType === 'add_bridge').length;

      return {
        title: 'Scenario-Specific Ecological Impact Assessment',
        scenarioName: `${removedTrees.length} removal(s), ${plantedTrees} planting(s), ${bridgeCount} bridge(s)`,
        targetSubject: removedTrees.length > 0 ? removedTrees.join(', ') : 'Proposed restoration intervention',
        location: 'Cubbon Park, Bengaluru',
        auditDate: 'March 2026',
        preparedFor: 'Project decision-makers & ecological stewards',
        sim,
      };
    } else if (selectedScenario === 'tree21') {
      const sim = engine.simulate([
        {
          id: 1,
          simulationId: null,
          actionType: 'remove_tree',
          targetId: 21,
          parameters: null,
          geometry: null,
        },
      ]);
      return {
        title: 'Ecological Impact Assessment: Centennial Rain Tree #021 Clearance',
        scenarioName: 'Queen Promenade Pavement & Parking Clearance',
        targetSubject: 'Rain Tree #021 (Samanea saman, 74 yrs, 22.5m canopy)',
        location: 'Cubbon Park, Bengaluru (12.9762° N, 77.5929° E)',
        auditDate: 'March 2026',
        preparedFor: 'Bruhat Bengaluru Mahanagara Palike (BBMP) & Horticulture Dept',
        sim,
      };
    } else if (selectedScenario === 'avenue') {
      const sim = engine.simulate([
        { id: 1, simulationId: null, actionType: 'remove_tree', targetId: 21, parameters: null, geometry: null },
        { id: 2, simulationId: null, actionType: 'remove_tree', targetId: 5, parameters: null, geometry: null },
        { id: 3, simulationId: null, actionType: 'remove_tree', targetId: 10, parameters: null, geometry: null },
      ]);
      return {
        title: 'Compound Impact Assessment: High Court Avenue Multi-Tree Felling',
        scenarioName: 'Attara Kacheri Multi-Tree Infrastructure Corridor',
        targetSubject: '3 Mature Heritage Avenue Trees (Rain Tree, Tamarind, Gulmohar)',
        location: 'High Court Avenue Ridge, Cubbon Park',
        auditDate: 'March 2026',
        preparedFor: 'Urban Infrastructure Authority & Karnataka Forest Department',
        sim,
      };
    } else {
      // Restoration
      const sim = engine.simulate([
        { id: 1, simulationId: null, actionType: 'remove_tree', targetId: 21, parameters: null, geometry: null },
        { id: 2, simulationId: null, actionType: 'add_bridge', targetId: 21, parameters: { treeId1: 21, treeId2: 1 }, geometry: null },
        { id: 3, simulationId: null, actionType: 'plant_tree', targetId: null, parameters: { canopyRadius: 10 }, geometry: null },
      ]);
      return {
        title: 'Mitigated Scenario: Compensatory Rewilding & Arboreal Bridge',
        scenarioName: 'Canopy Rope Bridge & 4x Ficus Rewilding Buffer',
        targetSubject: 'Compensated Intervention at Queen Promenade Link',
        location: 'Central Arterial Link, Cubbon Park',
        auditDate: 'March 2026',
        preparedFor: 'Ecological Restoration Taskforce & Citizen Stewards',
        sim,
      };
    }
  })();

  const { sim } = reportData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FEFAE0] text-[#283618] pt-18">
      <div className="print:hidden">
        <Navigation />
      </div>

      {/* Control Bar (hidden during printing) */}
      <div className="print:hidden bg-[#283618] text-[#FEFAE0] border-b border-[#FEFAE0]/15 px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-[#DDA15E] uppercase block">
              Audited Ecological Assessment
            </span>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#FEFAE0]">
              Environmental Impact Report Cards
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value as any)}
              className="px-3 py-2 text-xs rounded-xl bg-white/10 border border-[#FEFAE0]/20 text-[#FEFAE0] focus:outline-none focus:border-[#DDA15E]"
            >
              <option value="current" className="bg-[#283618] text-[#FEFAE0]" disabled={currentActions.length === 0}>
                Current Simulator Scenario {currentActions.length === 0 ? '(run a simulation first)' : ''}
              </option>
              <option value="tree21" className="bg-[#283618] text-[#FEFAE0]">
                Scenario 1: Tree #021 Felling (Loris Severance)
              </option>
              <option value="avenue" className="bg-[#283618] text-[#FEFAE0]">
                Scenario 2: Compound Multi-Tree Clearance
              </option>
              <option value="restoration" className="bg-[#283618] text-[#FEFAE0]">
                Scenario 3: Mitigated Rewilding & Rope Bridge
              </option>
            </select>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#DDA15E] hover:bg-[#e5b377] text-[#283618] font-bold text-xs rounded-xl shadow transition-all flex items-center space-x-1.5"
            >
              <span>🖨️</span>
              <span>Print / Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Printable Report Document */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-10 print:p-0 print:m-0">
        <article className="bg-white rounded-3xl border border-[#606C38]/20 shadow-xl overflow-hidden print:border-none print:shadow-none">
          {/* Header Band */}
          <header className="bg-gradient-to-r from-[#283618] via-[#606C38] to-[#283618] text-[#FEFAE0] p-8 sm:p-10 border-b border-[#FEFAE0]/15">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-mono text-[#DDA15E] uppercase tracking-wider mb-1">
                  ECOWEAVER AI &bull; URBAN ECOLOGICAL TWIN
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FEFAE0] leading-tight">
                  {reportData.title}
                </h2>
                <div className="text-xs font-mono text-[#FEFAE0]/80 mt-2">
                  Document Reference: EW-CP-2026-089 &bull; Standardized Graph-Theory Assessment
                </div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-[#FEFAE0] flex items-center justify-center text-3xl text-[#283618] shadow-md flex-shrink-0">
                🌿
              </div>
            </div>
          </header>

          <div className="p-8 sm:p-10 space-y-8 text-xs font-sans">
            {/* Metadata Table */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-[#606C38]/15">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#283618]/60 block mb-1">Proposed Action</span>
                <span className="font-bold text-[#283618]">{reportData.scenarioName}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#283618]/60 block mb-1">Target Subject</span>
                <span className="font-bold text-[#283618]">{reportData.targetSubject}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#283618]/60 block mb-1">Location</span>
                <span className="font-bold text-[#283618]">{reportData.location}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#283618]/60 block mb-1">Overall Risk</span>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded font-mono font-bold uppercase text-[11px] ${
                    sim.riskLevel === 'critical'
                      ? 'bg-red-100 text-red-900 border border-red-300'
                      : sim.riskLevel === 'high'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-green-100 text-green-900 border border-green-300'
                  }`}
                >
                  🔴 {sim.riskLevel.toUpperCase()} RISK
                </span>
              </div>
            </div>

            {/* Executive Summary */}
            <section className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-[#283618] uppercase tracking-wider">
                1. Executive Scientific Summary
              </h3>
              <p className="text-sm text-[#283618]/85 leading-relaxed bg-[#FEFAE0] p-4 rounded-2xl border border-[#DDA15E]/30 font-sans">
                {sim.impactSummary} The affected network currently contains {sim.networkTopology.isolatedCanopyIslands} canopy
                cluster{sim.networkTopology.isolatedCanopyIslands === 1 ? '' : 's'}, with the largest connected component
                representing {Math.round(sim.networkTopology.giantComponentRatio * 100)}% of active trees. The modeled
                microclimate change is +{sim.microclimateTempRiseEstimateC}°C, and the identified priority actions below
                provide the recommended response for this scenario.
              </p>
            </section>

            {/* Quantitative Network Metrics Table */}
            <section className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-[#283618] uppercase tracking-wider">
                2. Quantitative Ecological Metrics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-[#606C38]/20 shadow-sm">
                  <span className="text-[10px] font-mono uppercase text-[#283618]/60 block">Habitat Connectivity</span>
                  <div className="text-2xl font-serif font-bold text-[#283618] mt-1">
                    {sim.connectivityBefore}% &rarr;{' '}
                    <span className={sim.connectivityChangePct < 0 ? 'text-[#BC6C25]' : 'text-[#606C38]'}>
                      {sim.connectivityAfter}%
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#BC6C25] font-semibold">
                    {sim.connectivityChangePct}% delta
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#606C38]/20 shadow-sm">
                  <span className="text-[10px] font-mono uppercase text-[#283618]/60 block">Canopy Shadow Area</span>
                  <div className="text-xl font-serif font-bold text-[#283618] mt-1">
                    {sim.canopyAreaAfterSqM.toLocaleString('en-US')} m²
                  </div>
                  <span className="text-[10px] font-mono text-[#BC6C25] font-semibold">
                    -{sim.canopyAreaLostSqM.toLocaleString('en-US')} m² lost
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#606C38]/20 shadow-sm">
                  <span className="text-[10px] font-mono uppercase text-[#283618]/60 block">Keystone Nodes Severed</span>
                  <div className="text-2xl font-serif font-bold text-[#BC6C25] mt-1">
                    {sim.criticalNodesLost}
                  </div>
                  <span className="text-[10px] text-[#283618]/60">Centennial arterial trees</span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#606C38]/20 shadow-sm">
                  <span className="text-[10px] font-mono uppercase text-[#283618]/60 block">Carbon Sequestration</span>
                  <div className="text-xl font-serif font-bold text-[#283618] mt-1">
                    -{sim.carbonSequestrationLostKgPerYr} kg
                  </div>
                  <span className="text-[10px] text-[#283618]/60">Annual lost sink capacity</span>
                </div>
              </div>
            </section>

            {/* Multispecies Fauna Impact Matrix */}
            <section className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-[#283618] uppercase tracking-wider">
                3. Non-Human Species Impact Assessment
              </h3>
              <div className="space-y-2">
                {sim.affectedFauna.map((fauna, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-[#606C38]/20 flex items-start space-x-3 text-xs"
                  >
                    <span className="text-2xl">{fauna.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-[#283618]">{fauna.speciesName}</span>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            fauna.impactLevel === 'Critical'
                              ? 'bg-red-100 text-red-900 border border-red-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}
                        >
                          {fauna.impactLevel} Severity
                        </span>
                      </div>
                      <p className="text-[#283618]/80 leading-relaxed font-sans">{fauna.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Prescriptive Mitigation Blueprint */}
            <section className="space-y-3">
              <h3 className="font-serif text-lg font-bold text-[#283618] uppercase tracking-wider">
                4. Prescriptive Mitigation Blueprint
              </h3>
              <div className="space-y-2.5">
                {sim.mitigationStrategies.map((strat, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-4 rounded-2xl bg-[#606C38]/10 border border-[#606C38]/20 text-xs flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-[#283618]">{strat.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#BC6C25] text-white">
                          {strat.priority} Priority
                        </span>
                      </div>
                      <p className="text-[#283618]/80 leading-relaxed">{strat.action}</p>
                      <div className="text-[11px] font-mono text-[#606C38] font-semibold">
                        Implementation Window: {strat.timeline}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-[10px] font-mono text-[#283618]/60 block">Restoration Factor</span>
                      <span className="font-serif text-xl font-bold text-[#606C38]">
                        +{strat.effectivenessPct}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Signature & Custodian Sign-off */}
            <footer className="pt-8 border-t border-[#606C38]/20 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-[11px] font-mono text-[#283618]/70">
              <div>
                <div>Audited by EcoWeaver AI Environmental Engine v2.4</div>
                <div>Cubbon Park Planetary Stewardship Consortium</div>
                <div>Bengaluru, Karnataka &bull; ISO-14001 Compliant Framework</div>
              </div>
              <div className="text-right">
                <div className="font-serif text-base font-bold text-[#283618]">Planetary Stewardship Certified</div>
                <div className="text-[#606C38]">🌿 Non-Human Coexistence Protocol Verified</div>
              </div>
            </footer>
          </div>
        </article>
      </main>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#283618] flex items-center justify-center text-[#FEFAE0]">
          Loading ecological report...
        </div>
      }
    >
      <ReportsContent />
    </Suspense>
  );
}
