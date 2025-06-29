import React, { useState } from 'react';
import { atom, useAtom } from 'jotai';

// Atom to store the selected segment
export const selectedSegmentAtom = atom('SUVs');
// Atom to store the selected model index
export const selectedModelIndexAtom = atom(0);

// Data from tata_motors_car_lineup.md
const CAR_SEGMENTS = [
  "SUVs",
  "SUV Coupé",
  "Hatchbacks",
  "Sedans",
  "Electric Vehicles",
  "Commercial Vehicles"
];

// Available 3D models by segment (currently we only have SUVs)
const AVAILABLE_MODELS_BY_SEGMENT = {
  "SUVs": ["Safari", "Punch"],
  "SUV Coupé": [],
  "Hatchbacks": [],
  "Sedans": [],
  "Electric Vehicles": [],
  "Commercial Vehicles": []
};

const Configurator = () => {
  const [selectedSegment, setSelectedSegment] = useAtom(selectedSegmentAtom);
  const [selectedModelIndex, setSelectedModelIndex] = useAtom(selectedModelIndexAtom);
  const [minimized, setMinimized] = useState(false);

  // Get available models for current segment
  const availableModels = AVAILABLE_MODELS_BY_SEGMENT[selectedSegment];
  
  // When segment changes, reset model index to 0
  const handleSegmentChange = (segment) => {
    setSelectedSegment(segment);
    setSelectedModelIndex(0);
  };

  // Toggle minimized state
  const toggleMinimized = () => {
    setMinimized(!minimized);
  };

  return (
    <>
      {/* Model Dots Navigation - positioned at the bottom right */}
      {availableModels.length > 1 && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '20%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '15px',
          zIndex: 110,
          padding: '10px 15px',
          borderRadius: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
        }}>
          {availableModels.map((model, index) => (
            <button
              key={index}
              onClick={() => setSelectedModelIndex(index)}
              title={model}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: selectedModelIndex === index ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                boxShadow: selectedModelIndex === index ? '0 0 5px rgba(255, 255, 255, 0.7)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            />
          ))}
        </div>
      )}

      {/* Dashboard-style Configurator Panel */}
      <div style={{
        position: 'fixed',
        bottom: minimized ? '30px' : '80px',
        right: minimized ? '30px' : '50%',
        transform: minimized ? 'none' : 'translateX(50%)',
        background: 'rgba(10, 10, 10, 0.7)',
        backdropFilter: 'blur(10px)',
        padding: minimized ? '15px' : '20px',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
        zIndex: 100,
        width: minimized ? '50px' : '500px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'white',
      }}>
        {/* Toggle button */}
        <button
          onClick={toggleMinimized}
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            position: 'absolute',
            top: '15px',
            right: '15px',
            fontSize: '20px',
            padding: '0',
            margin: '0',
            opacity: '0.7',
            transition: 'opacity 0.2s ease',
            zIndex: 2,
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '0.7'}
        >
          {minimized ? '⋯' : '×'}
        </button>

        {/* Content section - hidden when minimized */}
        {!minimized && (
          <div style={{width: '100%'}}>
            <h3 style={{ 
              margin: '0 0 20px 0', 
              color: '#fff', 
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: '400',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}>
              Tata Motors Explorer
            </h3>
            
            {/* Model display section */}
            {availableModels.length > 0 && (
              <div style={{ 
                marginBottom: '25px', 
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '28px',
                  fontWeight: '600',
                  marginBottom: '5px',
                  backgroundImage: 'linear-gradient(90deg, #fff, #aaa)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}>
                  {availableModels[selectedModelIndex]}
                </div>
                <div style={{
                  fontSize: '14px',
                  opacity: 0.7,
                  letterSpacing: '1px',
                }}>
                  {selectedSegment}
                </div>
              </div>
            )}
            
            {/* Segment selection */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              justifyContent: 'center',
              marginBottom: '10px',
            }}>
              {CAR_SEGMENTS.map((segment) => (
                <button
                  key={segment}
                  onClick={() => handleSegmentChange(segment)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '20px',
                    border: 'none',
                    backgroundColor: selectedSegment === segment ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    color: selectedSegment === segment ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '12px',
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{segment}</span>
                  {AVAILABLE_MODELS_BY_SEGMENT[segment].length > 0 && (
                    <span style={{
                      backgroundColor: selectedSegment === segment ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                    }}>
                      {AVAILABLE_MODELS_BY_SEGMENT[segment].length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Configurator; 