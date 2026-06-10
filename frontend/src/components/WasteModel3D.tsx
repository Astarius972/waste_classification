"use client";

import { Canvas } from "@react-three/fiber";
import { Center, Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useMemo } from "react";

export type WasteModelType = "bottle" | "can" | "bag";

/** Ready-made CC0 glTF models — see frontend/public/models/README.md to swap assets */
const MODEL_CONFIG: Record<
  WasteModelType,
  { path: string; scale: number; y: number; autoRotateSpeed: number }
> = {
  bottle: { path: "/models/bottle.glb", scale: 1.4, y: -0.4, autoRotateSpeed: 1.2 },
  can: { path: "/models/can.glb", scale: 1.1, y: -0.35, autoRotateSpeed: 1.4 },
  bag: { path: "/models/bag.glb", scale: 1.2, y: -0.45, autoRotateSpeed: 1.0 },
};

function GltfModel({ type }: { type: WasteModelType }) {
  const cfg = MODEL_CONFIG[type];
  const { scene } = useGLTF(cfg.path);
  const cloned = useMemo(() => scene.clone(), [scene]);

  return (
    <Center position={[0, cfg.y, 0]}>
      <primitive object={cloned} scale={cfg.scale} />
    </Center>
  );
}

function Scene({ type }: { type: WasteModelType }) {
  const cfg = MODEL_CONFIG[type];
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 8, 4]} intensity={1.4} />
      <Environment preset="city" />
      <GltfModel type={type} />
      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={2}
        maxDistance={6}
        autoRotate
        autoRotateSpeed={cfg.autoRotateSpeed}
      />
    </>
  );
}

export function WasteModel3D({ type }: { type: WasteModelType }) {
  return (
    <div className="relative aspect-[4/3] w-full min-h-[220px] max-h-[420px] overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-950 shadow-2xl ring-1 ring-white/10 sm:min-h-[280px] lg:min-h-[360px]">
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center text-sm text-emerald-200/60">
            Loading 3D…
          </div>
        }
      >
        <Canvas camera={{ position: [0, 0.8, 3.5], fov: 45 }} dpr={[1, Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio : 1)]}>
          <Scene type={type} />
        </Canvas>
      </Suspense>
    </div>
  );
}

Object.values(MODEL_CONFIG).forEach((cfg) => {
  useGLTF.preload(cfg.path);
});
