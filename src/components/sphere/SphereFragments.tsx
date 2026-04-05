"use client";

import { useRef, useMemo, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SphereState } from "./InteractiveSphere";

/* -------------------------------------------------------------------------- */
/*  Fragment system — no Rapier dependency, pure useFrame physics             */
/* -------------------------------------------------------------------------- */

const FRAGMENT_COUNT = 22;
const EXPLODE_FORCE = 8;
const GRAVITY = -6;
const REASSEMBLE_DELAY = 2.5; // seconds before reassembly starts
const REASSEMBLE_SPEED = 0.04; // lerp factor per frame

// Pre-compute random values at module level to satisfy React purity rules
const FRAGMENT_RANDOMS = Array.from({ length: FRAGMENT_COUNT }, () => ({
  rotX: Math.random() * Math.PI,
  rotY: Math.random() * Math.PI,
  rotZ: Math.random() * Math.PI,
  angX: (Math.random() - 0.5) * 4,
  angY: (Math.random() - 0.5) * 4,
  angZ: (Math.random() - 0.5) * 4,
  scale: 0.3 + Math.random() * 0.4,
}));

interface Fragment {
  // Origin position on sphere surface
  origin: THREE.Vector3;
  // Current physics state
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Euler;
  angularVel: THREE.Vector3;
  scale: number;
}

interface SphereFragmentsProps {
  stateRef: React.MutableRefObject<SphereState>;
  visible: boolean;
  onReassembled: () => void;
  sphereRadius: number;
}

export default function SphereFragments({
  stateRef,
  visible,
  onReassembled,
  sphereRadius,
}: SphereFragmentsProps) {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const explodeTime = useRef(0);
  const reassembling = useRef(false);

  // Generate fragment origins distributed on sphere surface
  const fragments = useMemo<Fragment[]>(() => {
    const frags: Fragment[] = [];
    for (let i = 0; i < FRAGMENT_COUNT; i++) {
      // Golden spiral distribution
      const phi = Math.acos(1 - (2 * (i + 0.5)) / FRAGMENT_COUNT);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = sphereRadius * 0.95;

      const origin = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );

      const rand = FRAGMENT_RANDOMS[i];
      frags.push({
        origin: origin.clone(),
        position: origin.clone(),
        velocity: new THREE.Vector3(),
        rotation: new THREE.Euler(rand.rotX, rand.rotY, rand.rotZ),
        angularVel: new THREE.Vector3(rand.angX, rand.angY, rand.angZ),
        scale: rand.scale,
      });
    }
    return frags;
  }, [sphereRadius]);

  // Reset fragments to exploded state
  const triggerExplode = useCallback(() => {
    explodeTime.current = 0;
    reassembling.current = false;

    const sp = stateRef.current.position;
    const center = new THREE.Vector3(sp.x, sp.y, 0);

    fragments.forEach((frag) => {
      // Start at origin + sphere position
      frag.position.copy(frag.origin).add(center);

      // Explode outward from center
      const dir = frag.origin.clone().normalize();
      const randomness = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      );
      frag.velocity
        .copy(dir)
        .multiplyScalar(EXPLODE_FORCE * (0.7 + Math.random() * 0.6))
        .add(randomness);

      frag.angularVel.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      );
    });
  }, [fragments, stateRef]);

  // Expose trigger via ref on the parent — but we use a simpler approach:
  // check if we just became visible (mode switched to exploded)
  const wasVisible = useRef(false);

  useFrame((state, delta) => {
    if (!visible) {
      wasVisible.current = false;
      return;
    }

    // Just became visible — trigger explosion
    if (!wasVisible.current) {
      wasVisible.current = true;
      triggerExplode();
    }

    explodeTime.current += delta;

    const sp = stateRef.current.position;
    const center = new THREE.Vector3(sp.x, sp.y, 0);

    if (!reassembling.current && explodeTime.current > REASSEMBLE_DELAY) {
      reassembling.current = true;
    }

    let allBack = true;

    fragments.forEach((frag, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;

      if (reassembling.current) {
        // Lerp back to origin
        const target = frag.origin.clone().add(center);
        frag.position.lerp(target, REASSEMBLE_SPEED);
        frag.velocity.multiplyScalar(0.9);

        // Reduce rotation
        frag.rotation.x *= 0.95;
        frag.rotation.y *= 0.95;
        frag.rotation.z *= 0.95;

        const dist = frag.position.distanceTo(target);
        if (dist > 0.05) allBack = false;
      } else {
        // Physics simulation
        frag.velocity.y += GRAVITY * delta;
        frag.position.addScaledVector(frag.velocity, delta);

        // Rotation
        frag.rotation.x += frag.angularVel.x * delta;
        frag.rotation.y += frag.angularVel.y * delta;
        frag.rotation.z += frag.angularVel.z * delta;

        allBack = false;
      }

      mesh.position.copy(frag.position);
      mesh.rotation.copy(frag.rotation);
    });

    if (reassembling.current && allBack) {
      onReassembled();
    }
  });

  // Fragment size based on sphere radius
  const fragRadius = sphereRadius * 0.18;

  return (
    <group visible={visible}>
      {fragments.map((frag, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          scale={frag.scale}
        >
          <icosahedronGeometry args={[fragRadius, 1]} />
          <meshStandardMaterial
            color="#b8bcc0"
            emissive="#ff4400"
            emissiveIntensity={0.6}
            metalness={0.8}
            roughness={0.3}
            toneMapped={true}
          />
        </mesh>
      ))}
    </group>
  );
}
