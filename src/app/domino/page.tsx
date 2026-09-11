'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

interface DominoStep {
  step: number;
  title: string;
  subtitle: string;
  description: string;
  impactScore: string;
  icon: string;
  accent: string;
}

const DOMINO_SCENARIOS: Record<string, { title: string; species: string; target: string; steps: DominoStep[] }> = {
  loris: {
    title: 'Grey Slender Loris Arterial Severance',
    species: 'Loris lydekkerianus',
    target: 'Rain Tree #021 (74 yrs old, 22.5m canopy)',
    steps: [
      {
        step: 1,
        title: 'Tree Felling for Pavement Widening',
        subtitle: 'Initial Anthropogenic Intervention',
        description:
          'Tree #021, an 82-year-old Samanea saman with a 22.5-meter canopy spread, is cleared for a new road widening and vehicle parking turnoff along Queen Promenade.',
        impactScore: '-1 node',
        icon: '🪓',
        accent: '#BC6C25',
      },
      {
        step: 2,
        title: '22-Meter Physical Canopy Gap Opened',
        subtitle: 'Spatial Network Discontinuity',
        description:
          'Continuous branch contact between Central Promenade and Kingfisher Pond is severed. The maximum natural leap distance for Lorises (1.5m) is exceeded by 1400%.',
        impactScore: '-22.5m Canopy Overlap',
        icon: '⚠️',
        accent: '#BC6C25',
      },
      {
        step: 3,
        title: 'Forced Ground Descent & Predation Surge',
        subtitle: 'Non-Human Vulnerability Spike',
        description:
          'Unable to traverse overhead, Lorises descend to street level at dusk. Urban mortality surges due to stray dog attacks, vehicular collisions, and light disorientation.',
        impactScore: '4x Mortality Risk',
        icon: '🦎',
        accent: '#DDA15E',
      },
      {
        step: 4,
        title: 'Central Corridor Drops to 56% Connectivity',
        subtitle: 'Sub-threshold Habitat Isolation',
        description:
          'The entire Cubbon Park Loris population is bifurcated into isolated western and eastern gene pools, preventing territorial juvenile dispersal.',
        impactScore: 'Connectivity 86% → 56%',
        icon: '📉',
        accent: '#DDA15E',
      },
      {
        step: 5,
        title: 'Insect Pest Balance & Ecosystem Collapse',
        subtitle: 'Secondary Ecological Cascade',
        description:
          'Lorises consume up to 200 toxic nocturnal insects (caterpillars, beetles) per night. Their absence triggers defoliation spikes in nearby ornamental floral gardens.',
        impactScore: 'Secondary Pest Outbreak',
        icon: '🐛',
        accent: '#606C38',
      },
      {
        step: 6,
        title: 'Localized Urban Heat Island Spike',
        subtitle: 'Microclimate Degradation',
        description:
          'Loss of 1,590 m² of dense leaf shading leads to a +0.45°C ground surface temperature increase, altering soil moisture and eliminating humidity-dependent tree frogs.',
        impactScore: '+0.45°C Heat Buffer Lost',
        icon: '🌡️',
        accent: '#283618',
      },
    ],
  },
  banyan: {
    title: 'Grandmother Banyan #001 Disturbance',
    species: 'Ficus benghalensis & Spotted Owlet',
    target: 'Heritage Banyan #001 (145 yrs old, 36m canopy)',
    steps: [
      {
        step: 1,
        title: 'Heritage Banyan Root Pruning & Paving',
        subtitle: 'Underground Mycelial & Prop Root Shock',
        description:
          'Trenching for underground cabling severs 14 aerial prop roots of the 145-year-old Grandmother Banyan near Bandstand.',
        impactScore: '14 Prop Roots Damaged',
        icon: '🚜',
        accent: '#BC6C25',
      },
      {
        step: 2,
        title: 'Loss of 4,000 m² Shading & Upper Cavities',
        subtitle: 'Keystone Cavity Eviction',
        description:
          'Crown dieback causes trunk fissures. Three active nest cavities of breeding Spotted Owlets (Athene brama) collapse.',
        impactScore: '3 Cavity Nests Destroyed',
        icon: '🦉',
        accent: '#BC6C25',
      },
      {
        step: 3,
        title: 'Fig Crop Failure for 40+ Avian Species',
        subtitle: 'Year-Round Trophic Supply Severed',
        description:
          'Ficus benghalensis is an asynchronous fruiting keystone providing fruit during dry months. Over 40 bird species and fruit bats lose their emergency food anchor.',
        impactScore: '40+ Species Food Deficit',
        icon: '🍎',
        accent: '#DDA15E',
      },
      {
        step: 4,
        title: 'Giant Squirrel Home Range Severance',
        subtitle: 'Upper Canopy Disconnect',
        description:
          'Indian Giant Squirrels (Ratufa indica) can no longer bridge the gap between Bandstand and Central Library, abandoning their foraging runs.',
        impactScore: 'Territory Cut by 60%',
        icon: '🐿️',
        accent: '#DDA15E',
      },
      {
        step: 5,
        title: 'Avian Dispersal Deficit & Seed Infertility',
        subtitle: 'Park-Wide Natural Regeneration Halts',
        description:
          'Without fruit-eating birds dispersing seeds across the park, understorey regeneration of sandalwood and jamun saplings drops sharply.',
        impactScore: '-70% Natural Seedlings',
        icon: '🌱',
        accent: '#606C38',
      },
      {
        step: 6,
        title: 'Heritage Microclimate Decoupling',
        subtitle: 'Irreversible Living Heritage Loss',
        description:
          'The microclimate buffer that cooled the Bandstand by 3.5°C compared to outer MG Road degrades, accelerating asphalt thermal absorption.',
        impactScore: 'Living Heritage Eradicated',
        icon: '💔',
        accent: '#283618',
      },
    ],
  },
};

