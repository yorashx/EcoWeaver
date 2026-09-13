import { Tree, Corridor } from '@/types';

// IISc (Indian Institute of Science) Bangalore Campus Coordinates (near Yeshwantpur)
export const IISC_GEO = {
  center: { lat: 13.0219, lng: 77.5671 },
  bounds: [
    [13.0150, 77.5600],
    [13.0280, 77.5620],
    [13.0270, 77.5740],
    [13.0160, 77.5720],
  ] as [number, number][],
};

export const IISC_ZONES = [
  {
    id: 'zone-ces',
    name: 'Centre for Ecological Sciences (CES) & Loris Reserve',
    kannadaName: 'ಪರಿಸರ ವಿಜ್ಞಾನ ಕೇಂದ್ರ',
    description: 'The core biodiversity sanctuary of Bengaluru. Dense, contiguous native canopy harboring the primary breeding population of the nocturnal Grey Slender Loris.',
    lorisDensity: 'High (Primary Breeding Colony)',
  },
  {
    id: 'zone-main-building',
    name: 'Main Building & Tower Avenue',
    kannadaName: 'ಮುಖ್ಯ ಕಟ್ಟಡ ಮತ್ತು ಗೋಪುರ ಮಾರ್ಗ',
    description: 'Heritage avenue lined with centennial Gulmohar, Rain Trees, and Mahogany providing continuous aerial pathways across central IISc.',
    lorisDensity: 'Moderate (Active Transit & Nocturnal Foraging)',
  },
  {
    id: 'zone-jubilee',
    name: 'Jubilee Gardens & Biological Sciences Quad',
    kannadaName: 'ಜ್ಯುಬಿಲಿ ಉದ್ಯಾನವನ',
    description: 'Rich understory and fruit-bearing Ficus and Tamarind trees offering abundant insect prey and daytime sleeping clusters for Lorises.',
    lorisDensity: 'High (Documented Family Sleeping Clusters)',
  },
  {
    id: 'zone-gymkhana',
    name: 'Gymkhana Grounds & Tala Sankey Canopy',
    kannadaName: 'ಜಿಮ್ಖಾನಾ ಮೈದಾನ ಮತ್ತು ಸಾಂಕಿ ಕ್ಯಾನೋಪಿ',
    description: 'Eastern green belt buffering IISc with dense foliage, connecting the campus canopy toward the Sankey Tank riparian zone.',
    lorisDensity: 'Moderate (Seasonal Dispersal Route)',
  },
  {
    id: 'zone-yeshwantpur-gate',
    name: 'Yeshwantpur Gate & Western Perimeter',
    kannadaName: 'ಯಶವಂತಪುರ ಗೇಟ್ ಪಶ್ಚಿಮ ಗಡಿ',
    description: 'Buffer canopy facing the bustling Yeshwantpur transit nexus, where dense tree crowns act as acoustic noise buffers against suburban train rumble.',
    lorisDensity: 'Vulnerable Edge (Acoustic Buffer Zone)',
  },
];

