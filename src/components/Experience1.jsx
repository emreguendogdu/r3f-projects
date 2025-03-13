"use client"
import { useFrame } from "@react-three/fiber"
import { useState, useRef, useMemo, useEffect } from "react"
import { MathUtils } from "three"

const vertexShader = /*glsl*/ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
  }
  `

const fragmentShader = /*glsl*/ `
  uniform float uHoverStrength;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
  vec2 uv = vUv;
  vec2 center = vec2(0.5);
  vec2 pixelSize = vec2(0.25);
  float distanceToCenter = length(uv - center);
  float distanceToEdge = 1.0 - length(uv - center) * 1.35; // Inverted distance

  float hoverStrength = smoothstep(0.0, 1.0, uHoverStrength);

  // vec2 distortedUv = mix(uv, center, hoverStrength);
  vec2 quantizedUv = floor(uv / pixelSize) * pixelSize;

  // float fade = step(0.05, length(quantizedUv - center) * (1.0 - hoverStrength));
  // float fade = smoothstep(0.0, 1.0, distanceToEdge * (1.0 - hoverStrength));

  float fade = step(0.05, distanceToEdge * (1.0 - hoverStrength));

  fade = mix(1.0, fade, hoverStrength);
  
  
  gl_FragColor = vec4(vec3(fade), 1.0);
  }
`

export default function Experience1() {
  const ref = useRef()
  const hoverStrength = useRef({ value: 0 }) // Using ref for smooth updates

  const [hovered, setHovered] = useState(false)

  const pointerOver = () => setHovered(true)
  const pointerOut = () => setHovered(false)

  const uniforms = useMemo(
    () => ({
      uHoverStrength: { value: 0.0 },
      uTime: { value: 0.0 },
    }),
    []
  )

  useEffect(() => {
    let interval
    if (hovered) {
      interval = setInterval(() => {
        hoverStrength.current.value = Math.min(
          1.0,
          hoverStrength.current.value + 0.0125
        )
      }, 32) // Smooth increase
    } else {
      interval = setInterval(() => {
        hoverStrength.current.value = Math.max(
          0.0,
          hoverStrength.current.value - 0.0125
        )
      }, 32) // Smooth decrease
    }
    return () => clearInterval(interval)
  }, [hovered])

  // Update uniforms in each frame
  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime()
    uniforms.uHoverStrength.value = hoverStrength.current.value
  })

  return (
    <>
      <mesh onPointerOver={pointerOver} onPointerOut={pointerOut} ref={ref}>
        <planeGeometry args={[2, 2, 2, 40, 40]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>
    </>
  )
}
