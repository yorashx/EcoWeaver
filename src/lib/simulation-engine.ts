import { Tree, Corridor, SimulationAction } from '@/types';

interface ConnectivityGraph {
  nodes: Set<number>;
  edges: Map<number, Set<number>>;
}

export interface AdvancedSimulationResult {
  connectivityBefore: number;
  connectivityAfter: number;
  connectivityChangePct: number;
  canopyAreaBeforeSqM: number;
  canopyAreaAfterSqM: number;
  canopyAreaLostSqM: number;
  corridorsIntactBefore: number;
  corridorsIntactAfter: number;
  criticalNodesBefore: number;
  criticalNodesAfter: number;
  criticalNodesLost: number;
  shannonDiversityBefore: number;
  shannonDiversityAfter: number;
  carbonSequestrationLostKgPerYr: number;
  microclimateTempRiseEstimateC: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  impactSummary: string;
  affectedFauna: {
    speciesName: string;
    impactLevel: 'Critical' | 'Severe' | 'Moderate';
    reason: string;
    icon: string;
  }[];
  mitigationStrategies: {
    title: string;
    action: string;
    effectivenessPct: number;
    timeline: string;
    priority: 'Urgent' | 'High' | 'Recommended';
  }[];
  networkTopology: {
    isolatedCanopyIslands: number;
    giantComponentRatio: number;
    totalActiveTrees: number;
  };
  bioacoustics: {
    soundscapeNdsiBefore: number;
    soundscapeNdsiAfter: number;
    ndsiChangePct: number;
    lorisAuditoryReachMetersBefore: number;
    lorisAuditoryReachMetersAfter: number;
    acousticMaskingRisk: 'Low' | 'Moderate' | 'Severe' | 'Critical';
    sensorNodesAffected: number;
    ultrasonicBufferLossPct: number;
  };
}

export class SimulationEngine {
  private trees: Tree[];
  private corridors: Corridor[];
  private maxCanopyDistance: number = 22; // meters - maximum branch reach gap

  constructor(trees: Tree[], corridors: Corridor[] = []) {
    this.trees = trees;
    this.corridors = corridors;
  }

  // Calculate distance between two points in meters (Haversine formula)
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3; // Earth radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  // Build connectivity graph considering canopy overlap and artificial canopy bridges
  private buildConnectivityGraph(activeTrees: Tree[], bridges: any[] = []): ConnectivityGraph {
    const graph: ConnectivityGraph = {
      nodes: new Set(),
      edges: new Map(),
    };

    activeTrees.forEach(tree => {
      graph.nodes.add(tree.id);
      graph.edges.set(tree.id, new Set());
    });

    // Connect overlapping or adjacent canopies
    for (let i = 0; i < activeTrees.length; i++) {
      for (let j = i + 1; j < activeTrees.length; j++) {
        const tree1 = activeTrees[i];
        const tree2 = activeTrees[j];

        const distance = this.calculateDistance(tree1.lat, tree1.lng, tree2.lat, tree2.lng);
        const combinedReach = (tree1.canopyRadius || 6) + (tree2.canopyRadius || 6);

        // If canopies overlap or are within max branch leap distance
        if (distance <= Math.max(combinedReach, this.maxCanopyDistance)) {
          graph.edges.get(tree1.id)?.add(tree2.id);
          graph.edges.get(tree2.id)?.add(tree1.id);
        }
      }
    }

    // Connect trees bridged by artificial canopy bridges
    bridges.forEach(b => {
      if (b.treeId1 && b.treeId2 && graph.nodes.has(b.treeId1) && graph.nodes.has(b.treeId2)) {
        graph.edges.get(b.treeId1)?.add(b.treeId2);
        graph.edges.get(b.treeId2)?.add(b.treeId1);
      }
    });

    return graph;
  }

  private findConnectedComponents(graph: ConnectivityGraph): Set<number>[] {
    const visited = new Set<number>();
    const components: Set<number>[] = [];

    const dfs = (node: number, component: Set<number>) => {
      visited.add(node);
      component.add(node);

      graph.edges.get(node)?.forEach(neighbor => {
        if (!visited.has(neighbor)) {
          dfs(neighbor, component);
        }
      });
    };

    graph.nodes.forEach(node => {
      if (!visited.has(node)) {
        const component = new Set<number>();
        dfs(node, component);
        components.push(component);
      }
    });

    return components;
  }

