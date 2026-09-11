import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const family = searchParams.get('family') || undefined;
    const role = searchParams.get('role') || undefined;
    const nativeOnly = searchParams.get('nativeOnly') === 'true';

    const species = dataStore.getSpecies({
      search,
      family,
      role,
      nativeOnly,
    });

    // Extract unique families for filter dropdowns
    const allSpecies = dataStore.getSpecies();
    const families = Array.from(new Set(allSpecies.map(s => s.family))).sort();
    const ecologicalRoles = Array.from(new Set(allSpecies.map(s => s.ecologicalRole))).sort();

    return NextResponse.json({
      success: true,
      totalCount: allSpecies.length,
      filteredCount: species.length,
      families,
      ecologicalRoles,
      species,
    });
  } catch (error) {
    console.error('Error fetching species:', error);
    return NextResponse.json({ error: 'Failed to fetch species' }, { status: 500 });
  }
}
