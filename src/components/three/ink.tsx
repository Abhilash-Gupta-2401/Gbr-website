"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { useFrame, useThree, type ThreeElements } from "@react-three/fiber";
import { Edges, Line, OrthographicCamera, Outlines } from "@react-three/drei";
import * as THREE from "three";

/* ───────────────────────── Theme ───────────────────────── */

export type Ink = { line: string; paper: string; shade: string; fill: string; accent: string; warm: string };

// Brand navy replaces the reference's black ink; brand red is the single accent (teal in the reference).
export const LIGHT_INK: Ink = { line: "#2A1F4D", paper: "#FFFFFF", shade: "#E9E7F0", fill: "#2A1F4D", accent: "#B80C1E", warm: "#E8A33D" };
export const DARK_INK: Ink = { line: "#F4F2FA", paper: "#2A1F4D", shade: "#3A2E63", fill: "#F4F2FA", accent: "#E5233A", warm: "#E8A33D" };

const InkContext = createContext<Ink>(LIGHT_INK);
export const useInk = () => useContext(InkContext);

/** Reveal progress (0 → 1) for the whole illustration, driven by the DOM cell entering the viewport. */
export type RevealRef = RefObject<{ target: number }>;
const RevealContext = createContext<RefObject<{ value: number }> | null>(null);

export type Tone = "paper" | "shade" | "fill" | "accent" | "warm";
type Opts = { tone?: Tone; lines?: boolean; outline?: boolean; threshold?: number };

/* ───────────────────────── Stage ───────────────────────── */

/**
 * Isometric stage: orthographic camera on the (1,1,1) diagonal, flat "paper" lighting,
 * and auto-zoom so a `frame`-sized world area always fits the DOM cell.
 */
export function Stage({
  ink = LIGHT_INK,
  frame = [16, 12],
  center = [0, 0, 0],
  reveal,
  children,
}: {
  ink?: Ink;
  frame?: [number, number];
  center?: [number, number, number];
  reveal: RevealRef;
  children: ReactNode;
}) {
  const cam = useRef<THREE.OrthographicCamera>(null);
  const progress = useRef({ value: 0 });
  const size = useThree((s) => s.size);

  useFrame((_, dt) => {
    const c = cam.current;
    if (!c) return;
    const zoom = Math.min(size.width / frame[0], size.height / frame[1]);
    if (Math.abs(c.zoom - zoom) > 0.01) {
      c.zoom = zoom;
      c.updateProjectionMatrix();
    }
    const target = reveal.current?.target ?? 0;
    progress.current.value += (target - progress.current.value) * (1 - Math.exp(-dt * 2.2));
  });

  return (
    <InkContext.Provider value={ink}>
      <RevealContext.Provider value={progress}>
        <OrthographicCamera
          ref={cam}
          makeDefault
          near={-100}
          far={200}
          position={[center[0] + 20, center[1] + 20, center[2] + 20]}
          onUpdate={(c) => c.lookAt(...center)}
        />
        <ambientLight intensity={2.2} />
        <directionalLight position={[3, 10, 6]} intensity={1.1} />
        <directionalLight position={[-6, 2, 1]} intensity={-0.25} />
        {children}
      </RevealContext.Provider>
    </InkContext.Provider>
  );
}

/* ───────────────────────── Solid ───────────────────────── */

/** A mesh drawn like a technical illustration: flat fill + crease edges + silhouette outline. */
export function Solid({
  tone = "paper",
  lines = true,
  outline = true,
  threshold = 30,
  children,
  ...props
}: { tone?: Tone; lines?: boolean; outline?: boolean; threshold?: number; children: ReactNode } & ThreeElements["mesh"]) {
  const ink = useInk();
  const color = ink[tone];
  return (
    <mesh {...props}>
      {children}
      <meshLambertMaterial color={color} />
      {lines && <Edges color={ink.line} threshold={threshold} lineWidth={1.25} />}
      {outline && <Outlines color={ink.line} thickness={0.035} />}
    </mesh>
  );
}

// Boxes don't need the silhouette pass — their crease edges already outline them.
export const Block = ({ size, tone, outline = false, ...p }: { size: [number, number, number] } & Opts & ThreeElements["mesh"]) => (
  <Solid tone={tone} outline={outline} {...p}>
    <boxGeometry args={size} />
  </Solid>
);

