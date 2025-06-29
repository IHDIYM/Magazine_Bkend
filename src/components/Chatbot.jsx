import React, { useState, useRef, useEffect } from "react";
import { useAtom } from "jotai";
import { selectedSegmentAtom } from "./Configurator";
import { API_URL } from "../config";

// Initialize the window.globalResponse
window.globalResponse = "";

// Map of car models to their corresponding segments
const CAR_MODEL_TO_SEGMENT = {
  // SUVs
  "safari": "SUVs",
  "punch": "SUVs",
  "nexon": "SUVs",
  "harrier": "SUVs",
  
  // Hatchbacks
  "tiago": "Hatchbacks",
  "altroz": "Hatchbacks",
  "tiago nrg": "Hatchbacks",
  
  // Sedans
  "tigor": "Sedans",
  
  // Electric Vehicles
  "tiago ev": "Electric Vehicles",
  "nexon ev": "Electric Vehicles",
  "tigor ev": "Electric Vehicles",
  "punch ev": "Electric Vehicles",
  
  // SUV Coupé
  "curvv": "SUV Coupé",
  
  // Commercial Vehicles
  "magic": "Commercial Vehicles"
};

// Keywords for direct segment mentions
const SEGMENT_KEYWORDS = {
  "suv": "SUVs",
  "suvs": "SUVs",
  "hatchback": "Hatchbacks",
  "hatchbacks": "Hatchbacks",
  "sedan": "Sedans",
  "sedans": "Sedans",
  "electric vehicle": "Electric Vehicles",
  "electric vehicles": "Electric Vehicles",
  "ev": "Electric Vehicles",
  "evs": "Electric Vehicles",
  "coupe": "SUV Coupé",
  "coupé": "SUV Coupé",
  "suv coupe": "SUV Coupé",
  "suv coupé": "SUV Coupé",
  "commercial vehicle": "Commercial Vehicles",
  "commercial vehicles": "Commercial Vehicles"
};

const Chatbot = ({ page }) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localResponse, setLocalResponse] = useState("");
  const [selectedSegment, setSelectedSegment] = useAtom(selectedSegmentAtom);
  const [showResponse, setShowResponse] = useState(false);

  // Function to analyze the response and update the selected segment if needed
  const analyzeResponseForSegments = (responseText) => {
    // Skip empty responses
    if (!responseText) return;
    
    // Convert to lowercase for case-insensitive matching
    const lowerText = responseText.toLowerCase();
    
    // First check for specific car models (more specific than segment keywords)
    for (const [model, segment] of Object.entries(CAR_MODEL_TO_SEGMENT)) {
      if (lowerText.includes(model)) {
        console.log(`Detected car model: ${model}, switching to segment: ${segment}`);
        setSelectedSegment(segment);
        return;
      }
    }
    
    // Then check for segment keywords
    for (const [keyword, segment] of Object.entries(SEGMENT_KEYWORDS)) {
      if (lowerText.includes(keyword)) {
        console.log(`Detected segment keyword: ${keyword}, switching to segment: ${segment}`);
        setSelectedSegment(segment);
        return;
      }
    }
  };

  const generateResponse = async () => {
    if (!prompt) return;

    try {
      console.log("Sending prompt to API:", prompt);
      setIsLoading(true);
      
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Response data:", data);
      
      // Store the response in both local state and window
      setLocalResponse(data.response);
      window.globalResponse = data.response;
      
      // Analyze the response for car segments and models
      analyzeResponseForSegments(data.response);
      
      // Reset the prompt
      setPrompt("");
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMsg = "Error connecting to server. Please try again.";
      setLocalResponse(errorMsg);
      window.globalResponse = errorMsg;
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      generateResponse();
    }
  };

  return (
    <>
      {/* Sleek dashboard-style input field */}
      <div style={{
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '400px',
        zIndex: 999,
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask me about Tata Vehicles"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px 50px 14px 25px',
              backgroundColor: 'rgba(10, 10, 10, 0.7)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '30px',
              fontSize: '15px',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
              caretColor: '#9336B4',
              letterSpacing: '0.5px',
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = '0 5px 20px rgba(147, 54, 180, 0.3)';
              e.target.style.border = '1px solid rgba(147, 54, 180, 0.4)';
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
              e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)';
            }}
          />
          <button
            onClick={generateResponse}
            disabled={isLoading}
            style={{
              position: 'absolute',
              right: '15px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isLoading ? (
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                borderTop: '2px solid #9336B4',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}></div>
            ) : (
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                style={{ transition: 'all 0.2s ease' }}
                onMouseOver={(e) => e.target.style.opacity = '1'}
                onMouseOut={(e) => e.target.style.opacity = '0.7'}
              >
                <path 
                  d="M13 5L20 12L13 19M4 12H20" 
                  stroke="#9336B4" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  opacity="0.7"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Add styling for spin animation */}
        <style jsx="true">{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </>
  );
};

export default Chatbot; 