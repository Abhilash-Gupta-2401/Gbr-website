"use client";

import { useEffect, useRef } from "react";
import { View } from "@react-three/drei";
import { DARK_INK, LIGHT_INK, Stage } from "./ink";
import { SCENES, type SceneId } from "./scenes";

/** World-space area each scene must fit, and the point the camera centres on. */
const FRAMING: Record<SceneId, { frame: [number, number]; center: [number, number, number] }> = {
  hero: { frame: [60, 38], center: [0.76, -2.57, -1] },
  breeder: { frame: [13, 10], center: [0, 1.2, 0] },
  hatchery: { frame: [9, 11], center: [0, 3.4, 0] },
  feed: { frame: [13, 10], center: [0, 1.4, 0] },
  farms: { frame: [13.5, 10], center: [0, 1, 0] },
  market: { frame: [13.5, 10], center: [0, 1.2, 0] },
  cta: { frame: [20, 9], center: [0, 0.8, 0] },
};

/**
 * A DOM box whose contents are drawn by the shared WebGL canvas (drei <View>).
 * The illustration assembles itself the first time the box scrolls into view.
 */
export function Illustration({ scene, dark = false, className = "" }: { scene: SceneId; dark?: boolean; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const reveal = useRef({ target: 0 });
  const Scene = SCENES[scene];
  const { frame, center } = FRAMING[scene];

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal.current.target = 1;
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box} className={`relative ${className}`} aria-hidden>
      <View className="absolute inset-0">
        <Stage ink={dark ? DARK_INK : LIGHT_INK} frame={frame} center={center} reveal={reveal}>
          <Scene />
        </Stage>
      </View>
    </div>
  );
}
