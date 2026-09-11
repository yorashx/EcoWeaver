import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';
import { SimulationEngine } from '@/lib/simulation-engine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { actions = [], scenarioName = 'Custom Scenario' } = body;

    // Get current trees and corridors
    const currentTrees = dataStore.getTrees({ status: 'active' });
    const currentCorridors = dataStore.getCorridors();

    const engine = new SimulationEngine(currentTrees, currentCorridors);
    const results = engine.simulate(actions);

    return NextResponse.json({
      success: true,
      scenarioName,
      actionsCount: actions.length,
      results,
      executedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error running simulation:', error);
    return NextResponse.json({ error: 'Failed to execute simulation' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Provide standard demo presets for immediate exploration
    const presets = [
      {
        id: 'preset-tree-21',
        title: 'Centennial Rain Tree #021 Removal',
        targetTreeId: 21,
        description: 'Simulates the severance of the central Grey Slender Loris arterial pathway near Queen Promenade.',
        actionType: 'remove_tree',
        tag: 'Heritage Anchor',
      },
      {
        id: 'preset-banyan-1',
        title: 'Grandmother Banyan #001 Disturbance',
        targetTreeId: 1,
        description: 'Assesses the catastrophic loss of the 145-year-old Banyan prop-root network and owl roost.',
        actionType: 'remove_tree',
        tag: 'Keystone Giant',
      },
      {
        id: 'preset-corridor-bridge',
        title: 'Arboreal Rope Bridge Reconnection',
        targetTreeId: 21,
        description: 'Tests mitigating canopy gaps by installing a canopy rope bridge across Queen Avenue.',
        actionType: 'add_bridge',
        tag: 'Mitigation Test',
      },
    ];

    return NextResponse.json({ success: true, presets });
  } catch (error) {
    console.error('Error fetching simulations:', error);
    return NextResponse.json({ error: 'Failed to fetch simulations' }, { status: 500 });
  }
}
