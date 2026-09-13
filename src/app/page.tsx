'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { CUBBON_ZONES } from '@/lib/cubbon-species-data';
import { IISC_ZONES } from '@/lib/iisc-tree-inventory';

const AUDIO_SAMPLES = [
  {
    id: 'loris',
    title: 'Grey Slender Loris Whistle',
    species: 'Loris lydekkerianus',
    kannada: 'ಕಾಡುಪಾಪ',
    location: 'IISc Canopy (Yeshwantpur)',
    freq: '14.2 kHz (Ultrasonic)',
    audioUrl: '/audio/recording_one.ogg',
    badge: 'Sanctuary Field Sample',
    badgeColor: '#849324',
    icon: '🦎',
  },
  {
    id: 'koel',
    title: 'Asian Koel Melodic Couplet',
    species: 'Eudynamys scolopaceus',
    kannada: 'ಕೋಗಿಲೆ',
    location: 'Cubbon Bamboo Grove',
    freq: '1.8 kHz (Avian Melody)',
    audioUrl: '/audio/recording_two.ogg',
    badge: 'Dawn Chorus',
    badgeColor: '#437F97',
    icon: '🐦',
  },
  {
    id: 'owlet',
    title: 'Spotted Owlet Roost Call',
    species: 'Athene brama',
    kannada: 'ಚುಕ್ಕೆ ಗೂಬೆ',
    location: 'Heritage Banyan #001',
    freq: '2.4 kHz (Nocturnal Pulse)',
    audioUrl: '/audio/recording_three.ogg',
    badge: 'Nocturnal Roost',
    badgeColor: '#FFB30F',
    icon: '🦉',
  },
];

