"use client";

import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";

/**
 * The single WebGL canvas for the whole page. Every <Illustration> registers a <View>
 * that is scissored into this canvas at its DOM box's position.
 */
export default function CanvasRoot() {
  return (
    <Canvas
      flat
      dpr={[1, 2]}
      eventSource={document.body}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 20 }}
    >
      <View.Port />
    </Canvas>
  );
}
