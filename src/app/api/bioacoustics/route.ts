import { NextResponse } from 'next/server';
import { bioacousticsStore } from '@/lib/bioacoustics-store';
import { TelemetryPacket } from '@/lib/bioacoustics-data';

export async function GET() {
  try {
    const nodes = bioacousticsStore.getNodes();
    const recentPackets = bioacousticsStore.getRecentPackets(25);
    const recordings = bioacousticsStore.getRecordings();
    const soundscapeSummary = bioacousticsStore.getSoundscapeSummary();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      nodes,
      recentPackets,
      recordings,
      soundscapeSummary,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to retrieve bioacoustics data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Ingest telemetry packet
    const partialPacket: Partial<TelemetryPacket> = {
      nodeId: body.nodeId || 'NODE-CP-01',
      decibels: typeof body.decibels === 'number' ? body.decibels : undefined,
      peakFreqHz: typeof body.peakFreqHz === 'number' ? body.peakFreqHz : undefined,
      dominantSpecies: body.dominantSpecies,
      confidence: typeof body.confidence === 'number' ? body.confidence : undefined,
      temperatureC: typeof body.temperatureC === 'number' ? body.temperatureC : undefined,
      humidityPct: typeof body.humidityPct === 'number' ? body.humidityPct : undefined,
      batteryPct: typeof body.batteryPct === 'number' ? body.batteryPct : undefined,
      alertFlag: typeof body.alertFlag === 'boolean' ? body.alertFlag : undefined,
      alertReason: body.alertReason,
    };

    const ingestedPacket = bioacousticsStore.addTelemetryPacket(partialPacket);
    const soundscapeSummary = bioacousticsStore.getSoundscapeSummary();

    return NextResponse.json(
      {
        success: true,
        message: 'Bioacoustic telemetry packet ingested successfully from canopy node',
        ingestedPacket,
        soundscapeSummary,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to ingest telemetry packet' },
      { status: 400 }
    );
  }
}