// Key surveyed IISc trees with documented Grey Slender Loris habitat
const IISC_SURVEYED_TREES: Partial<Tree>[] = [
  {
    id: 1001,
    treeNumber: 'IISC-TREE-001',
    species: 'Tamarindus indica L.',
    commonName: 'Tamarind / ಹುಣಸೆ (Hunase)',
    age: 110,
    canopyRadius: 21.0,
    height: 24.0,
    ecologicalValue: 'critical',
    connectivityContribution: 19.5,
    lat: 13.0225,
    lng: 77.5668,
    isCriticalNode: true,
    metadata: {
      zone: 'zone-ces',
      campus: 'iisc',
      hasLorisSighting: true,
      residentLorisCount: 4,
      faunaAffinity: ['Grey Slender Loris', 'Spotted Owlet', 'Asian Palm Civet'],
      notes: 'Centre for Ecological Sciences (CES) core Loris maternal tree. Observed with adult female and twin infants in 2026 nocturnal census.',
      canopyType: 'Continuous Spreading',
      ecologicalRole: 'Prime Loris Sleeping & Foraging Anchor',
      nativeStatus: 'Native',
    },
  },
  {
    id: 1002,
    treeNumber: 'IISC-TREE-002',
    species: 'Ficus benghalensis L.',
    commonName: 'Heritage Banyan / ಆಲದ ಮರ (Aalada Mara)',
    age: 135,
    canopyRadius: 34.0,
    height: 27.5,
    ecologicalValue: 'critical',
    connectivityContribution: 23.0,
    lat: 13.0232,
    lng: 77.5675,
    isCriticalNode: true,
    metadata: {
      zone: 'zone-ces',
      campus: 'iisc',
      hasLorisSighting: true,
      residentLorisCount: 3,
      faunaAffinity: ['Grey Slender Loris', 'Indian Flying Fox', 'White-cheeked Barbet'],
      notes: 'Massive grandmother banyan near CES pond. Lorises use aerial prop roots for silent canopy descent during beetle hunts.',
      canopyType: 'Extensive Aerial Prop Root',
      ecologicalRole: 'Keystone Frugivore & Loris Habitat',
      nativeStatus: 'Native',
    },
  },
  {
    id: 1003,
    treeNumber: 'IISC-TREE-003',
    species: 'Samanea saman (Jacq.) Merr.',
    commonName: 'Rain Tree / ಮಳೆ ಮರ',
    age: 85,
    canopyRadius: 24.5,
    height: 26.0,
    ecologicalValue: 'critical',
    connectivityContribution: 18.0,
    lat: 13.0215,
    lng: 77.5660,
    isCriticalNode: true,
    metadata: {
      zone: 'zone-main-building',
      campus: 'iisc',
      hasLorisSighting: true,
      residentLorisCount: 2,
      faunaAffinity: ['Grey Slender Loris', 'Asian Koel', 'Giant Wood Spider'],
      notes: 'Main Building Avenue canopy bridge. Intertwines over roadway ensuring Lorises cross without descending to asphalt.',
      canopyType: 'Umbrella Spreading',
      ecologicalRole: 'Canopy Highway Overpass',
      nativeStatus: 'Naturalized',
    },
  },
  {
    id: 1004,
    treeNumber: 'IISC-TREE-004',
    species: 'Madhuca longifolia (J.Koenig) J.F.Macbr.',
    commonName: 'Mahua / ಇಪ್ಪೆ ಮರ (Ippe Mara)',
    age: 92,
    canopyRadius: 19.5,
    height: 22.0,
    ecologicalValue: 'critical',
    connectivityContribution: 16.2,
    lat: 13.0240,
    lng: 77.5690,
    isCriticalNode: true,
    metadata: {
      zone: 'zone-jubilee',
      campus: 'iisc',
      hasLorisSighting: true,
      residentLorisCount: 5,
      faunaAffinity: ['Grey Slender Loris', 'Fruit Bats', 'Indian Giant Squirrel'],
      notes: 'Jubilee Garden nocturnal nectar station. Lorises documented feeding on succulent Mahua blossoms and nocturnal sphingid moths.',
      canopyType: 'Dense Round',
      ecologicalRole: 'Seasonal High-Calorie Nectar Anchor',
      nativeStatus: 'Native',
    },
  },
  {
    id: 1005,
    treeNumber: 'IISC-TREE-005',
    species: 'Syzygium cumini (L.) Skeels',
    commonName: 'Jamun / ನೇರಳೆ ಮರ (Nerale Mara)',
    age: 70,
    canopyRadius: 18.0,
    height: 21.0,
    ecologicalValue: 'high',
    connectivityContribution: 14.5,
    lat: 13.0208,
    lng: 77.5682,
    isCriticalNode: false,
    metadata: {
      zone: 'zone-gymkhana',
      campus: 'iisc',
      hasLorisSighting: true,
      residentLorisCount: 2,
      faunaAffinity: ['Grey Slender Loris', 'Parakeets', 'Barbets'],
      notes: 'Gymkhana perimeter tree. Continuous foliage link connecting eastern campus to the Tala Sankey riparian belt.',
      canopyType: 'Pyramidal Dense',
      ecologicalRole: 'Corridor Stepping Stone',
      nativeStatus: 'Native',
    },
  },
  {
    id: 1006,
    treeNumber: 'IISC-TREE-006',
    species: 'Albizia lebbeck (L.) Benth.',
    commonName: 'Siris / ಬಾಗೆ ಮರ (Baage Mara)',
    age: 78,
    canopyRadius: 20.0,
    height: 23.5,
    ecologicalValue: 'high',
    connectivityContribution: 15.0,
    lat: 13.0195,
    lng: 77.5645,
    isCriticalNode: false,
    metadata: {
      zone: 'zone-yeshwantpur-gate',
      campus: 'iisc',
      hasLorisSighting: true,
      residentLorisCount: 1,
      faunaAffinity: ['Grey Slender Loris', 'Owlets', 'Carpenter Bees'],
      notes: 'Yeshwantpur perimeter buffer tree. Provides crucial acoustic attenuation against outer city transit noise.',
      canopyType: 'Broad Spreading',
      ecologicalRole: 'Acoustic Sound Barrier & Shelter',
      nativeStatus: 'Native',
    },
  },
  {
    id: 1007,
    treeNumber: 'IISC-TREE-007',
    species: 'Pongamia pinnata (L.) Pierre',
    commonName: 'Honge / ಹೊಂಗೆ ಮರ',
    age: 65,
    canopyRadius: 16.5,
    height: 18.0,
    ecologicalValue: 'high',
    connectivityContribution: 12.0,
    lat: 13.0235,
    lng: 77.5655,
    isCriticalNode: false,
    metadata: {
      zone: 'zone-ces',
      campus: 'iisc',
      hasLorisSighting: true,
      residentLorisCount: 2,
      faunaAffinity: ['Grey Slender Loris', 'Blue Tiger Butterflies', 'Sunbirds'],
      notes: 'Dense twig structure ideal for slender loris grip and stealth locomotion while hunting katydids.',
      canopyType: 'Compact Round',
      ecologicalRole: 'Foraging Sub-canopy',
      nativeStatus: 'Native',
    },
  },
  {
    id: 1008,
    treeNumber: 'IISC-TREE-008',
    species: 'Mangifera indica L.',
    commonName: 'Wild Mango / ಮಾವಿನ ಮರ',
    age: 80,
    canopyRadius: 21.0,
    height: 20.0,
    ecologicalValue: 'high',
    connectivityContribution: 15.5,
    lat: 13.0248,
    lng: 77.5680,
    isCriticalNode: false,
    metadata: {
      zone: 'zone-jubilee',
      campus: 'iisc',
      hasLorisSighting: true,
      residentLorisCount: 3,
      faunaAffinity: ['Grey Slender Loris', 'Flying Foxes', 'Civets'],
      notes: 'Heavy foliage cluster providing secure daylight sleeping roosts sheltered from diurnal raptors and crows.',
      canopyType: 'Dense Evergreen',
      ecologicalRole: 'Nocturnal Sleeping Cluster Shelter',
      nativeStatus: 'Native',
    },
  },
  {
    id: 1009,
    treeNumber: 'IISC-TREE-009',
    species: 'Peltophorum pterocarpum (DC.) Backer ex K.Heyne',
    commonName: 'Copperpod / ರತ್ನಗಂಧಿ',
    age: 60,
    canopyRadius: 19.0,
    height: 22.0,
    ecologicalValue: 'medium',
    connectivityContribution: 13.0,
    lat: 13.0210,
    lng: 77.5648,
    isCriticalNode: false,
    metadata: {
      zone: 'zone-main-building',
      campus: 'iisc',
      hasLorisSighting: false,
      faunaAffinity: ['Honeybees', 'Parakeets', 'Barbets'],
      notes: 'Prolific yellow flowering tree along faculty residential road.',
      canopyType: 'Spreading Dome',
      ecologicalRole: 'Floral Nectar & Stepping Stone',
      nativeStatus: 'Naturalized',
    },
  },
  {
    id: 1010,
    treeNumber: 'IISC-TREE-010',
    species: 'Delonix regia (Bojer ex Hook.) Raf.',
    commonName: 'Gulmohar / ಕೆಂಪು ತೋರಣ',
    age: 55,
    canopyRadius: 17.5,
    height: 19.0,
    ecologicalValue: 'medium',
    connectivityContribution: 11.5,
    lat: 13.0220,
    lng: 77.5695,
    isCriticalNode: false,
    metadata: {
      zone: 'zone-gymkhana',
      campus: 'iisc',
      hasLorisSighting: false,
      faunaAffinity: ['Purple Sunbird', 'Carpenter Bees'],
      notes: 'Iconic summer red bloom along Gymkhana perimeter.',
      canopyType: 'Spreading Umbrella',
      ecologicalRole: 'Pollinator Support',
      nativeStatus: 'Introduced',
    },
  },
];

