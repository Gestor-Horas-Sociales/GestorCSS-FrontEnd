import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function Map() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstanceRef.current) return; // ya inicializado, evita doble init en StrictMode

    // Inicializar el mapa centrado en El Salvador
    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([13.7942, -88.8965], 8);

    // Controles en posiciones específicas (como en tu mapa anterior)
    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.control.attribution({ position: "bottomleft", prefix: false }).addTo(map);

    // Tile layer de OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div ref={mapRef} className="h-full w-full" />

      <style>{`
        .leaflet-container {
          background: #f8fafc;
        }
      `}</style>
    </div>
  );
}