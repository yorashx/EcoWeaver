import { Tree, Species, Corridor } from '@/types';
import { CUBBON_TREES, CUBBON_CORRIDORS } from './cubbon-tree-inventory';
import { CUBBON_PARK_SPECIES, CubbonTreeSpecies, CUBBON_ZONES } from './cubbon-species-data';

// Singleton in-memory state representing the living Cubbon Park ecological twin
class CubbonDataStore {
  private trees: Tree[] = [];
  private corridors: Corridor[] = [];
  private speciesList: CubbonTreeSpecies[] = [];

  constructor() {
    this.reset();
  }

  public reset() {
    // Deep clone initial trees and corridors
    this.trees = JSON.parse(JSON.stringify(CUBBON_TREES));
    this.corridors = JSON.parse(JSON.stringify(CUBBON_CORRIDORS));
    this.speciesList = [...CUBBON_PARK_SPECIES];
  }

  // Trees CRUD
  public getTrees(filters?: {
    zone?: string;
    ecologicalValue?: string;
    search?: string;
    status?: string;
    limit?: number;
  }): Tree[] {
    let result = this.trees;

    if (filters?.status) {
      result = result.filter(t => t.status === filters.status);
    }

    if (filters?.zone && filters.zone !== 'all') {
      result = result.filter(t => t.metadata?.zone === filters.zone);
    }

    if (filters?.ecologicalValue && filters.ecologicalValue !== 'all') {
      result = result.filter(t => t.ecologicalValue === filters.ecologicalValue);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        t =>
          (t.treeNumber && t.treeNumber.toLowerCase().includes(q)) ||
          (t.species && t.species.toLowerCase().includes(q)) ||
          (t.commonName && t.commonName.toLowerCase().includes(q)) ||
          (t.metadata?.kannadaName && t.metadata.kannadaName.toLowerCase().includes(q)) ||
          (t.metadata?.family && t.metadata.family.toLowerCase().includes(q))
      );
    }

    if (filters?.limit && filters.limit > 0) {
      return result.slice(0, filters.limit);
    }

    return result;
  }

  public getTreeById(id: number): Tree | undefined {
    return this.trees.find(t => t.id === id);
  }

  public addTree(treeData: Partial<Tree>): Tree {
    const newId = Math.max(...this.trees.map(t => t.id), 0) + 1;
    const newTree: Tree = {
      id: newId,
      projectId: 1,
      treeNumber: treeData.treeNumber || `CP-PLANTED-${String(newId).padStart(3, '0')}`,
      species: treeData.species || 'Ficus benghalensis L.',
      commonName: treeData.commonName || 'Banyan Sapling',
      age: treeData.age || 3,
      canopyRadius: treeData.canopyRadius || 6.5,
      height: treeData.height || 8.0,
      ecologicalValue: treeData.ecologicalValue || 'high',
      connectivityContribution: treeData.connectivityContribution || 8.0,
      lat: treeData.lat || 12.9762,
      lng: treeData.lng || 77.5929,
      status: 'active',
      isCriticalNode: treeData.isCriticalNode ?? false,
      metadata: {
        zone: treeData.metadata?.zone || 'zone-bandstand',
        notes: treeData.metadata?.notes || 'Newly planted native rewilding tree.',
        healthScore: 100,
        plantedAt: new Date().toISOString(),
        ...(treeData.metadata || {}),
      },
    };

    this.trees.push(newTree);
    return newTree;
  }

  public removeTree(id: number): boolean {
    const tree = this.trees.find(t => t.id === id);
    if (!tree) return false;
    tree.status = 'removed';
    return true;
  }

  public restoreTree(id: number): boolean {
    const tree = this.trees.find(t => t.id === id);
    if (!tree) return false;
    tree.status = 'active';
    return true;
  }

  // Species
  public getSpecies(filters?: {
    search?: string;
    family?: string;
    role?: string;
    nativeOnly?: boolean;
  }): CubbonTreeSpecies[] {
    let result = this.speciesList;

    if (filters?.family && filters.family !== 'all') {
      result = result.filter(s => s.family === filters.family);
    }

    if (filters?.role && filters.role !== 'all') {
      result = result.filter(s => s.ecologicalRole === filters.role);
    }

    if (filters?.nativeOnly) {
      result = result.filter(s => s.nativeStatus === 'Native');
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        s =>
          s.scientificName.toLowerCase().includes(q) ||
          s.commonName.toLowerCase().includes(q) ||
          (s.kannadaName && s.kannadaName.toLowerCase().includes(q)) ||
          s.family.toLowerCase().includes(q) ||
          s.faunaAffinity.some(f => f.toLowerCase().includes(q))
      );
    }

    return result;
  }

  public getSpeciesBySerial(serialNo: number): CubbonTreeSpecies | undefined {
    return this.speciesList.find(s => s.serialNo === serialNo);
  }

  // Corridors
  public getCorridors(): Corridor[] {
    return this.corridors;
  }

  // Summary Metrics
  public getStats() {
    const active = this.trees.filter(t => t.status === 'active');
    const criticalNodes = active.filter(t => t.isCriticalNode || t.ecologicalValue === 'critical').length;
    const totalCanopyAreaSqM = Math.round(
      active.reduce((acc, t) => acc + Math.PI * Math.pow(t.canopyRadius || 5, 2), 0)
    );

    return {
      totalMonitoredTrees: active.length,
      removedTrees: this.trees.length - active.length,
      registeredSpeciesCount: this.speciesList.length,
      criticalKeystoneNodes: criticalNodes,
      wildlifeCorridorsCount: this.corridors.length,
      parkCanopyAreaSqM: totalCanopyAreaSqM,
      baselineConnectivityPct: 86,
      zones: CUBBON_ZONES,
    };
  }
}

// Global singleton to preserve simulation modifications across requests in dev
const globalForStore = globalThis as typeof globalThis & {
  __cubbonDataStore?: CubbonDataStore;
};

export const dataStore = globalForStore.__cubbonDataStore ?? new CubbonDataStore();

if (process.env.NODE_ENV !== 'production') {
  globalForStore.__cubbonDataStore = dataStore;
}
