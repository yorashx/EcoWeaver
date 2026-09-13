'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import {
  BIOACOUSTIC_RECORDINGS,
  CANOPY_SENSOR_NODES,
  BioacousticRecording,
  SensorNode,
  TelemetryPacket,
} from '@/lib/bioacoustics-data';

export default function BioacousticsPage() {
  // State
  const [recordings] = useState<BioacousticRecording[]>(BIOACOUSTIC_RECORDINGS);
  const [selectedRecordingId, setSelectedRecordingId] = useState<string>(BIOACOUSTIC_RECORDINGS[0].id);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'birds' | 'fauna'>('all');
  
  // Audio state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(12);
  const [volume, setVolume] = useState<number>(0.8);
  const [isLooping, setIsLooping] = useState<boolean>(true);

  // Nodes & Telemetry state
  const [nodes, setNodes] = useState<SensorNode[]>(CANOPY_SENSOR_NODES);
  const [telemetryPackets, setTelemetryPackets] = useState<TelemetryPacket[]>([]);
  const [isTransmittingMock, setIsTransmittingMock] = useState<boolean>(false);
  const [transmissionSuccess, setTransmissionSuccess] = useState<string | null>(null);

  // Audio & Visualizer refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Active recording object
  const activeRecording = useMemo(() => {
    return recordings.find((r) => r.id === selectedRecordingId) || recordings[0];
  }, [recordings, selectedRecordingId]);

  // Filtered recordings - Loris is merged with birds in a common wildlife library
  const displayedRecordings = useMemo(() => {
    if (categoryFilter === 'birds') {
      return recordings.filter((r) => !r.isRealFieldSample);
    }
    if (categoryFilter === 'fauna') {
      return recordings.filter((r) => r.isRealFieldSample);
    }
    return recordings;
  }, [recordings, categoryFilter]);

  // Fetch initial telemetry from API
  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('/api/bioacoustics');
        if (res.ok) {
          const data = await res.json();
          if (data.nodes) setNodes(data.nodes);
          if (data.recentPackets) setTelemetryPackets(data.recentPackets);
        }
      } catch (err) {
        console.error('Failed to fetch bioacoustic telemetry:', err);
      }
    };
    fetchTelemetry();
  }, []);

  // Set up Audio Context and Canvas visualizer
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || activeRecording.durationSec || 12);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      if (!isLooping) {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [activeRecording, isLooping]);

  // Connect Web Audio API Analyser on first play
  const setupAudioContext = () => {
    if (audioCtxRef.current || !audioRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;

      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      sourceNodeRef.current = source;
    } catch (e) {
      console.warn('Web Audio API initialized in fallback mode:', e);
    }
  };

  // Canvas Spectrogram / Oscilloscope render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Deep Navy spectrogram background
      ctx.fillStyle = '#00193b';
      ctx.fillRect(0, 0, width, height);

      // Grid guidelines
      ctx.strokeStyle = 'rgba(67, 127, 151, 0.15)';
      ctx.lineWidth = 1;
      for (let y = 0; y < height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (analyserRef.current && isPlaying) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const freqData = new Uint8Array(bufferLength);
        const timeData = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(freqData);
        analyserRef.current.getByteTimeDomainData(timeData);

        // Frequency Bars
        const barWidth = (width / bufferLength) * 1.6;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (freqData[i] / 255) * height * 0.75;
          const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
          gradient.addColorStop(0, '#849324');
          gradient.addColorStop(0.5, '#437F97');
          gradient.addColorStop(1, '#FFB30F');

          ctx.fillStyle = gradient;
          ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
          x += barWidth;
        }

        // Oscilloscope Line Overlay
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#FFB30F';
        ctx.beginPath();
        const sliceWidth = width / bufferLength;
        let wx = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = timeData[i] / 128.0;
          const wy = (v * height) / 2;
          if (i === 0) ctx.moveTo(wx, wy);
          else ctx.lineTo(wx, wy);
          wx += sliceWidth;
        }
        ctx.stroke();
      } else {
        // Aesthetic simulated waveform when paused / waiting
        ctx.lineWidth = 2;
        ctx.strokeStyle = isPlaying ? '#FFB30F' : 'rgba(255, 179, 15, 0.45)';
        ctx.beginPath();
        const freqMultiplier = activeRecording.peakFreqHz > 10000 ? 0.08 : 0.03;
        for (let x = 0; x < width; x++) {
          const amplitude = isPlaying ? 35 : 18;
          const y =
            height / 2 +
            Math.sin(x * freqMultiplier + phase) * amplitude * Math.sin((x / width) * Math.PI);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        if (isPlaying) phase += 0.08;
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isPlaying, activeRecording]);

  // Toggle Play / Pause
  const handleTogglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume();
    } else {
      setupAudioContext();
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error('Audio playback failed:', err);
          setIsPlaying(false);
        });
    }
  };

  // Change active recording
  const handleSelectRecording = (rec: BioacousticRecording) => {
    setSelectedRecordingId(rec.id);
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = rec.audioUrl;
      audioRef.current.load();
    }
  };

  // Transmit Mock Arduino Packet
  const handleSendMockPacket = async () => {
    setIsTransmittingMock(true);
    setTransmissionSuccess(null);

    const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
    const isHighFreq = Math.random() > 0.4;
    const packetData = {
      nodeId: randomNode.id,
      decibels: Number((47 + Math.random() * 18).toFixed(1)),
      peakFreqHz: isHighFreq ? 14200 : 2400,
      dominantSpecies: isHighFreq ? 'Loris lydekkerianus' : 'Psilopogon viridis',
      confidence: Number((93 + Math.random() * 6).toFixed(1)),
      temperatureC: Number((22.5 + Math.random()).toFixed(1)),
      humidityPct: Math.floor(72 + Math.random() * 8),
      batteryPct: Math.max(70, randomNode.batteryPct - 1),
      alertFlag: false,
    };

    try {
      const res = await fetch('/api/bioacoustics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(packetData),
      });

      if (res.ok) {
        const data = await res.json();
        setTelemetryPackets((prev) => [data.ingestedPacket, ...prev.slice(0, 19)]);
        setNodes((prev) =>
          prev.map((n) =>
            n.id === packetData.nodeId
              ? {
                  ...n,
                  lastPingTime: 'Just now',
                  currentDb: packetData.decibels,
                  peakHz: packetData.peakFreqHz,
                  dominantSpecies: packetData.dominantSpecies,
                  status: 'transmitting',
                }
              : n
          )
        );
        setTransmissionSuccess(
          `Packet #${data.ingestedPacket.id} successfully received from ${randomNode.name} (${packetData.dominantSpecies}, ${packetData.peakFreqHz}Hz)`
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTransmittingMock(false);
      setTimeout(() => setTransmissionSuccess(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] text-[#01295F] pt-18 pb-24">
      <Navigation />

      {/* Hidden native audio tag */}
      <audio
        ref={audioRef}
        src={activeRecording.audioUrl}
        preload="auto"
        loop={isLooping}
        onVolumeChange={() => {
          if (audioRef.current) setVolume(audioRef.current.volume);
        }}
      />

      {/* Hero & Real-time Soundscape Vitals */}
      <section className="bg-[#01295F] text-white border-b border-[#437F97]/25 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#FFB30F]">
                <span className="w-2 h-2 rounded-full bg-[#FFB30F] animate-ping" />
                <span>CANOPY ARDUINO BIOACOUSTIC SENSING ARRAY</span>
                <span>&bull;</span>
                <span className="text-white/70">BENGALURU HABITAT NETWORK</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                Bioacoustic AI Lab &amp; Urban Soundscape Monitor
              </h1>
              <p className="text-sm sm:text-base text-white/80 max-w-3xl">
                Continuous acoustic surveillance streaming from custom Arduino-ESP32 canopy nodes. Featuring audio analysis of urban birds, owls, and nocturnal mammals across Bengaluru&apos;s canopy corridors.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSendMockPacket}
                disabled={isTransmittingMock}
                className="px-4 py-2.5 bg-[#FFB30F] hover:bg-[#ffbf33] text-[#01295F] font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                <span>📡</span>
                <span>{isTransmittingMock ? 'Ingesting Packet...' : 'Transmit Mock Arduino Ping'}</span>
              </button>
              <Link
                href="/map"
                className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white font-medium text-xs rounded-xl border border-white/20 transition-all flex items-center space-x-1.5"
              >
                <span>🗺️</span>
                <span>Inspect on Eco-Map</span>
              </Link>
            </div>
          </div>

          {/* Success Banner */}
          {transmissionSuccess && (
            <div className="p-3 bg-[#849324]/30 border border-[#849324]/50 rounded-xl text-xs font-mono text-white flex items-center space-x-2 animate-pulse">
              <span>✅</span>
              <span>{transmissionSuccess}</span>
            </div>
          )}

          {/* Acoustic Telemetry Vitals Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="bg-black/25 border border-white/10 rounded-2xl p-4">
              <span className="text-[11px] font-mono text-[#FFB30F] uppercase block">Average Canopy Sound</span>
              <div className="font-serif text-3xl font-bold text-white mt-0.5">49.2 dB</div>
              <span className="text-[10px] text-white/60 block mt-1">Within optimal biophonic threshold</span>
            </div>
            <div className="bg-black/25 border border-white/10 rounded-2xl p-4">
              <span className="text-[11px] font-mono text-[#FFB30F] uppercase block">Biophony NDSI Ratio</span>
              <div className="font-serif text-3xl font-bold text-[#849324] mt-0.5">+0.42</div>
              <span className="text-[10px] text-white/60 block mt-1">Biophony dominant vs road noise</span>
            </div>
            <div className="bg-black/25 border border-white/10 rounded-2xl p-4">
              <span className="text-[11px] font-mono text-[#FFB30F] uppercase block">Acoustic Band Monitored</span>
              <div className="font-serif text-3xl font-bold text-[#437F97] mt-0.5">1 kHz - 22 kHz</div>
              <span className="text-[10px] text-white/60 block mt-1">Full spectrum avian &amp; ultrasonic</span>
            </div>
            <div className="bg-black/25 border border-white/10 rounded-2xl p-4">
              <span className="text-[11px] font-mono text-[#FFB30F] uppercase block">Online IoT Nodes</span>
              <div className="font-serif text-3xl font-bold text-white mt-0.5">
                {nodes.filter((n) => n.status !== 'warning').length} / {nodes.length}
              </div>
              <span className="text-[10px] text-white/60 block mt-1">Active solar-mesh connectivity</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-12">
        {/* SECTION 1: Audio Spectrogram & Unified Wildlife Acoustic Library */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Audio Player & Real-time Spectrogram Canvas (Left 7 cols) */}
          <div className="lg:col-span-7 bg-[#01295F] text-white rounded-3xl p-6 sm:p-8 border border-[#437F97]/30 shadow-2xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4">
              <div>
                <div className="inline-flex items-center space-x-2">
                  <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-[#849324] text-white font-bold">
                    {activeRecording.isRealFieldSample ? '🔬 REAL FIELD AUDIO' : '📊 BENCHMARK DATASET'}
                  </span>
                  <span className="text-xs font-mono text-white/60">{activeRecording.timeRecorded}</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-white mt-1">
                  {activeRecording.speciesCommon}
                </h3>
                <span className="text-xs italic text-[#437F97]">
                  {activeRecording.speciesScientific} &bull; {activeRecording.kannadaName}
                </span>
              </div>

              <div className="text-right font-mono text-xs">
                <span className="text-[#FFB30F] block font-bold text-sm">
                  {(activeRecording.peakFreqHz / 1000).toFixed(1)} kHz Peak
                </span>
                <span className="text-white/60">{activeRecording.zone}</span>
              </div>
            </div>

            {/* Canvas FFT Spectrogram Display */}
            <div className="relative rounded-2xl overflow-hidden border border-[#437F97]/30 shadow-inner">
              <canvas
                ref={canvasRef}
                width={640}
                height={220}
                className="w-full h-48 sm:h-56 block"
              />
              <div className="absolute top-2 left-3 text-[10px] font-mono text-[#FFB30F] bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                DYNAMIC FFT SPECTROGRAM &bull; {isPlaying ? 'STREAMING ACTIVE' : 'STANDBY'}
              </div>
              <div className="absolute bottom-2 right-3 text-[10px] font-mono text-white/70 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                Band: {(activeRecording.freqRangeHz[0] / 1000).toFixed(1)} - {(activeRecording.freqRangeHz[1] / 1000).toFixed(1)} kHz
              </div>
            </div>

            {/* Audio Controls Bar */}
            <div className="space-y-3 bg-black/20 p-4 rounded-2xl border border-white/10">
              {/* Progress Slider */}
              <div className="space-y-1">
                <input
                  type="range"
                  min={0}
                  max={duration || 12}
                  step={0.1}
                  value={currentTime}
                  onChange={(e) => {
                    const t = parseFloat(e.target.value);
                    setCurrentTime(t);
                    if (audioRef.current) audioRef.current.currentTime = t;
                  }}
                  className="w-full accent-[#FFB30F] h-1.5 bg-white/20 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-mono text-white/70">
                  <span>{currentTime.toFixed(1)}s</span>
                  <span>{duration.toFixed(1)}s (Total Duration)</span>
                </div>
              </div>

              {/* Control Buttons & Volume */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleTogglePlay}
                    className="w-12 h-12 rounded-full bg-[#FFB30F] hover:bg-[#ffbf33] text-[#01295F] flex items-center justify-center font-bold text-lg shadow-lg hover:scale-105 transition-all"
                    title={isPlaying ? 'Pause Audio' : 'Play Audio'}
                  >
                    {isPlaying ? '⏸' : '▶'}
                  </button>

                  <div>
                    <span className="text-xs font-bold text-white block">{activeRecording.title}</span>
                    <span className="text-[11px] font-mono text-[#FFB30F]">
                      Call Class: {activeRecording.callType}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Loop button */}
                  <button
                    onClick={() => setIsLooping(!isLooping)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                      isLooping
                        ? 'bg-[#849324] text-white border border-white/30'
                        : 'bg-white/10 text-white/60'
                    }`}
                    title="Toggle Loop Playback"
                  >
                    🔁 Loop {isLooping ? 'ON' : 'OFF'}
                  </button>

                  {/* Volume Slider */}
                  <div className="hidden sm:flex items-center space-x-2">
                    <span className="text-xs">🔊</span>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={volume}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        setVolume(v);
                        if (audioRef.current) audioRef.current.volume = v;
                      }}
                      className="w-20 accent-[#FFB30F] h-1 bg-white/20 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Recording Bio & Provenance Diagnostics */}
            <div className="space-y-3 bg-black/25 p-4 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between text-xs font-mono text-[#FFB30F]">
                <span>FIELD PROVENANCE &amp; BIOACOUSTIC DIAGNOSTICS</span>
                <span>CONFIDENCE: {activeRecording.confidenceScore}%</span>
              </div>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-sans">
                {activeRecording.description}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-white/10 text-[11px] font-mono">
                <div>
                  <span className="text-white/50 block">Sensor Node Location</span>
                  <span className="text-white font-semibold">{activeRecording.location}</span>
                </div>
                <div>
                  <span className="text-white/50 block">Bandwidth Span</span>
                  <span className="text-white font-semibold">
                    {(activeRecording.freqRangeHz[0] / 1000).toFixed(1)} - {(activeRecording.freqRangeHz[1] / 1000).toFixed(1)} kHz
                  </span>
                </div>
                <div>
                  <span className="text-white/50 block">Sound Pressure</span>
                  <span className="text-[#FFB30F] font-semibold">{activeRecording.decibels} dB SPL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Unified Recordings Selector (Right 5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-[#01295F]/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#01295F]">Wildlife Audio Library</h3>
                  <p className="text-xs text-[#437F97]">Unified Avian &amp; Nocturnal Recordings</p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center space-x-1 bg-[#F4F7FA] p-1 rounded-xl border border-[#01295F]/10 text-xs font-medium">
                  <button
                    onClick={() => setCategoryFilter('all')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      categoryFilter === 'all'
                        ? 'bg-[#01295F] text-white font-bold'
                        : 'text-[#01295F]/70 hover:text-[#01295F]'
                    }`}
                  >
                    All ({recordings.length})
                  </button>
                  <button
                    onClick={() => setCategoryFilter('birds')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      categoryFilter === 'birds'
                        ? 'bg-[#01295F] text-white font-bold'
                        : 'text-[#01295F]/70 hover:text-[#01295F]'
                    }`}
                  >
                    🐦 Birds
                  </button>
                  <button
                    onClick={() => setCategoryFilter('fauna')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      categoryFilter === 'fauna'
                        ? 'bg-[#01295F] text-white font-bold'
                        : 'text-[#01295F]/70 hover:text-[#01295F]'
                    }`}
                  >
                    🦎 Mammals
                  </button>
                </div>
              </div>

              {/* List of recordings */}
              <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                {displayedRecordings.map((rec) => {
                  const isSelected = rec.id === activeRecording.id;
                  return (
                    <div
                      key={rec.id}
                      onClick={() => handleSelectRecording(rec)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#01295F] text-white border-[#01295F] shadow-lg scale-[1.01]'
                          : 'bg-[#F4F7FA]/70 hover:bg-[#F4F7FA] border-[#01295F]/10 text-[#01295F]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-base">{rec.isRealFieldSample ? '🦎' : '🐦'}</span>
                            <span className="font-bold text-xs sm:text-sm">{rec.speciesCommon}</span>
                            {rec.isRealFieldSample && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#849324] text-white font-bold">
                                REAL FIELD SAMPLE
                              </span>
                            )}
                          </div>
                          <span className={`text-[11px] block mt-0.5 ${isSelected ? 'text-[#FFB30F]' : 'text-[#437F97]'}`}>
                            {rec.title}
                          </span>
                        </div>

                        <span className={`text-[11px] font-mono font-semibold ${isSelected ? 'text-white/80' : 'text-[#01295F]/60'}`}>
                          {(rec.peakFreqHz / 1000).toFixed(1)} kHz
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono mt-2 pt-2 border-t border-current/10">
                        <span>{rec.zone}</span>
                        <span>{rec.callType} &bull; {rec.durationSec}s</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Model Card */}
            <div className="bg-[#437F97] text-white rounded-3xl p-6 border border-white/15 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#FFB30F]">Edge ML Classifier</span>
                <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded text-white">ResNet-18 Log-Mel</span>
              </div>
              <h4 className="font-serif text-lg font-bold text-white">
                Multispecies Acoustic Recognition
              </h4>
              <p className="text-xs text-white/90 leading-relaxed font-sans">
                Trained on 4,200 annotated bioacoustic vocalization clips from Western Ghats and Bengaluru urban parks, fine-tuned on real field recordings of nocturnal fauna.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                <div className="bg-black/20 p-2.5 rounded-xl">
                  <span className="text-white/60 block text-[10px]">Top-1 Accuracy</span>
                  <span className="font-bold text-[#FFB30F] text-sm">96.8%</span>
                </div>
                <div className="bg-black/20 p-2.5 rounded-xl">
                  <span className="text-white/60 block text-[10px]">Inference Latency</span>
                  <span className="font-bold text-white text-sm">42 ms (Edge)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Arduino Canopy Hardware Sensor Network */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#01295F]/10 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#01295F]/10 pb-4">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#849324]">
                <span>HARDWARE LAYER</span>
                <span>&bull;</span>
                <span>ESP32 / ARDUINO UNO R4 MICROCONTROLLER MESH</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#01295F] mt-0.5">
                Canopy IoT Sensor Nodes &amp; Real-Time Telemetry Stream
              </h2>
            </div>

            <button
              onClick={handleSendMockPacket}
              disabled={isTransmittingMock}
              className="px-4 py-2 bg-[#01295F] hover:bg-[#0d3875] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              <span>⚡</span>
              <span>{isTransmittingMock ? 'Pinging Node...' : 'Simulate Arduino Transmission'}</span>
            </button>
          </div>

          {/* Nodes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {nodes.map((node) => {
              const isWarning = node.status === 'warning';
              return (
                <div
                  key={node.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isWarning
                      ? 'bg-amber-50/60 border-amber-300'
                      : 'bg-[#F4F7FA] border-[#01295F]/10 hover:border-[#437F97]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#01295F]">{node.id}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                        isWarning
                          ? 'bg-red-100 text-red-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {node.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-[#01295F] mt-2 line-clamp-1">{node.name}</h4>
                  <span className="text-xs text-[#437F97] block font-mono">{node.zone}</span>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#01295F]/10 text-xs font-mono">
                    <div>
                      <span className="text-[#01295F]/60 text-[10px] block">Sound Level</span>
                      <span className="font-bold text-[#01295F]">{node.currentDb} dB</span>
                    </div>
                    <div>
                      <span className="text-[#01295F]/60 text-[10px] block">Dominant Freq</span>
                      <span className="font-bold text-[#FFB30F]">{(node.peakHz / 1000).toFixed(1)} kHz</span>
                    </div>
                    <div>
                      <span className="text-[#01295F]/60 text-[10px] block">Battery</span>
                      <span className="font-bold text-emerald-700">{node.batteryPct}%</span>
                    </div>
                    <div>
                      <span className="text-[#01295F]/60 text-[10px] block">Last Ping</span>
                      <span className="text-[#01295F]/80 text-[11px]">{node.lastPingTime}</span>
                    </div>
                  </div>

                  {node.activeAlert && (
                    <div className="mt-2.5 p-2 bg-amber-100 text-amber-900 rounded-xl text-[10px] font-mono font-medium">
                      ⚠️ {node.activeAlert}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Live Ingestion Terminal Stream */}
          <div className="bg-[#00193b] text-white rounded-2xl p-4 sm:p-5 border border-[#437F97]/30 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[#FFB30F] border-b border-white/10 pb-2">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>LIVE MQTT / HTTP TELEMETRY LOG BUFFER</span>
              </div>
              <span className="text-white/50">{telemetryPackets.length} Packets Logged</span>
            </div>

            <div className="font-mono text-xs space-y-2 max-h-48 overflow-y-auto pr-1">
              {telemetryPackets.map((pkt) => (
                <div
                  key={pkt.id}
                  className={`p-2 rounded-xl flex flex-wrap items-center justify-between gap-2 border ${
                    pkt.alertFlag
                      ? 'bg-red-950/40 border-red-500/30 text-red-200'
                      : 'bg-black/30 border-white/5 text-white/90'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-[#FFB30F]">[{pkt.timestamp.split('T')[1].slice(0, 8)}]</span>
                    <span className="font-bold text-white">{pkt.nodeId}</span>
                    <span className="text-white/60">&bull;</span>
                    <span className="text-emerald-400 font-semibold">{pkt.dominantSpecies}</span>
                    <span className="text-[10px] text-white/50">({pkt.confidence}%)</span>
                  </div>

                  <div className="flex items-center space-x-3 text-[11px]">
                    <span className="text-[#FFB30F] font-semibold">{pkt.decibels} dB</span>
                    <span>{(pkt.peakFreqHz / 1000).toFixed(1)} kHz</span>
                    <span>{pkt.temperatureC}°C</span>
                    <span>Batt: {pkt.batteryPct}%</span>
                    {pkt.alertFlag && <span className="text-red-400 font-bold">⚠️ ALERT</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
