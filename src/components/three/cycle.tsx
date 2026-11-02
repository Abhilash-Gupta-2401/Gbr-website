"use client";

import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import type { ThreeElements } from "@react-three/fiber";
import type { Group } from "three";
import { Assemble, Ball, Block, Disc, Float, PillLabel, Road, Slab, Solid } from "./ink";
import { Egg, Shed, Shop, Silo, Truck } from "./models";

type G = ThreeElements["group"];
type V3 = [number, number, number];

/* ───────────── Small props ───────────── */

function Person({ ...p }: G) {
  return (
    <group {...p}>
      <Solid position={[0, 0.55, 0]}>
        <capsuleGeometry args={[0.2, 0.55, 4, 12]} />
      </Solid>
      <Ball r={0.17} position={[0, 1.18, 0]} />
    </group>
  );
}

function Tree({ ...p }: G) {
  return (
    <group {...p}>
      <Block size={[0.1, 1.5, 0.1]} position={[0, 0.75, 0]} />
      <Ball r={0.75} position={[0, 2.1, 0]} />
    </group>
  );
}

function MiniHen({ ...p }: G) {
  return (
    <group {...p}>
      <Ball r={0.22} position={[0, 0.24, 0]} scale={[0.85, 0.85, 1.15]} />
      <Ball r={0.12} position={[0, 0.48, 0.18]} />
      <Block size={[0.04, 0.09, 0.12]} tone="accent" position={[0, 0.62, 0.18]} />
    </group>
  );
}

function Fence({ from, to, posts = 8 }: { from: [number, number]; to: [number, number]; posts?: number }) {
  const [x1, z1] = from;
  const [x2, z2] = to;
  const len = Math.hypot(x2 - x1, z2 - z1);
  const angle = -Math.atan2(z2 - z1, x2 - x1);
  return (
    <group position={[(x1 + x2) / 2, 0, (z1 + z2) / 2]} rotation={[0, angle, 0]}>
      {Array.from({ length: posts }, (_, i) => (
        <Block key={i} size={[0.07, 0.9, 0.07]} position={[-len / 2 + (i * len) / (posts - 1), 0.45, 0]} />
      ))}
      {[0.35, 0.85].map((y) => (
        <Block key={y} size={[len, 0.04, 0.04]} position={[0, y, 0]} />
      ))}
    </group>
  );
}

function Crates({ ...p }: G) {
  return (
    <group {...p}>
      <Block size={[0.8, 0.6, 0.8]} position={[0, 0.3, 0]} />
      <Block size={[0.8, 0.6, 0.8]} position={[0.9, 0.3, 0.1]} />
      <Block size={[0.8, 0.6, 0.8]} position={[0.4, 0.9, 0.05]} />
    </group>
  );
}

function Tractor({ trailer = false, ...p }: { trailer?: boolean } & G) {
  return (
    <group {...p}>
      <Block size={[1.6, 0.7, 0.9]} position={[0.3, 0.75, 0]} />
      <Block size={[0.7, 0.1, 1]} position={[-0.25, 2, 0]} />
      {[
        [-0.55, -0.4],
        [-0.55, 0.4],
        [0, -0.4],
        [0, 0.4],
      ].map(([x, z]) => (
        <Block key={`${x}${z}`} size={[0.06, 0.9, 0.06]} position={[x, 1.5, z]} />
      ))}
      {[-0.55, 0.55].map((z) => (
        <Disc key={z} r={0.6} h={0.3} tone="fill" rotation={[Math.PI / 2, 0, 0]} position={[-0.3, 0.6, z]} />
      ))}
      {[-0.5, 0.5].map((z) => (
        <Disc key={z} r={0.32} h={0.2} tone="fill" rotation={[Math.PI / 2, 0, 0]} position={[0.85, 0.32, z]} />
      ))}
      <Block size={[0.06, 0.6, 0.06]} position={[0.8, 1.35, 0]} />
      {trailer && (
        <group position={[-2.5, 0, 0]}>
          <Block size={[2.2, 0.7, 1.3]} position={[0, 0.85, 0]} />
          <Block size={[1.9, 0.05, 1.1]} tone="warm" position={[0, 1.22, 0]} />
          {[-0.7, 0.7].map((z) => (
            <Disc key={z} r={0.3} h={0.15} tone="fill" rotation={[Math.PI / 2, 0, 0]} position={[0, 0.3, z]} />
          ))}
        </group>
      )}
    </group>
  );
}

