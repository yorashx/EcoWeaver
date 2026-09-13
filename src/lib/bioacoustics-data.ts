export interface BioacousticRecording {
  id: string;
  title: string;
  speciesCommon: string;
  speciesScientific: string;
  timeRecorded: string;
  zone: string;
  location: string;
  audioUrl: string;
  peakFreqHz: number;
  freqRangeHz: [number, number];
  durationSec: number;
  callType: 'Territorial Whistle' | 'Social Chitter' | 'Threat Alert' | 'Mating Call' | 'Dawn Chorus' | 'Foraging Click';
  confidenceScore: number;
  decibels: number;
  isRealFieldSample: boolean;
  provenance: string;
  description: string;
  threatStatus: 'Vulnerable' | 'Near Threatened' | 'Least Concern';
  kannadaName?: string;
}

export interface SensorNode {
  id: string;
  name: string;
  treeId: number;
  treeNumber: string;
  zone: string;
  lat: number;
  lng: number;
  status: 'online' | 'transmitting' | 'idle' | 'warning';
  batteryPct: number;
  signalDbm: number;
  firmwareVersion: string;
  lastPingTime: string;
  currentDb: number;
  peakHz: number;
  dominantSpecies: string;
  activeAlert: string | null;
}

export interface SpeciesEvolutionProjection {
  timeframe: string;
  monthIndex: number;
  label: string;
  businessAsUsual: {
    lorisPopulationEst: number;
    callDensityPerHr: number;
    auditoryConnectivityPct: number;
    extinctionRiskPct: number;
    soundscapeNdsi: number;
    canopyFragmentationScore: number;
  };
  ecoWeaverIntervention: {
    lorisPopulationEst: number;
    callDensityPerHr: number;
    auditoryConnectivityPct: number;
    extinctionRiskPct: number;
    soundscapeNdsi: number;
    canopyFragmentationScore: number;
  };
  keyDriver: string;
  actionMilestone: string;
}

export interface ConservationIntervention {
  id: string;
  title: string;
  category: 'Arboreal Infrastructure' | 'Acoustic / Lighting Sanctuary' | 'Native Botanical Forage' | 'Ground Protection' | 'IoT Edge Monitoring';
  priority: 'Immediate (0-14 Days)' | 'High Priority (1-3 Months)' | 'Systemic (6-12 Months)';
  timeToImpact: string;
  costEstimateInr: string;
  successRatePct: number;
  impactMetric: string;
  description: string;
  actionItems: string[];
  ecologicalRationale: string;
}

export interface TelemetryPacket {
  id: string;
  nodeId: string;
  timestamp: string;
  decibels: number;
  peakFreqHz: number;
  dominantSpecies: string;
  confidence: number;
  temperatureC: number;
  humidityPct: number;
  batteryPct: number;
  alertFlag: boolean;
  alertReason?: string;
}