// Generate additional distributed IISc trees around the campus to fill the canopy graph
function generateIiscTrees(): Tree[] {
  const trees: Tree[] = [];

  // Add the primary surveyed trees
  IISC_SURVEYED_TREES.forEach((st) => {
    trees.push({
      id: st.id!,
      projectId: 2,
      treeNumber: st.treeNumber!,
      species: st.species!,
      commonName: st.commonName!,
      age: st.age!,
      canopyRadius: st.canopyRadius!,
      height: st.height!,
      ecologicalValue: st.ecologicalValue!,
      connectivityContribution: st.connectivityContribution!,
      lat: st.lat!,
      lng: st.lng!,
      status: 'active',
      isCriticalNode: st.isCriticalNode || false,
      metadata: st.metadata,
    });
  });

  // Generative grid of 45 additional realistic trees across the 5 IISc zones
  const zoneCenters = [
    { zone: 'zone-ces', lat: 13.0230, lng: 77.5670, count: 12, lorisChance: 0.8 },
    { zone: 'zone-main-building', lat: 13.0215, lng: 77.5658, count: 10, lorisChance: 0.5 },
    { zone: 'zone-jubilee', lat: 13.0245, lng: 77.5685, count: 10, lorisChance: 0.7 },
    { zone: 'zone-gymkhana', lat: 13.0205, lng: 77.5688, count: 8, lorisChance: 0.4 },
    { zone: 'zone-yeshwantpur-gate', lat: 13.0198, lng: 77.5638, count: 8, lorisChance: 0.3 },
  ];

  const speciesPool = [
    { species: 'Ficus microcarpa L.f.', common: 'Curtain Fig', k: 'ಚಿಕ್ಕ ಆಲದ ಮರ', role: 'Epiphytic & Loris Foraging' },
    { species: 'Syzygium cumini (L.) Skeels', common: 'Jamun', k: 'ನೇರಳೆ ಮರ', role: 'Fruit Producer' },
    { species: 'Tamarindus indica L.', common: 'Tamarind', k: 'ಹುಣಸೆ ಮರ', role: 'Dense Arboreal Shelter' },
    { species: 'Samanea saman (Jacq.) Merr.', common: 'Rain Tree', k: 'ಮಳೆ ಮರ', role: 'Continuous Canopy' },
    { species: 'Albizia lebbeck (L.) Benth.', common: 'Siris', k: 'ಬಾಗೆ ಮರ', role: 'Canopy Connector' },
    { species: 'Pongamia pinnata (L.) Pierre', common: 'Honge', k: 'ಹೊಂಗೆ', role: 'Sub-canopy Foliage' },
  ];

  let nextId = 1011;
  zoneCenters.forEach((zc) => {
    for (let i = 0; i < zc.count; i++) {
      const sp = speciesPool[i % speciesPool.length];
      const latOffset = (Math.sin(i * 1.7) * 0.0022);
      const lngOffset = (Math.cos(i * 2.3) * 0.0022);
      const lat = Number((zc.lat + latOffset).toFixed(6));
      const lng = Number((zc.lng + lngOffset).toFixed(6));
      const age = Math.floor(25 + ((i * 11) % 65));
      const canopyRadius = Number((12 + (age / 80) * 11).toFixed(1));
      const height = Number((14 + (age / 80) * 12).toFixed(1));
      const isLorisTree = Math.random() < zc.lorisChance;
      const isCritical = isLorisTree && canopyRadius > 17;

      trees.push({
        id: nextId,
        projectId: 2,
        treeNumber: `IISC-TREE-${String(nextId - 1000).padStart(3, '0')}`,
        species: sp.species,
        commonName: `${sp.common} / ${sp.k}`,
        age,
        canopyRadius,
        height,
        ecologicalValue: isCritical ? 'critical' : isLorisTree ? 'high' : 'medium',
        connectivityContribution: Number((canopyRadius * 0.45 + (isCritical ? 3.5 : 1.0)).toFixed(1)),
        lat,
        lng,
        status: 'active',
        isCriticalNode: isCritical,
        metadata: {
          zone: zc.zone,
          campus: 'iisc',
          hasLorisSighting: isLorisTree,
          residentLorisCount: isLorisTree ? Math.floor(1 + Math.random() * 3) : 0,
          faunaAffinity: isLorisTree 
            ? ['Grey Slender Loris', 'Spotted Owlet', 'Asian Palm Civet']
            : ['Asian Koel', 'Parakeets', 'Barbets'],
          notes: isLorisTree
            ? 'Documented resident Grey Slender Loris foraging and sleeping habitat in IISc continuous canopy.'
            : 'Contiguous campus shade and microclimate buffer tree.',
          canopyType: 'Naturalized Broadleaf',
          ecologicalRole: sp.role,
          nativeStatus: 'Native',
          healthScore: 92,
        },
      });
      nextId++;
    }
  });

  return trees;
}