/** Box with rounded corners — the soft "device" shape from the reference. */
export function Slab({ size, radius = 0.3, tone, ...p }: { size: [number, number, number]; radius?: number } & Opts & ThreeElements["mesh"]) {
  const geometry = useMemo(() => {
    const [w, h, d] = size;
    const s = new THREE.Shape();
    const r = Math.min(radius, w / 2, d / 2);
    s.moveTo(-w / 2 + r, -d / 2);
    s.lineTo(w / 2 - r, -d / 2);
    s.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + r);
    s.lineTo(w / 2, d / 2 - r);
    s.quadraticCurveTo(w / 2, d / 2, w / 2 - r, d / 2);
    s.lineTo(-w / 2 + r, d / 2);
    s.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - r);
    s.lineTo(-w / 2, -d / 2 + r);
    s.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + r, -d / 2);
    const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: false, curveSegments: 6 });
    g.rotateX(-Math.PI / 2);
    g.translate(0, -h / 2, 0);
    return g;
  }, [size, radius]);
  return <Solid tone={tone} geometry={geometry} threshold={40} {...p}>{null}</Solid>;
}

export const Disc = ({ r, h, tone, segments = 40, ...p }: { r: number; h: number; segments?: number } & Opts & ThreeElements["mesh"]) => (
  <Solid tone={tone} threshold={40} {...p}>
    <cylinderGeometry args={[r, r, h, segments]} />
  </Solid>
);

export const Ball = ({ r, tone, ...p }: { r: number } & Opts & ThreeElements["mesh"]) => (
  <Solid tone={tone} lines={false} {...p}>
    <sphereGeometry args={[r, 24, 16]} />
  </Solid>
);

/* ───────────────────────── Motion helpers ───────────────────────── */

const easeOutBack = (x: number) => 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2);

/**
 * Assembles its children when the illustration is revealed: drops in from above with a
 * small overshoot. `order` staggers parts so the drawing builds up piece by piece.
 */
export function Assemble({ order = 0, from = 4, children, ...props }: { order?: number; from?: number; children: ReactNode } & ThreeElements["group"]) {
  const ref = useRef<THREE.Group>(null);
  const reveal = useContext(RevealContext);
  useFrame(() => {
    if (!ref.current || !reveal?.current) return;
    const local = THREE.MathUtils.clamp(reveal.current.value * 1.6 - order * 0.12, 0, 1);
    const k = easeOutBack(local);
    ref.current.position.y = (1 - k) * from;
    ref.current.scale.setScalar(Math.max(0.0001, Math.min(1, local * 1.4)));
  });
  return (
    <group {...props}>
      <group ref={ref}>{children}</group>
    </group>
  );
}

/** Gentle idle hover, like the stacked layers in the reference. */
export function Float({ amplitude = 0.15, speed = 1, phase = 0, children, ...props }: { amplitude?: number; speed?: number; phase?: number; children: ReactNode } & ThreeElements["group"]) {
  const ref = useRef<THREE.Group>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = reducedMotion ? 0 : Math.sin(clock.elapsedTime * speed + phase) * amplitude;
  });
  return (
    <group {...props}>
      <group ref={ref}>{children}</group>
    </group>
  );
}

/* ───────────────────────── Annotation ───────────────────────── */

/** Dashed connector on the ground plane, with rounded corners — the reference's "data path". */
export function DashedPath({ points, y = 0, radius = 0.8 }: { points: [number, number][]; y?: number; radius?: number }) {
  const ink = useInk();
  const pts = useMemo(() => {
    const out: THREE.Vector3[] = [];
    for (let i = 0; i < points.length; i++) {
      const p = new THREE.Vector3(points[i][0], y, points[i][1]);
      if (i === 0 || i === points.length - 1) {
        out.push(p);
        continue;
      }
      const prev = new THREE.Vector3(points[i - 1][0], y, points[i - 1][1]);
      const next = new THREE.Vector3(points[i + 1][0], y, points[i + 1][1]);
      const a = p.clone().add(prev.clone().sub(p).normalize().multiplyScalar(radius));
      const b = p.clone().add(next.clone().sub(p).normalize().multiplyScalar(radius));
      const curve = new THREE.QuadraticBezierCurve3(a, p, b);
      out.push(...curve.getPoints(8));
    }
    return out;
  }, [points, y, radius]);
  return <Line points={pts} color={ink.line} lineWidth={1.1} dashed dashSize={0.18} gapSize={0.14} />;
}

