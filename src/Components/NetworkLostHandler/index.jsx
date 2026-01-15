import React, { useState, useEffect } from 'react';

const NetworkErrorModal = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // Function to handle when the network goes offline
    const handleOffline = () => {
      setIsOffline(true); // Set state to show the modal
    };

    // Function to handle when the network comes back online
    const handleOnline = () => {
      setIsOffline(false); // Set state to hide the modal
    };

    // Listen for the online and offline events
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline) return null; // Only show the modal when offline

  return (
    <div className='fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg text-center'>
        <p className='text-[30px] font-semibold text-gray-900'>Internet connection lost</p>
        <p className='text-base text-gray-600 mb-6'>Please check your connection.</p>
        <button
          onClick={() => window.location.reload()}
          className='bg-text-primary/90 text-white px-4 py-2 rounded-xl hover:bg-text-primary transition'
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default NetworkErrorModal;
