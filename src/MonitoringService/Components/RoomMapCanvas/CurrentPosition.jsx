import React, { useState, useRef, useEffect, useMemo, useContext } from 'react';
import { Circle, Image } from 'react-konva';
import walking from '@/assets/icon/room/events/walking.svg';
import suspected_fall from '@/assets/icon/room/events/suspected_fall.svg';
import squatting from '@/assets/icon/room/events/squatting.svg';
import standing from '@/assets/icon/room/events/standing.svg';
import fall_confirm from '@/assets/icon/room/events/fall_confirm.svg';
import laying_down from '@/assets/icon/room/events/laying_down.svg';
import { WebSocketContext } from '@/Context/WebSoketHook';
import { FaBed } from 'react-icons/fa';
import { TbCircuitGround } from 'react-icons/tb';

const CurrentPosition = ({
  deviceCode,
  canvasCenter = {},
  playbackData = null,
  interval = 1000,
  isPlaying = true,
  currentFrame = 0, // Add this prop
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
      7: TbCircuitGround,
      8: TbCircuitGround,
    }),
    []
  );

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

  useEffect(() => {
    if (playbackData && Array.isArray(playbackData)) {
      // Clear any existing intervals
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
        playbackTimerRef.current = null;
      }

      // Set positions based on currentFrame
      const currentItem = playbackData[currentFrame];
      if (currentItem) {
        const validPositions = currentItem.filter(
          (p) =>
            p &&
            p.coordinates &&
            typeof p.coordinates.x === 'number' &&
            typeof p.coordinates.y === 'number'
        );
        setPositions(validPositions);
      } else {
        setPositions([]);
      }
    }
  }, [playbackData, currentFrame]);

  useEffect(() => {
    if (!playbackData || !Array.isArray(playbackData)) return;

    if (playbackTimerRef.current) {
      clearInterval(playbackTimerRef.current);
      playbackTimerRef.current = null;
    }

    if (isPlaying && playbackData.length > 0) {
      playbackIndexRef.current = currentFrame;

      playbackTimerRef.current = setInterval(() => {}, interval);
    }

    return () => {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
    };
  }, [playbackData, interval, isPlaying, currentFrame]);

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
  useEffect(() => {
    if (!playbackData && deviceData[deviceCode]?.heartBreath) {
      heartBreathRateRef.current = true;
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        heartBreathRateRef.current = false;
      }, 5000);
    }
  }, [deviceData[deviceCode]?.heartBreath, playbackData]);

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

        const key = targetId ? `pos-${targetId}` : `pos-${coordinates.x}-${coordinates.y}-${index}`;

        const imageIcon = postureIconMap[postureIndex];
        const imageObj = images[imageIcon];

        return (
          <React.Fragment key={index}>
            <Circle
              x={canvasCenter?.x - coordinates.x * 10}
              y={canvasCenter?.y + coordinates.y * 10}
              radius={18}
              fill={color || '#FFCB33'}
            />
            {imageIcon && imageObj && (
              <Image
                image={imageObj}
                x={canvasCenter?.x - coordinates.x * 10 - 15}
                y={canvasCenter?.y + coordinates.y * 10 - 15}
                width={30}
                height={30}
              />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

CurrentPosition.displayName = 'CurrentPosition';
export default React.memo(CurrentPosition);