/** Open-front incubator rack, showing shelves of egg trays. Opening faces +X. */
function HatchCabinet({ ...p }: G) {
  const W = 3.6; // along z
  const D = 2.8; // along x
  const H = 3.6;
  return (
    <group {...p}>
      <Block size={[0.15, H, W]} position={[-D / 2, H / 2, 0]} />
      <Block size={[D, H, 0.15]} position={[0, H / 2, -W / 2]} />
      <Block size={[D, H, 0.15]} position={[0, H / 2, W / 2]} />
      <Block size={[D + 0.2, 0.2, W + 0.2]} position={[0, H + 0.1, 0]} />
      <Block size={[D, 0.15, W]} position={[0, 0.07, 0]} />
      {[0.8, 1.55, 2.3, 3.05].map((y) => (
        <group key={y} position={[0, y, 0]}>
          <Block size={[D - 0.3, 0.08, W - 0.3]} />
          {Array.from({ length: 6 }, (_, i) => (
            <Egg key={i} scale={0.75} position={[0.6, 0.04, -1.25 + i * 0.5]} />
          ))}
        </group>
      ))}
      <Block size={[0.15, H, 0.15]} position={[D / 2, H / 2, 0]} />
      {/* control panel */}
      <Block size={[0.04, 0.5, 0.7]} tone="fill" position={[D / 2 + 0.02, 2.6, W / 2 + 0.6]} />
    </group>
  );
}

function LatticeTower({ height = 8, ...p }: { height?: number } & G) {
  const levels = Math.floor(height / 1.4);
  return (
    <group {...p}>
      {[
        [-0.45, -0.45],
        [0.45, -0.45],
        [-0.45, 0.45],
        [0.45, 0.45],
      ].map(([x, z]) => (
        <Block key={`${x}${z}`} size={[0.1, height, 0.1]} position={[x, height / 2, z]} />
      ))}
      {Array.from({ length: levels }, (_, i) => (
        <group key={i} position={[0, 0.9 + i * 1.4, 0]}>
          <Block size={[0.9, 0.05, 0.05]} position={[0, 0, 0.45]} />
          <Block size={[0.05, 0.05, 0.9]} position={[0.45, 0, 0]} />
          <Block size={[1.25, 0.04, 0.04]} position={[0, 0.7, 0.45]} rotation={[0, 0, 0.98]} />
          <Block size={[0.04, 0.04, 1.25]} position={[0.45, 0.7, 0]} rotation={[0.98, 0, 0]} />
        </group>
      ))}
      <Block size={[1.3, 1, 1.3]} position={[0, height + 0.5, 0]} />
      <Disc r={0.45} h={0.3} position={[0, height + 1.15, 0]} />
    </group>
  );
}

function Hopper({ ...p }: G) {
  return (
    <group {...p}>
      {[
        [-0.8, -0.8],
        [0.8, -0.8],
        [-0.8, 0.8],
        [0.8, 0.8],
      ].map(([x, z]) => (
        <Block key={`${x}${z}`} size={[0.1, 1.6, 0.1]} position={[x, 0.8, z]} />
      ))}
      <Solid position={[0, 2.1, 0]} rotation={[0, Math.PI / 4, 0]} threshold={20}>
        <cylinderGeometry args={[1.45, 0.35, 1.4, 4, 1]} />
      </Solid>
      <Block size={[2.05, 0.9, 2.05]} position={[0, 3.25, 0]} />
      <Block size={[1.85, 0.05, 1.85]} tone="warm" position={[0, 3.72, 0]} />
    </group>
  );
}

/* ───────────── Platforms ───────────── */

function Platform({ size, children, ...p }: { size: [number, number] } & G) {
  return (
    <group {...p}>
      <Slab size={[size[0], 0.7, size[1]]} radius={0.9} position={[0, -0.35, 0]} />
      {children}
    </group>
  );
}

