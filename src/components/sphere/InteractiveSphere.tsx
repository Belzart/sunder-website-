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

function lerpScalar(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/* -------------------------------------------------------------------------- */
/*  State types                                                               */
/* -------------------------------------------------------------------------- */

export type SphereMode = "idle" | "dragging" | "thrown" | "exploded" | "reassembling";

export interface SphereState {
  mode: SphereMode;
  velocity: THREE.Vector2;
  position: THREE.Vector2;
  targetScale: number;
  currentScale: number;
  hovered: boolean;
  hoverIntensity: number;
}

interface InteractiveSphereProps {
  stateRef: React.MutableRefObject<SphereState>;
  onExplode: () => void;
  visible: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function InteractiveSphere({
  stateRef,
  onExplode,
  visible,
}: InteractiveSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialRef = useRef<any>(null);
  const { viewport, size } = useThree();

  // Mouse tracking for idle rotation
  const mouse = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });

  // Drag state
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const isDragging = useRef(false);
  const dragMoved = useRef(false);

  const handleGlobalPointerMove = useCallback(
    (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (isDragging.current && stateRef.current.mode === "dragging") {
        const dx = (e.clientX - dragStart.current.x) * (viewport.width / size.width);
        const dy = -(e.clientY - dragStart.current.y) * (viewport.height / size.height);

        if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
          dragMoved.current = true;
        }

        stateRef.current.position.x = dragStart.current.posX + dx;
        stateRef.current.position.y = dragStart.current.posY + dy;

        // Track velocity (smoothed)
        stateRef.current.velocity.x = dx * 2;
        stateRef.current.velocity.y = dy * 2;
      }
    },
    [viewport, size, stateRef]
  );

  const handleGlobalPointerUp = useCallback(() => {
    if (isDragging.current) {
      isDragging.current = false;
      document.body.style.cursor = stateRef.current.hovered ? "grab" : "default";

      if (stateRef.current.mode === "dragging") {
        const vel = stateRef.current.velocity;
        if (vel.length() > 0.1) {
          stateRef.current.mode = "thrown";
        } else {
          stateRef.current.mode = "idle";
        }
      }
    }
  }, [stateRef]);

  useEffect(() => {
    window.addEventListener("pointermove", handleGlobalPointerMove);
    window.addEventListener("pointerup", handleGlobalPointerUp);
    return () => {
      window.removeEventListener("pointermove", handleGlobalPointerMove);
      window.removeEventListener("pointerup", handleGlobalPointerUp);
    };
  }, [handleGlobalPointerMove, handleGlobalPointerUp]);

  // Interpolated material values
  const interp = useRef({
    color: new THREE.Color(),
    emissive: new THREE.Color(),
    metalness: 0,
    roughness: 0,
    distort: 0,
    emissiveIntensity: 0,
  });

  useFrame((state, delta) => {
    if (!visible || !meshRef.current) return;

    const s = stateRef.current;
    const elapsed = state.clock.getElapsedTime();

    // --- Material cycling ---
    const totalCycle = PRESETS.length * TRANSITION_DURATION;
    const phase = (elapsed % totalCycle) / TRANSITION_DURATION;
    const currentIdx = Math.floor(phase) % PRESETS.length;
    const nextIdx = (currentIdx + 1) % PRESETS.length;
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
    iv.emissiveIntensity = lerpScalar(
      curr.emissiveIntensity,
      next.emissiveIntensity,
      t
    );

    // Hover boost
    const hoverTarget = s.hovered ? 1 : 0;
    s.hoverIntensity = lerpScalar(s.hoverIntensity, hoverTarget, 0.08);
    iv.distort += s.hoverIntensity * 0.15;
    iv.emissiveIntensity += s.hoverIntensity * 0.4;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mat = materialRef.current as any;
    if (mat) {
      mat.color.copy(iv.color);
      mat.emissive.copy(iv.emissive);
      mat.metalness = iv.metalness;
      mat.roughness = iv.roughness;
      mat.distort = iv.distort;
      mat.emissiveIntensity = iv.emissiveIntensity;
    }

    // --- Position & physics ---
    if (s.mode === "thrown") {
      const decay = Math.pow(0.95, delta * 60);
      s.velocity.multiplyScalar(decay);
      s.position.x += s.velocity.x * delta * 4;
      s.position.y += s.velocity.y * delta * 4;

      // Bounce off viewport edges
      const halfW = viewport.width / 2 - 1;
      const halfH = viewport.height / 2 - 1;
      if (s.position.x > halfW) {
        s.position.x = halfW;
        s.velocity.x *= -0.5;
      }
      if (s.position.x < -halfW) {
        s.position.x = -halfW;
        s.velocity.x *= -0.5;
      }
      if (s.position.y > halfH) {
        s.position.y = halfH;
        s.velocity.y *= -0.5;
      }
      if (s.position.y < -halfH) {
        s.position.y = -halfH;
        s.velocity.y *= -0.5;
      }

      if (s.velocity.length() < 0.01) {
        s.mode = "idle";
      }
    }

    // Scale
    s.currentScale = lerpScalar(s.currentScale, s.targetScale, 0.08);
    meshRef.current.scale.setScalar(s.currentScale);

    // Position
    meshRef.current.position.x = s.position.x;
    meshRef.current.position.y = s.position.y;

    // Rotation (idle + mouse influence)
    if (s.mode === "idle" || s.mode === "thrown") {
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

  const radius = Math.min(viewport.width, viewport.height) * 0.28;

  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      const s = stateRef.current;
      if (s.mode === "exploded" || s.mode === "reassembling") return;

      isDragging.current = true;
      dragMoved.current = false;
      dragStart.current = {
        x: e.nativeEvent.clientX,
        y: e.nativeEvent.clientY,
        posX: s.position.x,
        posY: s.position.y,
      };
      s.mode = "dragging";
      s.velocity.set(0, 0);
      document.body.style.cursor = "grabbing";
    },
    [stateRef]
  );

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      // Only explode if we didn't drag
      if (!dragMoved.current && stateRef.current.mode !== "exploded") {
        onExplode();
      }
    },
    [onExplode, stateRef]
  );

  const handlePointerEnter = useCallback(() => {
    stateRef.current.hovered = true;
    document.body.style.cursor = "grab";
  }, [stateRef]);

  const handlePointerLeave = useCallback(() => {
    stateRef.current.hovered = false;
    if (!isDragging.current) {
      document.body.style.cursor = "default";
    }
  }, [stateRef]);

  return (
    <mesh
      ref={meshRef}
      visible={visible}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
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
