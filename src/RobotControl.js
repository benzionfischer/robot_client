import React, { useState, useEffect } from 'react';

const RobotControl = () => {
  const [leftVelocity, setLeftVelocity] = useState(0);
  const [rightVelocity, setRightVelocity] = useState(0);
  const [keysPressed, setKeysPressed] = useState(new Set());

  // Function to send velocity data to the server
  const sendVelocity = (left, right) => {
    fetch(`http://remote-control.local:8080/go?left_velocity=${left}&right_velocity=${right}`, {
      method: 'POST'
    }).catch(err => console.error('Error sending velocity:', err));
  };

  // Update velocities based on keys pressed
  const updateVelocity = (newKeys) => {
    let newLeftVelocity = 0;
    let newRightVelocity = 0;

    // Handle leftVelocity controlled by W and S keys
    if (newKeys.has('w')) {
      newLeftVelocity = 100;
    } else if (newKeys.has('s')) {
      newLeftVelocity = -100;
    }

    // Handle rightVelocity controlled by ArrowUp and ArrowDown keys
    if (newKeys.has('arrowup')) {
      newRightVelocity = 100;
    } else if (newKeys.has('arrowdown')) {
      newRightVelocity = -100;
    }

    setLeftVelocity(newLeftVelocity);
    setRightVelocity(newRightVelocity);
    sendVelocity(newLeftVelocity, newRightVelocity); // Send immediately after updating
  };

  // Handle key press down
  const handleKeyDown = (event) => {
    const key = event.key.toLowerCase();

    setKeysPressed((prevKeys) => {
      if (!prevKeys.has(key)) {
        const newKeys = new Set(prevKeys);
        newKeys.add(key);
        updateVelocity(newKeys); // Update and send velocity immediately
        return newKeys;
      }
      return prevKeys;
    });
  };

  // Handle key release
  const handleKeyUp = (event) => {
    const key = event.key.toLowerCase();

    setKeysPressed((prevKeys) => {
      if (prevKeys.has(key)) {
        const newKeys = new Set(prevKeys);
        newKeys.delete(key);
        updateVelocity(newKeys); // Update and send velocity immediately
        return newKeys;
      }
      return prevKeys;
    });
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
    <div>
      <h1>Robot Control</h1>
      <p>W/S controls Left Velocity (100 for W, -100 for S).</p>
      <p>Up/Down Arrows control Right Velocity (100 for Up, -100 for Down).</p>
      <p>Left Velocity: {leftVelocity}</p>
      <p>Right Velocity: {rightVelocity}</p>
    </div>
  );
};

export default RobotControl;
