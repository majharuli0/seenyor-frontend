import { decodePosition } from '@/utils/helper';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Stage, Layer, Line, Image } from 'react-konva';
import { CustomContext } from '@/Context/UseCustomContext';
import ObjectRenderer from './ObjectTemplate';
import full from '@/assets/icon/room/full.png';
import walking from '@/assets/icon/room/events/walking.svg';
import suspected_fall from '@/assets/icon/room/events/suspected_fall.svg';
import squatting from '@/assets/icon/room/events/squatting.svg';
import standing from '@/assets/icon/room/events/standing.svg';
import fall_confirm from '@/assets/icon/room/events/fall_confirm.svg';
import laying_down from '@/assets/icon/room/events/laying_down.svg';
import CurrentPosition from './CurrentPosition';

const TopMountCanvas = ({
  roomInfo = [],
  position = [],
  playbackData = null,
  isPlaying = true,
  currentFrame,
}) => {
  const context = useContext(CustomContext);
  const { elderlyDetails } = context || {};
  const deviceCode = roomInfo?.device_no || elderlyDetails?.deviceId;
  const [deviceIcon, setDeviceIcon] = useState(null);
  const parentRef = useRef();
  const [stageScale, setScale] = useState(1);
  const roomWidthPx = 600;
  const roomHeightPx = 400;
  const [stageWidth, setStageWidth] = useState(600);
  const [stageHeight, setStageHeight] = useState(400);
  const [stageOffsetX, setStageOffsetX] = useState(0);
  const [stageOffsetY, setStageOffsetY] = useState(0);

  const [boundary, setBoundary] = useState({
    up_left: [0, 0],
    low_left: [0, 0],
    up_right: [0, 0],
    low_right: [0, 0],
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
  const canvasCenter = { x: 30 * scale, y: 20 * scale };

  const convertCoords = (coords = [0, 0]) => {
    const [x = 0, y = 0] = coords;
    return [canvasCenter.x - x * scale, canvasCenter.y + y * scale];
  };

  useEffect(() => {
    if (roomInfo?.device_boundaries && typeof roomInfo.device_boundaries === 'object') {
      const area = Object.fromEntries(
        Object.entries(roomInfo.device_boundaries).reduce((acc, [key, value]) => {
          if (key === '_id') return acc;
          acc.push([key, value.split(',').map(Number)]);
          return acc;
        }, [])
      );
      setBoundary(area);
    } else {
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
    img.onload = () => setDeviceIcon(img);
  }, [roomInfo]);

  const [images, setImages] = useState({});

  useEffect(() => {
    const loadImages = () => {
      const newImages = {};
      position?.forEach((pos) => {
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
      Math.min(...points.filter((_, i) => i % 2 === 0)),
      Math.max(...points.filter((_, i) => i % 2 === 0)),
      Math.min(...points.filter((_, i) => i % 2 !== 0)),
      Math.max(...points.filter((_, i) => i % 2 !== 0)),
    ];

    for (let y = minY + 10; y < maxY; y += 10) lines.push([minX, y, maxX, y]);
    for (let x = minX + 10; x < maxX; x += 10) lines.push([x, minY, x, maxY]);
    return lines;
  };

  useEffect(() => {
    const updateScale = () => {
      if (parentRef.current) {
        const parentWidth = parentRef.current.clientWidth;
        const parentHeight = parentRef.current.clientHeight;

        // Calculate based on 6:4 aspect ratio
        const aspectRatio = 6 / 4; // 1.5
        const widthBasedHeight = parentWidth / aspectRatio;
        const heightBasedWidth = parentHeight * aspectRatio;

        let newWidth, newHeight;

        if (widthBasedHeight <= parentHeight) {
          // Width is the limiting factor
          newWidth = parentWidth;
          newHeight = widthBasedHeight;
        } else {
          // Height is the limiting factor
          newWidth = heightBasedWidth;
          newHeight = parentHeight;
        }

        const newScale = newWidth / roomWidthPx;
        setScale(newScale);
        setStageWidth(newWidth);
        setStageHeight(newHeight);
        setStageOffsetX((parentWidth - newWidth) / 2);
        setStageOffsetY((parentHeight - newHeight) / 2);
      }
    };

    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    if (parentRef.current) resizeObserver.observe(parentRef.current);
    return () => resizeObserver.disconnect();
  }, [roomWidthPx, roomHeightPx]);
  const { boundaryPoints, layerOffset } = React.useMemo(() => {
    const points = [
      ...convertCoords(boundary.up_left),
      ...convertCoords(boundary.low_left),
      ...convertCoords(boundary.low_right),
      ...convertCoords(boundary.up_right),
    ];

    // Calculate content bounds
    const xPoints = points.filter((_, i) => i % 2 === 0);
    const yPoints = points.filter((_, i) => i % 2 !== 0);

    const minX = Math.min(...xPoints);
    const maxX = Math.max(...xPoints);
    const minY = Math.min(...yPoints);
    const maxY = Math.max(...yPoints);

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;

    // Center in 600x400 space
    const offsetX = (600 - contentWidth) / 2 - minX;
    const offsetY = (400 - contentHeight) / 2 - minY;

    return {
      boundaryPoints: points,
      layerOffset: { x: offsetX, y: offsetY },
    };
  }, [boundary, convertCoords]);
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
        aspectRatio: '6/4',
        maxWidth: '100%',
        maxHeight: '100vh',
      }}
    >
      <Stage
        width={stageWidth || 600}
        height={stageHeight || 400}
        scaleX={stageScale}
        scaleY={stageScale}
      >
        <Layer x={layerOffset.x} y={layerOffset.y}>
          <Line
            points={boundaryPoints}
            closed
            stroke='rgba(255, 175, 104, 1)'
            strokeWidth={2}
            fill='rgba(250, 181, 21, 0.1)'
          />
          {objects?.map((obj, index) => (
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
              x={canvasCenter.x - 25}
              y={canvasCenter.y - 25}
              width={50}
              height={50}
            />
          )}
          <CurrentPosition
            deviceCode={deviceCode}
            canvasCenter={canvasCenter}
            playbackData={playbackData}
            isPlaying={isPlaying}
            currentFrame={currentFrame}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default TopMountCanvas;