function BreederFarm() {
  const hens: V3[] = [
    [-3.6, 0, -2.5],
    [-2.2, 0, -1],
    [-3.9, 0, 0.6],
    [-2.6, 0, 2.2],
    [-1.6, 0, 3.6],
    [-3.4, 0, 4.2],
  ];
  return (
    <Platform size={[11, 12]}>
      <Shed length={8} width={5} height={2.2} roof="fill" rotation={[0, Math.PI / 2, 0]} position={[2.4, 0, -0.6]} />
      <Fence from={[-4.8, -4.8]} to={[-4.8, 5.2]} posts={10} />
      <Fence from={[-4.8, 5.2]} to={[-0.4, 5.2]} posts={5} />
      <Fence from={[-4.8, -4.8]} to={[-0.4, -4.8]} posts={5} />
      {hens.map((h, i) => (
        <MiniHen key={i} position={h} rotation={[0, i * 1.1, 0]} scale={1.3} />
      ))}
      <Person position={[-1.2, 0, 0.6]} />
      <Person position={[-0.6, 0, 2.2]} rotation={[0, 1, 0]} />
      <Tree position={[4.2, 0, 5]} />
    </Platform>
  );
}

function Hatchery() {
  return (
    <Platform size={[12, 10]}>
      <HatchCabinet position={[-1.6, 0, -1.3]} />
      <Block size={[2.6, 2.2, 2.4]} position={[1.6, 1.1, 1.8]} />
      <Block size={[0.04, 0.6, 0.9]} tone="fill" position={[2.92, 1.5, 1.8]} />
      <Person position={[3.4, 0, -0.8]} rotation={[0, -1.4, 0]} />
      <Person position={[3.6, 0, 1.0]} rotation={[0, -2, 0]} />
      <Person position={[4.6, 0, -2.4]} />
      <Crates position={[4, 0, 3]} />
      <Tree position={[-4.6, 0, 3.6]} />
    </Platform>
  );
}

function FeedMill() {
  return (
    <Platform size={[13, 10]}>
      {[-4.6, -2.6, -0.6].map((x, i) => (
        <Silo key={x} height={3.6 + (i % 2) * 0.6} r={0.9} position={[x, 0, -2.6]} />
      ))}
      <LatticeTower height={7.5} position={[3, 0, -2.8]} />
      <Block size={[1.4, 4.2, 1.4]} position={[1.1, 2.1, -0.4]} />
      <Block size={[1, 1.2, 1]} position={[1.1, 4.8, -0.4]} />
      <Hopper position={[4.6, 0, 1]} />
      <Truck scale={0.7} rotation={[0, Math.PI / 2, 0]} position={[-3.4, 0, 2.4]} />
      <Tractor rotation={[0, Math.PI, 0]} position={[2.4, 0, 3.4]} scale={0.8} />
      <Tree position={[-5.6, 0, 3.8]} />
    </Platform>
  );
}

function CommercialFarm() {
  const hens: V3[] = [
    [4.3, 0, 3.2],
    [3.6, 0, 4.4],
    [4.6, 0, 5.4],
    [-4.3, 0, 5.6],
    [-3.4, 0, 5.8],
    [0.2, 0, 5.9],
    [1.2, 0, 5.5],
  ];
  return (
    <Platform size={[11, 14]}>
      <Shed length={10} width={2.8} height={1.4} roof="accent" rotation={[0, Math.PI / 2, 0]} position={[-2.6, 0, -0.4]} />
      <Shed length={10} width={2.8} height={1.4} roof="accent" rotation={[0, Math.PI / 2, 0]} position={[1.6, 0, -0.4]} />
      {[-4, -2.2, -0.4].map((z, i) => (
        <Silo key={z} height={2.6} r={0.65} position={[4.4, 0, z - i * 0.4]} />
      ))}
      {hens.map((h, i) => (
        <MiniHen key={i} position={h} rotation={[0, i * 1.3, 0]} scale={1.1} />
      ))}
      <Block size={[1.6, 0.9, 0.06]} position={[3.4, 1.2, 6.3]} />
      <Block size={[0.06, 0.8, 0.06]} position={[3.4, 0.4, 6.3]} />
    </Platform>
  );
}

