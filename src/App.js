// src/App.js
import React from 'react';
import RobotControl from './RobotControl'; // Existing component
import CameraStream from './CameraStream'; // New component

const App = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <RobotControl />
      <CameraStream />
    </div>
  );
};

export default App;
