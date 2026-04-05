"use client";

import { useRef, useCallback, useEffect } from "react";
import { useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

/* -------------------------------------------------------------------------- */
/*  Material presets                                                          */
/* -------------------------------------------------------------------------- */

interface MaterialPreset {
  color: THREE.Color;
  emissive: THREE.Color;
  metalness: number;
  roughness: number;
  distort: number;
  emissiveIntensity: number;
}

export const PRESETS: MaterialPreset[] = [
  {
    color: new THREE.Color("#b8bcc0"),
    emissive: new THREE.Color("#000000"),
    metalness: 0.95,
    roughness: 0.35,
    distort: 0.25,
    emissiveIntensity: 0,
  },
  {
    color: new THREE.Color("#1a1a1a"),
    emissive: new THREE.Color("#050508"),
    metalness: 0.6,
    roughness: 0.45,
    distort: 0.35,
    emissiveIntensity: 0.1,
  },
  {
    color: new THREE.Color("#cde0f0"),
    emissive: new THREE.Color("#1a2a3a"),
    metalness: 0.1,
    roughness: 0.15,
    distort: 0.2,
    emissiveIntensity: 0.15,
  },
  {
    color: new THREE.Color("#ff6a00"),
    emissive: new THREE.Color("#ff4400"),
    metalness: 0.85,
    roughness: 0.25,
    distort: 0.4,
    emissiveIntensity: 1.2,
  },
];

const TRANSITION_DURATION = 4;
const GRAVITY = -9.8;
const BOUNCE = 0.6;
const REST_THRESHOLD = 0.05;
const MIN_SPLIT_RADIUS = 0.15;

function lerpScalar(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/* -------------------------------------------------------------------------- */
/*  Props                                                                     */
/* -------------------------------------------------------------------------- */

export interface BlobData {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isMain: boolean;
}

interface PhysicsBlobProps {
  blob: BlobData;
  onSplit: (id: string) => void;
  onReassemble: () => void;
  materialRef: React.MutableRefObject<{
    color: THREE.Color;
    emissive: THREE.Color;
    metalness: number;
    roughness: number;
    emissiveIntensity: number;
  }>;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function PhysicsBlob({
  blob,
  onSplit,
  onReassemble,
  materialRef,
}: PhysicsBlobProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matRef = useRef<any>(null);
  const { viewport, size } = useThree();

  // Physics state in refs for perf
  const pos = useRef({ x: blob.x, y: blob.y });
  const vel = useRef({ x: blob.vx, y: blob.vy });
  const rot = useRef({ x: 0, y: 0 });
  const hovered = useRef(false);
  const hoverIntensity = useRef(0);

  // Drag state
  const isDragging = useRef(false);
  const dragMoved = useRef(false);
  const lastDragPos = useRef({ x: 0, y: 0 });
  const dragVel = useRef({ x: 0, y: 0 });

  // Sync when blob data changes (e.g. after split creates new blob)
  const blobId = useRef(blob.id);
  useEffect(() => {
    if (blob.id !== blobId.current) {
      blobId.current = blob.id;
      pos.current = { x: blob.x, y: blob.y };
      vel.current = { x: blob.vx, y: blob.vy };
    }
  }, [blob.id, blob.x, blob.y, blob.vx, blob.vy]);

  // Global pointer handlers for drag
  const handleGlobalMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging.current) return;

      const worldX = ((e.clientX / size.width) * 2 - 1) * (viewport.width / 2);
      const worldY = (-(e.clientY / size.height) * 2 + 1) * (viewport.height / 2);

      const dx = worldX - lastDragPos.current.x;
      const dy = worldY - lastDragPos.current.y;

      if (Math.abs(dx) > 0.02 || Math.abs(dy) > 0.02) {
        dragMoved.current = true;
      }

      // Track velocity from drag movement
      dragVel.current = { x: dx * 60, y: dy * 60 };
      lastDragPos.current = { x: worldX, y: worldY };

      pos.current.x = worldX;
      pos.current.y = worldY;
    },
    [viewport, size]
  );

  const handleGlobalUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    document.body.style.cursor = hovered.current ? "grab" : "default";

    // Transfer drag velocity
    vel.current = { x: dragVel.current.x, y: dragVel.current.y };
  }, []);

  useEffect(() => {
    window.addEventListener("pointermove", handleGlobalMove);
    window.addEventListener("pointerup", handleGlobalUp);
    return () => {
      window.removeEventListener("pointermove", handleGlobalMove);
      window.removeEventListener("pointerup", handleGlobalUp);
    };
  }, [handleGlobalMove, handleGlobalUp]);

  // Material interpolation (for main blob only, but we keep it cheap for fragments)
  const interp = useRef({
    color: new THREE.Color(),
    emissive: new THREE.Color(),
  });

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const r = blob.radius;

    // --- Physics (skip while dragging) ---
    if (!isDragging.current) {
      // Gravity
      vel.current.y += GRAVITY * delta;

      // Move
      pos.current.x += vel.current.x * delta;
      pos.current.y += vel.current.y * delta;

      // Bounce off edges
      const halfW = viewport.width / 2 - r;
      const halfH = viewport.height / 2 - r;

      if (pos.current.y < -halfH) {
        pos.current.y = -halfH;
        vel.current.y *= -BOUNCE;
        vel.current.x *= 0.98; // friction
        // Rest threshold
        if (Math.abs(vel.current.y) < REST_THRESHOLD) vel.current.y = 0;
        if (Math.abs(vel.current.x) < REST_THRESHOLD * 0.5) vel.current.x = 0;
      }
      if (pos.current.y > halfH) {
        pos.current.y = halfH;
        vel.current.y *= -BOUNCE;
      }
      if (pos.current.x < -halfW) {
        pos.current.x = -halfW;
        vel.current.x *= -BOUNCE;
      }
      if (pos.current.x > halfW) {
        pos.current.x = halfW;
        vel.current.x *= -BOUNCE;
      }
    }

    // Position mesh
    meshRef.current.position.x = pos.current.x;
    meshRef.current.position.y = pos.current.y;

    // Rotation from velocity
    const speed = Math.sqrt(vel.current.x ** 2 + vel.current.y ** 2);
    if (speed > 0.1) {
      rot.current.x += vel.current.y * delta * 0.5;
      rot.current.y += vel.current.x * delta * 0.5;
    }
    meshRef.current.rotation.x = rot.current.x;
    meshRef.current.rotation.y = rot.current.y;

    // --- Material ---
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mat = matRef.current as any;
    if (!mat) return;

    // Hover intensity
    const hTarget = hovered.current ? 1 : 0;
    hoverIntensity.current = lerpScalar(hoverIntensity.current, hTarget, 0.1);

    if (blob.isMain) {
      // Main blob: full material cycling
      const elapsed = state.clock.getElapsedTime();
      const totalCycle = PRESETS.length * TRANSITION_DURATION;
      const phase = (elapsed % totalCycle) / TRANSITION_DURATION;
      const currentIdx = Math.floor(phase) % PRESETS.length;
      const nextIdx = (currentIdx + 1) % PRESETS.length;
      const rawT = phase - currentIdx;
      const t = rawT * rawT * (3 - 2 * rawT);

      const curr = PRESETS[currentIdx];
      const next = PRESETS[nextIdx];

      interp.current.color.copy(curr.color).lerp(next.color, t);
      interp.current.emissive.copy(curr.emissive).lerp(next.emissive, t);
      const metalness = lerpScalar(curr.metalness, next.metalness, t);
      const roughness = lerpScalar(curr.roughness, next.roughness, t);
      const emissiveI = lerpScalar(curr.emissiveIntensity, next.emissiveIntensity, t);
      const distort = lerpScalar(curr.distort, next.distort, t);

      mat.color.copy(interp.current.color);
      mat.emissive.copy(interp.current.emissive);
      mat.metalness = metalness;
      mat.roughness = roughness;
      mat.emissiveIntensity = emissiveI + hoverIntensity.current * 0.3;
      mat.distort = distort + hoverIntensity.current * 0.1;

      // Update shared material ref for fragments
      materialRef.current.color.copy(interp.current.color);
      materialRef.current.emissive.copy(interp.current.emissive);
      materialRef.current.metalness = metalness;
      materialRef.current.roughness = roughness;
      materialRef.current.emissiveIntensity = emissiveI;
    } else {
      // Fragment: use shared material values
      const shared = materialRef.current;
      mat.color.copy(shared.color);
      mat.emissive.copy(shared.emissive);
      mat.metalness = shared.metalness;
      mat.roughness = shared.roughness;
      mat.emissiveIntensity = shared.emissiveIntensity + hoverIntensity.current * 0.3;
    }
  });

  // --- Event handlers ---
  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      isDragging.current = true;
      dragMoved.current = false;

      const worldX = ((e.nativeEvent.clientX / size.width) * 2 - 1) * (viewport.width / 2);
      const worldY = (-(e.nativeEvent.clientY / size.height) * 2 + 1) * (viewport.height / 2);

      lastDragPos.current = { x: worldX, y: worldY };
      dragVel.current = { x: 0, y: 0 };
      vel.current = { x: 0, y: 0 };
      document.body.style.cursor = "grabbing";
    },
    [viewport, size]
  );

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      if (!dragMoved.current) {
        if (blob.radius > MIN_SPLIT_RADIUS) {
          onSplit(blob.id);
        } else {
          // Too small to split — bounce it up
          vel.current.y = 5;
          vel.current.x = (Math.random() - 0.5) * 3;
        }
      }
    },
    [blob.id, blob.radius, onSplit]
  );

  const handleDoubleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      onReassemble();
    },
    [onReassemble]
  );

  const handlePointerEnter = useCallback(() => {
    hovered.current = true;
    if (!isDragging.current) document.body.style.cursor = "grab";
  }, []);

  const handlePointerLeave = useCallback(() => {
    hovered.current = false;
    if (!isDragging.current) document.body.style.cursor = "default";
  }, []);

  // --- Render ---
  if (blob.isMain) {
    return (
      <mesh
        ref={meshRef}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <sphereGeometry args={[blob.radius, 48, 48]} />
        <MeshDistortMaterial
          ref={matRef}
          color={PRESETS[0].color}
          emissive={PRESETS[0].emissive}
          metalness={PRESETS[0].metalness}
          roughness={PRESETS[0].roughness}
          emissiveIntensity={PRESETS[0].emissiveIntensity}
          distort={PRESETS[0].distort}
          speed={1.2}
          envMapIntensity={0.8}
          toneMapped={true}
        />
      </mesh>
    );
  }

  return (
    <mesh
      ref={meshRef}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <icosahedronGeometry args={[blob.radius, 2]} />
      <meshStandardMaterial
        ref={matRef}
        color={PRESETS[0].color}
        emissive={PRESETS[0].emissive}
        metalness={0.8}
        roughness={0.3}
        emissiveIntensity={0}
        toneMapped={true}
      />
    </mesh>
  );
}
