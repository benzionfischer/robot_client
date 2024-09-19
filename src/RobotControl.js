import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client'; // Import io from socket.io-client
import './RobotControl.css';

const RobotControl = () => {
  const [leftVelocity, setLeftVelocity] = useState(0);
  const [rightVelocity, setRightVelocity] = useState(0);
  const [keysPressed, setKeysPressed] = useState(new Set());
  const [statusMessage, setStatusMessage] = useState("Idle");
  const socketRef = useRef(null); // Use ref to persist socket between renders

  useEffect(() => {
    const socket = io('ws://localhost:8080'); // Establish WebSocket connection once

    socket.on('connect', () => {
      console.log('Connected to WebSocket via Socket.IO');
      setStatusMessage("Connected");
    });

    socket.on('disconnect', () => {
      console.log('Socket.IO connection closed');
      setStatusMessage("Disconnected");
    });

    socket.on('error', (error) => {
      console.error('Socket.IO error:', error);
      setStatusMessage("Error");
    });

    socketRef.current = socket; // Save socket to ref

    return () => {
      if (socketRef.current) {
        socketRef.current.close(); // Clean up connection on unmount
      }
    };
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const sendVelocity = (left, right) => {
    if (socketRef.current) { // Use the socket from ref
      const data = { left_velocity: left, right_velocity: right };
      socketRef.current.emit('control', data); // Use socket from ref directly
      console.log("sent successfully");
    } else {
      console.error('Socket.IO is not open');
      setStatusMessage("Socket.IO not open");
    }
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
    sendVelocity(newLeftVelocity, newRightVelocity); // Send the velocity via WebSocket
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
  }, []); // Attach keydown/keyup listeners only once

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
