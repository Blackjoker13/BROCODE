"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { usePerformance } from "@/lib/performance/PerformanceContext";
import { getModel, MODEL_REGISTRY } from "@/lib/assets/assetService";

// Cached, pooled single model with persistent GPU buffers
function ModelInstance({
  modelUrl,
  dracoPath,
  isAnimated,
  targetHeight,
  tier,
  isLowPower,
  gl,
}) {
  const group = useRef();
  const { scene, animations } = useGLTF(modelUrl, dracoPath);
  const { actions } = useAnimations(animations, group);

  // Play / pause animations (Zero CPU waste when tab hidden or unmounted)
  useEffect(() => {
    if (!isAnimated || !actions) return;
    const actionNames = Object.keys(actions);
    if (actionNames.length === 0) return;

    const action = actions[actionNames[0]];
    if (!action) return;

    action.reset().fadeIn(0.25).play();
    action.setEffectiveTimeScale(0.85);

    return () => {
      action?.fadeOut(0.2);
    };
  }, [actions, isAnimated]);

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
    <group ref={group}>
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

  const modelInfo = useMemo(() => getModel(activeTheme), [activeTheme]);

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
    outerGroup.current.position.y = (modelInfo.yOffset || 0.1) + Math.sin(t * 1.5) * 0.03;
  });

  return (
    <group ref={outerGroup} {...props}>
      <ModelInstance
        key={modelInfo.id}
        modelUrl={modelInfo.url}
        dracoPath={modelInfo.dracoPath}
        isAnimated={modelInfo.isAnimated}
        targetHeight={modelInfo.scale}
        tier={tier}
        isLowPower={isLowPower}
        gl={gl}
      />
    </group>
  );
}

// Preload the primary active model immediately
if (typeof window !== "undefined") {
  const initialModel = getModel("noir");
  useGLTF.preload(initialModel.url, initialModel.dracoPath);

  // Defer secondary theme models until idle to ensure initial hero renders instantly (<1s)
  const deferSecondaryPreload = () => {
    const cyberModel = getModel("cyber");
    const ragnarokModel = getModel("ragnarok");
    useGLTF.preload(cyberModel.url, cyberModel.dracoPath);
    useGLTF.preload(ragnarokModel.url, ragnarokModel.dracoPath);
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(deferSecondaryPreload, { timeout: 3000 });
  } else {
    setTimeout(deferSecondaryPreload, 3000);
  }
}