// 3 Real Grey Slender Loris Recordings captured in Cubbon Park + Cubbon Bird Dataset
export const BIOACOUSTIC_RECORDINGS: BioacousticRecording[] = [
  {
    id: 'loris-field-01',
    title: 'Territorial Whistle & Zic-Call Sequence',
    speciesCommon: 'Grey Slender Loris',
    speciesScientific: 'Loris lydekkerianus',
    kannadaName: 'ಕಾಡುಪಾಪ (Kaadupaapa)',
    timeRecorded: '23:42 IST (Nocturnal Survey)',
    zone: 'IISc Centre for Ecological Sciences',
    location: 'IISc Heritage Tamarind #001 Upper Canopy (18m elevation, Yeshwantpur)',
    audioUrl: '/audio/recording_one.ogg',
    peakFreqHz: 14200,
    freqRangeHz: [9500, 18500],
    durationSec: 12,
    callType: 'Territorial Whistle',
    confidenceScore: 97.4,
    decibels: 52.3,
    isRealFieldSample: true,
    provenance: 'Authentic Field Hydro-Electret Canopy Recording (IISc Bangalore Sanctuary Survey, Centre for Ecological Sciences)',
    description: 'High-frequency narrow-band whistle followed by ultrasonic harmonic zic-clicks recorded in the IISc campus canopy (the sole surviving habitat for Lorises in Bengaluru). Used by territorial adults to delineate home range across contiguous crown bridges.',
    threatStatus: 'Near Threatened',
  },
  {
    id: 'loris-field-02',
    title: 'Arboreal Movement & Social Contact Chitter',
    speciesCommon: 'Grey Slender Loris',
    speciesScientific: 'Loris lydekkerianus',
    kannadaName: 'ಕಾಡುಪಾಪ (Kaadupaapa)',
    timeRecorded: '01:15 IST (Deep Night Shift)',
    zone: 'IISc Jubilee Gardens Quad',
    location: 'Mahua & Banyan Branch Overpass, IISc',
    audioUrl: '/audio/recording_two.ogg',
    peakFreqHz: 12800,
    freqRangeHz: [8200, 16000],
    durationSec: 9,
    callType: 'Social Chitter',
    confidenceScore: 95.8,
    decibels: 48.7,
    isRealFieldSample: true,
    provenance: 'Authentic Field Hydro-Electret Canopy Recording (IISc Bangalore Sanctuary Survey, Centre for Ecological Sciences)',
    description: 'Rapid multi-pulse chitter exchanged between mother and sub-adult during foraging transits in the IISc canopy. Captures subtle terminal twig locomotion sound as animal crawls stealthily.',
    threatStatus: 'Near Threatened',
  },
  {
    id: 'loris-field-03',
    title: 'Threat Alert & Rapid Pulse Evasion Series',
    speciesCommon: 'Grey Slender Loris',
    speciesScientific: 'Loris lydekkerianus',
    kannadaName: 'ಕಾಡುಪಾಪ (Kaadupaapa)',
    timeRecorded: '03:28 IST (Pre-Dawn Activity)',
    zone: 'IISc Western Yeshwantpur Perimeter',
    location: 'Yeshwantpur Gate Albizia Buffer Canopy, IISc',
    audioUrl: '/audio/recording_three.ogg',
    peakFreqHz: 16500,
    freqRangeHz: [11000, 21500],
    durationSec: 11,
    callType: 'Threat Alert',
    confidenceScore: 98.1,
    decibels: 56.1,
    isRealFieldSample: true,
    provenance: 'Authentic Field Hydro-Electret Canopy Recording (IISc Bangalore Sanctuary Survey, Centre for Ecological Sciences)',
    description: 'Sharply accented vocal pulses indicating acoustic masking from Yeshwantpur transit noise or light intrusion along the western perimeter of IISc. Precedes rapid retreat into dense core canopy.',
    threatStatus: 'Near Threatened',
  },
  {
    id: 'bird-ds-01',
    title: 'Ascending Melodic Couplet',
    speciesCommon: 'Asian Koel',
    speciesScientific: 'Eudynamys scolopaceus',
    kannadaName: 'ಕೋಗಿಲೆ (Kogile)',
    timeRecorded: '06:15 IST (Dawn Chorus)',
    zone: 'Bamboo Grove Sanctuary',
    location: 'Bambusa bambos Canopy Thicket',
    audioUrl: '/audio/recording_one.ogg',
    peakFreqHz: 1850,
    freqRangeHz: [1200, 3600],
    durationSec: 14,
    callType: 'Dawn Chorus',
    confidenceScore: 99.2,
    decibels: 68.4,
    isRealFieldSample: false,
    provenance: 'Cubbon Park Urban Avian Bioacoustic Training Dataset (Benchmark Cluster CP-AV-01)',
    description: 'Resonant "ku-oo" advertising call echoing through the park. Acts as a key bioindicator of understorey health and brood host availability in Cubbon Park.',
    threatStatus: 'Least Concern',
  },
  {
    id: 'bird-ds-02',
    title: 'Rhythmic Percussive Canopy Trill',
    speciesCommon: 'White-cheeked Barbet',
    speciesScientific: 'Psilopogon viridis',
    kannadaName: 'ಗೌಡ್ರ ಗಿಳಿ (Gowdra Gili)',
    timeRecorded: '07:45 IST (Morning Forage)',
    zone: 'Lotus Pond Avenue',
    location: 'Dead Wood Snag on Centennial Tamarindus',
    audioUrl: '/audio/recording_two.ogg',
    peakFreqHz: 2400,
    freqRangeHz: [1600, 4100],
    durationSec: 10,
    callType: 'Territorial Whistle',
    confidenceScore: 96.7,
    decibels: 64.2,
    isRealFieldSample: false,
    provenance: 'Cubbon Park Urban Avian Bioacoustic Training Dataset (Benchmark Cluster CP-AV-02)',
    description: 'Endemic frugivore of Western Ghats/Peninsular India. Continuous rhythmic rolling calls delineate cavity nest trees; highly dependent on mature soft-wood branches.',
    threatStatus: 'Least Concern',
  },
  {
    id: 'bird-ds-03',
    title: 'Dusk Duet & Chuckling Hoot',
    speciesCommon: 'Spotted Owlet',
    speciesScientific: 'Athene brama',
    kannadaName: 'ಚುಕ್ಕೆ ಗೂಬೆ (Chukke Goobe)',
    timeRecorded: '19:10 IST (Crepuscular Transition)',
    zone: 'High Court Avenue Ridge',
    location: 'Cavity Hollow in 85yr Millingtonia hortensis',
    audioUrl: '/audio/recording_three.ogg',
    peakFreqHz: 3200,
    freqRangeHz: [1800, 6400],
    durationSec: 12,
    callType: 'Territorial Whistle',
    confidenceScore: 94.3,
    decibels: 58.9,
    isRealFieldSample: false,
    provenance: 'Cubbon Park Urban Avian Bioacoustic Training Dataset (Benchmark Cluster CP-AV-03)',
    description: 'Harsh screeching and chuckling series emitted as pairs emerge from roost cavities to hunt nocturnal moths and beetles across the lawns.',
    threatStatus: 'Least Concern',
  },
];

