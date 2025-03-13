import { useFrame, useThree } from "@react-three/fiber"
import "../App.css"
import { FadingImageDisplacement } from "./FadingImageDisplacement"
import {
  Scroll,
  ScrollControls,
  useScroll,
  Image as ImageImpl,
} from "@react-three/drei"
import { useRef } from "react"
import * as THREE from "three"

function Image(props) {
  const ref = useRef()
  const group = useRef()
  const data = useScroll()
  useFrame((state, delta) => {
    group.current.position.z = THREE.MathUtils.damp(
      group.current.position.z,
      Math.max(0, data.delta * 50),
      4,
      delta
    )
    ref.current.material.grayscale = THREE.MathUtils.damp(
      ref.current.material.grayscale,
      Math.max(0, 1 - data.delta * 1000),
      4,
      delta
    )
  })
  return (
    <group ref={group}>
      <ImageImpl ref={ref} {...props} />
    </group>
  )
}

function Project(props) {
  return (
    <group {...props}>
      <Image position={[0, 0, 0]} url={props.url} />
    </group>
  )
}

function Projects() {
  const { height } = useThree((state) => state.viewport)
  return (
    <>
      <Project position={[0, -height * 1, 0]} url="/image1.webp" />
      <Project position={[0, height * 0, 0]} url="/image2.webp" />
    </>
  )
}

export default function BlackholeProjectsExperience() {
  return (
    <>
      <ScrollControls pages={2} damping={4} distance={1}>
        <Scroll>
          <Projects />
        </Scroll>
      </ScrollControls>
    </>
  )
}
