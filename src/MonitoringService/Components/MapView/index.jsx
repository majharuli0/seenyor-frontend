import React, { useMemo, useState } from 'react';
import CardUI from '../common/card';
import { Button } from '../ui/button';
import { Expand, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTheme } from '../ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPersonFalling } from 'react-icons/fa6';

function FitMapBounds({ points = [] }) {
  const map = useMap();

  React.useEffect(() => {
    if (!points?.length) return;
    const bounds = L.latLngBounds(points.map((p) => p.position));
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [points, map]);

  return null;
}

import { FaExclamationTriangle, FaWifi } from 'react-icons/fa';
import { renderToStaticMarkup } from 'react-dom/server';
import { RiWifiOffLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

const PinIcon = ({ type = '2' }) => {
  const colors = {
    2: '#FF0000',
    5: '#FFCE1B',
  };

  const lineColors = {
    2: 'linear-gradient(to bottom, #FF6B6B, #CC0000)',
    5: 'linear-gradient(to bottom, #FFE066, #CC9900)',
  };

  const IconComponent = type === '2' ? FaPersonFalling : RiWifiOffLine;
  const color = colors[type] || '#FF0000';
  const lineColor = lineColors[type] || 'linear-gradient(to bottom, #FF6B6B, #CC0000)';

  return (
    <div
      style={{
        position: 'relative',
        width: '50px',
        height: '50px',
        transform: 'translate(-50%, -100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          zIndex: 2,
          color: 'white',
          fontSize: '16px',
        }}
      >
        <IconComponent />
      </div>

      <div
        style={{
          position: 'absolute',
          top: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '3px',
          height: '15px',
          background: lineColor,
          borderRadius: '2px',
          zIndex: 1,
        }}
      ></div>
    </div>
  );
};

// Usage in your map component
const createPinIcon = (type = '0') => {
  const html = renderToStaticMarkup(<PinIcon type={type} />);

  return new L.DivIcon({
    html: html,
    className: 'custom-pin',
    iconSize: [50, 50],
    iconAnchor: [25, 50],
  });
};

export default function MapView({ data = {}, loading = true }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(false);
  const onPinClick = (id) => {
    setExpanded(false);
    navigate(`/ms/dashboard/alert/${id}`);
  };

  const formattedPoints = (data?.location || [])
    .filter(
      (item) =>
        typeof item?.latitude === 'number' &&
        typeof item?.longitude === 'number' &&
        !isNaN(item.latitude) &&
        !isNaN(item.longitude)
    )
    .map((item) => ({
      position: [item.latitude, item.longitude],
      event: item?.event,
      id: item?.alert_id,
    }));
  const center = formattedPoints.length > 0 ? formattedPoints[0].position : [23.8103, 90.4125];

  const tileUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';

  const overlayVariants = {
    hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
    visible: {
      opacity: 1,
      backdropFilter: 'blur(10px)',
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      backdropFilter: 'blur(0px)',
      transition: { duration: 0.4, ease: 'easeInOut' },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 60 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 120, damping: 18, delay: 0.05 },
    },
    exit: { opacity: 0, scale: 0.96, y: 40, transition: { duration: 0.3 } },
  };

  return (
    <>
      {/* Inline map */}
      <motion.div layout transition={{ duration: 0.4 }}>
        <CardUI
          className='!h-fit'
          title='Map View'
          variant='shine'
          headerPadding='py-1 px-3'
          actions={
            <Button variant='outline' size='icon' onClick={() => setExpanded(true)}>
              <Expand />
            </Button>
          }
        >
          <motion.div layout className='relative w-full h-[300px] overflow-hidden'>
            <MapContainer
              center={center}
              zoom={5}
              zoomControl={false}
              className='w-full h-full'
              attributionControl={false}
            >
              <TileLayer url={tileUrl} />
              {formattedPoints.map((point, idx) => (
                <Marker
                  key={idx}
                  eventHandlers={{
                    click: () => onPinClick(point?.id),
                  }}
                  position={point.position}
                  icon={createPinIcon(point?.event)}
                />
              ))}
              {formattedPoints.length > 0 && <FitMapBounds points={formattedPoints} />}
            </MapContainer>
          </motion.div>
        </CardUI>
      </motion.div>

      {/* Fullscreen animated overlay */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            variants={overlayVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            className='fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center'
            onClick={() => setExpanded(false)}
          >
            <motion.div
              variants={cardVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
              onClick={(e) => e.stopPropagation()}
              className='relative w-[95vw] h-[95vh] rounded-3xl shadow-2xl backdrop-blur-md'
            >
              <CardUI
                className='!h-fit'
                title='Map View'
                variant='shine'
                headerPadding='py-1 px-3'
                actions={
                  <Button variant='outline' size='icon' onClick={() => setExpanded(false)}>
                    <X />
                  </Button>
                }
              >
                <motion.div layout className='relative w-full h-[90vh] overflow-hidden'>
                  <MapContainer
                    center={center}
                    zoom={12}
                    zoomControl={false}
                    className='w-full h-full'
                    attributionControl={false}
                  >
                    <TileLayer url={tileUrl} />
                    {formattedPoints.map((point, idx) => (
                      <Marker
                        key={idx}
                        eventHandlers={{
                          click: () => onPinClick(point?.id),
                        }}
                        position={point.position}
                        icon={createPinIcon(point?.event)}
                      />
                    ))}
                    {formattedPoints.length > 0 && <FitMapBounds points={formattedPoints} />}
                  </MapContainer>
                </motion.div>
              </CardUI>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
