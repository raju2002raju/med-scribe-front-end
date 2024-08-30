import React, { useEffect } from 'react';
import './SoundWave.css'; // Assuming you put your CSS in this file

const SoundWave = () => {
  useEffect(() => {
    const bars = document.querySelectorAll('.bar');
    bars.forEach((bar) => {
      bar.style.animationDuration = `${Math.random() * (0.7 - 0.2) + 0.2}s`;
    });
  }, []);

  return (
    <div className="sound-wave">
      {Array.from({ length: 160 }, (_, i) => (
        <div key={i} className="bar"></div>
      ))}
    </div>
  );
};

export default SoundWave;
