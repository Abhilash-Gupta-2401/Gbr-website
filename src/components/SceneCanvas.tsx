"use client";

import dynamic from "next/dynamic";

// WebGL needs the browser (and `document` for the event source) — skip SSR.
const CanvasRoot = dynamic(() => import("./three/CanvasRoot"), { ssr: false });

export function SceneCanvas() {
  return <CanvasRoot />;
}