function PoultryShop() {
  return (
    <Platform size={[11, 9]}>
      <Shop position={[-2.4, 0, -1.6]} />
      <Person position={[0.6, 0, 1]} rotation={[0, 1.6, 0]} />
      <Person position={[1.5, 0, 1]} rotation={[0, -1.6, 0]} />
      <Truck scale={0.75} rotation={[0, -Math.PI / 2, 0]} position={[3.4, 0, 0.6]} />
      <Tree position={[-4.6, 0, 2.8]} />
    </Platform>
  );
}

/* ───────────── Animated road truck ───────────── */

// Truck model front faces +X → facing direction (cos θ, 0, −sin θ):
//   Breeder→Hatchery road direction (dx>0, dz<0) → θ = +π/4
//   return direction                               → θ = −3π/4
//
// Cycle: travel forward (travelTime s) → wait at Hatchery (waitTime s) → travel back (travelTime s) → repeat
function AnimatedTruck({
  from,
  to,
  travelTime = 5,
  waitTime = 1,
  phaseOffset = 0,
  rotForward = Math.PI / 4,
  rotReturn = -3 * (Math.PI / 4),
  children,
  childrenReturn,
}: {
  from: V3;
  to: V3;
  travelTime?: number;
  waitTime?: number;
  phaseOffset?: number;
  rotForward?: number;
  rotReturn?: number;
  children?: ReactNode;
  childrenReturn?: ReactNode;
}) {
  const ref = useRef<Group>(null);
  const fwdRef = useRef<Group>(null);
  const retRef = useRef<Group>(null);
  const CYCLE = travelTime + waitTime + travelTime;

  useFrame(({ clock }) => {
    const group = ref.current;
    if (!group) return;

    const t = (clock.getElapsedTime() - phaseOffset + CYCLE * 100) % CYCLE;

    if (t < travelTime) {
      const p = t / travelTime;
      group.position.set(
        from[0] + (to[0] - from[0]) * p,
        from[1],
        from[2] + (to[2] - from[2]) * p,
      );
      group.rotation.y = rotForward;
      group.visible = true;
      if (fwdRef.current) fwdRef.current.visible = true;
      if (retRef.current) retRef.current.visible = false;
    } else if (t < travelTime + waitTime) {
      group.visible = false;
    } else {
      const p = (t - travelTime - waitTime) / travelTime;
      group.position.set(
        to[0] + (from[0] - to[0]) * p,
        from[1],
        to[2] + (from[2] - to[2]) * p,
      );
      group.rotation.y = rotReturn;
      group.visible = true;
      if (fwdRef.current) fwdRef.current.visible = false;
      if (retRef.current) retRef.current.visible = true;
    }
  });

  return (
    <group ref={ref} position={from}>
      <group ref={fwdRef}>{children ?? <Truck scale={0.55} />}</group>
      <group ref={retRef} visible={false}>{childrenReturn ?? children ?? <Truck scale={0.55} />}</group>
    </group>
  );
}

/* ───────────── The full cycle ───────────── */

const GROUND = -0.7;

/** World (x, z) for a screen-space point on the ground: u → right, w → down. */
function iso(u: number, w: number): [number, number] {
  return [(u * Math.SQRT2 + w * Math.sqrt(6)) / 2, (w * Math.sqrt(6) - u * Math.SQRT2) / 2];
}

/*
 * Reference image layout.
 * All three bottom stations share w=13 so they sit on the SAME horizontal
 * screen line. Broiler Farm and Poultry Shop share u=22 so the road between
 * them is a straight VERTICAL line on screen.
 *
 * Key identities used for roads:
 *   roads along x + z = const  →  horizontal on screen
 *   roads along x − z = const  →  vertical   on screen
 */
const [BX, BZ] = iso(-23, 13); // 01 Breeder Farm  (lower-left,   w=13)
const [HX, HZ] = iso(-2, 13);  // 02 Hatchery       (lower-centre, w=13)
const [FX, FZ] = iso(5,  -2);  // 03 Feed Farm       (centre)
const [CX, CZ] = iso(20, 13);  // 04 Broiler Farm   (lower-right,  w=13)
const [SX, SZ] = iso(20, -10); // 05 Poultry Shop   (upper-right,  u=20 same as Broiler)

