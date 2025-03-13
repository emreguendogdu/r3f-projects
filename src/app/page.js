"use client"

import Experience1 from "@/components/Experience1"
import { Environment, OrbitControls, ScrollControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"

export default function Home() {
  return (
    <div id="canvas-container" className="absolute inset-0 w-full h-screen">
      <Canvas>
        <OrbitControls />
        <ambientLight intensity={0.25} />
        <Experience1 />
        <Environment preset="studio" />
      </Canvas>
    </div>
  )
}
