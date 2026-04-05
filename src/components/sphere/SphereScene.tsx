"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import PlaygroundScene from "./PlaygroundScene";

/* -------------------------------------------------------------------------- */
/*  Pre-computed particle positions (module level for purity)                 */
/* -------------------------------------------------------------------------- */

const PARTICLE_COUNT = 50;
const PARTICLE_POSITIONS = (() => {
  const pos = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 3 + Math.random() * 5;
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
  }
  return pos;
})();

/* -------------------------------------------------------------------------- */
/*  Particles (lightweight)                                                   */
/* -------------------------------------------------------------------------- */

function Particles() {
  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.015;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[PARTICLE_POSITIONS, 3]}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.012}
        color="#444444"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

/* -------------------------------------------------------------------------- */
/*  Scene — lightweight, no bloom, no HDR environment                         */
/* -------------------------------------------------------------------------- */

export default function SphereScene() {
  return (
    <>
      {/* Simple lighting — no expensive Environment map */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight
        position={[-3, -2, -4]}
        intensity={0.3}
        color="#8899bb"
      />
      <pointLight position={[0, 3, 4]} intensity={0.4} color="#aaccff" />
      {/* Fill light from below for a bit of rim */}
      <pointLight position={[0, -4, 2]} intensity={0.15} color="#ff6a00" />

      {/* Physics playground */}
      <PlaygroundScene />

      {/* Background particles */}
      <Particles />
    </>
  );
}
