import { Tree, Corridor } from '@/types';
import { CUBBON_PARK_SPECIES, CUBBON_ZONES } from './cubbon-species-data';

// Realistic Cubbon Park bounding polygon coordinates
export const CUBBON_PARK_GEO = {
  center: { lat: 12.9762, lng: 77.5929 },
  bounds: [
    [12.9730, 77.5890],
    [12.9805, 77.5910],
    [12.9795, 77.5980],
    [12.9740, 77.5960],
  ] as [number, number][],
};

// Deterministic generator to create 260 realistic individual trees distributed across the 5 real zones of Cubbon Park
function generateCubbonTrees(): Tree[] {
  const trees: Tree[] = [];

  // Key heritage anchor trees manually positioned at iconic landmarks
  const heritageAnchors = [
    {
      id: 21,
      treeNumber: "CP-TREE-021",
      speciesSerial: 151, // Samanea saman (Rain Tree)
      age: 82,
      canopyRadius: 22.5,
      height: 25.0,
      ecologicalValue: "critical",
      connectivityContribution: 16.5,
      lat: 12.9762,
      lng: 77.5929,
      zone: "zone-bandstand",
      isCriticalNode: true,
      notes: "Centennial Rain Tree. Core arboreal transit link for Grey Slender Loris between Queen's Road and Bandstand.",
    },
    {
      id: 1,
      treeNumber: "CP-TREE-001",
      speciesSerial: 78, // Ficus benghalensis (Great Banyan)
      age: 145,
      canopyRadius: 36.0,
      height: 29.0,
      ecologicalValue: "critical",
      connectivityContribution: 21.0,
      lat: 12.9768,
      lng: 77.5936,
      zone: "zone-bandstand",
      isCriticalNode: true,
      notes: "Heritage Grandmother Banyan with 42 prop roots. Roosting habitat for Spotted Owlets and Flying Foxes.",
    },
    {
      id: 2,
      treeNumber: "CP-TREE-002",
      speciesSerial: 86, // Ficus religiosa (Sacred Fig / Peepal)
      age: 110,
      canopyRadius: 26.0,
      height: 27.5,
      ecologicalValue: "critical",
      connectivityContribution: 14.2,
      lat: 12.9754,
      lng: 77.5921,
      zone: "zone-bandstand",
      isCriticalNode: true,
      notes: "Massive fig producer anchoring the central feeding territory for Indian Giant Squirrel and Barbets.",
    },
    {
      id: 3,
      treeNumber: "CP-TREE-003",
      speciesSerial: 20, // Artocarpus heterophyllus (Jackfruit)
      age: 65,
      canopyRadius: 18.0,
      height: 19.5,
      ecologicalValue: "high",
      connectivityContribution: 9.8,
      lat: 12.9748,
      lng: 77.5915,
      zone: "zone-bamboo",
      isCriticalNode: false,
      notes: "High food supply value for frugivorous mammals and civets near Bamboo Grove.",
    },
    {
      id: 4,
      treeNumber: "CP-TREE-004",
      speciesSerial: 30, // Bombax ceiba (Red Silk Cotton)
      age: 72,
      canopyRadius: 22.0,
      height: 31.0,
      ecologicalValue: "critical",
      connectivityContribution: 12.4,
      lat: 12.9782,
      lng: 77.5950,
      zone: "zone-bal-bhavan",
      isCriticalNode: true,
      notes: "Towering nectar source flowering profusely in spring; vital stopover for migratory starlings.",
    },
    {
      id: 5,
      treeNumber: "CP-TREE-005",
      speciesSerial: 174, // Tamarindus indica (Tamarind)
      age: 95,
      canopyRadius: 24.0,
      height: 23.0,
      ecologicalValue: "high",
      connectivityContribution: 11.2,
      lat: 12.9789,
      lng: 77.5918,
      zone: "zone-high-court",
      isCriticalNode: true,
      notes: "Heritage avenue tree shielding the High Court boundary microclimate.",
    },
    {
      id: 6,
      treeNumber: "CP-TREE-006",
      speciesSerial: 177, // Terminalia arjuna (Arjun)
      age: 88,
      canopyRadius: 25.0,
      height: 28.0,
      ecologicalValue: "critical",
      connectivityContribution: 15.0,
      lat: 12.9742,
      lng: 77.5909,
      zone: "zone-bamboo",
      isCriticalNode: true,
      notes: "Buttressed giant leaning toward Lotus Pond; stabilizes soil and hosts canopy epiphytes.",
    },
    {
      id: 7,
      treeNumber: "CP-TREE-007",
      speciesSerial: 173, // Tabebuia rosea (Pink Trumpet)
      age: 48,
      canopyRadius: 17.5,
      height: 20.0,
      ecologicalValue: "medium",
      connectivityContribution: 6.8,
      lat: 12.9775,
      lng: 77.5962,
      zone: "zone-bal-bhavan",
      isCriticalNode: false,
      notes: "Iconic spring bloom canopy providing abundant nectar for sunbirds and native bees.",
    },
    {
      id: 8,
      treeNumber: "CP-TREE-008",
      speciesSerial: 152, // Santalum album (Sandalwood)
      age: 38,
      canopyRadius: 10.0,
      height: 13.5,
      ecologicalValue: "critical",
      connectivityContribution: 8.5,
      lat: 12.9750,
      lng: 77.5944,
      zone: "zone-library",
      isCriticalNode: true,
      notes: "Protected indigenous sandalwood cluster with hemiparasitic root connections to nearby Albizias.",
    },
    {
      id: 9,
      treeNumber: "CP-TREE-009",
      speciesSerial: 128, // Neolamarckia cadamba (Kadamba)
      age: 58,
      canopyRadius: 20.0,
      height: 24.0,
      ecologicalValue: "high",
      connectivityContribution: 10.4,
      lat: 12.9758,
      lng: 77.5938,
      zone: "zone-library",
      isCriticalNode: false,
      notes: "Scented spherical blossoms attracting nocturnal sphinx moths and fruit bats.",
    },
    {
      id: 10,
      treeNumber: "CP-TREE-010",
      speciesSerial: 68, // Delonix regia (Gulmohar)
      age: 52,
      canopyRadius: 19.0,
      height: 16.5,
      ecologicalValue: "medium",
      connectivityContribution: 7.2,
      lat: 12.9765,
      lng: 77.5948,
      zone: "zone-bandstand",
      isCriticalNode: false,
      notes: "Scarlet flowering crown providing intermediate branch perches across Central Promenade.",
    },
  ];

  // Populate heritage anchors first
  heritageAnchors.forEach(ha => {
    const sp = CUBBON_PARK_SPECIES.find(s => s.serialNo === ha.speciesSerial) || CUBBON_PARK_SPECIES[0];
    trees.push({
      id: ha.id,
      projectId: 1,
      treeNumber: ha.treeNumber,
      species: sp.scientificName,
      commonName: sp.commonName,
      age: ha.age,
      canopyRadius: ha.canopyRadius,
      height: ha.height,
      ecologicalValue: ha.ecologicalValue,
      connectivityContribution: ha.connectivityContribution,
      lat: ha.lat,
      lng: ha.lng,
      status: "active",
      isCriticalNode: ha.isCriticalNode,
      metadata: {
        serialNo: sp.serialNo,
        family: sp.family,
        kannadaName: sp.kannadaName,
        canopyType: sp.canopyType,
        ecologicalRole: sp.ecologicalRole,
        faunaAffinity: sp.faunaAffinity,
        nativeStatus: sp.nativeStatus,
        zone: ha.zone,
        notes: ha.notes,
        healthScore: 94,
        lastAudited: "2026-03-01",
      },
    });
  });

  // Now procedurally generate remaining 250 trees distributed realistically across Cubbon Park zones
  const zoneCenters = [
    { zone: "zone-bandstand", lat: 12.9762, lng: 77.5929, radiusLat: 0.0018, radiusLng: 0.0022 },
    { zone: "zone-bamboo", lat: 12.9745, lng: 77.5912, radiusLat: 0.0016, radiusLng: 0.0020 },
    { zone: "zone-bal-bhavan", lat: 12.9780, lng: 77.5955, radiusLat: 0.0019, radiusLng: 0.0024 },
    { zone: "zone-high-court", lat: 12.9788, lng: 77.5915, radiusLat: 0.0015, radiusLng: 0.0020 },
    { zone: "zone-library", lat: 12.9752, lng: 77.5940, radiusLat: 0.0017, radiusLng: 0.0022 },
  ];

  let currentId = 30;

  zoneCenters.forEach((zc, zIdx) => {
    // Generate ~50 trees per zone
    const count = 50;
    for (let i = 0; i < count; i++) {
      currentId++;
      // Pick a species from the 196 species list
      const spIndex = (zIdx * 37 + i * 3 + 11) % CUBBON_PARK_SPECIES.length;
      const sp = CUBBON_PARK_SPECIES[spIndex];

      // Jitter coordinates naturally
      const angle = (i / count) * 2 * Math.PI + (i % 5) * 0.2;
      const distance = 0.2 + (0.78 * ((i * 7) % count)) / count;
      const latOffset = Math.sin(angle) * zc.radiusLat * distance;
      const lngOffset = Math.cos(angle) * zc.radiusLng * distance;

      const lat = Number((zc.lat + latOffset).toFixed(6));
      const lng = Number((zc.lng + lngOffset).toFixed(6));

      const age = Math.floor(15 + ((i * 13) % 85));
      const canopyRadius = Number((sp.typicalCanopySpreadM * (0.65 + (age / 120) * 0.5)).toFixed(1));
      const height = Number((sp.typicalHeightM * (0.7 + (age / 120) * 0.45)).toFixed(1));

      const isCritical = (sp.ecologicalRole === "Mother Tree / Continuous Canopy" || sp.ecologicalRole === "Keystone Food Source") && (age > 60 || canopyRadius > 18);
      const ecologicalValue = isCritical ? "critical" : (age > 40 || canopyRadius > 14 ? "high" : "medium");
      const connectivityContribution = Number((canopyRadius * 0.4 + (isCritical ? 4.5 : 1.2)).toFixed(1));

      trees.push({
        id: currentId,
        projectId: 1,
        treeNumber: `CP-TREE-${String(currentId).padStart(3, "0")}`,
        species: sp.scientificName,
        commonName: sp.commonName,
        age,
        canopyRadius,
        height,
        ecologicalValue,
        connectivityContribution,
        lat,
        lng,
        status: "active",
        isCriticalNode: isCritical,
        metadata: {
          serialNo: sp.serialNo,
          family: sp.family,
          kannadaName: sp.kannadaName,
          canopyType: sp.canopyType,
          ecologicalRole: sp.ecologicalRole,
          faunaAffinity: sp.faunaAffinity,
          nativeStatus: sp.nativeStatus,
          zone: zc.zone,
          healthScore: Math.floor(75 + ((i * 17) % 25)),
          carbonSequestrationKgPerYr: Math.round(canopyRadius * height * 1.85),
          lastAudited: "2026-02-18",
        },
      });
    }
  });

  return trees;
}