export const IISC_TREES: Tree[] = generateIiscTrees();

// Wildlife corridors across IISc Bangalore (The Last Loris Sanctuary)
export const IISC_CORRIDORS: Corridor[] = [
  {
    id: 101,
    projectId: 2,
    name: 'IISc Grey Slender Loris Sanctuary Corridor (CES to Jubilee)',
    speciesId: 1,
    connectivityScore: 94,
    length: 1.65,
    criticalTreeCount: 22,
    threatLevel: 'low',
    potentialFragmentation: 6,
    geometry: {
      type: 'LineString',
      coordinates: [
        [77.5645, 13.0195], // Yeshwantpur Gate buffer
        [77.5660, 13.0215], // Main Building Avenue
        [77.5668, 13.0225], // CES Tamarind maternal anchor
        [77.5675, 13.0232], // CES Grand Banyan
        [77.5690, 13.0240], // Jubilee Garden Mahua
        [77.5682, 13.0208], // Gymkhana Jamun corridor
      ],
    },
    status: 'intact',
    species: {
      id: 1,
      name: 'Grey Slender Loris',
      commonName: 'Grey Slender Loris (ಕಾಡುಪಾಪ)',
      scientificName: 'Loris lydekkerianus',
      habitatType: 'Continuous Arboreal Canopy',
      canopyDependency: 'high',
      sensitivity: 'high',
      description: 'The last surviving urban population of the Grey Slender Loris in Bengaluru, strictly confined to the contiguous tree canopy of the Indian Institute of Science (IISc) near Yeshwantpur. Requires unbroken branch bridges to hunt insects and mate safely without descending to the predator-laden ground.',
      imageUrl: null,
    },
  },
  {
    id: 102,
    projectId: 2,
    name: 'IISc Avian & Flying Fox Aerial Highway',
    speciesId: 4,
    connectivityScore: 89,
    length: 1.4,
    criticalTreeCount: 18,
    threatLevel: 'low',
    potentialFragmentation: 8,
    geometry: {
      type: 'LineString',
      coordinates: [
        [77.5638, 13.0198],
        [77.5668, 13.0225],
        [77.5685, 13.0245],
        [77.5688, 13.0205],
      ],
    },
    status: 'intact',
    species: {
      id: 4,
      name: 'Indian Flying Fox & Nocturnal Raptor Guild',
      commonName: 'Indian Flying Fox & Spotted Owlet',
      scientificName: 'Pteropus giganteus & Athene brama',
      habitatType: 'Heritage Canopy Roosts',
      canopyDependency: 'high',
      sensitivity: 'medium',
      description: 'Roosting and foraging flight paths linking ancient Banyans and Tamarinds across the IISc academic quad.',
      imageUrl: null,
    },
  },
];
