import React, { useState, useRef, useEffect, useMemo, useContext } from 'react';
import { Circle, Image, Group } from 'react-konva';
import Konva from 'konva'; // Import Konva for Easings
import walking from '../../assets/icon/room/events/walking.svg';
import suspected_fall from '../../assets/icon/room/events/suspected_fall.svg';
import squatting from '../../assets/icon/room/events/squatting.svg';
import standing from '../../assets/icon/room/events/standing.svg';
import fall_confirm from '../../assets/icon/room/events/fall_confirm.svg';
import laying_down from '../../assets/icon/room/events/laying_down.svg';
import { WebSocketContext } from '@/Context/WebSoketHook';
import { FaBed } from 'react-icons/fa';
import { TbCircuitGround } from 'react-icons/tb';

// AnimatedMarker component to handle smooth transitions
const AnimatedMarker = ({ x, y, color, imageObj }) => {
  const groupRef = useRef(null);
  const firstRender = useRef(true);

  React.useLayoutEffect(() => {
    if (groupRef.current) {
      if (firstRender.current) {
        // Initial position: snap immediately, no animation
        groupRef.current.position({ x, y });
        firstRender.current = false;
      } else {
        // Subsequent updates: animate to new position
        groupRef.current.to({
          x: x,
          y: y,
          duration: 0.5,
          easing: Konva.Easings.EaseInOut,
        });
      }
    }
  }, [x, y]);

  return (
    <Group ref={groupRef}>
      <Circle radius={18} fill={color || '#FFCB33'} />
      {imageObj && (
        <Image
          image={imageObj}
          x={-15} // Offset relative to group center
          y={-15}
          width={30}
          height={30}
        />
      )}
    </Group>
  );
};

const CurrentPosition = ({
  deviceCode,
  canvasCenter = {},
  playbackData = null,
  interval = 1000,
}) => {
  const { deviceData } = useContext(WebSocketContext);
  const [positions, setPositions] = useState([]);
  const [images, setImages] = useState({});
  const heartBreathRateRef = useRef(false);
  const timeoutRef = useRef(null);
  const playbackIndexRef = useRef(0);
  const playbackTimerRef = useRef(null);

  const postureIconMap = useMemo(
    () => ({
      0: null,
      1: walking,
      2: suspected_fall,
      3: squatting,
      4: standing,
      5: fall_confirm,
      6: laying_down,
      9: FaBed,
      10: FaBed,
      11: FaBed,
      39: TbCircuitGround,
      7: TbCircuitGround,
      8: TbCircuitGround,
    }),
    []
  );

  // Load icons on mount
  useEffect(() => {
    const newImages = {};
    Object.values(postureIconMap).forEach((src) => {
      if (src) {
        const img = new window.Image();
        img.src = src;
        img.onload = () => {
          newImages[src] = img;
          setImages((prev) => ({ ...prev, ...newImages }));
        };
      }
    });
  }, [postureIconMap]);

  // Playback simulation
  useEffect(() => {
    if (playbackData && Array.isArray(playbackData)) {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
      playbackIndexRef.current = 0;

      playbackTimerRef.current = setInterval(() => {
        const currentItem = playbackData[playbackIndexRef.current];
        if (currentItem) {
          const validPositions = currentItem.filter(
            (p) =>
              p &&
              p.coordinates &&
              typeof p.coordinates.x === 'number' &&
              typeof p.coordinates.y === 'number'
          );
          setPositions(validPositions);
          console.log(validPositions);

          playbackIndexRef.current++;
        } else {
          clearInterval(playbackTimerRef.current);
        }
      }, interval);

      return () => clearInterval(playbackTimerRef.current);
    }
  }, [playbackData, interval]);

  // Real-time device data
  useEffect(() => {
    if (!playbackData) {
      const rawPosition = deviceData[deviceCode]?.position || [];

      const validPositions = rawPosition.filter(
        (p) =>
          p &&
          p.coordinates &&
          typeof p.coordinates.x === 'number' &&
          typeof p.coordinates.y === 'number'
      );
      setPositions(validPositions);
    }
  }, [deviceData[deviceCode], playbackData]);

  // Heart/breath update timeout (only for live)
  useEffect(() => {
    if (!playbackData && deviceData[deviceCode]?.heartBreath) {
      heartBreathRateRef.current = true;
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        heartBreathRateRef.current = false;
      }, 5000);
    }
  }, [deviceData[deviceCode]?.heartBreath, playbackData]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    };
  }, []);

  return (
    <>
      {positions.map((pos, index) => {
        if (!pos || !pos.coordinates) return null;
        const { coordinates, color, postureIndex, targetId } = pos;

        // Use targetId if available, otherwise fallback to index.
        // CRITICAL: Do NOT include coordinates in key, or React will unmount/mount instead of animating.
        const key = targetId ? `pos-${targetId}` : `pos-idx-${index}`;

        const imageIcon = postureIconMap[postureIndex];
        const imageObj = images[imageIcon];

        const targetX = canvasCenter?.x - coordinates.x * 10;
        const targetY = canvasCenter?.y + coordinates.y * 10;

        return (
          <AnimatedMarker key={key} x={targetX} y={targetY} color={color} imageObj={imageObj} />
        );
      })}
    </>
  );
};

CurrentPosition.displayName = 'CurrentPosition';
export default React.memo(CurrentPosition);
