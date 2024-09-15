// src/CameraStream.js
import React from 'react';

const CameraStream = () => {
  return (
    <div>
      <h2>Camera Stream</h2>
      <img
        src="http://remote-control.local:5001/video_feed"
        autoPlay
        controls
        style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
      />
    </div>
  );
};

export default CameraStream;
