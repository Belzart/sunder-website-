"use client";

import { type ReactNode } from "react";
import { FieldProvider } from "@/lib/field-context";
import SphereBackground from "@/components/SphereBackground";
import FieldGlow from "@/components/field/FieldGlow";
import FieldAnnotations from "@/components/field/FieldAnnotations";
import MaterialStatus from "@/components/field/MaterialStatus";
import IdleDiscovery from "@/components/field/IdleDiscovery";

/**
 * Client-side shell wrapping the entire app.
 * Provides the field interaction context and persistent background layers.
 * The `film-grain` class activates the CSS noise overlay.
 *
 * Layer stack:
 *   z-0     Three.js blob (SphereBackground)
 *   z-1     Cursor field glow
 *   z-2     Lab annotations + material status
 *   z-3     Idle discovery messages
 *   z-9998  Film grain (CSS ::after)
 *   z-10    Page content (children)
 */
export default function FieldShell({ children }: { children: ReactNode }) {
  return (
    <FieldProvider>
      <div className="film-grain">
        <SphereBackground />
        <FieldGlow />
        <FieldAnnotations />
        <MaterialStatus />
        <IdleDiscovery />
        {children}
      </div>
    </FieldProvider>
  );
}