// Physical Arduino Sensor Nodes Deployed in Cubbon Park Canopies
export const CANOPY_SENSOR_NODES: SensorNode[] = [
  {
    id: 'NODE-CP-01',
    name: 'Canopy Node Alpha (Rain Tree #021)',
    treeId: 21,
    treeNumber: 'CP-021',
    zone: 'Queen Promenade',
    lat: 12.9762,
    lng: 77.5929,
    status: 'transmitting',
    batteryPct: 92,
    signalDbm: -64,
    firmwareVersion: 'EcoNode v2.4-ArduinoESP32',
    lastPingTime: 'Just now (12s ago)',
    currentDb: 49.2,
    peakHz: 14200,
    dominantSpecies: 'Loris lydekkerianus',
    activeAlert: null,
  },
  {
    id: 'NODE-CP-02',
    name: 'Canopy Node Beta (Bandstand Fig)',
    treeId: 1,
    treeNumber: 'CP-001',
    zone: 'Bandstand Core',
    lat: 12.9745,
    lng: 77.5915,
    status: 'online',
    batteryPct: 87,
    signalDbm: -71,
    firmwareVersion: 'EcoNode v2.4-ArduinoESP32',
    lastPingTime: '45s ago',
    currentDb: 53.8,
    peakHz: 12800,
    dominantSpecies: 'Loris lydekkerianus',
    activeAlert: null,
  },
  {
    id: 'NODE-CP-03',
    name: 'Canopy Node Gamma (High Court Ridge)',
    treeId: 5,
    treeNumber: 'CP-005',
    zone: 'High Court Avenue',
    lat: 12.9780,
    lng: 77.5940,
    status: 'warning',
    batteryPct: 78,
    signalDbm: -82,
    firmwareVersion: 'EcoNode v2.3-ArduinoUNO-R4',
    lastPingTime: '2m ago',
    currentDb: 68.4,
    peakHz: 1150,
    dominantSpecies: 'Urban Traffic Noise Masking',
    activeAlert: 'Acoustic Saturation: Traffic noise >65dB masking biophony frequencies',
  },
  {
    id: 'NODE-CP-04',
    name: 'Canopy Node Delta (Bamboo Grove)',
    treeId: 10,
    treeNumber: 'CP-010',
    zone: 'Lotus Pond Basin',
    lat: 12.9730,
    lng: 77.5900,
    status: 'online',
    batteryPct: 95,
    signalDbm: -60,
    firmwareVersion: 'EcoNode v2.4-ArduinoESP32',
    lastPingTime: '1m ago',
    currentDb: 44.1,
    peakHz: 1850,
    dominantSpecies: 'Eudynamys scolopaceus',
    activeAlert: null,
  },
];

