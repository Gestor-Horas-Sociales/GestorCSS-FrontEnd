import { useEffect, useRef } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import type { MapProject } from "@/Types/MapType";

interface MapProps {
  projects?: MapProject[];
  onProjectClick?: (project: MapProject) => void;
  /** Si es true, el mapa hace zoom automático para encuadrar los proyectos visibles */
  fitToProjects?: boolean;
}

// Pin SVG para el marcador individual (evita el problema de los íconos de Leaflet con Vite)
const projectIcon = L.divIcon({
  className: "",
  html: `
    <svg width="34" height="44" viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 0C7.6 0 0 7.6 0 17c0 12.75 17 27 17 27s17-14.25 17-27C34 7.6 26.4 0 17 0z" fill="#2563eb"/>
      <circle cx="17" cy="17" r="7" fill="white"/>
    </svg>`,
  iconSize: [34, 44],
  iconAnchor: [17, 44],
  tooltipAnchor: [0, -40],
});

export default function Map({
  projects = [],
  onProjectClick,
  fitToProjects = false,
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const onProjectClickRef = useRef(onProjectClick);
  onProjectClickRef.current = onProjectClick;

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([13.7942, -88.8965], 9);

    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.control.attribution({ position: "bottomleft", prefix: false }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {}).addTo(
      map
    );

    // Grupo de clusters: lejos se agrupan y muestran la cantidad de proyectos,
    // al acercarse se separan hasta mostrar el marcador individual
    const cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      maxClusterRadius: 60,
      iconCreateFunction: (c: L.MarkerCluster) => {
        const count = c.getChildCount();
        return L.divIcon({
          className: "",
          html: `
            <div class="project-cluster">
              <span class="project-cluster-count">${count}</span>
              <span class="project-cluster-label">proyecto${count > 1 ? "s" : ""}</span>
            </div>`,
          iconSize: L.point(64, 64),
        });
      },
    });
    map.addLayer(cluster);

    mapInstanceRef.current = map;
    clusterRef.current = cluster;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      clusterRef.current = null;
    };
  }, []);

  // Pintar/actualizar marcadores cuando cambian los proyectos
  useEffect(() => {
    const cluster = clusterRef.current;
    if (!cluster) return;

    cluster.clearLayers();
    projects.forEach((project) => {
      if (project.latitude == null || project.longitude == null) return;

      const marker = L.marker([project.latitude, project.longitude], {
        icon: projectIcon,
      });
      marker.bindTooltip(project.name, { direction: "top" });
      marker.on("click", () => onProjectClickRef.current?.(project));
      cluster.addLayer(marker);
    });

    // Encuadrar los proyectos visibles (al filtrar)
    if (fitToProjects && mapInstanceRef.current) {
      const bounds = cluster.getBounds();
      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, {
          padding: [60, 60],
          maxZoom: 13,
        });
      }
    }
  }, [projects, fitToProjects]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div ref={mapRef} className="h-full w-full" />

      <style>{`
        .leaflet-container {
          background: #f8fafc;
        }
        .project-cluster {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          border-radius: 9999px;
          background: rgba(37, 99, 235, 0.9);
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          color: white;
        }
        .project-cluster-count {
          font-size: 18px;
          font-weight: 700;
          line-height: 1;
        }
        .project-cluster-label {
          font-size: 9px;
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}
