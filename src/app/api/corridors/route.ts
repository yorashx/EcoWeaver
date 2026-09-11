import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';

export async function GET() {
  try {
    const corridors = dataStore.getCorridors();
    return NextResponse.json({
      success: true,
      count: corridors.length,
      corridors,
    });
  } catch (error) {
    console.error('Error fetching corridors:', error);
    return NextResponse.json({ error: 'Failed to fetch corridors' }, { status: 500 });
  }
}
