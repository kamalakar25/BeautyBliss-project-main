import React, { useState } from "react";
import beforehair from '../assets/before.avif';
import afterhair   from '../assets/after.avif';
// import bgImage from './assets/bg-1.avif';
// import { transform } from "framer-motion";


const Transformation = () => {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e) => {
    setSliderPosition(e.target.value);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '90%', // Changed for better mobile scaling
        maxWidth: '800px', // Slightly bigger for large screens
        margin: '40px auto',
       
        touchAction: 'none',
        padding: window.innerWidth < 600 ? '20px' : '40px', // Responsive padding
        border: '6px solid #f5f5f5',
        borderRadius: '20px',
        // backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
      }}
    >
      <div style={{
        position: 'relative',
        width: '100%',
       
        borderRadius: '12px',
        aspectRatio: '16/9', // Maintain consistent ratio
      }}>
        <img
          src={afterhair}
          alt="After Makeup"
          style={{
            width: '100%',
            height: '130%',
            objectFit: 'cover',
            userSelect: 'none',
            pointerEvents: 'none',
            borderRadius: '12px',
          }}
        />

        <img
          src={beforehair}
          alt="Before Makeup"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '99.50%',
            objectFit: 'cover',
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
            transition: 'clip-path 0.2s ease-out',
            userSelect: 'none',
            pointerEvents: 'none',
            borderRadius: '12px',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${sliderPosition}%`,
            width: '3px',
            backgroundColor: 'white',
            transform: 'translateX(-50%)',
            zIndex: 2,
            transition: 'left 0.2s ease-out',
            pointerEvents: 'none',
          }}
        />

        {/* Labels */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '15px',
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          padding: '4px 10px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: 'bold',
          zIndex: 4,
          backdropFilter: 'blur(4px)',
        }}>
          Before
        </div>
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '15px',
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          padding: '4px 10px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: 'bold',
          zIndex: 4,
          backdropFilter: 'blur(4px)',
        }}>
          After
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={handleSliderChange}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            zIndex: 3,
            cursor: 'ew-resize',
          }}
        />
      </div>
    </div>
  );
};

export default Transformation;