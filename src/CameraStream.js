// src/CameraStream.js
import React from 'react';

const CameraStream = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center', // Centers horizontally
        alignItems: 'center',     // Centers vertically
        height: '80vh',          // Full viewport height for vertical centering
        position: 'relative',     // Enables relative positioning
        top: '-50px',             // Moves the container 50px upward (adjust as needed)
      }}
    >
      <div style={{ width: '100%', maxWidth: '900px' }}>
        <h2 style={{ textAlign: 'center' }}>Camera Stream</h2>
        <img
          src="http://robot.local:5001/video_feed"
          alt="Camera Feed"
          style={{
            width: '100%',          // Set the width to take the full available width of the parent
            aspectRatio: '1 / 1',    // Forces the image to maintain a square shape
            objectFit: 'cover',      // Makes sure the image covers the square area
          }}
        />
      </div>
    </div>
  );
};

export default CameraStream;
