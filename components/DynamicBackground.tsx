"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function AnimatedShapes() {
  const group = useRef<THREE.Group>(null);
  const meshes = useRef<THREE.Mesh[]>([]);

  useMemo(() => {
    if (meshes.current.length === 0) {
      const geometries = [
        new THREE.IcosahedronGeometry(1, 4),
        new THREE.BoxGeometry(1.5, 1.5, 1.5),
        new THREE.OctahedronGeometry(1, 2),
        new THREE.TetrahedronGeometry(1.2, 2),
      ];

      // Refined dark-blue palette — richer, more varied blues
      const colors = [
        "#1e3a8a", // blue-800
        "#1d4ed8", // blue-700
        "#2563eb", // blue-600
        "#0ea5e9", // sky-500
        "#0c4a6e", // sky-900
        "#1e40af", // blue-700 alt
        "#164e63", // cyan-900
        "#075985", // sky-800
      ];

      for (let i = 0; i < 10; i++) {
        const geometry = geometries[i % geometries.length];
        const color = new THREE.Color(colors[i % colors.length]);

        const material = new THREE.MeshPhongMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.15,
          wireframe: i % 4 === 0,
          transparent: true,
          opacity: 0.45,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 16
        );

        mesh.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );

        mesh.userData = {
          speedX: (Math.random() - 0.5) * 0.008,
          speedY: (Math.random() - 0.5) * 0.008,
          speedZ: (Math.random() - 0.5) * 0.008,
          rotX: (Math.random() - 0.5) * 0.01,
          rotY: (Math.random() - 0.5) * 0.01,
          rotZ: (Math.random() - 0.5) * 0.01,
        };

        meshes.current.push(mesh);
        group.current?.add(mesh);
      }
    }
  }, []);

  useFrame(() => {
    meshes.current.forEach((mesh) => {
      mesh.position.x += mesh.userData.speedX;
      mesh.position.y += mesh.userData.speedY;
      mesh.position.z += mesh.userData.speedZ;

      mesh.rotation.x += mesh.userData.rotX;
      mesh.rotation.y += mesh.userData.rotY;
      mesh.rotation.z += mesh.userData.rotZ;

      if (Math.abs(mesh.position.x) > 11) mesh.userData.speedX *= -1;
      if (Math.abs(mesh.position.y) > 11) mesh.userData.speedY *= -1;
      if (Math.abs(mesh.position.z) > 11) mesh.userData.speedZ *= -1;
    });
  });

  return <group ref={group} />;
}

function Particles() {
  const ref = useRef<THREE.Points>(null);

  const pointsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(1800 * 3);
    for (let i = 0; i < 1800; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.0001;
      ref.current.rotation.y += 0.0002;
    }
  });

  return (
    <points ref={ref} geometry={pointsGeometry}>
      <pointsMaterial
        size={0.045}
        color="#3b82f6"
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function DynamicBackground() {
  return (
    <div
      className="fixed inset-0 -z-10"
      style={{
        background:
          "linear-gradient(135deg, #060E1F 0%, #081427 40%, #0D1F40 70%, #0a1628 100%)",
      }}
    >
      <Canvas camera={{ position: [0, 0, 25] }}>
        <ambientLight intensity={0.22} />
        <pointLight position={[10, 10, 10]}   intensity={0.30} color="#60a5fa" />
        <pointLight position={[-10, -10, 10]} intensity={0.22} color="#38bdf8" />
        <pointLight position={[0, 0, -15]}    intensity={0.16} color="#93c5fd" />

        <AnimatedShapes />
        <Particles />
      </Canvas>
    </div>
  );
}