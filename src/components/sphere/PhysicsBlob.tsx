"use client";

import { useRef, useCallback, useEffect } from "react";
import { useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import FluidMaterial, { FluidMaterialImpl } from "./FluidMaterial";

/* -------------------------------------------------------------------------- */
/*  Material presets (for main blob cycling)                                  */
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
  { color: new THREE.Color("#b8bcc0"), emissive: new THREE.Color("#000000"), metalness: 0.95, roughness: 0.35, distort: 0.25, emissiveIntensity: 0 },
  { color: new THREE.Color("#1a1a1a"), emissive: new THREE.Color("#050508"), metalness: 0.6, roughness: 0.45, distort: 0.35, emissiveIntensity: 0.1 },
  { color: new THREE.Color("#cde0f0"), emissive: new THREE.Color("#1a2a3a"), metalness: 0.1, roughness: 0.15, distort: 0.2, emissiveIntensity: 0.15 },
  { color: new THREE.Color("#ff6a00"), emissive: new THREE.Color("#ff4400"), metalness: 0.85, roughness: 0.25, distort: 0.4, emissiveIntensity: 1.2 },
];

const TRANSITION_DURATION = 4;
const MIN_SPLIT_RADIUS = 0.15;
const SPLIT_THRESHOLD = 2.5; // pullStrength * displacement > radius * this → split

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
  radius: number;
  isMain: boolean;
}

interface PhysicsBlobProps {
  blob: BlobData;
  cursorWorldRef: React.MutableRefObject<THREE.Vector3>;
  onSplit: (id: string, cursorX: number, cursorY: number) => void;
  onReassemble: () => void;
  sharedMaterialRef: React.MutableRefObject<{
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
  cursorWorldRef,
  onSplit,
  onReassemble,
  sharedMaterialRef,
}: PhysicsBlobProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<FluidMaterialImpl>(null);
  const { viewport } = useThree();

  // Physics state
  const pos = useRef(new THREE.Vector3(blob.x, blob.y, 0));
  const pullStr = useRef(0);
  const distortBoost = useRef(0); // wobble spike on snap-back
  const isGrabbed = useRef(false);
  const dragMoved = useRef(false);

  // Sync on new blob id
  const blobId = useRef(blob.id);
  useEffect(() => {
    if (blob.id !== blobId.current) {
      blobId.current = blob.id;
      pos.current.set(blob.x, blob.y, 0);
      pullStr.current = 0;
      distortBoost.current = 0.3; // wobble on spawn
    }
  }, [blob.id, blob.x, blob.y]);

  // Temp vector (avoid allocations)
  const _cursorLocal = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const mat = matRef.current;
    if (!mesh || !mat) return;

    const elapsed = state.clock.getElapsedTime();
    const r = blob.radius;

    // --- Idle drift (sinusoidal, no gravity) ---
    const blobSeed = blob.id.charCodeAt(blob.id.length - 1) * 0.1;
    if (!isGrabbed.current) {
      pos.current.x += Math.sin(elapsed * 0.3 + blobSeed) * 0.001;
      pos.current.y += Math.cos(elapsed * 0.2 + blobSeed * 1.7) * 0.001;

      // Soft boundary — gently push back if drifting off screen
      const halfW = viewport.width / 2 - r;
      const halfH = viewport.height / 2 - r;
      if (pos.current.x > halfW) pos.current.x -= 0.01;
      if (pos.current.x < -halfW) pos.current.x += 0.01;
      if (pos.current.y > halfH) pos.current.y -= 0.01;
      if (pos.current.y < -halfH) pos.current.y += 0.01;
    }

    mesh.position.copy(pos.current);

    // --- Cursor interaction (proximity-based stretch) ---
    const cursor = cursorWorldRef.current;
    const dx = cursor.x - pos.current.x;
    const dy = cursor.y - pos.current.y;
    const distToCursor = Math.sqrt(dx * dx + dy * dy);
    const interactionRadius = r * 3;

    // Pull strength target
    let pullTarget = 0;
    if (isGrabbed.current) {
      // Grabbed — strong pull, follows cursor
      pullTarget = Math.min(distToCursor * 0.8, r * 3);
      // Move blob slightly toward cursor while grabbed
      pos.current.x += dx * 0.02;
      pos.current.y += dy * 0.02;
    } else if (distToCursor < interactionRadius) {
      // Proximity — gentle stretch
      const proximity = 1 - distToCursor / interactionRadius;
      pullTarget = proximity * r * 0.8;
    }

