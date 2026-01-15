import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { FaPersonFalling } from 'react-icons/fa6';

const TimelineSlider = ({
  data = [],
  onFrameSelect,
  currentFrame = 0,
  isLongReplyAction = false,
  preLength = 0,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const timelineRef = useRef(null);
  const sliderRef = useRef(null);
  const getFrameDominantPosture = useCallback((frame) => {
    if (!frame || !Array.isArray(frame) || frame.length === 0) return null;

    const priorityPosture = frame.find(
      (item) => item?.postureIndex == 2 || item?.postureIndex == 5
    );

    if (priorityPosture) return priorityPosture.postureIndex;

    return frame[0]?.postureIndex || null;
  }, []);

  const getFrameColor = useCallback((frame) => {
    if (!frame || !Array.isArray(frame) || frame.length === 0) return '#CCCCCC';

    const firstItem =
      frame.find((item) => item?.postureIndex == 2 || item?.postureIndex == 5) || frame[0];

    return firstItem?.color || '#CCCCCC';
  }, []);

  const groupedFrames = useMemo(() => {
    if (!data.length) return [];

    const groups = [];
    let currentGroup = {
      startIndex: 0,
      endIndex: 0,
      posture: getFrameDominantPosture(data[0]),
      color: getFrameColor(data[0]),
      frameCount: 1,
    };

    for (let i = 1; i < data.length; i++) {
      const currentPosture = getFrameDominantPosture(data[i]);

      if (currentPosture === currentGroup.posture) {
        currentGroup.endIndex = i;
        currentGroup.frameCount++;
      } else {
        groups.push({ ...currentGroup });
        currentGroup = {
          startIndex: i,
          endIndex: i,
          posture: currentPosture,
          color: getFrameColor(data[i]),
          frameCount: 1,
        };
      }
    }

    groups.push({ ...currentGroup });

    return groups;
  }, [data, getFrameDominantPosture, getFrameColor]);

  const currentGroupIndex = useMemo(() => {
    return groupedFrames.findIndex(
      (group) => currentFrame >= group.startIndex && currentFrame <= group.endIndex
    );
  }, [groupedFrames, currentFrame]);

  const groupLayout = useMemo(() => {
    if (!data.length) return [];

    return groupedFrames.map((group) => ({
      ...group,
      startPercent: (group.startIndex / data.length) * 100,
      widthPercent: (group.frameCount / data.length) * 100,
    }));
  }, [groupedFrames, data.length]);
  const handleTimelineClick = useCallback(
    (e) => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      const frameIndex = Math.floor(percentage * (data.length - 1));
      onFrameSelect?.(frameIndex, data[frameIndex]);
    },
    [data, onFrameSelect]
  );

  const handleSliderDrag = useCallback(
    (e) => {
      if (!isDragging || !timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      const frameIndex = Math.floor(percentage * (data.length - 1));
      onFrameSelect?.(frameIndex, data[frameIndex]);
    },
    [isDragging, data, onFrameSelect]
  );

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setIsActive(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsActive(false);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) handleSliderDrag(e);
    },
    [isDragging, handleSliderDrag]
  );

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const sliderPosition = data.length > 1 ? `${(currentFrame / (data.length - 1)) * 100}%` : '0%';

  const markerPosition = data.length > 1 ? `${(preLength / (data.length - 1)) * 100}%` : null;

  return (
    <div className='w-full mx-auto py-3 relative'>
      <div
        ref={timelineRef}
        className='relative w-full h-5 cursor-pointer'
        onClick={handleTimelineClick}
      >
        <div className='relative h-full w-full rounded-md overflow-hidden'>
          {groupLayout.map((group, index) => (
            <div
              key={index}
              className='absolute h-full transition-all duration-200 hover:scale-y-150 hover:z-12 hover:shadow-md border-r border-white border-opacity-50 last:border-r-0'
              style={{
                left: `${group.startPercent}%`,
                width: `${group.widthPercent}%`,
                backgroundColor: group.color,
              }}
              title={`Posture: ${group.posture}, Frames: ${group.frameCount}`}
            />
          ))}
        </div>

        <div
          ref={sliderRef}
          className={`absolute top-1/2 size-4 bg-text border-2 border-card rounded-full shadow-lg transition-all duration-200 z-20 ${
            isActive
              ? 'scale-125 cursor-grabbing shadow-xl'
              : 'cursor-grab hover:scale-125 hover:shadow-xl'
          }`}
          style={{
            left: sliderPosition,
            transform: 'translate(-50%, -50%)',
          }}
          onMouseDown={handleMouseDown}
        />

        {groupLayout.slice(0, -1).map((group, index) => (
          <div
            key={index}
            className='absolute top-0 h-full w-px bg-white bg-opacity-30 z-10'
            style={{
              left: `${group.startPercent + group.widthPercent}%`,
            }}
          />
        ))}

        {isLongReplyAction && markerPosition && (
          <div
            className='absolute -top-6 text-red-500 z-30 flex flex-col items-center'
            style={{ left: markerPosition, transform: 'translateX(-50%)' }}
          >
            <FaPersonFalling size={18} className='animate-bounce' />
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineSlider;
