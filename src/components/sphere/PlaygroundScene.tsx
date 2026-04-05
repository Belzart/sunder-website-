"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import PhysicsBlob, { type BlobData } from "./PhysicsBlob";

const MAX_BLOBS = 12;

let nextId = 1;
function genId() {
  return `blob-${nextId++}`;
}

export default function PlaygroundScene() {
  const { viewport } = useThree();
  const sphereRadius = Math.min(viewport.width, viewport.height) * 0.28;

  // Shared material state — main blob writes, fragments read
  const sharedMaterial = useRef({
    color: new THREE.Color("#b8bcc0"),
    emissive: new THREE.Color("#000000"),
    metalness: 0.95,
    roughness: 0.35,
    emissiveIntensity: 0,
  });

  // Blob state
  const [blobs, setBlobs] = useState<BlobData[]>(() => [
    {
      id: genId(),
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      radius: sphereRadius,
      isMain: true,
    },
  ]);

  // Listen for scroll-to-scale (only affects main blob)
  useEffect(() => {
    const handleScale = (e: Event) => {
      const scale = (e as CustomEvent).detail as number;
      setBlobs((prev) =>
        prev.map((b) =>
          b.isMain ? { ...b, radius: sphereRadius * scale } : b
        )
      );
    };
    window.addEventListener("sphere-scale", handleScale);
    return () => window.removeEventListener("sphere-scale", handleScale);
  }, [sphereRadius]);

  // Split a blob into 2
  const handleSplit = useCallback(
    (id: string) => {
      setBlobs((prev) => {
        if (prev.length >= MAX_BLOBS) {
          // At max — don't split, blob will bounce itself via the click handler
          return prev;
        }

        const idx = prev.findIndex((b) => b.id === id);
        if (idx === -1) return prev;

        const parent = prev[idx];
        const childRadius = parent.radius * 0.65;
        const offset = parent.radius * 0.4;

        const child1: BlobData = {
          id: genId(),
          x: parent.x - offset,
          y: parent.y,
          vx: -3 + (parent.isMain ? 0 : parent.vx * 0.3),
          vy: 3,
          radius: childRadius,
          isMain: false,
        };

        const child2: BlobData = {
          id: genId(),
          x: parent.x + offset,
          y: parent.y,
          vx: 3 + (parent.isMain ? 0 : parent.vx * 0.3),
          vy: 3,
          radius: childRadius,
          isMain: false,
        };

        const next = [...prev];
        next.splice(idx, 1, child1, child2);
        return next;
      });
    },
    []
  );

  // Reassemble all blobs back into one
  const handleReassemble = useCallback(() => {
    setBlobs([
      {
        id: genId(),
        x: 0,
        y: 0,
        vx: 0,
        vy: 2, // gentle upward pop
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
          onSplit={handleSplit}
          onReassemble={handleReassemble}
          materialRef={sharedMaterial}
        />
      ))}
    </>
  );
}
