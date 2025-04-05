
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
  className?: string;
}

const Map: React.FC<MapProps> = ({ className }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');

  useEffect(() => {
    if (!mapContainer.current) return;
    
    // This should be replaced with your actual Mapbox token
    // For development purposes, we're using a local token input
    const token = mapboxToken || 'pk.placeholder'; // Replace with your token in production
    
    if (token === 'pk.placeholder' || !token) return;
    
    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-122.414, 37.776], // San Francisco
      zoom: 13,
      interactive: true
    });

    // Add San Francisco marker (example)
    const marker = new mapboxgl.Marker({ color: '#0077B6' })
      .setLngLat([-122.414, 37.776])
      .setPopup(new mapboxgl.Popup().setHTML("<h3>Dialysis Connect Hub</h3><p>Main Office</p>"))
      .addTo(map.current);
    
    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken]);

  return (
    <div className="w-full space-y-4">
      {!mapboxToken && (
        <div className="p-4 bg-yellow-50 rounded-md mb-4">
          <h4 className="font-medium text-yellow-800 mb-1">Mapbox Token Required</h4>
          <p className="text-sm text-yellow-700 mb-2">
            Please enter your Mapbox public token to display the map. Get one free at{' '}
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="underline"
            >
              mapbox.com
            </a>
          </p>
          <input 
            type="text" 
            placeholder="Enter Mapbox token" 
            className="w-full p-2 border rounded"
            onChange={(e) => setMapboxToken(e.target.value)}
          />
        </div>
      )}
      <div 
        ref={mapContainer} 
        className={`${className || 'h-64 rounded-lg shadow-lg'} ${!mapboxToken ? 'bg-gray-100' : ''}`}
      >
        {!mapboxToken && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Enter your Mapbox token above to see the map</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;
