import { decodePosition } from '@/utils/helper';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Stage, Layer, Line, Circle, Group, Text, Image } from 'react-konva';
import { CustomContext } from '@/Context/UseCustomContext';
import ObjectRenderer from './ObjectTemplate';
import full from '../../assets/icon/room/full.png';
import walking from '../../assets/icon/room/events/walking.svg';
import suspected_fall from '../../assets/icon/room/events/suspected_fall.svg';
import squatting from '../../assets/icon/room/events/squatting.svg';
import standing from '../../assets/icon/room/events/standing.svg';
import fall_confirm from '../../assets/icon/room/events/fall_confirm.svg';
import laying_down from '../../assets/icon/room/events/laying_down.svg';
import CurrentPosition from './CurrentPosition';
const svgsforevent = import.meta.glob('../assets/icon/room/events/*.svg', {
  eager: true,
});
let iconsforevent = {};
for (const key in svgsforevent) {
  if (Object.prototype.hasOwnProperty.call(svgsforevent, key)) {
    const iconName = key.split('/').pop().replace('.svg', '');
    // Ensure iconName is not a prototype property
    if (iconName !== '__proto__' && iconName !== 'constructor' && iconName !== 'prototype') {
      iconsforevent[iconName] = svgsforevent[key].default;
    }
  }
}
const DetectionBoundaryCanvas = ({ roomInfo = [], position = [], playbackData = null }) => {
  console.log('redd');

  const context = useContext(CustomContext);
  // Safely destructure elderlyDetails
  const { elderlyDetails } = context || {};
  const deviceCode = roomInfo?.device_no || elderlyDetails?.deviceId;
  // const [position, setPosition] = useState([]);
  const [deviceIcon, setDeviceIcon] = useState(null);
  const parentRef = useRef();
  const [stageScale, setScale] = useState(1);
  const roomWidthPx = 600;
  const roomHeightPx = 500;
  const [stageWidth, setStageWidth] = useState(600);
  const [stageHeight, setStageHeight] = useState(500);
  const [stageOffsetX, setStageOffsetX] = useState(0);
  const [stageOffsetY, setStageOffsetY] = useState(0);
  // Default dimensions for the top-mounted device
  const [boundary, setBoundary] = useState({
    up_left: [0, 0], // Top-left corner
    low_left: [0, 0], // Bottom-left corner
    up_right: [0, 0], // Top-right corner
    low_right: [0, 0], // Bottom-right corner
  });
  const [objects, setObjects] = useState([]);
  const postureIconMap = {
    0: null,
    1: walking,
    2: suspected_fall,
    3: squatting,
    4: standing,
    5: fall_confirm,
    6: laying_down,
  };
  const scale = 10;
  const canvasCenter = { x: 30 * scale, y: 25 * scale };

  // Convert boundary coordinates to pixel values
  const convertCoords = (coords = [0, 0]) => {
    if (!Array.isArray(coords) || coords.length < 2) {
      throw new Error('Invalid input: coords must be an array with at least two elements.');
    }

    const [x = 0, y = 0] = coords;

    return [canvasCenter.x - x * scale, canvasCenter.y + y * scale];
  };

  // Define boundary points for the polygon (top-mounted device)
  const boundaryPoints = [
    ...convertCoords(boundary.up_left),
    ...convertCoords(boundary.low_left),
    ...convertCoords(boundary.low_right),
    ...convertCoords(boundary.up_right),
  ];

  useEffect(() => {
    if (roomInfo?.device_boundaries && typeof roomInfo.device_boundaries === 'object') {
      const area = Object.fromEntries(
        Object.entries(roomInfo.device_boundaries).reduce((acc, [key, value]) => {
          if (key === '_id') return acc; // Skip the _id field
          acc.push([key, value.split(',').map(Number)]);
          return acc;
        }, [])
      );
      setBoundary(area);
    } else {
      console.error('device_boundaries is undefined or not an object');
      setBoundary({});
    }

    const transformedData = roomInfo?.device_areas?.map(({ _id, coordKey, ...rest }) => ({
      ...rest,
      up_left: rest.up_left.split(',').map(Number),
      low_left: rest.low_left.split(',').map(Number),
      up_right: rest.up_right.split(',').map(Number),
      low_right: rest.low_right.split(',').map(Number),
    }));

    setObjects(transformedData);
    const img = new window.Image();
    img.src = full;

    img.onload = () => {
      setDeviceIcon(img);
    };
  }, [roomInfo]);

  const [images, setImages] = useState({});

  useEffect(() => {
    const loadImages = () => {
      const newImages = {};
      position?.forEach((pos) => {
        // Get the postureIcon from the map using targetId or other relevant property
        const postureIcon = postureIconMap[pos.postureIndex];

        if (postureIcon) {
          const img = new window.Image();
          img.src = postureIcon;
          img.onload = () => {
            newImages[postureIcon] = img;
            setImages((prev) => ({ ...prev, ...newImages }));
          };
        }
      });
    };
    loadImages();
  }, [position, postureIconMap]);
  const generateGridLines = (points) => {
    const lines = [];
    const [minX, maxX, minY, maxY] = [
      Math.min(...points.filter((_, i) => i % 2 === 0)), // X-coordinates
      Math.max(...points.filter((_, i) => i % 2 === 0)),
      Math.min(...points.filter((_, i) => i % 2 !== 0)), // Y-coordinates
      Math.max(...points.filter((_, i) => i % 2 !== 0)),
    ];

    // Horizontal grid lines
    for (let y = minY + 10; y < maxY; y += 10) {
      lines.push([minX, y, maxX, y]);
    }

    // Vertical grid lines
    for (let x = minX + 10; x < maxX; x += 10) {
      lines.push([x, minY, x, maxY]);
    }

    return lines;
  };
  useEffect(() => {
    // Ensure parentRef is valid and resize the stage on mount
    const updateScale = () => {
      if (parentRef.current) {
        const widthScale = parentRef.current.clientWidth / roomWidthPx;
        const heightScale = parentRef.current.clientHeight / roomHeightPx;
        const newScale = Math.min(widthScale, heightScale); // Scale down to fit
        setScale(newScale);

        // Update stage size based on scale
        const newStageWidth = parentRef.current.clientWidth;
        const newStageHeight = parentRef.current.clientHeight;
        setStageWidth(newStageWidth);
        setStageHeight(newStageHeight);

        // Calculate offset for centering the room inside the parent div
        const offsetX = (newStageWidth - roomWidthPx * newScale) / 2;
        const offsetY = (newStageHeight - roomHeightPx * newScale) / 2;
        setStageOffsetX(offsetX);
        setStageOffsetY(offsetY);
      }
    };

    // Set initial scale on mount
    updateScale();

    // Use ResizeObserver to handle changes in container size
    const resizeObserver = new ResizeObserver(updateScale);
    if (parentRef.current) {
      resizeObserver.observe(parentRef.current);
    }

    // Clean up observer when the component is unmounted
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [roomWidthPx, roomHeightPx]);

  return (
    <div
      ref={parentRef}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto',
        maxHeight: '500px',
        maxWidth: '600px',
      }}
    >
      <Stage
        width={stageWidth || 600}
        height={stageHeight || 500}
        scaleX={stageScale}
        scaleY={stageScale}
      >
        <Layer x={(stageWidth - 600 * stageScale) / 2} y={(stageHeight - 500 * stageScale) / 2}>
          <Line
            points={boundaryPoints}
            closed
            stroke='rgba(250, 181, 21, 1' // Border color
            strokeWidth={2} // Border thickness
            dash={[10, 5]} // Dashed border (10px dash, 5px gap)
            fill='rgba(250, 181, 21, 0.2)' // Light blue background with transparency
            opacity={0.4}
          />

          {/* Grid lines inside the polygon */}
          {generateGridLines(boundaryPoints).map((gridLine, index) => (
            <Line
              key={index}
              points={gridLine}
              stroke='rgba(250, 181, 21, 1'
              strokeWidth={0.5}
              dash={[2, 3]} // Dashed grid lines
            />
          ))}

          {objects &&
            objects.map((obj, index) => (
              <ObjectRenderer
                roomType={roomInfo?.room_type}
                key={index}
                object={obj}
                convertCoords={convertCoords}
              />
            ))}
          {deviceIcon && (
            <Image
              image={deviceIcon}
              x={canvasCenter.x - 50 / 2} // Center the icon horizontally
              y={canvasCenter.y - 50 / 2} // Center the icon vertically
              width={50}
              height={50}
            />
          )}

          <CurrentPosition
            deviceCode={deviceCode}
            canvasCenter={canvasCenter}
            playbackData={playbackData}
          />
        </Layer>
        {/* Render Objects (e.g., bed, sofa) */}
      </Stage>
    </div>
  );
};

export default DetectionBoundaryCanvas;
