/* eslint-disable react/no-unknown-property */
import { shaderMaterial, useTexture, useScroll } from "@react-three/drei"
import { extend, useFrame } from "@react-three/fiber"
import { easing, geometry } from "maath"
import { useState } from "react"
import { useEffect } from "react"
import { useRef } from "react"

export const ImageFadeMaterialDisplacement = shaderMaterial(
  {
    effectFactor: 1.2,
    dispFactor: 0,
    tex: undefined,
    tex2: undefined,
    disp: undefined,
  },
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,
  /* glsl */ `
    varying vec2 vUv;
    uniform sampler2D tex;
    uniform sampler2D tex2;
    uniform sampler2D disp;
    uniform float _rot;
    uniform float dispFactor;
    uniform float effectFactor;
    void main() {
      vec2 uv = vUv;
      vec4 disp = texture2D(disp, uv);
      
      vec2 distortedPosition = vec2(uv.x + dispFactor * (disp.r * effectFactor), uv.y);
      vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * (disp.r * effectFactor), uv.y);
      vec4 _texture = texture2D(tex, distortedPosition);
      vec4 _texture2 = texture2D(tex2, distortedPosition2);
      vec4 finalTexture = mix(_texture, _texture2, dispFactor);
      gl_FragColor = finalTexture;
    }`
)

extend({  
  ImageFadeMaterialDisplacement,
  RoundedPlaneGeometry: geometry.RoundedPlaneGeometry,
})

export const FadingImageDisplacement = (props) => {
  const ref = useRef()
  const scroll = useScroll() // Get normalized scroll position (0 to 1)
  const [secondImage, setSecondImage] = useState(false)
  const [hovered, setHover] = useState(false)

  useEffect(() => {
    if (hovered) {
      setSecondImage(true)
    } else {
      setSecondImage(false)
    }
  }, [hovered])

  const [texture1, texture2, dispTexture] = useTexture([
    "/image1.webp",
    "/image2.webp",
    "/displacement1.jpg",
  ])

  useFrame((_state, delta) => {
    easing.damp(ref.current, "dispFactor", hovered ? 1 : 0, 0.4, delta)
    // Smoothly animate dispFactor based on scroll position
  })

  return (
    <mesh
      {...props}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <roundedPlaneGeometry args={[8, 5]} />
      <imageFadeMaterialDisplacement
        ref={ref}
        tex={texture1}
        tex2={texture2}
        disp={dispTexture}
        toneMapped={false}
      />
    </mesh>
  )
}