/** Upper-case label printed flat on the ground, rotated to run along a path. */
export function GroundLabel({ text, position, angle = 0, size = 0.32 }: { text: string; position: [number, number, number]; angle?: number; size?: number }) {
  const ink = useInk();
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    const px = 64;
    const ctx = canvas.getContext("2d")!;
    ctx.font = `700 ${px}px ui-monospace, "SF Mono", Menlo, monospace`;
    const spaced = text.toUpperCase().split("").join(" ");
    canvas.width = Math.ceil(ctx.measureText(spaced).width) + 16;
    canvas.height = px + 16;
    ctx.font = `700 ${px}px ui-monospace, "SF Mono", Menlo, monospace`;
    ctx.fillStyle = ink.line;
    ctx.textBaseline = "middle";
    ctx.fillText(spaced, 8, canvas.height / 2);
    const t = new THREE.CanvasTexture(canvas);
    t.anisotropy = 8;
    t.colorSpace = THREE.SRGBColorSpace;
    return { t, aspect: canvas.width / canvas.height };
  }, [text, ink.line]);
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, angle]}>
      <planeGeometry args={[size * texture.aspect, size]} />
      <meshBasicMaterial map={texture.t} transparent depthWrite={false} />
    </mesh>
  );
}

/** Soft flat shadow under a floating object. */
export function Shadow({ r = 1, position = [0, 0, 0] as [number, number, number], opacity = 0.12 }) {
  const ink = useInk();
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[r, 32]} />
      <meshBasicMaterial color={ink.line} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
}

/* ───────────────────────── Cycle diorama helpers ───────────────────────── */

/** Rounds the corners of a polyline on the ground plane. */
export function roundedPath(points: [number, number][], y: number, radius: number, closed = false) {
  const pts = points.map(([x, z]) => new THREE.Vector3(x, y, z));
  const out: THREE.Vector3[] = [];
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const isEnd = !closed && (i === 0 || i === n - 1);
    if (isEnd) {
      out.push(p.clone());
      continue;
    }
    const prev = pts[(i - 1 + n) % n];
    const next = pts[(i + 1) % n];
    const a = p.clone().add(prev.clone().sub(p).normalize().multiplyScalar(radius));
    const b = p.clone().add(next.clone().sub(p).normalize().multiplyScalar(radius));
    out.push(...new THREE.QuadraticBezierCurve3(a, p, b).getPoints(10));
  }
  if (closed) out.push(out[0].clone());
  return out;
}

/** Offsets a ground-plane polyline sideways (for the two edges of a road). */
function offsetPath(pts: THREE.Vector3[], d: number) {
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    const dir = b.clone().sub(a).normalize();
    return new THREE.Vector3(p.x - dir.z * d, p.y, p.z + dir.x * d);
  });
}

/** Double-line road with a static dashed centre line. */
export function Road({ points, y = 0, width = 1.1, radius = 2.2, closed = false }: { points: [number, number][]; y?: number; width?: number; radius?: number; closed?: boolean }) {
  const ink = useInk();
  const center = useMemo(() => roundedPath(points, y, radius, closed), [points, y, radius, closed]);
  const left = useMemo(() => offsetPath(center, width / 2), [center, width]);
  const right = useMemo(() => offsetPath(center, -width / 2), [center, width]);
  return (
    <group>
      <Line points={left} color={ink.line} lineWidth={1.1} />
      <Line points={right} color={ink.line} lineWidth={1.1} />
      <Line
        points={center}
        color={ink.line}
        lineWidth={1.4}
        dashed
        dashSize={0.35}
        gapSize={1.4}
        transparent
        opacity={0.75}
      />
    </group>
  );
}

/** "01 | BREEDER FARM (01)" pill that always faces the camera. */
export function PillLabel({ index, text, position, height = 1.45 }: { index: number; text: string; position: [number, number, number]; height?: number }) {
  const ink = useInk();
  const tex = useMemo(() => {
    const scale = 4;
    const h = 44 * scale;
    const pad = 20 * scale;
    const num = String(index).padStart(2, "0");
    const label = `${num}  |  ${text.toUpperCase()}`;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const font = `500 ${17 * scale}px Inter, "Helvetica Neue", Arial, sans-serif`;
    ctx.font = font;
    const textW = ctx.measureText(label).width;
    canvas.width = Math.ceil(pad + textW + pad);
    canvas.height = h + 4;
    const r = h / 2;
    const lw = 1.6 * scale;
    // pill
    ctx.beginPath();
    ctx.roundRect(lw, lw, canvas.width - lw * 2, h - lw * 2 + 2, r);
    ctx.fillStyle = ink.paper;
    ctx.fill();
    ctx.lineWidth = lw;
    ctx.strokeStyle = ink.line;
    ctx.stroke();
    // text
    ctx.font = font;
    ctx.fillStyle = ink.line;
    ctx.textBaseline = "middle";
    ctx.fillText(label, pad, h / 2 + 2);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return { t, aspect: canvas.width / canvas.height };
  }, [index, text, ink.line, ink.paper]);
  return (
    <sprite position={position} scale={[height * tex.aspect, height, 1]} renderOrder={10}>
      <spriteMaterial map={tex.t} transparent depthTest={false} />
    </sprite>
  );
}
