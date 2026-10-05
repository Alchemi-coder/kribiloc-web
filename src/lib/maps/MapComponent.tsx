"use client";

import * as React from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Location {
  id: string;
  latitude: number;
  longitude: number;
  price: number;
  title: string;
}

interface MapProps {
  locations: Location[];
  onMarkerClick?: (id: string) => void;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export function MapComponent({ locations, onMarkerClick }: MapProps) {
  return (
    <div className="w-full h-full relative border-l border-border bg-muted">
      <Map
        initialViewState={{
          longitude: 9.9161,
          latitude: 2.9439,
          zoom: 12
        }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" />
        
        {locations.map((loc) => (
          <Marker 
            key={loc.id} 
            longitude={loc.longitude} 
            latitude={loc.latitude}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              if (onMarkerClick) onMarkerClick(loc.id);
            }}
          >
            <div className="bg-[#111315] text-white px-2 py-1 font-bold text-xs cursor-pointer hover:bg-[#e4002b] transition-colors border border-border shadow-md">
              {loc.price.toLocaleString('fr-FR')} F
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
}
