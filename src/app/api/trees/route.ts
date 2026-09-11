import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const zone = searchParams.get('zone') || undefined;
    const ecologicalValue = searchParams.get('ecologicalValue') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;
    const status = searchParams.get('status') || undefined;

    const filteredTrees = dataStore.getTrees({
      zone,
      ecologicalValue,
      search,
      limit,
      status,
    });

    const stats = dataStore.getStats();

    return NextResponse.json({
      success: true,
      count: filteredTrees.length,
      stats,
      trees: filteredTrees,
    });
  } catch (error) {
    console.error('Error fetching trees:', error);
    return NextResponse.json({ error: 'Failed to fetch trees' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newTree = dataStore.addTree(body);
    return NextResponse.json({ success: true, tree: newTree }, { status: 201 });
  } catch (error) {
    console.error('Error creating tree:', error);
    return NextResponse.json({ error: 'Failed to create tree' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '', 10);
    if (!id) {
      return NextResponse.json({ error: 'Tree id is required' }, { status: 400 });
    }

    const removed = dataStore.removeTree(id);
    return NextResponse.json({ success: removed, id });
  } catch (error) {
    console.error('Error removing tree:', error);
    return NextResponse.json({ error: 'Failed to remove tree' }, { status: 500 });
  }
}
