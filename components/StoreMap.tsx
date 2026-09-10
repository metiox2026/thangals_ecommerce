'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { Store } from '@/lib/api';

interface Props {
  stores: Store[];
}

export const StoreMap: React.FC<Props> = ({ stores }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const userMarkerRef = useRef<unknown>(null);
  const clusterRef = useRef<unknown>(null);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cancelled = false;

    (async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet.markercluster');

      if (cancelled || !containerRef.current) return;

      // Inject Leaflet CSS once
      if (!document.querySelector('link[data-leaflet-css]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        link.setAttribute('data-leaflet-css', '');
        document.head.appendChild(link);
      }
      if (!document.querySelector('link[data-markercluster-css]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css';
        link.setAttribute('data-markercluster-css', '');
        document.head.appendChild(link);
      }
      if (!document.querySelector('link[data-markercluster-default-css]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css';
        link.setAttribute('data-markercluster-default-css', '');
        document.head.appendChild(link);
      }

      const goldIcon = L.divIcon({
        className: 'thangals-marker',
        html: `
          <div style="position: relative; width: 36px; height: 44px;">
            <div style="
              position: absolute;
              top: 0;
              left: 50%;
              transform: translateX(-50%) rotate(45deg);
              width: 22px;
              height: 22px;
              background: linear-gradient(135deg, #C89F53 0%, #B8975A 100%);
              border: 2px solid #ffffff;
              box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            "></div>
            <div style="
              position: absolute;
              bottom: 0;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-top: 12px solid #B8975A;
            "></div>
          </div>
        `,
        iconSize: [36, 44],
        iconAnchor: [18, 44],
        popupAnchor: [0, -38],
      });

      const clusterIcon = (cluster: { getChildCount: () => number }) => {
        const count = cluster.getChildCount();
        const size = count < 5 ? 40 : count < 15 ? 48 : 56;
        return L.divIcon({
          html: `
            <div style="
              width: ${size}px;
              height: ${size}px;
              border-radius: 50%;
              background: linear-gradient(135deg, #1A3A2A 0%, #144B3C 100%);
              color: #C89F53;
              border: 2px solid #C89F53;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: var(--font-jost), sans-serif;
              font-size: ${size < 48 ? 12 : 14}px;
              font-weight: 500;
              letter-spacing: 0.05em;
              box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            ">${count}</div>
          `,
          className: 'thangals-cluster',
          iconSize: [size, size],
        });
      };

      const map = L.map(containerRef.current, {
        zoomControl: false,
        scrollWheelZoom: false,
        worldCopyJump: true,
      });

      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution: '',
          subdomains: 'abcd',
          maxZoom: 19,
        }
      ).addTo(map);

      const cluster = (L as unknown as {
        markerClusterGroup: (opts?: unknown) => {
          addLayer: (layer: unknown) => void;
          addTo: (map: unknown) => unknown;
        };
      }).markerClusterGroup({
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
        maxClusterRadius: 60,
        iconCreateFunction: clusterIcon,
      });

      const bounds = L.latLngBounds([]);
      const uaeBounds = L.latLngBounds([]);
      const UA_LAT_RANGE = [22, 26.5];
      const UA_LNG_RANGE = [54, 56.5];

      stores.forEach((store) => {
        if (typeof store.lat !== 'number' || typeof store.lng !== 'number') return;
        const marker = L.marker([store.lat, store.lng], { icon: goldIcon });
        const mapHref =
          store.mapUrl && store.mapUrl !== '#'
            ? store.mapUrl
            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${store.name} ${store.address} ${store.emirate}`)}`;
        marker.bindPopup(
          `
            <div style="font-family: inherit; min-width: 220px; max-width: 260px;">
              <p style="margin:0; font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:#B8975A;">${store.emirate}</p>
              <h3 style="margin:6px 0 4px; font-family: 'Cormorant Garamond', serif; font-size:18px; color:#1C1C1C; font-weight:500; line-height:1.2;">${store.name}</h3>
              <p style="margin:0; font-size:12px; color:#444; line-height:1.5;">${store.address}</p>
              <p style="margin:6px 0 0; font-size:11px; color:#777;">${store.hours}</p>
              <div style="margin-top:10px; display:flex; gap:12px; align-items:center;">
                <a href="tel:${store.phone}" style="font-size:12px; color:#1A3A2A; font-weight:500; text-decoration:none;">${store.phone}</a>
                <a href="${mapHref}" target="_blank" rel="noopener noreferrer" style="font-size:11px; letter-spacing:0.15em; text-transform:uppercase; color:#B8975A; font-weight:500; text-decoration:none;">Directions →</a>
              </div>
            </div>
          `,
          { closeButton: false }
        );
        cluster.addLayer(marker);
        bounds.extend([store.lat, store.lng]);
        if (
          store.lat >= UA_LAT_RANGE[0] &&
          store.lat <= UA_LAT_RANGE[1] &&
          store.lng >= UA_LNG_RANGE[0] &&
          store.lng <= UA_LNG_RANGE[1]
        ) {
          uaeBounds.extend([store.lat, store.lng]);
        }
      });

      cluster.addTo(map);
      clusterRef.current = cluster;

      // Default view: zoomed into the UAE (where most stores are).
      // Users can pan out to see stores in other countries.
      const initialBounds = uaeBounds.isValid() ? uaeBounds : bounds;
      if (initialBounds.isValid()) {
        map.fitBounds(initialBounds, { padding: [60, 60], maxZoom: 11 });
      } else {
        map.setView([25.2, 55.3], 8);
      }

      map.on('click', () => map.scrollWheelZoom.enable());
      map.on('mouseout', () => map.scrollWheelZoom.disable());

      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      const map = mapRef.current as { remove?: () => void } | null;
      if (map && typeof map.remove === 'function') map.remove();
      mapRef.current = null;
      clusterRef.current = null;
      userMarkerRef.current = null;
    };
  }, [stores]);

  const handleLocate = () => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setLocateError('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setLocateError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const { latitude, longitude } = pos.coords;
        const map = mapRef.current as
          | (L.Map & { setView: (c: [number, number], z: number) => L.Map; fitBounds: (b: L.LatLngBounds, o?: unknown) => L.Map })
          | null;
        if (!map) return;

        import('leaflet').then((L) => {
          const userIcon = L.default.divIcon({
            className: 'thangals-user-marker',
            html: `
              <div style="position: relative; width: 28px; height: 28px;">
                <div style="
                  position: absolute;
                  inset: 0;
                  border-radius: 50%;
                  background: rgba(26, 58, 42, 0.2);
                  animation: thangals-pulse 2s ease-out infinite;
                "></div>
                <div style="
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  width: 14px;
                  height: 14px;
                  border-radius: 50%;
                  background: #1A3A2A;
                  border: 3px solid #ffffff;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                "></div>
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });

          const existing = userMarkerRef.current as L.Layer | null;
          if (existing) map.removeLayer(existing);

          const marker = L.default.marker([latitude, longitude], { icon: userIcon }).addTo(map);
          marker.bindPopup(
            `<div style="font-family: inherit; min-width:160px;">
              <p style="margin:0; font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:#1A3A2A;">You are here</p>
              <p style="margin:6px 0 0; font-size:11px; color:#777;">Lat ${latitude.toFixed(4)}, Lng ${longitude.toFixed(4)}</p>
            </div>`,
            { closeButton: false }
          );
          userMarkerRef.current = marker;

          const validStores = stores.filter(
            (s) => typeof s.lat === 'number' && typeof s.lng === 'number'
          );

          // Haversine distance to find the nearest boutique
          const toRad = (d: number) => (d * Math.PI) / 180;
          const haversine = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
            const R = 6371;
            const dLat = toRad(b.lat - a.lat);
            const dLng = toRad(b.lng - a.lng);
            const lat1 = toRad(a.lat);
            const lat2 = toRad(b.lat);
            const x =
              Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
            return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
          };

          let nearest: Store | null = null;
          let nearestKm = Infinity;
          for (const s of validStores) {
            const d = haversine({ lat: latitude, lng: longitude }, { lat: s.lat!, lng: s.lng! });
            if (d < nearestKm) {
              nearestKm = d;
              nearest = s;
            }
          }

          const userPoint = L.default.latLng(latitude, longitude);
          if (nearest) {
            const nearestPoint = L.default.latLng(nearest.lat!, nearest.lng!);
            map.fitBounds(L.default.latLngBounds(userPoint, nearestPoint), {
              padding: [80, 80],
              maxZoom: 13,
            });
            // Open the nearest store's popup after the pan finishes
            window.setTimeout(() => {
              clusterRef.current &&
                (clusterRef.current as {
                  eachLayer: (cb: (l: L.Layer) => void) => void;
                }).eachLayer((layer: L.Layer) => {
                  const m = layer as L.Marker & {
                    getLatLng?: () => L.LatLng;
                    openPopup?: () => void;
                  };
                  if (m.getLatLng && m.openPopup) {
                    const ll = m.getLatLng();
                    if (ll.lat === nearest!.lat && ll.lng === nearest!.lng) {
                      m.openPopup();
                    }
                  }
                });
            }, 600);
          } else {
            map.setView(userPoint, 12);
          }
        });
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocateError('Location access denied. Please enable it in your browser settings.');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setLocateError('Location is currently unavailable.');
        } else {
          setLocateError('Unable to retrieve your location.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const countryCount = new Set(stores.map((s) => s.emirate.split(/[,\s]/)[0])).size;

  return (
    <div className="relative overflow-hidden rounded-sm border border-[#E5DDD0] bg-[#F5F0E8]">
      <div ref={containerRef} className="h-[420px] w-full" />
      <div className="pointer-events-none absolute left-4 top-4 z-[1000] rounded-sm bg-white/90 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[#1A3A2A] shadow-sm backdrop-blur">
        {stores.length} Boutiques · {countryCount} Countries
      </div>
      <div
        className="absolute right-0 z-[9999] flex flex-col items-end gap-0"
        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 0px)' }}
      >
        <button
          type="button"
          onClick={handleLocate}
          disabled={locating}
          className="inline-flex items-center gap-2 rounded-sm bg-white px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-[#1A3A2A] shadow-md transition-opacity hover:opacity-90 disabled:opacity-60"
          aria-label="Show my location on the map"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
          </svg>
          {locating ? 'Locating…' : 'Use my location'}
        </button>
        {locateError && (
          <div className="max-w-[220px] rounded-sm bg-white/95 px-3 py-2 text-[10px] leading-relaxed text-[#7a3a3a] shadow-md">
            {locateError}
          </div>
        )}
      </div>
    </div>
  );
};