    // Ramp pull strength (viscous — slow up, slower down)
    const rampUp = isGrabbed.current ? 0.08 : 0.04;
    const rampDown = 0.03; // viscous return
    if (pullTarget > pullStr.current) {
      pullStr.current = lerpScalar(pullStr.current, pullTarget, rampUp);
    } else {
      pullStr.current = lerpScalar(pullStr.current, pullTarget, rampDown);
    }

    // Update material pull uniforms
    // Transform cursor to local space
    _cursorLocal.current.set(cursor.x, cursor.y, 0);
    mesh.worldToLocal(_cursorLocal.current);
    mat.localPullPoint = _cursorLocal.current;
    mat.pullStrength = pullStr.current;
    mat.pullRadius = r * 0.5;

    // --- Split detection ---
    if (pullStr.current > r * SPLIT_THRESHOLD && r > MIN_SPLIT_RADIUS) {
      onSplit(blob.id, cursor.x, cursor.y);
      pullStr.current = 0;
      distortBoost.current = 0.4; // wobble snap-back
      return;
    }

    // --- Distort wobble (base + boost that decays) ---
    distortBoost.current = Math.max(0, distortBoost.current - delta * 0.5);
    const baseDistort = blob.isMain ? 0.25 : 0.2;
    mat.distort = baseDistort + distortBoost.current;

    // --- Material color cycling ---
    if (blob.isMain) {
      const totalCycle = PRESETS.length * TRANSITION_DURATION;
      const phase = (elapsed % totalCycle) / TRANSITION_DURATION;
      const currentIdx = Math.floor(phase) % PRESETS.length;
      const nextIdx = (currentIdx + 1) % PRESETS.length;
      const rawT = phase - currentIdx;
      const t = rawT * rawT * (3 - 2 * rawT);

      const curr = PRESETS[currentIdx];
      const next = PRESETS[nextIdx];

      mat.color.copy(curr.color).lerp(next.color, t);
      mat.emissive.copy(curr.emissive).lerp(next.emissive, t);
      mat.metalness = lerpScalar(curr.metalness, next.metalness, t);
      mat.roughness = lerpScalar(curr.roughness, next.roughness, t);
      mat.emissiveIntensity = lerpScalar(curr.emissiveIntensity, next.emissiveIntensity, t);

      // Update shared ref for fragments
      sharedMaterialRef.current.color.copy(mat.color);
      sharedMaterialRef.current.emissive.copy(mat.emissive);
      sharedMaterialRef.current.metalness = mat.metalness;
      sharedMaterialRef.current.roughness = mat.roughness;
      sharedMaterialRef.current.emissiveIntensity = mat.emissiveIntensity;
    } else {
      // Fragment — read shared color
      const shared = sharedMaterialRef.current;
      mat.color.copy(shared.color);
      mat.emissive.copy(shared.emissive);
      mat.metalness = shared.metalness;
      mat.roughness = shared.roughness;
      mat.emissiveIntensity = shared.emissiveIntensity;
    }
  });

  // --- Event handlers ---
  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    isGrabbed.current = true;
    dragMoved.current = false;
    document.body.style.cursor = "grabbing";
  }, []);

  const handlePointerUp = useCallback(() => {
    if (isGrabbed.current) {
      isGrabbed.current = false;
      // Snap-back wobble
      distortBoost.current = Math.min(0.3, pullStr.current * 0.2);
      document.body.style.cursor = "default";
    }
  }, []);

  useEffect(() => {
    window.addEventListener("pointerup", handlePointerUp);
    return () => window.removeEventListener("pointerup", handlePointerUp);
  }, [handlePointerUp]);

  const handleDoubleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onReassemble();
  }, [onReassemble]);

  const handlePointerEnter = useCallback(() => {
    if (!isGrabbed.current) document.body.style.cursor = "grab";
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (!isGrabbed.current) document.body.style.cursor = "default";
  }, []);

  return (
    <mesh
      ref={meshRef}
      onPointerDown={handlePointerDown}
      onDoubleClick={handleDoubleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <sphereGeometry args={[blob.radius, 48, 48]} />
      <FluidMaterial
        ref={matRef}
        speed={1.2}
        distort={0.25}
        radius={1}
        color="#b8bcc0"
        metalness={0.95}
        roughness={0.35}
        emissiveIntensity={0}
        toneMapped={true}
      />
    </mesh>
  );
}
