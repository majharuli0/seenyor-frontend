import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import CardUI from '../common/card';
import { Button } from '../ui/button';
import { Pause, Play, Plug, WifiOff } from 'lucide-react';
import { Badge } from '../ui/badge';
import WallMountCanvas from '../RoomMapCanvas/WallMount';
import { FaArrowRotateLeft } from 'react-icons/fa6';
import { usePlayFallback, useRoomInfo } from '@/MonitoringService/hooks/useAlert';
import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import TopMountCanvas from '../RoomMapCanvas/TopMount';
import { Spinner } from '../ui/spinner';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '../ui/empty';
import TimelineSlider from '../TimelineSlider';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPause, FaPlay } from 'react-icons/fa';
import { useDeviceStore } from '@/MonitoringService/store/useDeviceStore';
import { fallPlayback } from '@/api/deviceReports';

export const FallPlayBack = ({ selectedAlert = {}, type = 1 }) => {
  const [transformedData, setTransformedData] = useState([]);
  const [playbackArray, setPlaybackArray] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const playbackIntervalRef = useRef(null);
  const getDeviceByUID = useDeviceStore((state) => state.getDeviceByUID);
  const [isLongReplyAction, setIsLongReplayAction] = useState(false);
  const postureColorMap = useMemo(
    () => ({
      1: '#34CECE',
      2: '#FFCB33',
      3: '#91B4FF',
      4: '#A7E2FE',
      5: '#FC4A4A',
      6: '#252F67',
    }),
    []
  );

  const {
    data: fallPlaybackData,
    isSuccess,
    isLoading: isFallDataLoading,
    refetch: refetchFall,
  } = usePlayFallback({
    id: selectedAlert?._id,
    createdAt: selectedAlert?.created_at,
  });
  const pre_frames =
    (fallPlaybackData?.data &&
      fallPlaybackData?.data?.pre_frames &&
      JSON.parse(fallPlaybackData?.data?.pre_frames)) ||
    [];
  const post_frames =
    fallPlaybackData?.data &&
    fallPlaybackData?.data?.post_frames &&
    JSON.parse(fallPlaybackData?.data?.post_frames);

  const deviceInfo = getDeviceByUID(selectedAlert?.uid);
  const {
    data: roomInfo,
    refetch,
    isLoading = true,
  } = useRoomInfo(
    {
      elderly_id: selectedAlert?.elderly_id,
      room_id: selectedAlert?.uid,
    },
    {
      enabled: !!selectedAlert?.elderly_id && !!selectedAlert?.uid,
    }
  );
  function formatToAlarmTime(createdAt, timeZone = 'Asia/Dhaka') {
    const date = new Date(createdAt);
    date.setSeconds(date.getSeconds() - 1);

    return date.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
      timeZone,
    });
  }

  const device = getDeviceByUID(selectedAlert?.uid);
  const getRealFall = useCallback(() => {
    fallPlayback({
      uid: selectedAlert?.uid,
      alarmTime: formatToAlarmTime(selectedAlert?.created_at, device?.timezone || 'Asia/Dhaka'),
    })
      .then((res) => {
        const rawData = res?.data?.data;
        const transformed = transformPlayback(rawData, false);
        setTransformedData(transformed);
      })
      .catch((err) => console.log(err));
  }, [selectedAlert?._id]);
  useEffect(() => {
    getRealFall();
  }, [getRealFall]);
  const transformPlayback = (data = [], isReplayAction = true) => {
    if (!Array.isArray(data)) return [];
    return data.map((frame, idx) => {
      if (!Array.isArray(frame)) return [];

      return (frame?.length > 0 ? frame : frame[0]).map((entry) => ({
        id: idx,
        targetId: entry?.groupStr ?? null,
        coordinates: {
          x: entry?.xaxis ?? 0,
          y: entry?.yaxis ?? 0,
        },
        color:
          postureColorMap?.[
            isReplayAction
              ? entry?.posture
              : data?.length - 1 === idx && entry.posture == '2'
                ? 5
                : entry.posture
          ] ?? '#ccc',
        postureIndex: isReplayAction
          ? (entry?.posture ?? 0)
          : data?.length - 1 === idx && entry.posture == '2'
            ? 5
            : entry.posture,
      }));
    });
  };

  useEffect(() => {
    if (playbackIntervalRef.current) {
      clearInterval(playbackIntervalRef.current);
      playbackIntervalRef.current = null;
    }

    if (isPlaying && playbackArray.length > 0) {
      playbackIntervalRef.current = setInterval(() => {
        setCurrentFrame((prev) => {
          const nextFrame = prev + 1;
          if (nextFrame >= playbackArray.length) {
            setIsPlaying(false);
            return prev;
          }
          return nextFrame;
        });
      }, 1000);
    }

    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, [isPlaying, playbackArray.length, selectedAlert]);

  useEffect(() => {
    if (pre_frames || transformedData) {
      // const frames = [post_frames];
      // const frames = [pre_frames];
      const frames = [pre_frames, post_frames];
      const merged = frames.flat();
      const transformed = transformPlayback(merged);
      setPlaybackArray(transformed);
      setIsLongReplayAction(true);

      if (transformed?.length < 2) {
        setPlaybackArray(transformedData);
        setIsLongReplayAction(false);
      }
      setCurrentFrame(0);
      setIsPlaying(true);
    } else {
      setPlaybackArray([]);
      setCurrentFrame(0);
    }
  }, [fallPlaybackData, isSuccess, selectedAlert, transformedData]);

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleReset = () => {
    setCurrentFrame(0);
    setIsPlaying(true);
  };

  const handleFrameSelect = (frameIndex, frameData) => {
    setCurrentFrame(frameIndex);
    setIsPlaying(false);
  };

  const handleNextFrame = () => {
    if (currentFrame < playbackArray.length - 1) {
      setCurrentFrame((prev) => prev + 1);
      setIsPlaying(false);
    }
  };

  const handlePrevFrame = () => {
    if (currentFrame > 0) {
      setCurrentFrame((prev) => prev - 1);
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const morphVariants = {
    play: {
      scale: 1,
      rotate: 0,
      transition: { type: 'spring', stiffness: 500, damping: 15 },
    },
    pause: {
      scale: 1,
      rotate: 0,
      transition: { type: 'spring', stiffness: 500, damping: 15 },
    },
  };

  const iconVariants = {
    play: {
      opacity: 1,
      scale: 1,
      transition: { delay: 0.1 },
    },
    pause: {
      opacity: 1,
      scale: 1,
      transition: { delay: 0.1 },
    },
  };

  return (
    <CardUI
      title={<h1 className='text-base font-semibold text-text text-nowrap'>Fall Playback</h1>}
      headerPadding='px-5 py-4'
    >
      <div className='relative w-full !h-full'>
        <div
          className='absolute inset-0 pointer-events-none z-0 bg-[length:20px_20px]'
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(var(--ms-text-color) / 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(var(--ms-text-color) / 0.1) 1px, transparent 1px)
            `,
          }}
        />
        <div className='w-full flex items-center justify-between absolute top-1 px-1 z-[9999]'>
          <Button
            size='icon'
            variant='outline'
            onClick={() => {
              handleReset();
              refetchFall();
              getRealFall();
            }}
          >
            <FaArrowRotateLeft />
          </Button>
          <Badge variant='outline' className='border-card-300 text-sm'>
            {isFallDataLoading && <Spinner className='h-8 w-8' />} {formatTime(currentFrame)} /{' '}
            {formatTime(playbackArray.length)}
          </Badge>
        </div>
        <div className='relative z-10 max-w-[600px] mx-auto'>
          {/* Canvas Components */}
          {roomInfo?.data?.mount_type == 2 && !isLoading && (
            <WallMountCanvas
              roomInfo={roomInfo?.data}
              playbackData={playbackArray}
              isPlaying={isPlaying}
              currentFrame={currentFrame}
            />
          )}
          {roomInfo?.data?.mount_type == 1 && !isLoading && (
            <TopMountCanvas
              roomInfo={roomInfo?.data}
              playbackData={playbackArray}
              isPlaying={isPlaying}
              currentFrame={currentFrame}
              onFrameSelect={handleFrameSelect}
              preLength={pre_frames.length}
            />
          )}

          {!isLoading && !playbackArray.length == 0 && (
            <div className={`flex items-center gap-2 w-full absolute bottom-0 px-2`}>
              <TimelineSlider
                data={playbackArray}
                currentFrame={currentFrame}
                onFrameSelect={handleFrameSelect}
                isLongReplyAction={isLongReplyAction}
                preLength={pre_frames.length}
              />
              <motion.div
                onClick={handleTogglePlay}
                variants={morphVariants}
                initial='play'
                animate={isPlaying ? 'pause' : 'play'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div variants={iconVariants}>
                  {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
                </motion.div>
              </motion.div>
            </div>
          )}
          {(isLoading || !roomInfo || !roomInfo?.data) && (
            <div className='w-full h-full flex justify-center items-center aspect-[6/4] max-h-screen'>
              {isLoading ? (
                <Spinner className='h-8 w-8' />
              ) : !roomInfo?.data?.is_device_bind && roomInfo?.data?.device_no ? (
                <Empty className='w-full text-center'>
                  <EmptyHeader className='pt-8'>
                    <EmptyMedia variant='icon'>
                      <Plug className='w-16 h-16 text-muted-foreground' />
                    </EmptyMedia>
                    <EmptyTitle>Device Offline</EmptyTitle>
                    <EmptyDescription>Check device or select another room.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <Empty className='w-full text-center'>
                  <EmptyHeader className='pt-8'>
                    <EmptyMedia variant='icon'>
                      <WifiOff className='w-16 h-16 text-muted-foreground' />
                    </EmptyMedia>
                    <EmptyTitle>No Device</EmptyTitle>
                    <EmptyDescription>No device is linked to this room.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </div>
          )}
        </div>
      </div>
    </CardUI>
  );
};
