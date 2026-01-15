import React from 'react';
import './style.css';
export default function Loader({ loaderTitle }) {
  return (
    <div className='absolute w-[100vw] h-[100vh] top-0 left-0 bg-white flex items-center justify-center z-[5000]'>
      <p className='mb-10 text-text-primary font-medium text-base'>{loaderTitle}</p>
      <div className='progress-loader  '>
        <div className='progress'></div>
      </div>
    </div>
  );
}
