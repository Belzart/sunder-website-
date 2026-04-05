"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import InteractiveSphere, { type SphereState } from "./InteractiveSphere";
import SphereFragments from "./SphereFragments";

/* -------------------------------------------------------------------------- */
/*  Pre-computed particle positions (module level for purity)                 */
/* -------------------------------------------------------------------------- */

const PARTICLE_COUNT = 80;
const PARTICLE_POSITIONS = (() => {
  const pos = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 3 + Math.random() * 4;
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
  }
  return pos;
})();

/* -------------------------------------------------------------------------- */
/*  Particles                                                                 */
/* -------------------------------------------------------------------------- */

function Particles() {
  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.02;
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.01;
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
        size={0.015}
        color="#444444"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

/* -------------------------------------------------------------------------- */
/*  Scene                                                                     */
/* -------------------------------------------------------------------------- */

export default function SphereScene() {
  const { viewport } = useThree();
  const sphereRadius = Math.min(viewport.width, viewport.height) * 0.28;

  // Shared state ref — no React re-renders for animation
  const stateRef = useRef<SphereState>({
    mode: "idle",
    velocity: new THREE.Vector2(0, 0),
    position: new THREE.Vector2(0, 0),
    targetScale: 1,
    currentScale: 1,
    hovered: false,
    hoverIntensity: 0,
  });

  // Listen for scroll-to-scale events from container
  useEffect(() => {
    const handleScale = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      stateRef.current.targetScale = detail;
    };
    window.addEventListener("sphere-scale", handleScale);
    return () => window.removeEventListener("sphere-scale", handleScale);
  }, []);

  const handleExplode = useCallback(() => {
    stateRef.current.mode = "exploded";
  }, []);

  const handleReassembled = useCallback(() => {
    stateRef.current.mode = "idle";
  }, []);

  // Visibility state — triggers re-render when mode changes
  const [vis, setVis] = useState({ sphere: true, frags: false });
  const lastMode = useRef("idle");

  useFrame(() => {
    const mode = stateRef.current.mode;
    if (mode !== lastMode.current) {
      lastMode.current = mode;
      const sphere = mode !== "exploded" && mode !== "reassembling";
      const frags = mode === "exploded" || mode === "reassembling";
      setVis({ sphere, frags });
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight
        position={[-3, -2, -4]}
        intensity={0.3}
        color="#8899bb"
      />
      <pointLight position={[0, 3, 4]} intensity={0.4} color="#aaccff" />

      {/* Environment reflections */}
      <Environment preset="city" />

      {/* Main interactive sphere */}
      <InteractiveSphere
        stateRef={stateRef}
        onExplode={handleExplode}
        visible={vis.sphere}
      />

      {/* Shatter fragments */}
      <SphereFragments
        stateRef={stateRef}
        visible={vis.frags}
        onReassembled={handleReassembled}
        sphereRadius={sphereRadius}
      />

      {/* Background particles */}
      <Particles />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          intensity={0.5}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}
