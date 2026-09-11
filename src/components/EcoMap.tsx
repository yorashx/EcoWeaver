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
  center = { lat: 12.9762, lng: 77.5929 },
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
          attributionControl: false,
        }).setView([center.lat, center.lng], 16);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // Nature-harmonious carto tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          subdomains: 'abcd',
        }).addTo(map);

        // Layer groups for markers, canopies, and corridors
        canopyCirclesGroupRef.current = L.layerGroup().addTo(map);
        corridorsGroupRef.current = L.layerGroup().addTo(map);
        markersGroupRef.current = L.layerGroup().addTo(map);

        mapRef.current = map;
        setMapError(null);
        setIsMapLoaded(true);

        requestAnimationFrame(() => map.invalidateSize());
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

            const polyline = L.polyline(latlngs, {
              color: isHighThreat ? '#BC6C25' : '#DDA15E',
              weight: isHighThreat ? 4 : 3,
              dashArray: '8, 8',
              opacity: 0.85,
            }).addTo(corridorsGroupRef.current);

            polyline.bindTooltip(
              `<div style="font-family: inherit; font-size: 11px; font-weight: bold; color: #283618;">
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
        const isCritical = tree.isCriticalNode || tree.ecologicalValue === 'critical';
        const isHigh = tree.ecologicalValue === 'high';

        const mainColor = isSelected
          ? '#DDA15E'
          : isCritical
          ? '#BC6C25'
          : isHigh
          ? '#606C38'
          : '#283618';

        // Add Canopy Spread Ring (in meters)
        if (showCanopyRings && tree.canopyRadius) {
          L.circle([tree.lat, tree.lng], {
            radius: tree.canopyRadius,
            fillColor: mainColor,
            fillOpacity: isSelected ? 0.35 : isCritical ? 0.22 : 0.14,
            color: mainColor,
            weight: isSelected ? 2 : 1,
            opacity: 0.5,
          }).addTo(canopyCirclesGroupRef.current);
        }

        // Custom organic SVG marker
        const markerSvg = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${isSelected ? 36 : 28}" height="${isSelected ? 36 : 28}">
            <circle cx="16" cy="16" r="${isSelected ? 14 : 11}" fill="${mainColor}" fill-opacity="${isSelected ? 0.45 : 0.25}"/>
            <circle cx="16" cy="16" r="${isSelected ? 8 : 6}" fill="${mainColor}" stroke="#FEFAE0" stroke-width="2"/>
            ${isCritical ? '<circle cx="16" cy="16" r="3" fill="#FEFAE0"/>' : ''}
          </svg>
        `;

        const icon = L.divIcon({
          className: 'custom-tree-pin',
          html: markerSvg,
          iconSize: [isSelected ? 36 : 28, isSelected ? 36 : 28],
          iconAnchor: [isSelected ? 18 : 14, isSelected ? 18 : 14],
          popupAnchor: [0, -18],
        });

        const marker = L.marker([tree.lat, tree.lng], { icon }).addTo(markersGroupRef.current);

        // Rich botanical popup
        const kannada = tree.metadata?.kannadaName ? `(${escapeHtml(tree.metadata.kannadaName)})` : '';
        const fauna = tree.metadata?.faunaAffinity?.slice(0, 3).map(escapeHtml).join(', ') || 'Birds, pollinators';

        const popupContent = `
          <div style="font-family: inherit; line-height: 1.4; min-width: 200px; padding: 2px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-family: monospace; font-size: 11px; color: #DDA15E; font-weight: bold;">${escapeHtml(tree.treeNumber)}</span>
              <span style="font-size: 10px; text-transform: uppercase; background: ${isCritical ? '#BC6C25' : '#606C38'}; color: #FEFAE0; padding: 2px 6px; border-radius: 4px; font-weight: bold;">
                ${escapeHtml(tree.ecologicalValue || 'Standard')}
              </span>
            </div>
            <div style="font-size: 13px; font-weight: bold; color: #FEFAE0; margin-bottom: 2px;">
              ${escapeHtml(tree.commonName || tree.species)}
            </div>
            <div style="font-size: 11px; font-style: italic; color: #e0d9b6; margin-bottom: 6px;">
              ${escapeHtml(tree.species)} ${kannada}
            </div>
            <div style="font-size: 11px; color: #FEFAE0; margin-bottom: 4px;">
              <strong>Age:</strong> ~${escapeHtml(tree.age || '—')} yrs &bull; <strong>Canopy:</strong> ${escapeHtml(tree.canopyRadius || '—')}m
            </div>
            <div style="font-size: 10px; color: #DDA15E; border-top: 1px solid rgba(221,161,94,0.25); padding-top: 4px; margin-top: 4px;">
              🐾 <strong>Affinity:</strong> ${fauna}
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('click', () => {
          onTreeSelect?.(tree);
        });
      });
    });
  }, [trees, selectedTree, isMapLoaded, showCanopyRings, showCorridors, corridors, onTreeSelect]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#606C38]/30 shadow-2xl">
      <div ref={mapContainerRef} className="w-full h-full" />
      {!isMapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#283618] text-[#FEFAE0]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DDA15E] mx-auto mb-4"></div>
            <p className="font-serif text-lg font-semibold text-[#FEFAE0]">Rendering Cubbon Park Canopy...</p>
            <p className="text-xs font-mono text-[#DDA15E]/80 mt-1">Calculating spatial canopy intersections</p>
          </div>
        </div>
      )}
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#283618] px-6 text-center text-[#FEFAE0]">
          <p className="text-sm font-mono text-[#DDA15E]">{mapError}</p>
        </div>
      )}
    </div>
  );
}
