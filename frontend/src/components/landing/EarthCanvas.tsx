"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Stars, useTexture } from "@react-three/drei";
import { BackSide, type Group } from "three";

function Earth() {
  const ref = useRef<Group>(null);
  const map = useTexture("/textures/earth.jpg");

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.045;
  });

  return (
    <group ref={ref} rotation={[0.35, 0, 0.15]}>
      <mesh>
        <sphereGeometry args={[1.85, 64, 64]} />
        <meshStandardMaterial map={map} roughness={0.9} metalness={0.05} />
      </mesh>
      {/* Soft emerald atmosphere */}
      <mesh scale={1.045}>
        <sphereGeometry args={[1.85, 48, 48]} />
        <meshBasicMaterial color="#34d399" transparent opacity={0.07} side={BackSide} />
      </mesh>
      <mesh scale={1.12}>
        <sphereGeometry args={[1.85, 48, 48]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.04} side={BackSide} />
      </mesh>
    </group>
  );
}

export default function EarthCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      aria-hidden
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 3, 5]} intensity={2.4} color="#fff7e6" />
      <Suspense fallback={null}>
        <Earth />
        <Sparkles count={110} scale={8} size={2.2} speed={0.25} color="#6ee7b7" opacity={0.45} />
      </Suspense>
      <Stars radius={60} depth={45} count={1600} factor={3.2} fade speed={0.4} />
    </Canvas>
  );
}
