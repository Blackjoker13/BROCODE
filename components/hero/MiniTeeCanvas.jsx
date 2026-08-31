"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/tshirt.glb";
const DRACO_PATH = "/draco/gltf/";

function MiniTee() {
  const meshRef = useRef();
  const { scene } = useGLTF(MODEL_URL, DRACO_PATH);

  const { model, fitScale } = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    clone.position.sub(center);

    const size = box.getSize(new THREE.Vector3());
    const maxAxis = Math.max(size.x, size.y, size.z) || 1;
    const fit = 2.1 / maxAxis;

    clone.traverse((o) => {
      if (o.isMesh && o.material) {
        o.material.roughness = 0.8;
      }
    });

    return { model: clone, fitScale: fit };
  }, [scene]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={meshRef} position={[0, -0.05, 0]}>
      <primitive object={model} scale={fitScale} />
    </group>
  );
}

export default function MiniTeeCanvas() {
  return (
    <div className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0.1, 4.2], fov: 32 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[2, 4, 3]} intensity={2.2} />
        <directionalLight position={[-2, 1, 2]} intensity={1.2} />
        <Suspense fallback={null}>
          <MiniTee />
        </Suspense>
      </Canvas>
    </div>
  );
}
