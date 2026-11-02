"use client";

import { useMemo, useRef } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import { Ball, Block, Disc, Slab, Solid } from "./ink";

type G = ThreeElements["group"];

export function Egg({ scale = 1, ...p }: { scale?: number } & G) {
  return (
    <group {...p}>
      <Solid lines={false} scale={[scale, scale * 1.3, scale]} position={[0, 0.2 * scale * 1.3, 0]}>
        <sphereGeometry args={[0.2, 20, 14]} />
      </Solid>
    </group>
  );
}

/** Hen in the GBR logo spirit: white body, red comb, a pecking head. */
export function Hen({ phase = 0, ...p }: { phase?: number } & G) {
  const head = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!head.current) return;
    const s = Math.max(0, Math.sin(clock.elapsedTime * 1.8 + phase));
    head.current.rotation.x = s * s * 0.9;
  });
  return (
    <group {...p}>
      <Solid lines={false} position={[0, 0.55, 0]} scale={[0.8, 0.75, 1.1]}>
        <sphereGeometry args={[0.5, 20, 14]} />
      </Solid>
      <Solid lines={false} position={[0, 0.85, -0.5]} rotation={[-0.7, 0, 0]}>
        <coneGeometry args={[0.28, 0.55, 12]} />
      </Solid>
      <group ref={head} position={[0, 0.85, 0.35]}>
        <Ball r={0.24} position={[0, 0.25, 0.08]} />
        <Block size={[0.07, 0.16, 0.26]} tone="accent" position={[0, 0.52, 0.06]} outline={false} />
        <Solid tone="warm" position={[0, 0.24, 0.36]} rotation={[Math.PI / 2, 0, 0]} outline={false}>
          <coneGeometry args={[0.07, 0.18, 4]} />
        </Solid>
        <Ball r={0.06} tone="accent" position={[0, 0.08, 0.26]} outline={false} />
      </group>
      {[-0.15, 0.15].map((x) => (
        <Block key={x} size={[0.05, 0.25, 0.05]} tone="warm" position={[x, 0.12, 0]} outline={false} />
      ))}
    </group>
  );
}

export function Chick({ phase = 0, ...p }: { phase?: number } & G) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = Math.abs(Math.sin(clock.elapsedTime * 3 + phase)) * 0.12;
  });
  return (
    <group {...p}>
      <group ref={ref}>
        <Ball r={0.22} tone="warm" position={[0, 0.22, 0]} />
        <Ball r={0.15} tone="warm" position={[0, 0.48, 0.1]} />
        <Solid tone="fill" position={[0, 0.48, 0.28]} rotation={[Math.PI / 2, 0, 0]} outline={false}>
          <coneGeometry args={[0.04, 0.1, 4]} />
        </Solid>
      </group>
    </group>
  );
}

/** Round tray carrying eggs or chicks — the "disc on a conveyor" motif from the reference. */
export function Tray({ content = "eggs", ...p }: { content?: "eggs" | "chicks" | "empty" } & G) {
  return (
    <group {...p}>
      <Disc r={0.85} h={0.18} position={[0, 0.09, 0]} />
      {content === "eggs" &&
        [
          [-0.28, -0.2],
          [0.28, -0.2],
          [0, 0.28],
        ].map(([x, z]) => <Egg key={`${x}${z}`} position={[x, 0.18, z]} scale={0.9} />)}
      {content === "chicks" && <Chick position={[0, 0.18, 0]} />}
    </group>
  );
}

/** Rectangular egg flat — a grid of eggs on a slab (used in stacked layers). */
export function EggFlat({ cols = 5, rows = 4, ...p }: { cols?: number; rows?: number } & G) {
  const w = cols * 0.5 + 0.3;
  const d = rows * 0.5 + 0.3;
  return (
    <group {...p}>
      <Slab size={[w, 0.16, d]} radius={0.2} position={[0, 0.08, 0]} />
      {Array.from({ length: cols * rows }, (_, i) => (
        <Egg key={i} scale={0.7} position={[-w / 2 + 0.4 + (i % cols) * 0.5, 0.16, -d / 2 + 0.4 + Math.floor(i / cols) * 0.5]} />
      ))}
    </group>
  );
}

/** The hub machine: an incubator with a status screen and a lid that opens on a loop. */
export function Incubator({ label = true, ...p }: { label?: boolean } & G) {
  const lid = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!lid.current) return;
    const t = (clock.elapsedTime % 6) / 6;
    const open = t < 0.15 ? t / 0.15 : t < 0.45 ? 1 : t < 0.6 ? 1 - (t - 0.45) / 0.15 : 0;
    lid.current.rotation.x = -open * 0.9;
  });
  return (
    <group {...p}>
      <Slab size={[4.4, 1.3, 3.6]} radius={0.4} position={[0, 0.65, 0]} />
      {/* screen strip */}
      <Slab size={[2.6, 0.08, 0.8]} radius={0.35} tone="fill" position={[-0.2, 1.33, 0.9]} />
      <Disc r={0.32} h={0.12} position={[0.3, 1.4, 0.9]} />
      {[0, 1, 2].map((i) => (
        <Block key={i} size={[0.25, 0.06, 0.08]} tone="paper" position={[-1, 1.38, 0.75 + i * 0.15]} outline={false} />
      ))}
      {/* vents */}
      {label &&
        [0, 1, 2, 3].map((i) => <Block key={i} size={[0.06, 0.5, 0.02]} tone="fill" position={[1.2 + i * 0.18, 0.65, 1.81]} outline={false} />)}
      {/* lid hinged at the back edge */}
      <group position={[0, 1.32, -1.5]}>
        <group ref={lid}>
          <Slab size={[3, 0.22, 1.2]} radius={0.5} position={[0, 0.12, 0.55]} />
          <Ball r={0.16} tone="accent" position={[0.9, 0.3, 0.55]} />
        </group>
      </group>
    </group>
  );
}

