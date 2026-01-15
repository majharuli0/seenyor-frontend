import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { FaPlay } from 'react-icons/fa';
import { FaPause } from 'react-icons/fa6';
const AudioPlayer = ({ audioSrc }) => {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const waveColor = isPlaying ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.4)';
  useEffect(() => {
    // Initialize WaveSurfer
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#60ab90',
      progressColor: '#ffffff',
      height: 40,
      responsive: true,
      hideScrollbar: true,
    });

    // Load audio file
    wavesurferRef.current.load(audioSrc);

    // Update playing state on play/pause
    wavesurferRef.current.on('play', () => setIsPlaying(true));
    wavesurferRef.current.on('pause', () => setIsPlaying(false));

    // Clean up on unmount
    return () => wavesurferRef.current.destroy();
  }, [audioSrc]);

  const togglePlayback = () => {
    wavesurferRef.current.playPause();
  };

  return (
    <div className='audio-player' style={{ display: 'flex', alignItems: 'center' }}>
      <button
        onClick={togglePlayback}
        className='play-pause-button'
        style={{
          marginRight: '8px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {isPlaying ? <FaPause color='white' /> : <FaPlay color='white' />}
      </button>
      <div ref={waveformRef} style={{ flex: 1 }} />
    </div>
  );
};

export default AudioPlayer;
