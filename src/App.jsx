import { Loader, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useEffect } from "react";
import { Experience } from "./components/Experience";
import { UI, pageAtom } from "./components/UI";
import Chatbot from "./components/Chatbot";
import { Model as Safari } from "./components/Safari";
import { Model as Punch } from "./components/Punch";
import { Model as Arc } from "./components/arc";
import { useAtom } from "jotai";
import Configurator, { selectedSegmentAtom, selectedModelIndexAtom } from "./components/Configurator";
import TextResponse from "./components/3DText";

// Initialize global variable for user input if it doesn't exist
if (typeof window !== 'undefined') {
  window.userInput = "";
}

// Car model mappings for different segments
const CAR_MODELS = {
  "SUVs": [Safari, Punch],
  // Add other segments and their models here when available
}

// Position for displaying car models
const CAR_POSITION = [-2, -2, -8];
const CAR_SCALE = 0.8;

// Rotating car component - shows selected model based on segment and index
function RotatingCar() {
  const groupRef = useRef();
  const [selectedSegment] = useAtom(selectedSegmentAtom);
  const [selectedModelIndex] = useAtom(selectedModelIndexAtom);

  // Get available models for current segment
  const availableModels = CAR_MODELS[selectedSegment] || [];
  
  // Get current car model component
  const CurrentCarModel = availableModels[selectedModelIndex] || null;

  useFrame((state) => {
    if (groupRef.current) {
      // Rotate around Y axis (vertical rotation)
      groupRef.current.rotation.y += 0.004;
    }
  });

  if (!CurrentCarModel) return null;

  return (
    <group ref={groupRef} position={CAR_POSITION} scale={CAR_SCALE}>
      <CurrentCarModel />
    </group>
  );
}

// Always visible Arc component
function RotatingArc() {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      // Rotate around Y axis (vertical rotation)
      groupRef.current.rotation.y += 0.004;
    }
  });

  return (
    <group ref={groupRef} position={[-2.5, -3.5, -8]} scale={0.015}>
      <Arc 
        glowProps={{
          falloff: 0.1,
          glowInternalRadius: 0.5,
          glowColor: "#9336B4",
          glowSharpness: 2.5,
          opacity: 2.0
        }} 
      />
    </group>
  );
}

// Custom hook to capture chatbot input
function useCaptureUserInput() {
  useEffect(() => {
    // Function to intercept form submissions
    const handleFormSubmit = (event) => {
      // Check if the event target is from the chatbot form
      if (event.target.tagName === 'FORM' && event.target.querySelector('input[type="text"]')) {
        const inputField = event.target.querySelector('input[type="text"]');
        if (inputField && inputField.value) {
          // Store the user input in the global variable
          window.userInput = inputField.value;
          console.log("Captured user input:", window.userInput);
        }
      }
    };

    // Add event listener for form submissions
    document.addEventListener('submit', handleFormSubmit, true);

    // Add event listener for input changes to handle when Enter key is pressed
    const handleInputKeydown = (event) => {
      if (event.key === 'Enter' && event.target.tagName === 'INPUT' && event.target.type === 'text') {
        window.userInput = event.target.value;
        console.log("Captured user input from keydown:", window.userInput);
      }
    };
    document.addEventListener('keydown', handleInputKeydown, true);

    // Cleanup event listeners
    return () => {
      document.removeEventListener('submit', handleFormSubmit, true);
      document.removeEventListener('keydown', handleInputKeydown, true);
    };
  }, []);
}

function App() {
  const [page] = useAtom(pageAtom);
  const [selectedSegment] = useAtom(selectedSegmentAtom);
  
  // Use the custom hook to capture user input
  useCaptureUserInput();
  
  return (
    <>
      <UI />
      <Loader />
      <Configurator />
      
      {/* Main Canvas with Book only */}
      <Canvas 
        shadows 
        camera={{
          position: [0, 1, 5],
          fov: 45,
        }}
      >
        <group position-y={0}>
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </group>
      </Canvas>
      
      {/* Separate Canvas for 3D Text */}
      <Canvas
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none', // This makes the canvas non-interactive
          zIndex: 10, // Ensure it's above the book but below UI elements
        }}
        camera={{
          position: [-0.5, 0, 4], // Adjusted camera position to better frame the text
          fov: 50, // Wider field of view to better see the text
          near: 0.1,
          far: 1000,
        }}
      >
        <Suspense fallback={null}>
          <TextResponse />
        </Suspense>
      </Canvas>

      {/* Separate Canvas for Car models */}
      <Canvas
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '75vw',
          height: '100vh',
          pointerEvents: 'auto'
        }}
        camera={{
          position: [-3, 1, 8],
          fov: 50
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={2} castShadow />
          <group rotation={[0, -Math.PI / 2, 0]} position={[-5, 0, 0]}>
            {/* Only show car model if available for the current segment */}
            {selectedSegment && CAR_MODELS[selectedSegment] && CAR_MODELS[selectedSegment].length > 0 && (
              <RotatingCar />
            )}
            {/* Always show the Arc model regardless of segment */}
            <RotatingArc />
          </group>
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            target={[0, -1, -3]} 
            makeDefault
          />
        </Suspense>
      </Canvas>

      <Chatbot page={page} />
    </>
  );
}

export default App;
