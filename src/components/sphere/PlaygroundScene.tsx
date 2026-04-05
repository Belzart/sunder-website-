"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import PhysicsBlob, { type BlobData } from "./PhysicsBlob";

const MAX_BLOBS = 12;

export default function PlaygroundScene() {
  const { viewport, pointer, camera } = useThree();
  const sphereRadius = Math.min(viewport.width, viewport.height) * 0.28;

  // ID counter in ref for React strict mode
  const idCounter = useRef(1);

  // Shared cursor world position — updated once per frame, read by all blobs
  const cursorWorld = useRef(new THREE.Vector3());
  const _raycasterPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
  const _raycaster = useRef(new THREE.Raycaster());
  const _pointerNdc = useRef(new THREE.Vector2());

  useFrame(() => {
    // Project pointer to z=0 world plane
    _pointerNdc.current.set(pointer.x, pointer.y);
    _raycaster.current.setFromCamera(_pointerNdc.current, camera);
    _raycaster.current.ray.intersectPlane(
      _raycasterPlane.current,
      cursorWorld.current
    );
  });

  // Shared material state — main blob writes, fragments read
  const sharedMaterial = useRef({
    color: new THREE.Color("#b8bcc0"),
    emissive: new THREE.Color("#000000"),
    metalness: 0.95,
    roughness: 0.35,
    emissiveIntensity: 0,
  });

  // Blob state — use a plain string for initial id to avoid ref access in initializer
  const [blobs, setBlobs] = useState<BlobData[]>(() => [
    { id: "blob-0", x: 0, y: 0, radius: sphereRadius, isMain: true },
  ]);

  // Split a blob into 2
  const handleSplit = useCallback(
    (id: string, cursorX: number, cursorY: number) => {
      setBlobs((prev) => {
        if (prev.length >= MAX_BLOBS) return prev;

        const idx = prev.findIndex((b) => b.id === id);
        if (idx === -1) return prev;

        const parent = prev[idx];
        // Volume-preserving: r_child = r_parent * 0.7937 (cube root of 0.5)
        const childRadius = parent.radius * 0.7937;
        const offset = parent.radius * 0.3;

        // Direction from blob to cursor
        const dx = cursorX - parent.x;
        const dy = cursorY - parent.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = dx / len;
        const ny = dy / len;

        const child1: BlobData = {
          id: `blob-${idCounter.current++}`,
          x: parent.x - nx * offset,
          y: parent.y - ny * offset,
          radius: childRadius,
          isMain: false,
        };

        const child2: BlobData = {
          id: `blob-${idCounter.current++}`,
          x: parent.x + nx * offset,
          y: parent.y + ny * offset,
          radius: childRadius,
          isMain: false,
        };

        const next = [...prev];
        next.splice(idx, 1, child1, child2);

        // If the main blob was split, make the larger child the main
        if (parent.isMain && next.length > 0) {
          // Find the largest blob and make it main
          let largestIdx = 0;
          let largestR = 0;
          next.forEach((b, i) => {
            if (b.radius > largestR) {
              largestR = b.radius;
              largestIdx = i;
            }
          });
          next.forEach((b, i) => {
            b.isMain = i === largestIdx;
          });
        }

        return next;
      });
    },
    []
  );

  // Reassemble all blobs back into one
  const handleReassemble = useCallback(() => {
    setBlobs([
      {
        id: `blob-${idCounter.current++}`,
        x: 0,
        y: 0,
        radius: sphereRadius,
        isMain: true,
      },
    ]);
  }, [sphereRadius]);

  // R key to reassemble
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") {
        handleReassemble();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleReassemble]);

  return (
    <>
      {blobs.map((blob) => (
        <PhysicsBlob
          key={blob.id}
          blob={blob}
          cursorWorldRef={cursorWorld}
          onSplit={handleSplit}
          onReassemble={handleReassemble}
          sharedMaterialRef={sharedMaterial}
        />
      ))}
    </>
  );
}
