import { Environment, Float, OrbitControls } from "@react-three/drei";
import { Book } from "./Book";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";

export const Experience = () => {
  const { gl, camera } = useThree();
  const controlsRef = useRef();
  
  // Configure controls for easy dragging
  useEffect(() => {
    if (controlsRef.current) {
      // Make dragging easier by removing the shift key requirement
      controlsRef.current.enableDamping = true;
      controlsRef.current.dampingFactor = 0.1;
      controlsRef.current.rotateSpeed = 0.8;
      controlsRef.current.zoomSpeed = 0.8;
      
      // Set reasonable limits to prevent extreme rotations
      controlsRef.current.minPolarAngle = Math.PI / 6; // Limit how high user can orbit
      controlsRef.current.maxPolarAngle = Math.PI / 1.5; // Limit how low user can orbit
      
      // Set camera bounds to keep book in view
      controlsRef.current.minDistance = 2; // Don't allow zooming too close
      controlsRef.current.maxDistance = 10; // Don't allow zooming too far
    }
  }, []);
  
  return (
    <>
      <Float
        floatIntensity={1.5}
        speed={0.4}
        rotationIntensity={0.2}
      >
        <Book 
           
          
           
        />
      </Float>

      <OrbitControls 
        ref={controlsRef}
        makeDefault
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
      />
      
      <Environment preset="studio" />
      <directionalLight
        position={[2, 5, 2]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      <mesh position-y={-1.5} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>
    </>
  );
};
