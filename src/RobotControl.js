import React, { useState, useEffect } from 'react';
import './RobotControl.css'; // Import the CSS file for styling

const RobotControl = () => {
  const [leftVelocity, setLeftVelocity] = useState(0);
  const [rightVelocity, setRightVelocity] = useState(0);
  const [keysPressed, setKeysPressed] = useState(new Set());
  const [statusMessage, setStatusMessage] = useState("Idle");

  const sendVelocity = (left, right) => {
    console.log(typeof(left), typeof(right))
    fetch(`http://robot.local:8080/go?left_velocity=${left}&right_velocity=${right}`, {
      method: 'POST'
    }).catch(err => {
      console.error('Error sending velocity:', err);
      setStatusMessage("Error sending data");
    });
  };

  const updateVelocity = (newKeys) => {
    let newLeftVelocity = 0;
    let newRightVelocity = 0;
    if (newKeys.has('w')) newLeftVelocity = 100;
    if (newKeys.has('s')) newLeftVelocity = -100;
    if (newKeys.has('arrowup')) newRightVelocity = 100;
    if (newKeys.has('arrowdown')) newRightVelocity = -100;

    setLeftVelocity(newLeftVelocity);
    setRightVelocity(newRightVelocity);
    setStatusMessage("Moving");
    sendVelocity(newLeftVelocity, newRightVelocity);
  };

  const handleKeyDown = (event) => {
    const key = event.key.toLowerCase();
    const normalizedKey = key.includes('arrow') ? key : key;

    setKeysPressed((prevKeys) => {
      if (!prevKeys.has(normalizedKey)) {
        const newKeys = new Set(prevKeys);
        newKeys.add(normalizedKey);
        updateVelocity(newKeys);
        return newKeys;
      }
      return prevKeys;
    });
  };

  const handleKeyUp = (event) => {
    const key = event.key.toLowerCase();
    setKeysPressed((prevKeys) => {
      const newKeys = new Set(prevKeys);
      newKeys.delete(key);
      updateVelocity(newKeys);
      return newKeys;
    });
    setStatusMessage("Idle");
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="robot-control">
      <h1 className="title">Robot Control Dashboard</h1>
      <div className="status-container">
        <p className="status">Status: <span className={`status-message ${statusMessage.toLowerCase()}`}>{statusMessage}</span></p>
      </div>
      <div className="velocity-display">
        <div className="velocity">
          <p className="velocity-label">Left Velocity:</p>
          <p className="velocity-value">{leftVelocity}</p>
        </div>
        <div className="velocity">
          <p className="velocity-label">Right Velocity:</p>
          <p className="velocity-value">{rightVelocity}</p>
        </div>
      </div>
    </div>
  );
};

export default RobotControl;
