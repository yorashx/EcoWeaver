'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SimulatorRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const treeId = searchParams?.get('treeId');

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('mode', 'simulator');
    if (treeId) params.set('treeId', treeId);
    router.replace(`/map?${params.toString()}`);
  }, [router, treeId]);

  return (
    <div className="min-h-screen bg-[#F4F7FA] flex items-center justify-center text-[#01295F]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#01295F] mx-auto mb-3"></div>
        <p className="text-sm font-mono">Redirecting to Habitat Simulator...</p>
      </div>
    </div>
  );
}

export default function SimulatorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F7FA] flex items-center justify-center text-[#01295F]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#01295F] mx-auto mb-3" />
        </div>
      }
    >
      <SimulatorRedirect />
    </Suspense>
  );
}
