import React, { useState } from 'react';
import styled from 'styled-components';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { GeoLocation } from '../types/weather';

// Fix for default marker icons with Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface WeatherMapProps {
  center?: [number, number];
  onLocationSelected: (location: GeoLocation) => void;
}

const MapWrapper = styled.div`
  height: 400px;
  width: 100%;
  margin-bottom: 1.5rem;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
`;

const HelpText = styled.div`
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #666;
`;

// Component to handle map click events
const LocationMarker: React.FC<{
  onLocationSelected: (location: GeoLocation) => void;
}> = ({ onLocationSelected }) => {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelected({
        lat: e.latlng.lat,
        lon: e.latlng.lng
      });
    }
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Selected Location</Popup>
    </Marker>
  );
};

const WeatherMap: React.FC<WeatherMapProps> = ({ 
  center = [20, 0], 
  onLocationSelected 
}) => {
  return (
    <>
      <HelpText>Click on the map to select a location</HelpText>
      <MapWrapper>
        <MapContainer 
          center={center} 
          zoom={3} 
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution={process.env.REACT_APP_MAP_ATTRIBUTION}
            url={process.env.REACT_APP_MAP_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
          />
          <LocationMarker onLocationSelected={onLocationSelected} />
        </MapContainer>
      </MapWrapper>
    </>
  );
};

export default WeatherMap; 