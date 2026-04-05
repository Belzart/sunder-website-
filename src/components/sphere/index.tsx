"use client";

import { useSyncExternalStore, useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import SphereScene from "./SphereScene";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function MaterialSphere() {
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-to-scale: forward wheel events into a custom event the scene can read
  const scaleRef = useRef(1);
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
    const delta = -e.deltaY * 0.001;
    scaleRef.current = Math.max(0.4, Math.min(2.5, scaleRef.current + delta));

    // Dispatch custom event that SphereScene can pick up
    window.dispatchEvent(
      new CustomEvent("sphere-scale", { detail: scaleRef.current })
    );
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
      ref={containerRef}
      onWheel={handleWheel}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        background: "#0A0A0A",
        position: "relative",
        touchAction: "none",
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
        <SphereScene />
      </Canvas>
    </div>
  );
}
