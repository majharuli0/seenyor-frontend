import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Input, Spin, ConfigProvider } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import Modal from 'antd/es/modal';
import { InfoCircleOutlined } from '@ant-design/icons';
import { LuNavigation } from 'react-icons/lu';
const hospitalIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Fetch hospitals using Overpass API
const fetchHospitals = async (map, abortController) => {
  const bounds = map.getBounds();
  const south = bounds.getSouth();
  const west = bounds.getWest();
  const north = bounds.getNorth();
  const east = bounds.getEast();

  const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="hospital"](${south},${west},${north},${east});out%20center;`;

  try {
    const response = await fetch(overpassUrl, {
      signal: abortController.signal, // Attach the abort signal
    });
    const data = await response.json();
    if (data && data.elements) {
      return data.elements.map((element) => ({
        id: element.id,
        name: element.tags.name || 'Unknown Hospital',
        lat: element.lat || element.center.lat,
        lon: element.lon || element.center.lon,
        extra: element,
      }));
    }
    return [];
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Error fetching hospitals:', error);
    }
    return [];
  }
};

const MapEventHandler = ({ setHospitals, setLoading, isMapModalVisible }) => {
  const map = useMap();
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const loadHospitals = async () => {
      setLoading(true);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const hospitalData = await fetchHospitals(map, abortControllerRef.current);
      setHospitals(hospitalData);
      setLoading(false);
    };

    loadHospitals();
    map.on('moveend', loadHospitals);

    return () => {
      map.off('moveend', loadHospitals);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [map, setHospitals, setLoading]);
  useEffect(() => {
    // Invalidate size when modal is visible
    if (isMapModalVisible) {
      map.invalidateSize();
    }
  }, [isMapModalVisible, map]);
  return null;
};

const CustomPlaceSelect = ({
  value,
  onChange,
  label,
  error,
  placeholder,
  elderlyLocation,
  disabled,
}) => {
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const mapRef = useRef(null);
  useEffect(() => {
    // Reset state when elderlyLocation changes
    setSelectedPlace(null);
    setHospitals([]);
    if (mapRef.current) {
      mapRef.current.setView([elderlyLocation.lat, elderlyLocation.lng], 16);
    }
    console.log('elderlyLocation', elderlyLocation);
  }, [elderlyLocation?.lat]);
  const handleHospitalSelect = (hospital) => {
    const newPlace = {
      name: hospital.name,
      address: hospital.name,
      lat: hospital.lat,
      lng: hospital.lon,
    };
    setSelectedPlace(newPlace);
    onChange(newPlace);
    console.log('newPlace', hospital);
  };

  const openMapModal = () => {
    setIsMapModalVisible(true);
  };

  const closeMapModal = () => {
    setIsMapModalVisible(false);
  };

  return (
    <div className='flex flex-col items-start w-full mt-3'>
      <label className='mb-1 font-medium text-[13px] text-[#1B2559]'>{label}</label>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#8086AC',
            colorLink: '#8086AC',
            colorLinkHover: '#A0A4C1',
            colorLinkActive: '#6A6E8E',
          },
        }}
      >
        <Input
          ref={inputRef}
          placeholder={placeholder}
          size='large'
          className='w-full h-[50px]'
          disabled={!elderlyLocation}
          value={value?.name || ''}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          suffix={<EnvironmentOutlined onClick={openMapModal} style={{ cursor: 'pointer' }} />}
        />
      </ConfigProvider>
      {error && <span style={{ color: 'red' }}>{error.message}</span>}
      <Modal
        visible={isMapModalVisible}
        onOk={closeMapModal}
        onCancel={closeMapModal}
        width='80vw'
        height='80vh'
        footer={null}
        className='!p-0 relative'
      >
        {isLoading && (
          <div
            id='Loader'
            className='absolute  z-[1000] flex items-center justify-center gap-2 p-3'
          >
            <Spin size='small' tip='Getting Hospitals...' />
            <p className='text-sm text-gray-500'>Getting Hospitals...</p>
          </div>
        )}
        {!isLoading && hospitals.length === 0 && (
          <div
            id='Loader'
            className='absolute  z-[1000] flex items-center justify-center gap-2 p-3'
          >
            <InfoCircleOutlined className='text-red-500' />
            No Hospitals Found
          </div>
        )}
        <MapContainer
          center={[elderlyLocation?.lat, elderlyLocation?.lng]}
          zoom={16}
          maxZoom={18}
          minZoom={10}
          zoomControl={false}
          style={{ height: '600px', width: '100%', zIndex: 100 }}
          ref={mapRef}
        >
          <TileLayer
            url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapEventHandler
            setHospitals={setHospitals}
            setLoading={setIsLoading}
            isMapModalVisible={isMapModalVisible}
          />
          {elderlyLocation && (
            <Marker
              key={elderlyLocation.id}
              position={[elderlyLocation.lat, elderlyLocation.lng]}
              icon={new L.Icon.Default()}
              // onClick={() => handleHospitalSelect(elderlyLocation)}
            >
              <Popup>Elderly</Popup>
            </Marker>
          )}
          {hospitals.map((hospital) => (
            <Marker
              key={hospital.id}
              position={[hospital.lat, hospital.lon]}
              icon={hospitalIcon}
              eventHandlers={{
                click: () => {
                  handleHospitalSelect(hospital);
                  console.log('Hospital clicked:', hospital);
                },
              }}
            >
              <Popup>
                <div className='flex flex-col items-start gap-3 font-baloo'>
                  <div className='flex flex-col items-start gap-0'>
                    <h4 className='font-bold text-lg !m-0'>{hospital.name}</h4>
                    <p className='text-[14px] !m-0'>Phone: {hospital.extra.tags.phone}</p>
                  </div>

                  <div className='flex items-center gap-2'>
                    <a
                      href={`https://www.google.com/maps?q=${hospital.lat},${hospital.lon}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-sm font-medium !text-blue-500'
                    >
                      View on Google Maps
                    </a>
                    <LuNavigation size={18} className='text-blue-500' />
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Modal>
    </div>
  );
};

export default CustomPlaceSelect;
