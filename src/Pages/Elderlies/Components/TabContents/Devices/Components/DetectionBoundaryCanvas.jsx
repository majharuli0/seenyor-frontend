import React, { useEffect, useState } from 'react';
import { Stage, Layer, Line, Image } from 'react-konva';
import deviceImg from '../images/1.png';

const DetectionBoundaryCanvas = ({ device_boundaries = {}, mountType = 1 }) => {
  // Canvas configuration
  const width = 300;
  const height = 200;
  const centerX = width / 2;
  const centerY = mountType === 1 ? height / 2 : 0;
  const scale = 5;
  const canvasCenter = {
    x: 30 * scale,
    y: mountType === 1 ? 20 * scale : 0,
  };
  const [deviceIcon, setDeviceIcon] = useState(null);

  const [boundary, setBoundary] = useState({
    up_left: [0, 0],
    low_left: [0, 0],
    up_right: [0, 0],
    low_right: [0, 0],
  });

  const convertCoords = (coords = [0, 0]) => {
    if (!Array.isArray(coords) || coords.length < 2) {
      throw new Error('Invalid input: coords must be an array with at least two elements.');
    }

    const [x = 0, y = 0] = coords;

    return [canvasCenter.x - x * scale, canvasCenter.y + y * scale];
  };

  const boundaryPoints = [
    ...convertCoords(boundary.up_left),
    ...convertCoords(boundary.low_left),
    ...convertCoords(boundary.low_right),
    ...convertCoords(boundary.up_right),
  ];
  const generateGridLines = (points) => {
    const lines = [];
    const [minX, maxX, minY, maxY] = [
      Math.min(...points.filter((_, i) => i % 2 === 0)), // X-coordinates
      Math.max(...points.filter((_, i) => i % 2 === 0)),
      Math.min(...points.filter((_, i) => i % 2 !== 0)), // Y-coordinates
      Math.max(...points.filter((_, i) => i % 2 !== 0)),
    ];

    // Horizontal grid lines
    for (let y = minY + 10; y < maxY; y += 50) {
      lines.push([minX, y, maxX, y]);
    }

    // Vertical grid lines
    for (let x = minX + 10; x < maxX; x += 50) {
      lines.push([x, minY, x, maxY]);
    }

    return lines;
  };
  useEffect(() => {
    if (device_boundaries && typeof device_boundaries === 'object') {
      const area = Object.fromEntries(
        Object.entries(device_boundaries).reduce((acc, [key, value]) => {
          if (key === '_id') return acc;

          // Ensure value is a string before using split
          if (typeof value === 'string') {
            acc.push([key, value.split(',').map(Number)]);
          } else {
            console.warn(`Skipping key "${key}" because value is not a string:`, value);
          }

          return acc;
        }, [])
      );

      setBoundary(area);
    } else {
      console.error('device_boundaries is undefined or not an object', device_boundaries);
      setBoundary({});
    }
    const img = new window.Image();
    img.src = deviceImg;

    img.onload = () => {
      setDeviceIcon(img);
    };
  }, [device_boundaries]);

  return (
    <Stage
      width={width}
      height={height}
      style={{ background: '#F9F9F9', width: 'fit-content', scale: '1.2' }}
    >
      <Layer>
        {/* Grid lines */}
        {Array.from({ length: Math.floor(height / 25) + 1 }).map((_, i) => (
          <Line
            key={`h-grid-${i}`}
            points={[0, i * 25, width, i * 25]}
            stroke='rgba(0,0,0,0.1)'
            strokeWidth={1}
          />
        ))}
        {Array.from({ length: Math.floor(width / 25) + 1 }).map((_, i) => (
          <Line
            key={`v-grid-${i}`}
            points={[i * 25, 0, i * 25, height]}
            stroke='rgba(0,0,0,0.1)'
            strokeWidth={1}
          />
        ))}
        <Line
          points={boundaryPoints}
          closed
          stroke='#FAB515'
          strokeWidth={2}
          dash={[5, 3]}
          fill='rgba(250, 181, 21, 0.2)'
        />

        {/* Visual guides */}
        {/* {mountType === 2 && (
          <>
            <Line // Top boundary line
              points={[0, 0, CANVAS_WIDTH, 0]}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth={1}
            />
            <Line // Center vertical line
              points={[CANVAS_WIDTH / 2, 0, CANVAS_WIDTH / 2, CANVAS_HEIGHT]}
              stroke="rgba(0,0,0,0.1)"
              strokeWidth={1}
              dash={[5, 3]}
            />
          </>
        )} */}
      </Layer>
      <Layer>
        {deviceIcon && (
          <Image
            image={deviceIcon}
            x={canvasCenter.x - 30 / 2} // Center the icon horizontally
            y={canvasCenter.y - 30 / 2} // Center the icon vertically
            width={30}
            height={30}
          />
        )}
      </Layer>
    </Stage>
  );
};

export default DetectionBoundaryCanvas;