export default function Home() {
  const [connectivity, setConnectivity] = useState(0);
  const [speciesCount, setSpeciesCount] = useState(0);
  const [treeCount, setTreeCount] = useState(0);
  const [corridorsActive, setCorridorsActive] = useState(0);

  // Audio preview state on front page
  const [activeSampleId, setActiveSampleId] = useState<string>('loris');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  // Animate counters on mount
  useEffect(() => {
    const animateValue = (setter: (v: number) => void, end: number, duration: number) => {
      let start = 0;
      const stepTime = 20;
      const totalSteps = duration / stepTime;
      const increment = end / totalSteps;
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setter(end);
          clearInterval(timer);
        } else {
          setter(Math.floor(start));
        }
      }, stepTime);
    };

    animateValue(setConnectivity, 94, 1500);
    animateValue(setSpeciesCount, 196, 1700);
    animateValue(setTreeCount, 310, 1900);
    animateValue(setCorridorsActive, 6, 1200);
  }, []);

  const handleToggleAudio = (sample: typeof AUDIO_SAMPLES[0]) => {
    if (activeSampleId === sample.id && isPlayingAudio) {
      audioPreviewRef.current?.pause();
      setIsPlayingAudio(false);
    } else {
      setActiveSampleId(sample.id);
      if (audioPreviewRef.current) {
        audioPreviewRef.current.src = sample.audioUrl;
        audioPreviewRef.current.play()
          .then(() => setIsPlayingAudio(true))
          .catch((e) => console.log('Audio autoplay prevented:', e));
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] text-[#01295F] selection:bg-[#FFB30F] selection:text-[#01295F]">
      <Navigation />

      {/* Hidden Audio Player for Interactive Frontpage Soundscapes */}
      <audio
        ref={audioPreviewRef}
        src="/audio/recording_one.ogg"
        onEnded={() => setIsPlayingAudio(false)}
      />

      {/* Hero Section */}
      <section
        style={{ backgroundColor: '#01295F' }}
        className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-[#01295F] text-white overflow-hidden bg-nature-grid-dark border-b border-[#437F97]/25"
      >
        {/* Glow Spheres */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#849324]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-[#FFB30F]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Nature Micro-tokens */}
        <div className="absolute top-24 left-[12%] text-2xl select-none opacity-80 animate-bounce duration-1000" style={{ animationDuration: '4s' }}>
          🦋
        </div>
        <div className="absolute top-36 right-[18%] text-3xl select-none opacity-80 animate-pulse">
          🦎
        </div>
        <div className="absolute bottom-20 left-[22%] text-2xl select-none opacity-70">
          🐿️
        </div>
        <div className="absolute bottom-28 right-[10%] text-3xl select-none opacity-80">
          🦉
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Dual-campus context badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono text-[#FFB30F] mb-8 backdrop-blur-md">
            <span>📍 Bengaluru Multispecies Twin</span>
            <span className="text-white/40">•</span>
            <span className="text-[#849324] font-bold">IISc (Yeshwantpur) Loris Sanctuary</span>
            <span className="text-white/40">•</span>
            <span>Cubbon Park Forest</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08]">
                Technology for <br />
                <span className="italic text-[#FFB30F] font-normal">all species.</span>
              </h1>

              <p className="text-lg sm:text-xl text-white/85 font-sans leading-relaxed max-w-2xl">
                A planetary stewardship platform modeling the living canopy of Bengaluru. 
                In urban Bengaluru, the elusive <strong className="text-[#FFB30F]">Grey Slender Loris (*Loris lydekkerianus*)</strong> now 
                survives <strong className="text-white font-semibold">only in the contiguous canopy of IISc near Yeshwantpur</strong>. 
                We simulate canopy connectivity and acoustic masking before development breaks habitats forever.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/map?mode=simulator"
                  className="px-6 py-3.5 bg-[#FFB30F] hover:bg-[#ffbf33] text-[#01295F] font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-2"
                >
                  <span>🔬</span>
                  <span>Simulate Canopy Changes</span>
                </Link>
                <Link
                  href="/map"
                  className="px-6 py-3.5 bg-[#849324] hover:bg-[#9db02e] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <span>🦎</span>
                  <span>Explore IISc Loris Map</span>
                </Link>
                <Link
                  href="/bioacoustics"
                  className="px-5 py-3.5 bg-white/10 hover:bg-white/15 text-white font-medium rounded-xl border border-white/20 transition-all flex items-center space-x-2"
                >
                  <span>📡</span>
                  <span>Bioacoustic AI Lab</span>
                </Link>
              </div>
            </div>

            {/* Living Canopy Stats Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#00193b]/90 rounded-3xl p-7 border border-[#437F97]/30 shadow-2xl relative backdrop-blur-xl space-y-6">
                <div className="flex items-center justify-between pb-5 border-b border-white/15">
                  <div>
                    <span className="text-xs uppercase font-mono text-[#FFB30F] tracking-wider font-semibold">Urban Vitals Monitor</span>
                    <h3 className="font-serif text-2xl font-bold text-white">Bengaluru Living Canopy</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#849324] text-white font-mono text-xs font-bold">
                    LIVE TWIN
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5">
                    <div className="font-serif text-4xl font-bold text-[#FFB30F]">{connectivity}%</div>
                    <div className="text-xs font-mono uppercase text-white/80 mt-1">IISc Canopy Integrity</div>
                    <div className="text-[11px] text-[#849324] mt-0.5">Continuous branch bridges</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5">
                    <div className="font-serif text-4xl font-bold text-white">{speciesCount}</div>
                    <div className="text-xs font-mono uppercase text-white/80 mt-1">Botanical Species</div>
                    <div className="text-[11px] text-white/50 mt-0.5">Ficus, Tamarind, Mahua</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5">
                    <div className="font-serif text-4xl font-bold text-[#849324]">{treeCount}+</div>
                    <div className="text-xs font-mono uppercase text-white/80 mt-1">Geo-Tagged Trees</div>
                    <div className="text-[11px] text-white/50 mt-0.5">Across IISc &amp; Cubbon</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5">
                    <div className="font-serif text-4xl font-bold text-[#437F97]">{corridorsActive}</div>
                    <div className="text-xs font-mono uppercase text-white/80 mt-1">Arboreal Corridors</div>
                    <div className="text-[11px] text-white/50 mt-0.5">Loris, Squirrel &amp; Bats</div>
                  </div>
                </div>

                {/* Loris Reality Callout */}
                <div className="p-3.5 rounded-2xl bg-[#849324]/20 border border-[#849324]/40 flex items-start space-x-3 text-xs text-white">
                  <span className="text-2xl">🦎</span>
                  <div>
                    <strong className="text-[#FFB30F] block">IISc Bangalore Sanctuary Notice:</strong>
                    <span>Grey Slender Lorises are now strictly confined to IISc near Yeshwantpur due to street fragmentation across the rest of the city.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW ELEMENT 1: Live Interactive Soundscape Wavelet Player */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-[#01295F]/10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#01295F] rounded-3xl p-6 sm:p-8 text-white border border-[#437F97]/30 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#FFB30F] mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#849324] animate-ping" />
                  <span>INTERACTIVE CANOPY SOUNDSCAPE PREVIEW</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  Listen to the Living Canopy Right Now
                </h3>
                <p className="text-xs sm:text-sm text-white/70 mt-1">
                  Click any species below to hear their acoustic signature captured from Bengaluru&apos;s tree canopies.
                </p>
              </div>

              <Link
                href="/bioacoustics"
                className="px-4 py-2 bg-[#849324] hover:bg-[#9db02e] text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 self-start md:self-center"
              >
                <span>🔬</span>
                <span>Open Full Bioacoustics Lab &rarr;</span>
              </Link>
            </div>

            {/* Sound Previews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              {AUDIO_SAMPLES.map((sample) => {
                const isSelected = activeSampleId === sample.id;
                const isCurrentlyPlaying = isSelected && isPlayingAudio;
                return (
                  <div
                    key={sample.id}
                    onClick={() => handleToggleAudio(sample)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white/15 border-[#FFB30F] shadow-lg scale-[1.02]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{sample.icon}</span>
                      <span
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase"
                        style={{ backgroundColor: sample.badgeColor, color: '#FFFFFF' }}
                      >
                        {sample.badge}
                      </span>
                    </div>

                    <h4 className="font-serif text-base font-bold text-white mt-2">{sample.title}</h4>
                    <span className="text-xs text-[#437F97] italic block font-mono">
                      {sample.species} &bull; {sample.kannada}
                    </span>

                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                      <span className="text-[#FFB30F]">{sample.freq}</span>
                      <button
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow ${
                          isCurrentlyPlaying
                            ? 'bg-[#FFB30F] text-[#01295F]'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        {isCurrentlyPlaying ? '⏸' : '▶'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* NEW ELEMENT 2: Scientific Loris Sanctuary Radar (IISc vs Urban Fragment) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F4F7FA]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#849324]">
              Bengaluru Urban Conservation Reality
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#01295F]">
              The Last Stronghold of the Grey Slender Loris
            </h2>
            <p className="text-[#01295F]/80 text-sm sm:text-base leading-relaxed">
              Decades of rapid urban expansion cut central parks off from surrounding forests. 
              Today, the Indian Institute of Science (IISc) near Yeshwantpur is the <strong className="text-[#01295F] font-bold">sole surviving sanctuary</strong> for 
              the Grey Slender Loris in Bengaluru.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* IISc Card */}
            <div className="bg-white rounded-3xl p-8 border-2 border-[#849324] shadow-xl space-y-5 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#849324] text-white font-bold uppercase">
                    ACTIVE BREEDING REFUGE
                  </span>
                  <span className="text-xs font-mono text-[#849324] font-bold">Near Yeshwantpur</span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-[#01295F]">
                  IISc Campus Continuous Canopy
                </h3>

                <p className="text-sm text-[#01295F]/80 leading-relaxed font-sans">
                  Protected since 1909, IISc contains over 11,000 trees with an uninterrupted canopy layer across the Centre for Ecological Sciences (CES) and Jubilee Gardens. Because lorises cannot traverse branch gaps &gt;2 meters without fatal predator risk, this unbroken canopy enables survival.
                </p>

                <div className="grid grid-cols-3 gap-3 pt-2 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-[#F4F7FA] border border-[#01295F]/10">
                    <span className="text-[#01295F]/60 text-[10px] block">Loris Population</span>
                    <span className="font-bold text-[#849324] text-base">40 - 60</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F4F7FA] border border-[#01295F]/10">
                    <span className="text-[#01295F]/60 text-[10px] block">Canopy Overlap</span>
                    <span className="font-bold text-[#01295F] text-base">94.2%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F4F7FA] border border-[#01295F]/10">
                    <span className="text-[#01295F]/60 text-[10px] block">Acoustic NDSI</span>
                    <span className="font-bold text-[#849324] text-base">+0.64 (High)</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#01295F]/10">
                <Link
                  href="/map?campus=iisc"
                  className="w-full py-3 px-4 bg-[#849324] hover:bg-[#9db02e] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center space-x-2"
                >
                  <span>🗺️</span>
                  <span>Inspect IISc Loris Sanctuary on Map &rarr;</span>
                </Link>
              </div>
            </div>

            {/* Cubbon Park Contrast Card */}
            <div className="bg-white rounded-3xl p-8 border border-[#01295F]/10 shadow-xl space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-200 text-slate-700 font-bold uppercase">
                    CANOPY FRAGMENTED
                  </span>
                  <span className="text-xs font-mono text-[#437F97] font-bold">Central Bengaluru</span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-[#01295F]">
                  Cubbon Park Urban Forest
                </h3>

                <p className="text-sm text-[#01295F]/80 leading-relaxed font-sans">
                  While Cubbon Park hosts 196 magnificent tree species and thriving populations of Indian Giant Squirrels, Flying Foxes, and Barbets, past road widenings and traffic avenues severed overhead branch connections, leading to the historical extirpation of the Grey Slender Loris.
                </p>

                <div className="grid grid-cols-3 gap-3 pt-2 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-[#F4F7FA] border border-[#01295F]/10">
                    <span className="text-[#01295F]/60 text-[10px] block">Loris Population</span>
                    <span className="font-bold text-[#FD151B] text-base">0 (Extirpated)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F4F7FA] border border-[#01295F]/10">
                    <span className="text-[#01295F]/60 text-[10px] block">Avenue Traffic</span>
                    <span className="font-bold text-[#FD151B] text-base">Severed</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F4F7FA] border border-[#01295F]/10">
                    <span className="text-[#01295F]/60 text-[10px] block">Primary Guild</span>
                    <span className="font-bold text-[#437F97] text-base">Avian &amp; Squirrel</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#01295F]/10">
                <Link
                  href="/map?mode=simulator"
                  className="w-full py-3 px-4 bg-[#01295F] hover:bg-[#0d3875] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center space-x-2"
                >
                  <span>🔬</span>
                  <span>Simulate Rewilding &amp; Bridge Restorations &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW ELEMENT 3: Canopy Intelligence Matrix */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#01295F] text-white">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-[#FFB30F] tracking-wider">
                Multi-Sensor Edge Intelligence
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1">
                Real-Time Canopy Telemetry Matrix
              </h2>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono text-white/70">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>4 IoT Sensors Connected &bull; Cloud Telemetry Synced</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-black/25 p-6 rounded-3xl border border-white/10 space-y-2">
              <span className="text-3xl">🌡️</span>
              <h4 className="font-bold text-lg text-white">Urban Heat Island Buffer</h4>
              <div className="font-serif text-3xl font-bold text-[#849324]">-3.8 °C</div>
              <p className="text-xs text-white/70 font-sans">
                Cooler microclimate registered beneath continuous tree canopies compared to peripheral tarmac.
              </p>
            </div>

            <div className="bg-black/25 p-6 rounded-3xl border border-white/10 space-y-2">
              <span className="text-3xl">📡</span>
              <h4 className="font-bold text-lg text-white">Arduino Edge Array</h4>
              <div className="font-serif text-3xl font-bold text-[#FFB30F]">4 Nodes Online</div>
              <p className="text-xs text-white/70 font-sans">
                Solar-mesh ESP32 nodes running on-device ML classifiers for acoustic surveillance.
              </p>
            </div>

            <div className="bg-black/25 p-6 rounded-3xl border border-white/10 space-y-2">
              <span className="text-3xl">🍃</span>
              <h4 className="font-bold text-lg text-white">Carbon Sequestration</h4>
              <div className="font-serif text-3xl font-bold text-white">184,200 kg</div>
              <p className="text-xs text-white/70 font-sans">
                Annual CO₂ storage provided by 310+ heritage Rain Trees, Banyans, and Tamarinds.
              </p>
            </div>

            <div className="bg-black/25 p-6 rounded-3xl border border-white/10 space-y-2">
              <span className="text-3xl">🕸️</span>
              <h4 className="font-bold text-lg text-white">Network Connectivity</h4>
              <div className="font-serif text-3xl font-bold text-[#437F97]">86.4% Overall</div>
              <p className="text-xs text-white/70 font-sans">
                Spatial graph score measuring continuous arboreal paths across all surveyed zones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of EcoWeaver (Nature's Domino cleanly removed) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#437F97]">
              Core Capabilities
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#01295F]">
              The Four Pillars of EcoWeaver
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-[#F4F7FA] border border-[#01295F]/10 shadow-md hover:shadow-xl transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#849324]/20 flex items-center justify-center text-2xl text-[#849324]">
                🌿
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#01295F]">196 Species Botanical Registry</h3>
              <p className="text-[#01295F]/80 text-sm leading-relaxed font-sans">
                Full taxonomy and ecological profiling of 196 tree species documented in Bengaluru. 
                Categorized by canopy architecture, flowering seasonality, and keystone support for urban fauna.
              </p>
              <Link href="/species" className="inline-block text-xs font-mono font-bold text-[#849324] hover:text-[#01295F] tracking-wider uppercase">
                Browse Species Catalog &rarr;
              </Link>
            </div>

            <div className="p-8 rounded-3xl bg-[#F4F7FA] border border-[#01295F]/10 shadow-md hover:shadow-xl transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#437F97]/20 flex items-center justify-center text-2xl text-[#437F97]">
                🕸️
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#01295F]">Spatial Canopy Graph Engine</h3>
              <p className="text-[#01295F]/80 text-sm leading-relaxed font-sans">
                Graph-theory network modeling measuring continuous branch overlaps, giant components, and keystone nodes. 
                Toggle between the IISc Loris Sanctuary and Cubbon Park urban canopy.
              </p>
              <Link href="/map" className="inline-block text-xs font-mono font-bold text-[#437F97] hover:text-[#01295F] tracking-wider uppercase">
                Inspect Interactive Map &rarr;
              </Link>
            </div>

            <div className="p-8 rounded-3xl bg-[#F4F7FA] border border-[#01295F]/10 shadow-md hover:shadow-xl transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFB30F]/20 flex items-center justify-center text-2xl text-[#FFB30F]">
                ⚡
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#01295F]">Dynamic In-Silico Simulator</h3>
              <p className="text-[#01295F]/80 text-sm leading-relaxed font-sans">
                Simulate removing any tree, planting compensatory native saplings, or installing aerial rope bridges. 
                Real-time recalculation of connectivity, carbon sequestration, and bioacoustic dead zones.
              </p>
              <Link href="/map?mode=simulator" className="inline-block text-xs font-mono font-bold text-[#01295F] hover:text-[#849324] tracking-wider uppercase">
                Open Simulator Workbench &rarr;
              </Link>
            </div>

            <div className="p-8 rounded-3xl bg-[#F4F7FA] border border-[#01295F]/10 shadow-md hover:shadow-xl transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FD151B]/15 flex items-center justify-center text-2xl text-[#FD151B]">
                📜
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#01295F]">Environmental Impact Reports</h3>
              <p className="text-[#01295F]/80 text-sm leading-relaxed font-sans">
                Export comprehensive ecological audits and mitigation blueprints for civic authorities, 
                benchmarking habitat connectivity and acoustic masking risk against municipal bylaws.
              </p>
              <Link href="/reports" className="inline-block text-xs font-mono font-bold text-[#01295F] hover:text-[#849324] tracking-wider uppercase">
                View Sample Impact Audit &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section — Shortened */}
      <section className="bg-[#01295F] text-white px-4 sm:px-6 lg:px-8 py-16 border-t border-[#437F97]/30">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold text-[#FFB30F] uppercase tracking-widest">Our Philosophy</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
              Beyond Human-Centric Planning
            </h2>
            <p className="text-base text-white/80 max-w-2xl mx-auto font-sans leading-relaxed">
              EcoWeaver reframes every tree as a sovereign node — a home, a corridor, a microclimate.
              Urban planning that excludes non-human lives is incomplete planning.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:bg-white/10 transition-colors">
              <div className="text-3xl">🌳</div>
              <h3 className="font-serif text-lg font-bold text-[#FFB30F]">Non-Human Agency</h3>
              <p className="text-xs text-white/70 leading-relaxed font-sans">
                A 100-year-old Banyan is simultaneously a home for 40+ bird species, a foraging bridge for lorises,
                and a mycelial nutrient bank — not just a municipal asset.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:bg-white/10 transition-colors">
              <div className="text-3xl">🔬</div>
              <h3 className="font-serif text-lg font-bold text-[#849324]">Graph-Theory Science</h3>
              <p className="text-xs text-white/70 leading-relaxed font-sans">
                Haversine canopy overlap, betweenness centrality, and microclimate shading models quantify the true
                ecological cost of every tree removal before it happens.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:bg-white/10 transition-colors">
              <div className="text-3xl">🦎</div>
              <h3 className="font-serif text-lg font-bold text-[#437F97]">Last Urban Loris</h3>
              <p className="text-xs text-white/70 leading-relaxed font-sans">
                Grey Slender Lorises survive exclusively in IISc near Yeshwantpur — proof that continuous
                canopy is not a luxury but a lifeline for urban biodiversity.
              </p>
            </div>
          </div>
          <div className="text-center">
            <Link
              href="/about"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl border border-white/20 text-white/80 hover:text-white hover:border-[#FFB30F] text-xs font-bold font-mono transition-all hover:bg-white/5"
            >
              <span>Read Full Philosophy</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-14 px-4 sm:px-6 lg:px-8 bg-[#00193b] text-white/80 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono">
          <div className="flex items-center space-x-3">
            <span className="text-xl">🌿</span>
            <div>
              <span className="font-serif font-bold text-sm text-white">EcoWeaver AI</span>
              <span className="block text-[11px] text-[#437F97]">Bengaluru Multispecies Digital Twin (IISc &amp; Cubbon Park)</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-5 text-white/70">
            <Link href="/map" className="hover:text-[#FFB30F]">Eco Map</Link>
            <Link href="/species" className="hover:text-[#FFB30F]">196 Species</Link>
            <Link href="/map?mode=simulator" className="hover:text-[#FFB30F]">Simulator</Link>
            <Link href="/bioacoustics" className="hover:text-[#FFB30F]">Bioacoustics</Link>
            <Link href="/reports" className="hover:text-[#FFB30F]">Impact Reports</Link>
            <Link href="/about" className="hover:text-[#FFB30F]">Philosophy</Link>
          </div>
          <div className="text-white/50">
            &copy; 2026 EcoWeaver Planetary Stewardship Platform.
          </div>
        </div>
      </footer>
    </div>
  );
}