  private calculateConnectivityScore(graph: ConnectivityGraph): number {
    if (graph.nodes.size === 0) return 0;

    let totalDegree = 0;
    graph.edges.forEach(conn => {
      totalDegree += conn.size;
    });
    const avgDegree = totalDegree / graph.nodes.size;

    const components = this.findConnectedComponents(graph);
    const largestComponent = Math.max(...components.map(c => c.size), 0);

    // Degree contribution (up to 40) + Giant Component coherence (up to 60)
    const degreeScore = Math.min(avgDegree / 4.5, 1) * 40;
    const componentScore = (largestComponent / graph.nodes.size) * 60;

    return Math.min(Math.round(degreeScore + componentScore), 100);
  }

  private calculateTotalCanopyArea(trees: Tree[]): number {
    return Math.round(
      trees.reduce((sum, t) => sum + Math.PI * Math.pow(t.canopyRadius || 5, 2), 0)
    );
  }

  private countCriticalNodes(graph: ConnectivityGraph, trees: Tree[]): number {
    let count = 0;
    graph.nodes.forEach(id => {
      const degree = graph.edges.get(id)?.size || 0;
      const tree = trees.find(t => t.id === id);
      if (degree >= 5 || tree?.isCriticalNode || tree?.ecologicalValue === 'critical') {
        count++;
      }
    });
    return count;
  }

  private calculateShannonDiversity(trees: Tree[]): number {
    if (trees.length === 0) return 0;
    const speciesCounts: Record<string, number> = {};
    trees.forEach(t => {
      const sp = t.species || 'Unknown';
      speciesCounts[sp] = (speciesCounts[sp] || 0) + 1;
    });

    let h = 0;
    const n = trees.length;
    Object.values(speciesCounts).forEach(c => {
      const p = c / n;
      if (p > 0) h -= p * Math.log(p);
    });

    return Number(h.toFixed(2));
  }