const HERO_SCALE = 0.93;
const HERO_RISE = 2.35;
const HERO_FLOAT_SPEED = (2 * Math.PI) / 3;
const SHOP_LABEL_RIGHT_SHIFT = 4.1;
const HERO_RIGHT_EDGE_U = 29;
const HERO_SHIFT = ((1 - HERO_SCALE) * HERO_RIGHT_EDGE_U) / Math.SQRT2;
const BREEDER_FEED_START: [number, number] = [BX, BZ - 6];
const BREEDER_FEED_END: [number, number] = [FX, FZ + 5];

export function CycleScene() {
  // x + z constant for the bottom row (all at w = 13)
  const ROW = BX + BZ; // ≈ 31.84

  return (
    <group scale={HERO_SCALE} position={[HERO_SHIFT, HERO_RISE, -HERO_SHIFT]}>
      {/* Bottom road: Breeder → Hatchery (diagonal in world = horizontal on screen) */}
      <Road y={GROUND} radius={0} points={[[BX + 5, ROW - (BX + 5)], [HX - 5, ROW - (HX - 5)]]} />
      {/* Single road from Breeder Farm to Feed Farm */}
      <Road
        y={GROUND}
        radius={0}
        points={[BREEDER_FEED_START, BREEDER_FEED_END]}
      />
      {/* Bottom road: Hatchery → Broiler Farm */}
      <Road y={GROUND} radius={0} points={[[HX + 5, ROW - (HX + 5)], [CX - 5, ROW - (CX - 5)]]} />
      {/* Right road: Broiler Farm → Poultry Shop — double lane, offset ±1.2 perp to road dir */}
      <Road y={GROUND} radius={0} points={[[CX - 4 + 0.5, CZ - 4 - 0.5], [SX + 4 + 0.5, SZ + 4 - 0.5]]} />
      <Road y={GROUND} radius={0} points={[[CX - 4 - 0.5, CZ - 4 + 0.5], [SX + 4 - 0.5, SZ + 4 + 0.5]]} />
      {/* Feed Farm → Broiler Farm — double lane, same perpendicular magnitude as Broiler↔Poultry (0.707) */}
      <Road y={GROUND} radius={0} points={[[FX + 5 - 0.18, FZ + 1 + 0.68], [CX - 5 - 0.18, CZ - 1 + 0.68]]} />
      <Road y={GROUND} radius={0} points={[[FX + 5 + 0.18, FZ + 1 - 0.68], [CX - 5 + 0.18, CZ - 1 - 0.68]]} />

      <Assemble order={0} position={[BX, 0, BZ]}>
        <BreederFarm />
      </Assemble>
      <Assemble order={1} position={[HX, 0, HZ]}>
        <Hatchery />
      </Assemble>
      <Assemble order={2} position={[FX, 0, FZ]}>
        <FeedMill />
      </Assemble>
      <Assemble order={3} position={[CX, 0, CZ]}>
        <CommercialFarm />
      </Assemble>
      <Assemble order={4} position={[SX, 0, SZ]}>
        <PoultryShop />
      </Assemble>

      {/* Animated delivery truck: Breeder Farm ↔ Hatchery */}
      <AnimatedTruck
        from={[BX + 5, GROUND, ROW - (BX + 5)]}
        to={[HX - 5, GROUND, ROW - (HX - 5)]}
        travelTime={5}
        waitTime={2}
      />

      {/* Animated delivery truck: Hatchery ↔ Broiler Farm — departs when first truck arrives */}
      <AnimatedTruck
        from={[HX + 5, GROUND, ROW - (HX + 5)]}
        to={[CX - 5, GROUND, ROW - (CX - 5)]}
        travelTime={5}
        waitTime={2}
        phaseOffset={5}
      />

      {/* Broiler Farm → Poultry Shop (lane A: offset +0.5 / -0.5) */}
      <AnimatedTruck
        from={[CX - 4 + 0.5, GROUND, CZ - 4 - 0.5]}
        to={[SX + 4 + 0.5, GROUND, SZ + 4 - 0.5]}
        travelTime={6}
        waitTime={1}
        rotForward={3 * (Math.PI / 4)}
        rotReturn={-(Math.PI / 4)}
      />

      {/* Poultry Shop → Broiler Farm (lane B: offset -0.5 / +0.5) */}
      <AnimatedTruck
        from={[SX + 4 - 0.5, GROUND, SZ + 4 + 0.5]}
        to={[CX - 4 - 0.5, GROUND, CZ - 4 + 0.5]}
        travelTime={6}
        waitTime={1}
        rotForward={-(Math.PI / 4)}
        rotReturn={3 * (Math.PI / 4)}
      />

      {/* Feed Farm → Broiler Farm (lane A): loaded forward, empty return */}
      <AnimatedTruck
        from={[FX + 5 - 0.18, GROUND, FZ + 1 + 0.68]}
        to={[CX - 5 - 0.18, GROUND, CZ - 1 + 0.68]}
        travelTime={5}
        waitTime={2}
        rotForward={-Math.PI / 12}
        rotReturn={11 * Math.PI / 12}
        childrenReturn={<Tractor scale={0.75} />}
      >
        <Tractor trailer scale={0.75} />
      </AnimatedTruck>

      {/* Broiler Farm → Feed Farm (lane B): empty forward, loaded return */}
      <AnimatedTruck
        from={[CX - 5 + 0.18, GROUND, CZ - 1 - 0.68]}
        to={[FX + 5 + 0.18, GROUND, FZ + 1 - 0.68]}
        travelTime={5}
        waitTime={2}
        rotForward={11 * Math.PI / 12}
        rotReturn={-Math.PI / 12}
        childrenReturn={<Tractor trailer scale={0.75} />}
      >
        <Tractor scale={0.75} />
      </AnimatedTruck>

      {/* Feed Farm → Breeder Farm: loaded forward, empty return */}
      <AnimatedTruck
        from={[BREEDER_FEED_END[0], GROUND, BREEDER_FEED_END[1]]}
        to={[BREEDER_FEED_START[0], GROUND, BREEDER_FEED_START[1]]}
        travelTime={5}
        waitTime={2}
        rotForward={Math.atan2(
          BREEDER_FEED_END[1] - BREEDER_FEED_START[1],
          BREEDER_FEED_START[0] - BREEDER_FEED_END[0],
        )}
        rotReturn={Math.atan2(
          BREEDER_FEED_START[1] - BREEDER_FEED_END[1],
          BREEDER_FEED_END[0] - BREEDER_FEED_START[0],
        )}
        childrenReturn={<Tractor scale={0.75} />}
      >
        <Tractor trailer scale={0.75} />
      </AnimatedTruck>

      <Float amplitude={0.14} speed={HERO_FLOAT_SPEED} phase={0.2} position={[BX, 8.3, BZ]}>
        <PillLabel index={1} text="Breeder Farm" position={[0, 0, 0]} />
      </Float>
      <Float amplitude={0.14} speed={HERO_FLOAT_SPEED} phase={1.4} position={[HX, 8, HZ]}>
        <PillLabel index={2} text="Hatchery" position={[0, 0, 0]} />
      </Float>
      <Float amplitude={0.14} speed={HERO_FLOAT_SPEED} phase={2.6} position={[FX, 10.4, FZ]}>
        <PillLabel index={3} text="Feed Plant" position={[0, 0, 0]} />
      </Float>
      <Float amplitude={0.14} speed={HERO_FLOAT_SPEED} phase={3.8} position={[CX + 4, 7.5, CZ - 4]}>
        <PillLabel index={4} text="Broiler Farm" position={[0, 0, 0]} />
      </Float>
      <Float
        amplitude={0.14}
        speed={HERO_FLOAT_SPEED}
        phase={5}
        position={[
          SX + SHOP_LABEL_RIGHT_SHIFT,
          7.4 - HERO_RISE / HERO_SCALE,
          SZ - SHOP_LABEL_RIGHT_SHIFT,
        ]}
      >
        <PillLabel index={5} text="Poultry Shop" position={[0, 0, 0]} />
      </Float>
    </group>
  );
}
