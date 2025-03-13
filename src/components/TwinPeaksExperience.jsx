/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */

import * as THREE from "three"
import { useMemo } from "react"
import { useEffect } from "react"
import GUI from "lil-gui"

export default function TwinPeaksExperience() {
  const floorUniforms = useMemo(
    () => ({
      uTime: {
        value: 0.0,
      },
      uAmplitude: {
        value: 0.1,
      },
      uFrequency: {
        value: 16,
      },
      uStripeHeight: {
        value: 8,
      },
    }),
    []
  )

  const curtainUniforms = useMemo(
    () => ({
      uTime: {
        value: 0.0,
      },
      uAmplitude: {
        value: 0.1,
      },
      uFrequency: {
        value: 60,
      },
      uStripeHeight: {
        value: 0,
      },
    }),
    []
  )

  useEffect(() => {
    const gui = new GUI()
    gui.add(floorUniforms.uAmplitude, "value", 0, 0.25).name("Floor Amplitude")
    gui.add(floorUniforms.uFrequency, "value", 6, 20).name("Floor Frequency")
    gui
      .add(floorUniforms.uStripeHeight, "value", 1, 5)
      .name("Floor Stripe Height")

    gui
      .add(curtainUniforms.uAmplitude, "value", 0, 0.25)
      .name("Curtain Amplitude")
    gui
      .add(curtainUniforms.uFrequency, "value", 6, 200)
      .name("Curtain Frequency")
    gui
      .add(curtainUniforms.uStripeHeight, "value", 1, 200)
      .name("Curtain Stripe Height")

    return () => gui.destroy()
  }, [floorUniforms, curtainUniforms])
  return (
    <>
      <Floor uniforms={floorUniforms} />
      <Curtain uniforms={curtainUniforms} />
    </>
  )
}

function Floor({ uniforms }) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -2, 0]}
      side={THREE.DoubleSide}
    >
      <planeGeometry args={[40, 25]} />
      <shaderMaterial
        vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
        fragmentShader={`
            varying vec2 vUv;

            uniform float uAmplitude;
            uniform float uFrequency;
            uniform float uStripeHeight;

            void main() {
              vec2 uv = vUv;

                float zigzag = abs(fract(uv.y * uStripeHeight) - 0.5) * 2.0;

              float stripes = step(0.5, mod((uv.x + zigzag * uAmplitude) * uFrequency, 1.0));

              gl_FragColor = vec4(vec3(stripes), 1.0);
            }
          `}
        uniforms={uniforms}
      />
    </mesh>
  )
}

function Curtain({ uniforms }) {
  return (
    <mesh position={[0, 0, -2]}>
      <planeGeometry args={[16, 5]} />
      <shaderMaterial
        vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
        fragmentShader={`
            varying vec2 vUv;

            float random(float x) {
               return fract(sin(x) * 43758.5453123);
            }

            uniform float uAmplitude;
            uniform float uFrequency;
            uniform float uStripeHeight;

            void main() {
              vec2 uv = vUv;

              float wave = step(0.2, sin(uv.y * uStripeHeight) * uAmplitude);

              float stripe = smoothstep(0.3, 0.5, sin(uv.x * uFrequency + wave) + random(floor(uv.x * 25.0)));

              vec3 curtainColor = mix(vec3(0.6, 0.0, 0.0), vec3(0.3, 0.0, 0.0), stripe);

              gl_FragColor = vec4(curtainColor, 1.0);
            }
          `}
        uniforms={uniforms}
      />
    </mesh>
  )
}
