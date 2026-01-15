import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const customerLocations = [
  { lat: 51.505, lng: -0.09, name: 'Customer 1' },
  { lat: 51.515, lng: -0.1, name: 'Customer 2' },
  { lat: 51.525, lng: -0.08, name: 'Customer 3' },
];

const MapLocat = () => {
  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={11}
      zoomControl={false}
      style={{ height: '100%', width: '445px' }}
      className='!w-full rounded-[8px] overflow-hidden'
    >
      {/* A clean, minimal tile layer (you can replace with any other clean style) */}
      <TileLayer
        url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />

      {/* Loop through customer locations and render circular points */}
      {customerLocations.map((customer, index) => (
        <CircleMarker
          key={index}
          center={[customer.lat, customer.lng]}
          radius={8} // Size of the circle
          color='#007BFF' // Circle border color (blue in this case)
          fillColor='#007BFF' // Fill color for the circle
          fillOpacity={0.3}
          weight={0.5}
        >
          <Tooltip
            direction='top'
            offset={[0, -10]}
            className='relative z-10 !bg-transparent !border-none' // Ensure it's positioned properly
          >
            {/* Custom styled tooltip using Tailwind */}
            <div className='bg-white text-sm text-gray-800 shadow-lg rounded-md p-2 border border-gray-200'>
              <p className='font-semibold'>{customer.name}</p>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default MapLocat;
