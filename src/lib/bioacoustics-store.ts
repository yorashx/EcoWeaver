import {
  SensorNode,
  TelemetryPacket,
  CANOPY_SENSOR_NODES,
  BIOACOUSTIC_RECORDINGS,
  BioacousticRecording,
} from './bioacoustics-data';

class BioacousticsStore {
  private nodes: SensorNode[] = [];
  private packets: TelemetryPacket[] = [];
  private recordings: BioacousticRecording[] = [];
  private isAutoStreamActive: boolean = false;

  constructor() {
    this.reset();
  }

  public reset() {
    this.nodes = JSON.parse(JSON.stringify(CANOPY_SENSOR_NODES));
    this.recordings = [...BIOACOUSTIC_RECORDINGS];
    this.packets = [
      {
        id: 'pkt-init-01',
        nodeId: 'NODE-CP-01',
        timestamp: new Date(Date.now() - 1000 * 18).toISOString(),
        decibels: 49.2,
        peakFreqHz: 14200,
        dominantSpecies: 'Loris lydekkerianus',
        confidence: 97.4,
        temperatureC: 22.4,
        humidityPct: 74,
        batteryPct: 92,
        alertFlag: false,
      },
      {
        id: 'pkt-init-02',
        nodeId: 'NODE-CP-02',
        timestamp: new Date(Date.now() - 1000 * 45).toISOString(),
        decibels: 53.8,
        peakFreqHz: 12800,
        dominantSpecies: 'Loris lydekkerianus',
        confidence: 95.8,
        temperatureC: 22.8,
        humidityPct: 72,
        batteryPct: 87,
        alertFlag: false,
      },
      {
        id: 'pkt-init-03',
        nodeId: 'NODE-CP-03',
        timestamp: new Date(Date.now() - 1000 * 120).toISOString(),
        decibels: 68.4,
        peakFreqHz: 1150,
        dominantSpecies: 'Urban Traffic Noise Masking',
        confidence: 98.9,
        temperatureC: 23.5,
        humidityPct: 69,
        batteryPct: 78,
        alertFlag: true,
        alertReason: 'Acoustic Saturation: Traffic noise >65dB masking biophony frequencies',
      },
      {
        id: 'pkt-init-04',
        nodeId: 'NODE-CP-04',
        timestamp: new Date(Date.now() - 1000 * 60).toISOString(),
        decibels: 44.1,
        peakFreqHz: 1850,
        dominantSpecies: 'Eudynamys scolopaceus',
        confidence: 99.2,
        temperatureC: 22.1,
        humidityPct: 76,
        batteryPct: 95,
        alertFlag: false,
      },
    ];
  }

  public getNodes(): SensorNode[] {
    return this.nodes;
  }

  public getNodeById(id: string): SensorNode | undefined {
    return this.nodes.find((n) => n.id === id);
  }

  public getRecentPackets(limit: number = 20): TelemetryPacket[] {
    return this.packets.slice(0, limit);
  }

  public getRecordings(): BioacousticRecording[] {
    return this.recordings;
  }

  public getRecordingById(id: string): BioacousticRecording | undefined {
    return this.recordings.find((r) => r.id === id);
  }

  public addTelemetryPacket(rawPacket: Partial<TelemetryPacket>): TelemetryPacket {
    const targetNodeId = rawPacket.nodeId || 'NODE-CP-01';
    const decibels = rawPacket.decibels ?? Number((46 + Math.random() * 16).toFixed(1));
    const peakFreqHz = rawPacket.peakFreqHz ?? 14200;
    const dominantSpecies = rawPacket.dominantSpecies || (peakFreqHz > 8000 ? 'Loris lydekkerianus' : 'Eudynamys scolopaceus');
    const isAlert = rawPacket.alertFlag ?? (decibels > 65);

    const packet: TelemetryPacket = {
      id: `pkt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      nodeId: targetNodeId,
      timestamp: new Date().toISOString(),
      decibels,
      peakFreqHz,
      dominantSpecies,
      confidence: rawPacket.confidence ?? Number((92 + Math.random() * 7).toFixed(1)),
      temperatureC: rawPacket.temperatureC ?? Number((22 + Math.random() * 2).toFixed(1)),
      humidityPct: rawPacket.humidityPct ?? Math.floor(70 + Math.random() * 10),
      batteryPct: rawPacket.batteryPct ?? Math.floor(80 + Math.random() * 18),
      alertFlag: isAlert,
      alertReason: isAlert
        ? (rawPacket.alertReason || 'High acoustic energy detected: possible machinery or road traffic intrusion')
        : undefined,
    };

    // Prepend to packets
    this.packets.unshift(packet);
    if (this.packets.length > 100) {
      this.packets = this.packets.slice(0, 100);
    }

    // Update the node's state
    const node = this.nodes.find((n) => n.id === targetNodeId);
    if (node) {
      node.lastPingTime = 'Just now';
      node.currentDb = decibels;
      node.peakHz = peakFreqHz;
      node.dominantSpecies = dominantSpecies;
      node.batteryPct = packet.batteryPct;
      node.status = isAlert ? 'warning' : 'transmitting';
      node.activeAlert = packet.alertReason || null;
    }

    return packet;
  }

  public getSoundscapeSummary() {
    const avgDb = Number(
      (this.packets.reduce((acc, p) => acc + p.decibels, 0) / Math.max(1, this.packets.length)).toFixed(1)
    );
    const lorisDetections = this.packets.filter((p) => p.dominantSpecies.includes('Loris')).length;
    const birdDetections = this.packets.filter((p) => !p.dominantSpecies.includes('Loris') && !p.alertFlag).length;
    const alertCount = this.packets.filter((p) => p.alertFlag).length;

    // NDSI calculation: (Biophony [2-8kHz + ultrasonic] - Anthropophony [1-2kHz]) / Total
    const biophonyPackets = this.packets.filter((p) => p.peakFreqHz >= 1800 && !p.alertFlag).length;
    const anthropophonyPackets = this.packets.filter((p) => p.peakFreqHz < 1800 || p.alertFlag).length;
    const total = Math.max(1, biophonyPackets + anthropophonyPackets);
    const ndsi = Number(((biophonyPackets - anthropophonyPackets) / total).toFixed(2));

    return {
      avgDb,
      lorisDetections,
      birdDetections,
      alertCount,
      ndsi,
      acousticComplexityIndex: 0.86,
      healthyAcousticBufferMeters: 42,
      activeNodesCount: this.nodes.filter((n) => n.status !== 'warning').length,
      totalNodesCount: this.nodes.length,
    };
  }
}

export const bioacousticsStore = new BioacousticsStore();
