"use client";

import { useRef, useMemo, useCallback, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

/* -------------------------------------------------------------------------- */
/*  Material presets – each tuple describes a "look"                          */
/* -------------------------------------------------------------------------- */

interface MaterialPreset {
  color: THREE.Color;
  emissive: THREE.Color;
  metalness: number;
  roughness: number;
  distort: number;
  emissiveIntensity: number;
}

const PRESETS: MaterialPreset[] = [
  {
    // Brushed titanium
    color: new THREE.Color("#b8bcc0"),
    emissive: new THREE.Color("#000000"),
    metalness: 0.95,
    roughness: 0.35,
    distort: 0.25,
    emissiveIntensity: 0,
  },
  {
    // Carbon fiber
    color: new THREE.Color("#1a1a1a"),
    emissive: new THREE.Color("#050508"),
    metalness: 0.6,
    roughness: 0.45,
    distort: 0.35,
    emissiveIntensity: 0.1,
  },
  {
    // Frosted glass
    color: new THREE.Color("#cde0f0"),
    emissive: new THREE.Color("#1a2a3a"),
    metalness: 0.1,
    roughness: 0.15,
    distort: 0.2,
    emissiveIntensity: 0.15,
  },
  {
    // Molten / warm metal
    color: new THREE.Color("#ff6a00"),
    emissive: new THREE.Color("#ff4400"),
    metalness: 0.85,
    roughness: 0.25,
    distort: 0.4,
    emissiveIntensity: 1.2,
  },
];

const TRANSITION_DURATION = 4; // seconds per material phase

/* -------------------------------------------------------------------------- */
/*  Lerp helpers                                                              */
/* -------------------------------------------------------------------------- */

function lerpScalar(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/* -------------------------------------------------------------------------- */
/*  Inner sphere mesh                                                         */
/* -------------------------------------------------------------------------- */

function Sphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialRef = useRef<any>(null);
  const { viewport } = useThree();

  // Mouse tracking
  const mouse = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });

  const handlePointerMove = useCallback(
    (e: { clientX: number; clientY: number }) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    },
    []
  );

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [handlePointerMove]);

  // Interpolated values ref so we avoid allocations every frame
  const interp = useRef({
    color: new THREE.Color(),
    emissive: new THREE.Color(),
    metalness: 0,
    roughness: 0,
    distort: 0,
    emissiveIntensity: 0,
  });

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();
    const totalCycle = PRESETS.length * TRANSITION_DURATION;
    const phase = (elapsed % totalCycle) / TRANSITION_DURATION;
    const currentIdx = Math.floor(phase) % PRESETS.length;
    const nextIdx = (currentIdx + 1) % PRESETS.length;
    // Smooth-step easing for buttery transitions
    const rawT = phase - currentIdx;
    const t = rawT * rawT * (3 - 2 * rawT);

    const curr = PRESETS[currentIdx];
    const next = PRESETS[nextIdx];

    const iv = interp.current;
    iv.color.copy(curr.color).lerp(next.color, t);
    iv.emissive.copy(curr.emissive).lerp(next.emissive, t);
    iv.metalness = lerpScalar(curr.metalness, next.metalness, t);
    iv.roughness = lerpScalar(curr.roughness, next.roughness, t);
    iv.distort = lerpScalar(curr.distort, next.distort, t);
    iv.emissiveIntensity = lerpScalar(curr.emissiveIntensity, next.emissiveIntensity, t);

    // Apply to material
    const mat = materialRef.current as any;
    if (mat) {
      mat.color.copy(iv.color);
      mat.emissive.copy(iv.emissive);
      mat.metalness = iv.metalness;
      mat.roughness = iv.roughness;
      mat.distort = iv.distort;
      mat.emissiveIntensity = iv.emissiveIntensity;
    }

    // Auto-rotation + mouse influence
    if (meshRef.current) {
      targetRotation.current.x = mouse.current.y * 0.3;
      targetRotation.current.y = mouse.current.x * 0.3;

      meshRef.current.rotation.x +=
        (targetRotation.current.x - meshRef.current.rotation.x) * 0.05;
      meshRef.current.rotation.y +=
        (targetRotation.current.y +
          elapsed * 0.15 -
          meshRef.current.rotation.y) *
        0.05;
    }
  });

  // Responsive radius
  const radius = Math.min(viewport.width, viewport.height) * 0.28;

  return (
    <mesh ref={meshRef} scale={[1, 1, 1]}>
      <sphereGeometry args={[radius, 128, 128]} />
      <MeshDistortMaterial
        ref={materialRef}
        color={PRESETS[0].color}
        emissive={PRESETS[0].emissive}
        metalness={PRESETS[0].metalness}
        roughness={PRESETS[0].roughness}
        emissiveIntensity={PRESETS[0].emissiveIntensity}
        distort={PRESETS[0].distort}
        speed={1.8}
        envMapIntensity={1.5}
        toneMapped={true}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/*  Subtle floating particles for depth                                       */
/* -------------------------------------------------------------------------- */

function Particles({ count = 80 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 4;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

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
          args={[positions, 3]}
          count={count}
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

function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        color="#ffffff"
      />
      <directionalLight
        position={[-3, -2, -4]}
        intensity={0.3}
        color="#8899bb"
      />
      <pointLight position={[0, 3, 4]} intensity={0.4} color="#aaccff" />

      {/* Environment reflections */}
      <Environment preset="city" />

      {/* Main sphere */}
      <Sphere />

      {/* Background particles */}
      <Particles />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Exported component                                                        */
/* -------------------------------------------------------------------------- */

export default function MaterialSphere() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          minHeight: "100vh",
          background: "#0A0A0A",
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        background: "#0A0A0A",
        position: "relative",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        style={{ background: "#0A0A0A" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
