import { useFrame } from "@react-three/fiber"
import { Image, ScrollControls, useScroll } from "@react-three/drei"
import { useRef } from "react"

import * as THREE from "three"
import { FadingImageDisplacement } from "./components/FadingImageDisplacement"
import { easing } from "maath"
import { useState } from "react"

function Rig(props) {
  const ref = useRef()
  const scroll = useScroll(
    useFrame((state, delta) => {
      ref.current.position.y = -scroll.offset * (Math.PI * 2) // Rotate contents
      state.events.update() // Raycasts every frame rather than on pointer-move
      easing.damp3(
        state.camera.position,
        [-state.pointer.x * 2, state.pointer.y + 1.5, 10],
        0.3,
        delta
      ) // Move camera
      state.camera.lookAt(0, 0, 0) // Look at center
    })
  )
  return <group ref={ref} {...props} />
}

function ImageCarousel({ radius = 1.4, count = 2 }) {
  return Array.from({ length: count }, (_, i) => (
    <ImageCard
      key={i}
      url={`/image${Math.floor(i % 10) + 1}.webp`}
      position={[
        Math.sin((i / count) * Math.PI * 2) * radius,
        0,
        Math.cos((i / count) * Math.PI * 2) * radius,
      ]}
      rotation={[0, Math.PI + (i / count) * Math.PI * 2, 0]}
    />
  ))
}

function ImageCard({ url, ...props }) {
  const ref = useRef()
  const [hovered, hover] = useState(false)
  const pointerOver = (e) => (e.stopPropagation(), hover(true))
  const pointerOut = () => hover(false)
  useFrame((state, delta) => {
    easing.damp3(ref.current.scale, hovered ? 1.15 : 1, 0.1, delta)
    easing.damp(
      ref.current.material,
      "radius",
      hovered ? 0.25 : 0.1,
      0.2,
      delta
    )
    easing.damp(ref.current.material, "zoom", hovered ? 1 : 1.5, 0.2, delta)
  })
  return (
    <Image
      ref={ref}
      url={url}
      transparent
      side={THREE.DoubleSide}
      onPointerOver={pointerOver}
      onPointerOut={pointerOut}
      {...props}
    >
      <planeGeometry args={[12, 6, 2, 80, 80]} />
    </Image>
  )
}

export default function RiggedExperience() {
  return (
    <>
      <ScrollControls pages={2}>
        <FadingImageDisplacement />
        {/* <Rig>
          <ImageCarousel />
        </Rig> */}
      </ScrollControls>
    </>
  )
}