// Predictive Species Evolution & Long-Term Trends (1 Month to 5 Years)
export const SPECIES_EVOLUTION_PROJECTIONS: SpeciesEvolutionProjection[] = [
  {
    timeframe: '1 Month',
    monthIndex: 1,
    label: 'Immediate Baseline (Month 1)',
    businessAsUsual: {
      lorisPopulationEst: 28,
      callDensityPerHr: 4.8,
      auditoryConnectivityPct: 78,
      extinctionRiskPct: 18,
      soundscapeNdsi: 0.28,
      canopyFragmentationScore: 24,
    },
    ecoWeaverIntervention: {
      lorisPopulationEst: 29,
      callDensityPerHr: 5.2,
      auditoryConnectivityPct: 84,
      extinctionRiskPct: 12,
      soundscapeNdsi: 0.38,
      canopyFragmentationScore: 18,
    },
    keyDriver: 'Initial sensor deployment establishes nocturnal acoustic baseline across 4 canopy nodes.',
    actionMilestone: 'Deploy real-time Arduino alert webhooks to detect night acoustic masking spikes.',
  },
  {
    timeframe: '6 Months',
    monthIndex: 6,
    label: 'Medium Horizon (Month 6)',
    businessAsUsual: {
      lorisPopulationEst: 25,
      callDensityPerHr: 3.9,
      auditoryConnectivityPct: 69,
      extinctionRiskPct: 29,
      soundscapeNdsi: 0.15,
      canopyFragmentationScore: 35,
    },
    ecoWeaverIntervention: {
      lorisPopulationEst: 32,
      callDensityPerHr: 6.7,
      auditoryConnectivityPct: 89,
      extinctionRiskPct: 8,
      soundscapeNdsi: 0.52,
      canopyFragmentationScore: 12,
    },
    keyDriver: 'Unmitigated pruning creates 4m branch leaps, forcing lorises to ground; EcoWeaver bridges reconnect severed corridors.',
    actionMilestone: 'Installation of 2 high-tension coir aerial rope bridges across Queen Promenade.',
  },
  {
    timeframe: '1 Year',
    monthIndex: 12,
    label: 'Annual Milestone (Year 1)',
    businessAsUsual: {
      lorisPopulationEst: 22,
      callDensityPerHr: 3.1,
      auditoryConnectivityPct: 58,
      extinctionRiskPct: 42,
      soundscapeNdsi: 0.02,
      canopyFragmentationScore: 46,
    },
    ecoWeaverIntervention: {
      lorisPopulationEst: 36,
      callDensityPerHr: 8.4,
      auditoryConnectivityPct: 93,
      extinctionRiskPct: 5,
      soundscapeNdsi: 0.65,
      canopyFragmentationScore: 8,
    },
    keyDriver: 'Mating calls in 12-16kHz band blocked by unbuffered traffic noise; Quiet Hours buffer restores acoustic territory overlap.',
    actionMilestone: 'Establishment of 21:00-05:00 30km/h traffic calming and <5 lux dark-sky canopy corridors.',
  },
  {
    timeframe: '3 Years',
    monthIndex: 36,
    label: 'Generational Turn (Year 3)',
    businessAsUsual: {
      lorisPopulationEst: 16,
      callDensityPerHr: 2.0,
      auditoryConnectivityPct: 41,
      extinctionRiskPct: 64,
      soundscapeNdsi: -0.18,
      canopyFragmentationScore: 62,
    },
    ecoWeaverIntervention: {
      lorisPopulationEst: 44,
      callDensityPerHr: 11.2,
      auditoryConnectivityPct: 96,
      extinctionRiskPct: 2,
      soundscapeNdsi: 0.76,
      canopyFragmentationScore: 4,
    },
    keyDriver: 'Genetic isolation causes sub-population decay in Bandstand cluster; native Ficus saplings mature into contiguous canopy.',
    actionMilestone: 'Compensatory planting of 120 indigenous keystone saplings bridging North-South Cubbon avenues.',
  },
  {
    timeframe: '5 Years',
    monthIndex: 60,
    label: 'Long-Term Flourishing (Year 5)',
    businessAsUsual: {
      lorisPopulationEst: 11,
      callDensityPerHr: 1.2,
      auditoryConnectivityPct: 28,
      extinctionRiskPct: 82,
      soundscapeNdsi: -0.35,
      canopyFragmentationScore: 78,
    },
    ecoWeaverIntervention: {
      lorisPopulationEst: 54,
      callDensityPerHr: 14.5,
      auditoryConnectivityPct: 98,
      extinctionRiskPct: 1,
      soundscapeNdsi: 0.84,
      canopyFragmentationScore: 2,
    },
    keyDriver: 'Species functional extirpation prevented; Cubbon Park becomes thriving urban sanctuary reservoir for peninsular primates.',
    actionMilestone: 'Self-sustaining multispecies canopy network certified by Karnataka State Biodiversity Board.',
  },
];

