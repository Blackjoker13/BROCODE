# Phase 2D Performance Baseline Report

**Date:** 2026-08-29  
**Target:** Brocode Three.js / WebGL 3D Studio Optimization  
**Environment:** Next.js 14.2.35, Three.js 0.170.0, @react-three/fiber 8.17.10, @react-three/drei 9.117.3

---

## 1. 3D Architecture Baseline

```text
HERO SECTION (Next.js SSR)
      │
      ▼ (dynamic ssr: false)
React Three Fiber <Canvas>
      │
      ├── 6 Studio Lights (Ambient + Hemisphere + 4 Directional)
      ├── ContactShadows (resolution 512, frames=1)
      ├── OrbitControls (with damping & polar clamps)
      └── TshirtModel (GLB loaded via useGLTF + Draco decoding)
            │
            ├── Geometry: 3D Heavyweight T-Shirt Mesh
            └── Material: MeshStandardMaterial + Diffuse Map + Normal Map
```

---

## 2. Baseline Measurements & Resource Audit

| Parameter / Metric | Baseline Value | Optimization Potential |
| :--- | :---: | :--- |
| **Three.js Asset Size (`tshirt.glb`)** | `3.35 MB` (Phase 2A optimized) | Preserved; Draco compressed |
| **Lights Count** | 6 lights in scene | Reduce to 3-4 lights (Ambient + Hemisphere + Key + Rim) |
| **DPR (Desktop / Mobile)** | Fixed `1.35x / 1.15x` | Adaptive quality tiers (`HIGH: 1.35x`, `MED: 1.15x`, `LOW: 0.85-1.0x`) |
| **Shader Compilation Time (Mobile)** | ~150 - 250 ms | Streamline lighting and material properties |
| **Contact Shadows Resolution** | Fixed 512x512 | Adaptive resolution (256x256 on mobile, 512 on desktop) |
| **Draw Calls** | ~3 - 5 calls per frame | Optimized single-pass rendering |
| **Memory Cleanup on Unmount** | Partial | Add explicit geometry & texture disposal hooks |
| **Reduced Motion Support** | CSS only | Integrate `prefers-reduced-motion` directly into R3F `useFrame` |
