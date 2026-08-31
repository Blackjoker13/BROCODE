"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { usePerformance } from "@/lib/performance/PerformanceContext";

const DRACO_PATH = "/draco/gltf/";

export const MODEL_CONFIGS = {
  noir: {
    url: "/models/tshirt_param_noir.glb",
    isAnimated: false,
    scale: 2.05,
    yOffset: 0.12,
  },
  cyber: {
    url: "/models/tshirt_cyber_kinetic.glb",
    isAnimated: true,
    scale: 2.15,
    yOffset: 0.05,
  },
  ragnarok: {
    url: "/models/tshirt_gothic_ragnarok.glb",
    isAnimated: true,
    scale: 2.15,
    yOffset: 0.05,
  },
};

// Cached, pooled single model with persistent GPU buffers
function ModelInstance({
  modelUrl,
  isAnimated,
  targetHeight,
  visible,
  tier,
  isLowPower,
  gl,
}) {
  const group = useRef();
  const { scene, animations } = useGLTF(modelUrl, DRACO_PATH);
  const { actions } = useAnimations(animations, group);

  // Play / pause animations based on active visibility (Zero CPU waste when hidden)
  useEffect(() => {
    if (!isAnimated || !actions) return;
    const actionNames = Object.keys(actions);
    if (actionNames.length === 0) return;

    const action = actions[actionNames[0]];
    if (!action) return;

    if (visible) {
      action.reset().fadeIn(0.2).play();
      action.setEffectiveTimeScale(0.85);
    } else {
      action.fadeOut(0.2);
    }
  }, [actions, isAnimated, visible]);

  // Center and normalize once per model load
  const modelObject = useMemo(() => {
    const root = scene.clone(true);

    const box = new THREE.Box3().setFromObject(root);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    root.position.x = -center.x;
    root.position.y = -center.y;
    root.position.z = -center.z;

    const maxAxis = Math.max(size.x, size.y, size.z) || 1;
    const scale = targetHeight / maxAxis;

    const maxAnisotropy =
      tier === "low" || isLowPower ? 2 : Math.min(gl?.capabilities?.getMaxAnisotropy?.() || 4, 4);

    root.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        o.frustumCulled = true;

        if (o.material) {
          o.material.roughness = 0.62;
          o.material.metalness = 0.04;

          if (o.material.map) {
            o.material.map.anisotropy = maxAnisotropy;
            o.material.map.generateMipmaps = true;
          }
        }
      }
    });

    const wrapper = new THREE.Group();
    wrapper.add(root);
    wrapper.scale.setScalar(scale);

    return wrapper;
  }, [scene, targetHeight, gl, tier, isLowPower]);

  return (
    <group ref={group} visible={visible}>
      <primitive object={modelObject} />
    </group>
  );
}

export default function TshirtModel({
  activeTheme = "noir",
  autoRotate = true,
  rotateSpeed = 0.65,
  targetAngle = null,
  userInteracting = false,
  ...props
}) {
  const outerGroup = useRef();
  const gl = useThree((state) => state.gl);
  const { tier, isLowPower } = usePerformance();

  const config = MODEL_CONFIGS[activeTheme] || MODEL_CONFIGS.noir;

  const targetAngleRef = useRef(targetAngle);
  const isTransitioningAngle = useRef(false);

  useEffect(() => {
    if (targetAngle !== null && targetAngle !== undefined) {
      targetAngleRef.current = targetAngle;
      isTransitioningAngle.current = true;
    }
  }, [targetAngle]);

  // Smooth frame loop update (Optimized for rock-solid 60 FPS)
  useFrame((state, delta) => {
    if (!outerGroup.current) return;

    const dt = Math.min(delta, 0.05);

    // Angle rotation
    if (isTransitioningAngle.current && targetAngleRef.current !== null && !userInteracting) {
      const currentRot = outerGroup.current.rotation.y;
      let diff = (targetAngleRef.current - currentRot) % (Math.PI * 2);
      if (diff > Math.PI) diff -= Math.PI * 2;
      if (diff < -Math.PI) diff += Math.PI * 2;

      if (Math.abs(diff) > 0.03) {
        outerGroup.current.rotation.y += diff * Math.min(dt * 4.5, 0.25);
      } else {
        outerGroup.current.rotation.y = targetAngleRef.current;
        isTransitioningAngle.current = false;
      }
    } else if (autoRotate && !userInteracting) {
      outerGroup.current.rotation.y += dt * rotateSpeed;
    }

    // Floating animation
    const t = state.clock.elapsedTime;
    outerGroup.current.position.y = (config.yOffset || 0.1) + Math.sin(t * 1.5) * 0.03;
  });

  return (
    <group ref={outerGroup} {...props}>
      {/* 1. NOIR MODEL */}
      <ModelInstance
        modelUrl={MODEL_CONFIGS.noir.url}
        isAnimated={MODEL_CONFIGS.noir.isAnimated}
        targetHeight={MODEL_CONFIGS.noir.scale}
        visible={activeTheme === "noir"}
        tier={tier}
        isLowPower={isLowPower}
        gl={gl}
      />

      {/* 2. CYBER MODEL */}
      <ModelInstance
        modelUrl={MODEL_CONFIGS.cyber.url}
        isAnimated={MODEL_CONFIGS.cyber.isAnimated}
        targetHeight={MODEL_CONFIGS.cyber.scale}
        visible={activeTheme === "cyber"}
        tier={tier}
        isLowPower={isLowPower}
        gl={gl}
      />

      {/* 3. RAGNAROK MODEL */}
      <ModelInstance
        modelUrl={MODEL_CONFIGS.ragnarok.url}
        isAnimated={MODEL_CONFIGS.ragnarok.isAnimated}
        targetHeight={MODEL_CONFIGS.ragnarok.scale}
        visible={activeTheme === "ragnarok"}
        tier={tier}
        isLowPower={isLowPower}
        gl={gl}
      />
    </group>
  );
}

// Preload all 3 models with Draco decoder support
Object.values(MODEL_CONFIGS).forEach((cfg) => {
  useGLTF.preload(cfg.url, DRACO_PATH);
});
