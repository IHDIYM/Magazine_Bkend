import { shaderMaterial } from '@react-three/drei'
import { extend, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Create a shader material with glsl
const GlowMaterialImpl = shaderMaterial(
  {
    falloff: 0.1,
    glowInternalRadius: 6.0,
    glowColor: new THREE.Color('#00ff00'),
    glowSharpness: 1.0,
    opacity: 1.0,
    depthTest: false,
    side: THREE.FrontSide,
  },
  // Vertex shader
  `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // Fragment shader
  `
  uniform vec3 glowColor;
  uniform float falloff;
  uniform float glowInternalRadius;
  uniform float glowSharpness;
  uniform float opacity;
  
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  
  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = dot(viewDirection, vNormal);
    fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
    
    float glow = pow(fresnel, falloff * 10.0);
    float glowInternal = clamp(1.0 - abs(glowInternalRadius - glow), 0.0, 1.0);
    glowInternal = pow(glowInternal, glowSharpness);
    
    gl_FragColor = vec4(glowColor * glowInternal, opacity * glowInternal);
  }
  `
)

// Extend drei with our material to use it in JSX
extend({ GlowMaterialImpl })

export default function FakeGlowMaterial({ 
  falloff = 0.1, 
  glowInternalRadius = 6.0, 
  glowColor = "#00ff00", 
  glowSharpness = 1.0, 
  side = "THREE.FrontSide", 
  opacity = 1.0, 
  depthTest = false 
}) {
  const { gl } = useThree()
  
  // Convert side string to actual THREE constant
  const getSide = () => {
    switch(side) {
      case "THREE.BackSide": return THREE.BackSide
      case "THREE.DoubleSide": return THREE.DoubleSide
      default: return THREE.FrontSide
    }
  }
  
  return (
    <glowMaterialImpl 
      key={[falloff, glowInternalRadius, glowColor, glowSharpness, side, opacity, depthTest].join('-')}
      falloff={falloff}
      glowInternalRadius={glowInternalRadius}
      glowColor={new THREE.Color(glowColor)}
      glowSharpness={glowSharpness}
      side={getSide()}
      opacity={opacity}
      depthTest={depthTest}
      transparent
      blending={THREE.AdditiveBlending}
    />
  )
} 