export default function DominoPage() {
  const [currentActionCount] = useState(() => {
    if (typeof window === 'undefined') return 0;
    try {
      const actions = JSON.parse(sessionStorage.getItem('ecoweaver-report-actions') || '[]');
      return Array.isArray(actions) ? actions.length : 0;
    } catch {
      return 0;
    }
  });
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<'current' | 'loris' | 'banyan'>(
    currentActionCount > 0 ? 'current' : 'loris'
  );
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const scenario = selectedScenarioKey === 'current'
    ? {
        title: 'Current Simulator Intervention Cascade',
        species: 'Affected species identified by the simulation engine',
        target: `${currentActionCount} intervention${currentActionCount === 1 ? '' : 's'} from the active workbench`,
        steps: [
          { step: 1, title: 'Intervention enters the canopy network', subtitle: 'Modeled planning decision', description: `The workbench applies ${currentActionCount} recorded intervention${currentActionCount === 1 ? '' : 's'} to the Cubbon Park ecological graph.`, impactScore: `${currentActionCount} action${currentActionCount === 1 ? '' : 's'}`, icon: '🧭', accent: '#DDA15E' },
          { step: 2, title: 'Habitat connections are recalculated', subtitle: 'Spatial network response', description: 'Tree removals, new plantings, and bridges change which canopy nodes can still exchange movement and shade.', impactScore: 'Graph recalculated', icon: '🕸️', accent: '#606C38' },
          { step: 3, title: 'Species exposure is identified', subtitle: 'Multispecies consequence', description: 'The engine flags fauna guilds associated with removed keystone trees and highlights where movement or food access is most constrained.', impactScore: 'Species at risk', icon: '🦎', accent: '#BC6C25' },
          { step: 4, title: 'Mitigation becomes an actionable choice', subtitle: 'Decision support', description: 'Use the report to compare aerial bridges, native rewilding, and understorey buffers before approving the intervention.', impactScore: 'Response plan', icon: '🌱', accent: '#DDA15E' },
        ],
      }
    : DOMINO_SCENARIOS[selectedScenarioKey];

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStep((prev) => {
          if (prev >= scenario.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2400);
    }
    return () => clearInterval(timer);
  }, [isPlaying, scenario.steps.length]);

  const handlePlayToggle = () => {
    if (activeStep >= scenario.steps.length - 1) {
      setActiveStep(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveStep(0);
  };

  return (
    <div className="min-h-screen bg-[#283618] text-[#FEFAE0] pt-18 selection:bg-[#DDA15E] selection:text-[#283618]">
      <Navigation />

      {/* Header Banner */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 border-b border-[#FEFAE0]/15 bg-nature-grid-dark">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#DDA15E] mb-2">
                <span>MULTISPECIES CASUALTY CHAIN</span>
                <span>&bull;</span>
                <span>CUBBON PARK CASES</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#FEFAE0]">
                Nature&apos;s Domino Effect
              </h1>
              <p className="text-sm sm:text-base text-[#FEFAE0]/80 mt-2 max-w-2xl leading-relaxed">
                One urban construction decision triggers a multi-order ecological cascade. 
                Trace how physical canopy clearance cascades down into genetic isolation, trophic collapse, and microclimate failure.
              </p>
            </div>

            {/* Scenario Selector */}
            <div className="flex flex-col sm:flex-row gap-2 bg-black/30 p-1.5 rounded-2xl border border-white/10">
              {currentActionCount > 0 && (
                <button
                  onClick={() => {
                    setSelectedScenarioKey('current');
                    setActiveStep(0);
                    setIsPlaying(false);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedScenarioKey === 'current'
                      ? 'bg-[#DDA15E] text-[#283618] shadow-md'
                      : 'text-[#FEFAE0]/70 hover:text-white'
                  }`}
                >
                  🧭 Current Workbench Cascade
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedScenarioKey('loris');
                  setActiveStep(0);
                  setIsPlaying(false);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedScenarioKey === 'loris'
                    ? 'bg-[#606C38] text-[#FEFAE0] shadow-md'
                    : 'text-[#FEFAE0]/70 hover:text-white'
                }`}
              >
                🦎 Loris Corridor Severance
              </button>
              <button
                onClick={() => {
                  setSelectedScenarioKey('banyan');
                  setActiveStep(0);
                  setIsPlaying(false);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedScenarioKey === 'banyan'
                    ? 'bg-[#BC6C25] text-[#FEFAE0] shadow-md'
                    : 'text-[#FEFAE0]/70 hover:text-white'
                }`}
              >
                🦉 Heritage Banyan Disturbance
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Controls Bar */}
      <div className="bg-[#1b2510] border-b border-[#FEFAE0]/10 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-mono text-[#FEFAE0]/80">
            <strong>Target:</strong> <span className="text-[#DDA15E]">{scenario.target}</span> &bull; Focus Species:{' '}
            <span className="italic text-[#FEFAE0]">{scenario.species}</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-xs font-mono"
            >
              &larr; Prev
            </button>
            <button
              onClick={handlePlayToggle}
              className="px-5 py-2 rounded-xl text-xs font-bold font-mono bg-[#DDA15E] hover:bg-[#e5b377] text-[#283618] shadow transition-transform transform active:scale-95"
            >
              {isPlaying ? '⏸ Pause Cascade' : activeStep >= scenario.steps.length - 1 ? '↺ Replay' : '▶ Play Sequence'}
            </button>
            <button
              onClick={() => setActiveStep(Math.min(scenario.steps.length - 1, activeStep + 1))}
              disabled={activeStep >= scenario.steps.length - 1}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-xs font-mono"
            >
              Next &rarr;
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Domino Steps Timeline */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative border-l-2 border-[#DDA15E]/30 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12">
          {scenario.steps.map((item, index) => {
            const isRevealed = index <= activeStep;
            const isCurrent = index === activeStep;

            return (
              <div
                key={item.step}
                className={`relative transition-all duration-700 ${
                  isRevealed ? 'opacity-100 translate-y-0' : 'opacity-25 translate-y-4'
                }`}
              >
                {/* Step Marker Dot */}
                <div
                  className={`absolute -left-[35px] sm:-left-[51px] top-1.5 w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                    isCurrent
                      ? 'bg-[#DDA15E] text-[#283618] ring-4 ring-[#DDA15E]/30 scale-125'
                      : isRevealed
                      ? 'bg-[#606C38] text-[#FEFAE0]'
                      : 'bg-white/10 text-[#FEFAE0]/40'
                  }`}
                >
                  {item.step}
                </div>

                {/* Domino Step Card */}
                <article
                  className={`p-6 sm:p-7 rounded-3xl border transition-all ${
                    isCurrent
                      ? 'bg-[#202b13] border-[#DDA15E] shadow-2xl scale-[1.01]'
                      : 'bg-white/5 border-[#FEFAE0]/10 hover:border-[#FEFAE0]/25'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{item.icon}</span>
                      <div>
                        <span className="text-[11px] font-mono text-[#DDA15E] uppercase tracking-wider block">
                          Stage 0{item.step} &bull; {item.subtitle}
                        </span>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#FEFAE0]">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#BC6C25]/30 text-[#DDA15E] border border-[#BC6C25]/40">
                      {item.impactScore}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-[#FEFAE0]/85 font-sans leading-relaxed">
                    {item.description}
                  </p>
                </article>
              </div>
            );
          })}
        </div>

        {/* Conclusion Callout & Mitigation Link */}
        {activeStep >= scenario.steps.length - 1 && (
          <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-[#606C38] to-[#283618] border border-[#FEFAE0]/30 shadow-2xl text-center space-y-4">
            <span className="text-3xl inline-block">🌿</span>
            <h2 className="font-serif text-3xl font-bold text-[#FEFAE0]">
              Every Tree Sustains a Non-Human World
            </h2>
            <p className="text-sm sm:text-base text-[#FEFAE0]/90 max-w-2xl mx-auto leading-relaxed">
              Urban planning can avert this domino effect. By modeling connectivity in advance, cities can 
              route infrastructure around critical keystone trees, plant compensatory native understoreys, 
              and erect canopy rope bridges to keep arboreal highways intact.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                href="/simulator"
                className="px-6 py-3 rounded-xl bg-[#DDA15E] hover:bg-[#e5b377] text-[#283618] font-bold text-xs shadow-lg transition-transform active:scale-95"
              >
                🔬 Test Compensatory Mitigation in Simulator
              </Link>
              <Link
                href="/reports"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-[#FEFAE0] font-semibold text-xs border border-white/20 transition-colors"
              >
                📜 Generate Impact Assessment Report
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
