import React, { useState, useEffect } from 'react';

const RobotControl = () => {
  const [leftVelocity, setLeftVelocity] = useState(0);
  const [rightVelocity, setRightVelocity] = useState(0);
  const [keysPressed, setKeysPressed] = useState(new Set());

  const sendVelocity = (left, right) => {
    fetch(`http://remote-control.local:8080/go?left_velocity=${left}&right_velocity=${right}`, {
      method: 'POST'
    }).catch(err => console.error('Error sending velocity:', err));
  };

  const updateVelocity = () => {
    let newLeftVelocity = 0;
    let newRightVelocity = 0;

    // Handle leftVelocity controlled by W and S keys
    if (keysPressed.has('w')) {
      newLeftVelocity = 100;
    } else if (keysPressed.has('s')) {
      newLeftVelocity = -100;
    }

    // Handle rightVelocity controlled by ArrowUp and ArrowDown keys
    if (keysPressed.has('arrowup')) {
      newRightVelocity = 100;
    } else if (keysPressed.has('arrowdown')) {
      newRightVelocity = -100;
    }

    setLeftVelocity(newLeftVelocity);
    setRightVelocity(newRightVelocity);
    sendVelocity(newLeftVelocity, newRightVelocity);
  };

  const handleKeyDown = (event) => {
    setKeysPressed(prevKeys => new Set(prevKeys).add(event.key.toLowerCase()));
  };

  const handleKeyUp = (event) => {
    setKeysPressed(prevKeys => {
      const newKeys = new Set(prevKeys);
      newKeys.delete(event.key.toLowerCase());
      return newKeys;
    });
  };

  useEffect(() => {
    const intervalId = setInterval(updateVelocity, 100);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keysPressed]);

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
