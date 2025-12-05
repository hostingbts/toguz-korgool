import React, { createContext, useContext, useState, useEffect } from 'react';

const FullscreenContext = createContext();

export const useFullscreen = () => {
  const context = useContext(FullscreenContext);
  if (!context) {
    throw new Error('useFullscreen must be used within FullscreenProvider');
  }
  return context;
};

export const FullscreenProvider = ({ children }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768 || 
                            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const enterFullscreen = () => {
    if (isMobile) {
      setIsFullscreen(true);
      // Prevent body scroll when in fullscreen
      document.body.style.overflow = 'hidden';
    }
  };

  const exitFullscreen = () => {
    setIsFullscreen(false);
    document.body.style.overflow = '';
  };

  return (
    <FullscreenContext.Provider value={{ isFullscreen, isMobile, enterFullscreen, exitFullscreen }}>
      {children}
    </FullscreenContext.Provider>
  );
};

