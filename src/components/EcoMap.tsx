'use client';

import { useEffect, useRef, useState } from 'react';
import { Tree, Corridor } from '@/types';
import { CUBBON_CORRIDORS } from '@/lib/cubbon-tree-inventory';

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

interface EcoMapProps {
  trees: Tree[];
  center?: { lat: number; lng: number };
  onTreeSelect?: (tree: Tree) => void;
  selectedTree?: Tree | null;
  corridors?: Corridor[];
  showCanopyRings?: boolean;
  showCorridors?: boolean;
}

export default function EcoMap({
  trees,
  center = { lat: 13.0219, lng: 77.5671 },
  onTreeSelect,
  selectedTree,
  corridors = CUBBON_CORRIDORS,
  showCanopyRings = true,
  showCorridors = true,
}: EcoMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const canopyCirclesGroupRef = useRef<any>(null);
  const corridorsGroupRef = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Initialize Map
  useEffect(() => {
    if (typeof window === 'undefined' || mapRef.current || !mapContainerRef.current) return;

    let isMounted = true;

    import('leaflet')
      .then((L) => {
        if (!isMounted || !mapContainerRef.current || mapRef.current) return;

        // Fix default Leaflet icon issues
        delete (L.Icon.Default.prototype as any)._getIconUrl;

        // Initialize Leaflet map
        const map = L.map(mapContainerRef.current, {
          zoomControl: false,
        }).setView([center.lat, center.lng], 16);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // Nature-harmonious carto tiles
        const cartoApiKey = process.env.NEXT_PUBLIC_CARTO_API_KEY;
        const cartoTileUrl = `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png${
          cartoApiKey ? `?key=${encodeURIComponent(cartoApiKey)}` : ''
        }`;

        L.tileLayer(cartoTileUrl, {
          maxZoom: 19,
          subdomains: 'abcd',
          attribution: '&copy; CARTO &copy; OpenStreetMap contributors',
        }).addTo(map);

        // Layer groups for markers, canopies, and corridors
        canopyCirclesGroupRef.current = L.layerGroup().addTo(map);
        corridorsGroupRef.current = L.layerGroup().addTo(map);
        markersGroupRef.current = L.layerGroup().addTo(map);

        mapRef.current = map;
        setMapError(null);
        setIsMapLoaded(true);

        // Force layout recalculation so h-full containers resolve
        requestAnimationFrame(() => {
          map.invalidateSize();
          setTimeout(() => map.invalidateSize(), 150);
        });
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        console.error('Error loading Leaflet map:', error);
        setMapError('The map could not be loaded. Please refresh and try again.');
      });

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => mapRef.current?.invalidateSize())
      : null;
    if (resizeObserver && mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      isMounted = false;
      resizeObserver?.disconnect();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center.lat, center.lng]);

  // Update trees, markers, canopy rings, and corridors when data or selection changes
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) return;

    // Ensure map dimensions are correct before placing markers
    mapRef.current.invalidateSize();

    import('leaflet').then((L) => {
      // Clear previous layers
      markersGroupRef.current?.clearLayers();
      canopyCirclesGroupRef.current?.clearLayers();
      corridorsGroupRef.current?.clearLayers();

      // Render Corridors
      if (showCorridors && corridors) {
        corridors.forEach((corr) => {
          if (corr.geometry?.coordinates) {
            const latlngs = corr.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
            const isHighThreat = corr.threatLevel === 'high';
            const isLorisCorridor = Boolean(corr.name && corr.name.includes('Loris'));

            const polyline = L.polyline(latlngs, {
              color: isLorisCorridor ? '#849324' : isHighThreat ? '#FD151B' : '#FFB30F',
              weight: isLorisCorridor ? 4 : isHighThreat ? 4 : 3,
              dashArray: isLorisCorridor ? undefined : '8, 8',
              opacity: 0.9,
            }).addTo(corridorsGroupRef.current);

            polyline.bindTooltip(
              `<div style="font-family: inherit; font-size: 11px; font-weight: bold; color: #01295F;">
                🛣️ ${escapeHtml(corr.name)} (${escapeHtml(corr.connectivityScore)}% Intact)
              </div>`,
              { sticky: true }
            );
          }
        });
      }

      // Render Trees & Canopy Spread Rings
      trees.forEach((tree) => {
        if (tree.status === 'removed') return;

        const isSelected = selectedTree?.id === tree.id;
        const hasLoris = Boolean(tree.metadata?.hasLorisSighting);
        const isCritical = tree.isCriticalNode || tree.ecologicalValue === 'critical';
        const isHigh = tree.ecologicalValue === 'high';

        const mainColor = isSelected
          ? '#FFB30F'
          : hasLoris
          ? '#849324'
          : isCritical
          ? '#FD151B'
          : isHigh
          ? '#437F97'
          : '#01295F';

        // Add Canopy Spread Ring (in meters)
        if (showCanopyRings && tree.canopyRadius) {
          L.circle([tree.lat, tree.lng], {
            radius: tree.canopyRadius,
            fillColor: mainColor,
            fillOpacity: isSelected ? 0.38 : hasLoris ? 0.28 : isCritical ? 0.22 : 0.15,
            color: mainColor,
            weight: isSelected ? 2.5 : hasLoris ? 2 : 1,
            opacity: 0.6,
          }).addTo(canopyCirclesGroupRef.current);
        }

        // Custom organic SVG marker with Loris badge
        const markerSvg = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${isSelected ? 38 : hasLoris ? 34 : 28}" height="${isSelected ? 38 : hasLoris ? 34 : 28}">
            <circle cx="16" cy="16" r="${isSelected ? 14 : hasLoris ? 13 : 11}" fill="${mainColor}" fill-opacity="${isSelected ? 0.5 : 0.3}"/>
            <circle cx="16" cy="16" r="${isSelected ? 8 : hasLoris ? 7 : 6}" fill="${mainColor}" stroke="#FFFFFF" stroke-width="2"/>
            ${hasLoris ? '<circle cx="16" cy="16" r="3.5" fill="#FFB30F"/>' : isCritical ? '<circle cx="16" cy="16" r="3" fill="#FFFFFF"/>' : ''}
          </svg>
        `;

        const icon = L.divIcon({
          className: 'custom-tree-pin',
          html: markerSvg,
          iconSize: [isSelected ? 38 : hasLoris ? 34 : 28, isSelected ? 38 : hasLoris ? 34 : 28],
          iconAnchor: [isSelected ? 19 : hasLoris ? 17 : 14, isSelected ? 19 : hasLoris ? 17 : 14],
          popupAnchor: [0, -18],
        });

        const marker = L.marker([tree.lat, tree.lng], { icon }).addTo(markersGroupRef.current);

        // Rich botanical popup
        const kannada = tree.metadata?.kannadaName ? `(${escapeHtml(tree.metadata.kannadaName)})` : '';
        const fauna = tree.metadata?.faunaAffinity?.slice(0, 3).map(escapeHtml).join(', ') || 'Birds, pollinators';
        const lorisNotice = hasLoris
          ? `<div style="background: rgba(132, 147, 36, 0.25); border: 1px solid #849324; border-radius: 6px; padding: 4px 6px; margin-top: 6px; font-size: 10px; color: #FFB30F; font-weight: bold;">
              🦎 Grey Slender Loris Resident Tree (IISc Bangalore)
             </div>`
          : '';

        const popupContent = `
          <div style="font-family: inherit; line-height: 1.4; min-width: 220px; padding: 2px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-family: monospace; font-size: 11px; color: #FFB30F; font-weight: bold;">${escapeHtml(tree.treeNumber)}</span>
              <span style="font-size: 10px; text-transform: uppercase; background: ${hasLoris ? '#849324' : isCritical ? '#FD151B' : '#437F97'}; color: #FFFFFF; padding: 2px 6px; border-radius: 4px; font-weight: bold;">
                ${escapeHtml(hasLoris ? 'Loris Refuge' : tree.ecologicalValue || 'Standard')}
              </span>
            </div>
            <div style="font-size: 13px; font-weight: bold; color: #FFFFFF; margin-bottom: 2px;">
              ${escapeHtml(tree.commonName || tree.species)}
            </div>
            <div style="font-size: 11px; font-style: italic; color: #cbd5e1; margin-bottom: 6px;">
              ${escapeHtml(tree.species)} ${kannada}
            </div>
            <div style="font-size: 11px; color: #f1f5f9; margin-bottom: 4px;">
              <strong>Age:</strong> ~${escapeHtml(tree.age || '—')} yrs &bull; <strong>Canopy:</strong> ${escapeHtml(tree.canopyRadius || '—')}m
            </div>
            <div style="font-size: 10px; color: #FFB30F; border-top: 1px solid rgba(255,179,15,0.25); padding-top: 4px; margin-top: 4px;">
              🐾 <strong>Affinity:</strong> ${fauna}
            </div>
            ${lorisNotice}
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('click', () => {
          onTreeSelect?.(tree);
        });
      });
    });
  }, [trees, selectedTree, isMapLoaded, showCanopyRings, showCorridors, corridors, onTreeSelect]);

  // Handle center changes dynamically with smooth flyTo
  useEffect(() => {
    if (mapRef.current && center) {
      mapRef.current.flyTo([center.lat, center.lng], 16, { duration: 1.2 });
    }
  }, [center.lat, center.lng]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#437F97]/30 shadow-2xl">
      <div ref={mapContainerRef} className="w-full h-full" />
      {!isMapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#01295F] text-[#F4F7FA]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFB30F] mx-auto mb-4"></div>
            <p className="font-serif text-lg font-semibold text-white">Rendering Living Urban Canopy...</p>
            <p className="text-xs font-mono text-[#FFB30F]/90 mt-1">Mapping spatial canopy intersections &amp; Loris sanctuaries</p>
          </div>
        </div>
      )}
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#01295F] px-6 text-center text-white">
          <p className="text-sm font-mono text-[#FFB30F]">{mapError}</p>
        </div>
      )}
    </div>
  );
}
