/* global SELECTOR, OPTIONS */
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import mZoom from 'medium-zoom';
import './style.css';

function useZoom() {
  const [zoom, setZoom] = useState(null);
  const location = useLocation();
  const updateZoom = () => {
    setTimeout(() => {
      if (zoom) {
        zoom.detach();
      }
      setZoom(mZoom(SELECTOR, OPTIONS));
    }, 1000);
  };
  useEffect(() => {
    updateZoom();
  },[location.pathname]);
}

export default ({ hooks }) => {
  hooks.push(useZoom);
};

