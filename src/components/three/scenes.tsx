"use client";

import { Assemble, Ball, DashedPath, Float, Shadow, Slab } from "./ink";
import { CycleScene } from "./cycle";
import { Chick, Egg, EggFlat, FeedBag, Hen, Incubator, Shed, Shop, Silo, Truck } from "./models";

/* ───────────── 01 Breeder farm ───────────── */
export function BreederScene() {
  return (
    <group>
      <Assemble order={0} from={1}>
        <Slab size={[9, 0.25, 7]} radius={0.6} position={[0, -0.13, 0]} tone="shade" />
      </Assemble>
      <Assemble order={1} position={[-0.6, 0, -1.4]}>
        <Shed length={6} width={2.6} />
      </Assemble>
      <Assemble order={2}>
        <Hen position={[-2, 0, 1.7]} rotation={[0, 0.6, 0]} />
        <Hen position={[0.2, 0, 2.2]} rotation={[0, -0.3, 0]} phase={1.4} />
        <Hen position={[2.2, 0, 1.3]} rotation={[0, 1.2, 0]} phase={2.6} />
      </Assemble>
      <Assemble order={3}>
        <Float amplitude={0.2} position={[2.4, 3.4, -1]}>
          <EggFlat cols={4} rows={3} />
        </Float>
        <Shadow r={1.4} position={[2.4, 0.01, -1]} opacity={0.07} />
      </Assemble>
    </group>
  );
}

/* ───────────── 02 Hatchery — stacked layers like the reference's floating cards ───────────── */
export function HatcheryScene() {
  return (
    <group>
      <Assemble order={0}>
        <Incubator scale={0.9} />
      </Assemble>
      {[0, 1, 2].map((i) => (
        <Assemble key={i} order={1 + i} position={[0, 2.6 + i * 1.3, 0]}>
          <Float amplitude={0.12} phase={i * 0.8} speed={1.3}>
            <EggFlat cols={5} rows={4} />
          </Float>
        </Assemble>
      ))}
      <Assemble order={4} position={[0, 7, 0]}>
        <Float amplitude={0.2} phase={2}>
          <Chick scale={1.6} />
        </Float>
      </Assemble>
    </group>
  );
}

/* ───────────── 03 Feed farm ───────────── */
export function FeedScene() {
  return (
    <group>
      <Assemble order={0} from={1}>
        <Slab size={[9, 0.25, 7]} radius={0.6} position={[0, -0.13, 0]} tone="shade" />
      </Assemble>
      {[-2.6, -0.8].map((x, i) => (
        <Assemble key={x} order={1 + i} position={[x, 0, -1.6]}>
          <Silo height={3.2 + i * 0.6} />
        </Assemble>
      ))}
      <DashedPath points={[[-0.8, 0], [-0.8, 1.6], [2, 1.6]]} y={0.02} radius={0.5} />
      <Assemble order={3}>
        {[0, 1, 2, 3, 4].map((i) => (
          <FeedBag key={i} position={[2.4 + (i % 2) * 1.1, Math.floor(i / 2) * 0.36, 1.2 + (i % 2) * 0.3]} rotation={[0, 0.1 * i, 0]} />
        ))}
      </Assemble>
      <Assemble order={4} position={[2.4, 0, -1.8]}>
        <Float amplitude={0.15} position={[0, 2.2, 0]}>
          <Slab size={[1.8, 0.2, 1.8]} radius={0.5} />
          {Array.from({ length: 9 }, (_, i) => (
            <Ball key={i} r={0.13} tone="warm" position={[-0.45 + (i % 3) * 0.45, 0.22, -0.45 + Math.floor(i / 3) * 0.45]} outline={false} />
          ))}
        </Float>
      </Assemble>
    </group>
  );
}

/* ───────────── 04 Partner farms ───────────── */
export function FarmScene() {
  const chicks: [number, number][] = [
    [-2.6, 1.6],
    [-1.4, 2.4],
    [-0.4, 1.4],
    [0.8, 2.6],
    [1.8, 1.8],
    [2.9, 2.5],
    [-3.2, 2.7],
  ];
  return (
    <group>
      <Assemble order={0} from={1}>
        <Slab size={[10, 0.25, 7.5]} radius={0.6} position={[0, -0.13, 0]} tone="shade" />
      </Assemble>
      <Assemble order={1} position={[-0.8, 0, -1.6]}>
        <Shed length={7} width={2.4} height={1.2} roof="accent" />
      </Assemble>
      <Assemble order={2} position={[3.8, 0, -1.6]}>
        <Silo height={2.2} r={0.55} />
      </Assemble>
      <Assemble order={3}>
        {chicks.map(([x, z], i) => (
          <Chick key={i} position={[x, 0, z]} rotation={[0, i * 0.9, 0]} phase={i * 0.7} />
        ))}
      </Assemble>
      <Assemble order={4} position={[-3.4, 3.4, -1.6]}>
        <Float amplitude={0.18}>
          <FeedBag scale={1.3} />
        </Float>
      </Assemble>
    </group>
  );
}

/* ───────────── 05 Market ───────────── */
export function MarketScene() {
  return (
    <group>
      <Assemble order={0} from={1}>
        <Slab size={[10, 0.25, 7.5]} radius={0.6} position={[0, -0.13, 0]} tone="shade" />
      </Assemble>
      <Assemble order={1} position={[-1.6, 0, -0.9]}>
        <Shop />
      </Assemble>
      <DashedPath points={[[4.2, 3.2], [4.2, 0.4], [1.2, 0.4]]} y={0.02} radius={0.5} />
      <Assemble order={2} position={[3.3, 0, -1.9]}>
        <Truck rotation={[0, Math.PI / 2, 0]} scale={0.75} />
      </Assemble>
      <Assemble order={3} position={[2.6, 2.6, 2.4]}>
        <Float amplitude={0.18}>
          <Slab size={[1.6, 0.35, 1.1]} radius={0.2} />
          {[0, 1, 2].map((i) => (
            <Egg key={i} scale={0.8} position={[-0.45 + i * 0.45, 0.17, 0]} />
          ))}
        </Float>
      </Assemble>
    </group>
  );
}

/* ───────────── CTA banner (rendered with the dark ink theme) ───────────── */
export function CtaScene() {
  return (
    <group>
      <DashedPath points={[[-9, 2], [-3, 2], [-3, -2], [6, -2]]} y={0.02} />
      <Assemble order={0} position={[-4.5, 0, -1]}>
        <Incubator scale={0.8} />
      </Assemble>
      <Assemble order={1} position={[2.2, 0, 1.2]}>
        <Truck scale={0.85} />
      </Assemble>
      <Assemble order={2} position={[5.6, 0, -2.4]}>
        <Silo height={2} r={0.6} />
      </Assemble>
    </group>
  );
}

export const SCENES = {
  hero: CycleScene,
  breeder: BreederScene,
  hatchery: HatcheryScene,
  feed: FeedScene,
  farms: FarmScene,
  market: MarketScene,
  cta: CtaScene,
} as const;

export type SceneId = keyof typeof SCENES;