/** Poultry house with gable roof, side windows and an open gable end. Length runs along X. */
export function Shed({ length = 6, width = 3, height = 1.4, roof: roofTone = "paper", ...p }: { length?: number; width?: number; height?: number; roof?: "paper" | "fill" | "accent" } & G) {
  const roof = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-width / 2 - 0.25, 0);
    s.lineTo(width / 2 + 0.25, 0);
    s.lineTo(0, 1.1);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: length + 0.3, bevelEnabled: false });
    g.translate(0, 0, -(length + 0.3) / 2);
    g.rotateY(Math.PI / 2);
    return g;
  }, [length, width]);
  const windows = Math.max(2, Math.floor(length / 1.1));
  return (
    <group {...p}>
      <Block size={[length, height, width]} position={[0, height / 2, 0]} />
      <Solid geometry={roof} tone={roofTone} position={[0, height, 0]}>{null}</Solid>
      {Array.from({ length: windows }, (_, i) => (
        <Block
          key={i}
          size={[0.45, 0.28, 0.04]}
          tone="fill"
          outline={false}
          position={[-length / 2 + 0.6 + i * ((length - 1.2) / (windows - 1)), height * 0.6, width / 2 + 0.01]}
        />
      ))}
      <Block size={[0.04, 0.9, 0.9]} tone="fill" outline={false} position={[length / 2 + 0.01, 0.45, 0]} />
    </group>
  );
}

export function Silo({ height = 3, r = 0.8, ...p }: { height?: number; r?: number } & G) {
  return (
    <group {...p}>
      {[0, 1, 2, 3].map((i) => {
        const a = Math.PI / 4 + (i * Math.PI) / 2;
        return <Block key={i} size={[0.08, 0.6, 0.08]} position={[Math.cos(a) * r * 0.75, 0.3, Math.sin(a) * r * 0.75]} outline={false} />;
      })}
      <Solid position={[0, 0.85, 0]} threshold={40}>
        <coneGeometry args={[r, 0.5, 32]} />
      </Solid>
      <Disc r={r} h={height} position={[0, 1.1 + height / 2, 0]} />
      {[0.3, 0.6].map((f) => (
        <Disc key={f} r={r + 0.02} h={0.05} position={[0, 1.1 + height * f, 0]} outline={false} />
      ))}
      <Solid position={[0, 1.1 + height + 0.3, 0]} threshold={40}>
        <coneGeometry args={[r, 0.6, 32]} />
      </Solid>
    </group>
  );
}

export function FeedBag({ ...p }: G) {
  return (
    <group {...p}>
      <Slab size={[1, 0.35, 0.7]} radius={0.15} position={[0, 0.18, 0]} />
      <Block size={[0.5, 0.02, 0.3]} tone="accent" position={[0, 0.36, 0]} outline={false} />
    </group>
  );
}

export function Truck({ ...p }: G) {
  return (
    <group {...p}>
      <Slab size={[1.5, 1.2, 1.4]} radius={0.25} position={[1.6, 0.85, 0]} />
      <Block size={[0.04, 0.5, 1.1]} tone="fill" position={[2.36, 1.05, 0]} outline={false} />
      <Block size={[3, 1.6, 1.6]} position={[-0.7, 1.05, 0]} />
      <Block size={[1.2, 0.1, 0.02]} tone="accent" position={[-0.7, 1.2, 0.81]} outline={false} />
      {[
        [1.6, 0.7],
        [1.6, -0.7],
        [-1.4, 0.7],
        [-1.4, -0.7],
      ].map(([x, z]) => (
        <Disc key={`${x}${z}`} r={0.3} h={0.2} tone="fill" rotation={[Math.PI / 2, 0, 0]} position={[x, 0.3, z]} />
      ))}
    </group>
  );
}

export function Shop({ ...p }: G) {
  return (
    <group {...p}>
      <Block size={[4, 2.2, 3]} position={[0, 1.1, 0]} />
      <Block size={[4.3, 0.2, 3.3]} position={[0, 2.3, 0]} />
      <Block size={[2.6, 0.5, 0.06]} tone="accent" position={[0, 1.9, 1.53]} outline={false} />
      {/* striped awning */}
      {Array.from({ length: 7 }, (_, i) => (
        <Block key={i} size={[4 / 7, 0.06, 0.9]} tone={i % 2 ? "paper" : "accent"} rotation={[0.4, 0, 0]} position={[-2 + 2 / 7 + (i * 4) / 7, 1.45, 1.85]} outline={false} />
      ))}
      <Block size={[0.9, 1.2, 0.04]} tone="fill" position={[-1, 0.6, 1.52]} outline={false} />
      <Slab size={[1.6, 0.7, 0.8]} radius={0.15} position={[0.9, 0.35, 2.2]} />
      {[0, 1, 2].map((i) => (
        <Egg key={i} scale={0.8} position={[0.45 + i * 0.45, 0.7, 2.2]} />
      ))}
    </group>
  );
}