  // Full multi-action simulation
  public simulate(actions: SimulationAction[]): AdvancedSimulationResult {
    let workingTrees = this.trees.map(t => ({ ...t }));
    const bridges: any[] = [];
    const removedTreeDetails: Tree[] = [];
    let plantedTreeCount = 0;

    // Apply all simulation actions
    actions.forEach(act => {
      if (act.actionType === 'remove_tree') {
        const removed = workingTrees.find(t => t.id === act.targetId);
        if (removed) {
          removedTreeDetails.push(removed);
          workingTrees = workingTrees.filter(t => t.id !== act.targetId);
        }
      } else if (act.actionType === 'add_tree' || act.actionType === 'plant_tree') {
        plantedTreeCount++;
        const p = act.parameters || {};
        workingTrees.push({
          id: 9000 + plantedTreeCount,
          projectId: 1,
          treeNumber: `CP-NEW-${plantedTreeCount}`,
          species: p.species || 'Ficus benghalensis L.',
          commonName: p.commonName || 'Native Banyan',
          age: p.age || 4,
          canopyRadius: p.canopyRadius || 7.5,
          height: p.height || 9.0,
          ecologicalValue: 'high',
          connectivityContribution: 9.0,
          lat: p.lat || 12.9762,
          lng: p.lng || 77.5929,
          status: 'active',
          isCriticalNode: false,
          metadata: { notes: 'Restoration sapling' },
        });
      } else if (act.actionType === 'add_bridge') {
        bridges.push(act.parameters || {});
      }
    });

    // Graphs before and after
    const beforeGraph = this.buildConnectivityGraph(this.trees);
    const afterGraph = this.buildConnectivityGraph(workingTrees, bridges);

    const connectivityBefore = this.calculateConnectivityScore(beforeGraph);
    const connectivityAfter = this.calculateConnectivityScore(afterGraph);
    const connectivityChangePct = connectivityAfter - connectivityBefore;

    const canopyAreaBeforeSqM = this.calculateTotalCanopyArea(this.trees);
    const canopyAreaAfterSqM = this.calculateTotalCanopyArea(workingTrees);
    const canopyAreaLostSqM = Math.max(0, canopyAreaBeforeSqM - canopyAreaAfterSqM);

    const criticalNodesBefore = this.countCriticalNodes(beforeGraph, this.trees);
    const criticalNodesAfter = this.countCriticalNodes(afterGraph, workingTrees);
    const criticalNodesLost = Math.max(0, criticalNodesBefore - criticalNodesAfter);

    const beforeComponents = this.findConnectedComponents(beforeGraph);
    const afterComponents = this.findConnectedComponents(afterGraph);

    const shannonDiversityBefore = this.calculateShannonDiversity(this.trees);
    const shannonDiversityAfter = this.calculateShannonDiversity(workingTrees);

    // Carbon lost approx 180kg/yr per removed mature tree
    const carbonSequestrationLostKgPerYr = Math.round(
      removedTreeDetails.reduce((acc, t) => acc + (t.metadata?.carbonSequestrationKgPerYr || 185), 0)
    );

    // Microclimate impact
    const microclimateTempRiseEstimateC = Number((canopyAreaLostSqM / 4500 * 0.45).toFixed(2));

    // Determine Risk Level
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (connectivityChangePct <= -18 || criticalNodesLost >= 2) {
      riskLevel = 'critical';
    } else if (connectivityChangePct <= -10 || criticalNodesLost === 1) {
      riskLevel = 'high';
    } else if (connectivityChangePct < -3 || removedTreeDetails.length > 0) {
      riskLevel = 'medium';
    } else if (connectivityChangePct >= 0) {
      riskLevel = 'low';
    }

    // Dynamic fauna consequences based on exact removed species
    const affectedFauna: AdvancedSimulationResult['affectedFauna'] = [];

    const hasLorisAnchorRemoved = removedTreeDetails.some(
      t => t.projectId === 2 || t.metadata?.campus === 'iisc' || t.metadata?.hasLorisSighting
    );

    if (hasLorisAnchorRemoved) {
      affectedFauna.push({
        speciesName: 'Grey Slender Loris (Loris lydekkerianus)',
        impactLevel: 'Critical',
        reason: 'IISc sanctuary arboreal link severed. Lorises cannot traverse gaps >2m without mortal ground descent risk in their last Bengaluru stronghold.',
        icon: '🦎',
      });
    }

    const hasSquirrelAnchorRemoved = removedTreeDetails.some(
      t => t.id === 21 || t.isCriticalNode || t.species?.includes('Ficus') || t.species?.includes('Samanea')
    );

    if (hasSquirrelAnchorRemoved) {
      affectedFauna.push({
        speciesName: 'Indian Giant Squirrel & Asian Palm Civet',
        impactLevel: 'Severe',
        reason: 'Arboreal canopy path severed. Squirrels and civets forced across ground avenues risking vehicle collisions.',
        icon: '🐿️',
      });
    }

    const hasFruitKeystoneRemoved = removedTreeDetails.some(
      t => t.species?.includes('Artocarpus') || t.species?.includes('Ficus') || t.species?.includes('Syzygium')
    );

    if (hasFruitKeystoneRemoved) {
      affectedFauna.push({
        speciesName: 'Indian Giant Squirrel (Ratufa indica)',
        impactLevel: 'Severe',
        reason: 'Essential foraging stopover destroyed. Home range fragmented, forcing long energetic leaps over exposed wires.',
        icon: '🐿️',
      });
    }

    const hasOldHollowTreeRemoved = removedTreeDetails.some(t => (t.age || 0) > 60);
    if (hasOldHollowTreeRemoved) {
      affectedFauna.push({
        speciesName: 'Spotted Owlet & Roosting Bats',
        impactLevel: 'Severe',
        reason: 'Centennial trunk hollows and dense upper shading eliminated, evicting breeding nocturnal raptors.',
        icon: '🦉',
      });
    }

    affectedFauna.push({
      speciesName: 'Native Pollinator Guild (Honeybees & Sunbirds)',
      impactLevel: 'Moderate',
      reason: 'Loss of floral nectar staging posts disrupting cross-pollination flights across Cubbon Park avenues.',
      icon: '🌸',
    });

    // Dynamic mitigation strategies tailored to actions
    const mitigationStrategies: AdvancedSimulationResult['mitigationStrategies'] = [];

    if (bridges.length === 0 && (hasLorisAnchorRemoved || connectivityChangePct < -8)) {
      mitigationStrategies.push({
        title: 'Install Aerial Canopy Rope Bridges',
        action: 'Erect high-tension natural fibre rope bridges (80mm coir/sisal) across the severed corridor to maintain arboreal mammal movement.',
        effectivenessPct: Math.min(90, 62 + Math.max(0, Math.abs(connectivityChangePct)) * 1.5),
        timeline: '1-2 Weeks (Immediate Relief)',
        priority: 'Urgent',
      });
    }

    const plantingEffectiveness = Math.min(96, 68 + plantedTreeCount * 6 + (bridges.length > 0 ? 8 : 0));
    const bufferEffectiveness = Math.min(88, 48 + removedTreeDetails.length * 5 + plantedTreeCount * 4);

    mitigationStrategies.push({
      title: 'Targeted Native Rewilding (Compensatory Planting)',
      action: 'Plant 4-8 mature saplings of indigenous keystone species (Ficus benghalensis, Terminalia arjuna, Syzygium cuminii) along the corridor periphery.',
      effectivenessPct: plantingEffectiveness,
      timeline: 'Phased (1-3 Years for Canopy Reach)',
      priority: 'High',
    });

    mitigationStrategies.push({
      title: 'Ground Understorey Micro-Habitat Buffer',
      action: 'Plant bamboo and native shrub thickets beneath the canopy gap to provide emergency cover if wildlife is forced to ground level.',
      effectivenessPct: bufferEffectiveness,
      timeline: '2 Months',
      priority: 'Recommended',
    });

    const impactSummary =
      removedTreeDetails.length > 0
        ? `Simulation of ${removedTreeDetails.length} tree modification(s) resulted in ${Math.abs(
            connectivityChangePct
          )}% connectivity ${connectivityChangePct < 0 ? 'loss' : 'gain'}, fragmenting the network into ${
            afterComponents.length
          } canopy clusters and forfeiting ${canopyAreaLostSqM.toLocaleString('en-US')} m² of continuous shade.`
        : `Simulation completed. Network maintains ${connectivityAfter}% habitat connectivity across Cubbon Park with ${afterComponents.length} connected canopy components.`;

    // Bioacoustic impact calculations
    const sensorTreeIds = [21, 1, 5, 10];
    const sensorNodesAffected = removedTreeDetails.filter(t => sensorTreeIds.includes(t.id)).length;
    
    const hasTree21Removed = removedTreeDetails.some(t => t.id === 21);
    const soundscapeNdsiBefore = 0.42;
    let ndsiPenalty = removedTreeDetails.length * 0.12 + (hasTree21Removed ? 0.18 : 0);
    let ndsiBonus = bridges.length * 0.14 + plantedTreeCount * 0.08;
    const soundscapeNdsiAfter = Number(Math.max(-0.8, Math.min(0.85, soundscapeNdsiBefore - ndsiPenalty + ndsiBonus)).toFixed(2));
    const ndsiChangePct = Number((((soundscapeNdsiAfter - soundscapeNdsiBefore) / soundscapeNdsiBefore) * 100).toFixed(1));

    const lorisAuditoryReachMetersBefore = 38;
    let reachPenalty = removedTreeDetails.length * 5 + (hasTree21Removed ? 14 : 0);
    let reachBonus = bridges.length * 8 + plantedTreeCount * 3;
    const lorisAuditoryReachMetersAfter = Math.max(8, Math.min(48, lorisAuditoryReachMetersBefore - reachPenalty + reachBonus));

    let acousticMaskingRisk: 'Low' | 'Moderate' | 'Severe' | 'Critical' = 'Low';
    if (hasTree21Removed || ndsiPenalty >= 0.25) {
      acousticMaskingRisk = 'Critical';
    } else if (removedTreeDetails.length >= 2 || ndsiPenalty >= 0.15) {
      acousticMaskingRisk = 'Severe';
    } else if (removedTreeDetails.length === 1) {
      acousticMaskingRisk = 'Moderate';
    }

    const ultrasonicBufferLossPct = Math.min(100, Math.round((canopyAreaLostSqM / Math.max(1, canopyAreaBeforeSqM)) * 320));

    return {
      connectivityBefore,
      connectivityAfter,
      connectivityChangePct,
      canopyAreaBeforeSqM,
      canopyAreaAfterSqM,
      canopyAreaLostSqM,
      corridorsIntactBefore: beforeComponents.length,
      corridorsIntactAfter: afterComponents.length,
      criticalNodesBefore,
      criticalNodesAfter,
      criticalNodesLost,
      shannonDiversityBefore,
      shannonDiversityAfter,
      carbonSequestrationLostKgPerYr,
      microclimateTempRiseEstimateC,
      riskLevel,
      impactSummary,
      affectedFauna,
      mitigationStrategies,
      networkTopology: {
        isolatedCanopyIslands: afterComponents.length,
        giantComponentRatio: Number(
          (Math.max(...afterComponents.map(c => c.size), 0) / Math.max(workingTrees.length, 1)).toFixed(2)
        ),
        totalActiveTrees: workingTrees.length,
      },
      bioacoustics: {
        soundscapeNdsiBefore,
        soundscapeNdsiAfter,
        ndsiChangePct,
        lorisAuditoryReachMetersBefore,
        lorisAuditoryReachMetersAfter,
        acousticMaskingRisk,
        sensorNodesAffected,
        ultrasonicBufferLossPct,
      },
    };
  }
}