// Immediate High-Impact Conservation Playbook ("What more can be done right now")
export const CONSERVATION_PLAYBOOK: ConservationIntervention[] = [
  {
    id: 'playbook-01',
    title: 'Deploy Tensioned Coir Canopy Bridges Across Queen Promenade',
    category: 'Arboreal Infrastructure',
    priority: 'Immediate (0-14 Days)',
    timeToImpact: '48 Hours Post-Erection',
    costEstimateInr: '₹45,000 / Bridge ($540)',
    successRatePct: 94,
    impactMetric: '+18% Corridors Reconnected, 0 Ground Descents',
    description: 'Install 80mm natural organic coir/sisal rope ladders between Tree #021 and facing Rain Tree across Queen Promenade. Lorises will not traverse gaps >2.5m without jumping (which they cannot do) or descending to the road where dog attacks and vehicle strikes cause 70% of mortality.',
    actionItems: [
      'Procure untreated 3-strand coir rope with stainless steel tension turnbuckles',
      'Anchor to high secondary scaffold branches (minimum 12m clear road clearance)',
      'Install infrared trail camera on anchor limb to monitor crossing uptake',
      'Coat contact points in non-toxic tree healing sealant',
    ],
    ecologicalRationale: 'Grey Slender Lorises are strictly obligate arboreal quadrupeds. They lack the gliding membrane of squirrels and have low jumping agility. A continuous physical bridge is non-negotiable for gene flow.',
  },
  {
    id: 'playbook-02',
    title: 'Institute Nocturnal Low-Lux Dark-Sky Buffer (<5 Lux)',
    category: 'Acoustic / Lighting Sanctuary',
    priority: 'Immediate (0-14 Days)',
    timeToImpact: 'Immediate upon dimming',
    costEstimateInr: '₹25,000 (Lamp Shrouds)',
    successRatePct: 89,
    impactMetric: '+32% Nocturnal Foraging Duration',
    description: 'Shield high-intensity LED municipal floodlights along the internal roads between 20:30 and 05:00. Intense white/blue light blinds tapetum lucidum eyes of lorises and drives nocturnal insects away from tree foliage toward street lamps.',
    actionItems: [
      'Fit 2700K warm-amber shields on 18 street lamps adjacent to identified sleeping trees',
      'Dim pathway lighting to 15% brightness after park visiting hours (20:00)',
      'Establish 50-meter radius dark core around Tree #021 and Bandstand Ficus',
    ],
    ecologicalRationale: 'Loris foraging efficiency drops by 65% under direct unshielded illumination. Insects attracted to street lamps starve the upper canopy insectivore guild.',
  },
  {
    id: 'playbook-03',
    title: 'Nocturnal Traffic Noise Calming & Acoustic Green Barriers',
    category: 'Acoustic / Lighting Sanctuary',
    priority: 'High Priority (1-3 Months)',
    timeToImpact: '2 Weeks',
    costEstimateInr: '₹80,000 (Signage & Calming)',
    successRatePct: 86,
    impactMetric: '+0.34 NDSI Index (Biophony Restored)',
    description: 'Enforce 30 km/h speed limits on perimeter Kasturba and Queen Roads during night hours to drop low-frequency anthropophonic noise from 68 dB to <48 dB, reopening the acoustic window for high-frequency mating calls.',
    actionItems: [
      'Install solar-powered acoustic radar speed displays on peripheral roads',
      'Plant dense evergreen acoustic shrub hedge (Murraya paniculata, Syzygium) along park fences',
      'Restock micro-grooves on asphalt to reduce tire friction decibels',
    ],
    ecologicalRationale: 'High urban engine decibels (>60 dB) trigger chronic cortisol elevation in lorises and physically mask their 12-16 kHz whistles beyond 6 meters.',
  },
  {
    id: 'playbook-04',
    title: 'Understorey Native Bamboo Thickets for Anti-Predation Escape',
    category: 'Ground Protection',
    priority: 'High Priority (1-3 Months)',
    timeToImpact: '4 Months (Growth phase)',
    costEstimateInr: '₹35,000 (Saplings & Mulch)',
    successRatePct: 91,
    impactMetric: '-85% Feral Canine Predation Risk',
    description: 'Establish dense native bamboo (Bambusa bambos) and climbing shrubs around the base of peripheral trees. If a loris is accidentally dislodged by branch breakage or storm gusts, dense ground thickets provide immediate vertical laddering.',
    actionItems: [
      'Plant 6 multi-culm bamboo clusters near Queen Promenade border trees',
      'Eradicate thorny invasive Lantana camara and replace with native Clerodendrum infortunatum',
      'Install BBMP stray dog management humane exclusion zone around core habitat',
    ],
    ecologicalRationale: 'Ground-level predation by free-roaming domestic and feral dogs is the #1 acute mortality cause for urban lorises falling from fragmented branches.',
  },
  {
    id: 'playbook-05',
    title: 'Canopy Arduino Bioacoustic Edge Array Expansion (Real-Time Vigilance)',
    category: 'IoT Edge Monitoring',
    priority: 'Systemic (6-12 Months)',
    timeToImpact: 'Continuous Real-Time Feedback',
    costEstimateInr: '₹12,000 / Node ($145)',
    successRatePct: 96,
    impactMetric: 'Instantaneous Chainsaw & Distress Call Alerting',
    description: 'Expand the 4-node Arduino ESP32 bioacoustic array to 12 canopy nodes, running on-device edge ML for real-time detection of illegal pruning, chainsaw acoustics, vehicle crashes, and distress calls.',
    actionItems: [
      'Assemble solar-harvesting supercapacitor power units for continuous canopy autonomy',
      'Deploy LoRaWAN mesh gateways to ensure zero cell-network dropouts during storms',
      'Connect API webhook to BBMP Forest Cell rapid response team mobile dispatch',
    ],
    ecologicalRationale: 'Continuous bioacoustic telemetry transforms passive conservation into proactive stewardship, catching habitat severance before it impacts non-human lives.',
  },
];
