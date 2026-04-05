"use client";

import dynamic from "next/dynamic";

const MaterialSphere = dynamic(() => import("./sphere"), {
  ssr: false,
});

export default function SphereBackground() {
  return <MaterialSphere />;
}