export const CUBBON_TREES: Tree[] = generateCubbonTrees();

// Wildlife corridors across Cubbon Park based on real arboreal routes
export const CUBBON_CORRIDORS: Corridor[] = [
  {
    id: 1,
    projectId: 1,
    name: "Grey Slender Loris Central Arterial Bridge",
    speciesId: 1,
    connectivityScore: 84,
    length: 1.85,
    criticalTreeCount: 28,
    threatLevel: "high",
    potentialFragmentation: 26,
    geometry: {
      type: "LineString",
      coordinates: [
        [77.5912, 12.9745],
        [77.5921, 12.9754],
        [77.5929, 12.9762],
        [77.5936, 12.9768],
        [77.5950, 12.9782],
      ],
    },
    status: "vulnerable",
    species: {
      id: 1,
      name: "Grey Slender Loris",
      commonName: "Grey Slender Loris",
      scientificName: "Loris lydekkerianus",
      habitatType: "Canopy",
      canopyDependency: "high",
      sensitivity: "high",
      description: "Nocturnal arboreal primate that requires gap-free continuous branch connections. Cannot safely cross open ground without mortal predator and roadkill risk.",
      imageUrl: null,
    },
  },
  {
    id: 2,
    projectId: 1,
    name: "Indian Giant Squirrel Foraging Highway",
    speciesId: 2,
    connectivityScore: 78,
    length: 1.45,
    criticalTreeCount: 19,
    threatLevel: "medium",
    potentialFragmentation: 18,
    geometry: {
      type: "LineString",
      coordinates: [
        [77.5940, 12.9752],
        [77.5936, 12.9768],
        [77.5929, 12.9762],
        [77.5918, 12.9789],
      ],
    },
    status: "intact",
    species: {
      id: 2,
      name: "Indian Giant Squirrel",
      commonName: "Malabar / Indian Giant Squirrel",
      scientificName: "Ratufa indica",
      habitatType: "Upper Canopy",
      canopyDependency: "high",
      sensitivity: "medium",
      description: "Large forest squirrel that leaps up to 6 meters between overlapping upper tree branches in search of mature Ficus and Mahua fruit.",
      imageUrl: null,
    },
  },
  {
    id: 3,
    projectId: 1,
    name: "Avian & Pollinator Flyway (Bal Bhavan to Lotus Pond)",
    speciesId: 3,
    connectivityScore: 91,
    length: 2.1,
    criticalTreeCount: 34,
    threatLevel: "low",
    potentialFragmentation: 8,
    geometry: {
      type: "LineString",
      coordinates: [
        [77.5955, 12.9780],
        [77.5948, 12.9765],
        [77.5929, 12.9762],
        [77.5915, 12.9748],
        [77.5909, 12.9742],
      ],
    },
    status: "intact",
    species: {
      id: 3,
      name: "Native Pollinator Guild",
      commonName: "Purple Sunbird & Honeybee Guild",
      scientificName: "Cinnyris asiaticus & Apis dorsata",
      habitatType: "Flowering Canopy",
      canopyDependency: "medium",
      sensitivity: "low",
      description: "Pollinator flight corridor linking spring-blooming Gulmohar, Tabebuia, and Cotton trees across the length of Cubbon Park.",
      imageUrl: null,
    },
  },
  {
    id: 4,
    projectId: 1,
    name: "Nocturnal Raptor & Bat Roost Flyway",
    speciesId: 4,
    connectivityScore: 72,
    length: 1.6,
    criticalTreeCount: 16,
    threatLevel: "high",
    potentialFragmentation: 22,
    geometry: {
      type: "LineString",
      coordinates: [
        [77.5909, 12.9742],
        [77.5929, 12.9762],
        [77.5940, 12.9752],
        [77.5950, 12.9782],
      ],
    },
    status: "vulnerable",
    species: {
      id: 4,
      name: "Spotted Owlet & Flying Fox Guild",
      commonName: "Spotted Owlet & Indian Flying Fox",
      scientificName: "Athene brama & Pteropus giganteus",
      habitatType: "Old Hollow Canopy",
      canopyDependency: "high",
      sensitivity: "high",
      description: "Nocturnal roosting corridor dependent on hollowed heritage Banyans and tall Araucarias for daytime shelter and nocturnal feeding flights.",
      imageUrl: null,
    },
  },
];
