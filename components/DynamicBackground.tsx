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

      const colors = [
        "#1e3a8a", // dark blue
        "#09099e", // deep blue
        "#0f172a", // charcoal-black
        "#1e40af", // medium dark blue
        "#0c4a6e", // slate-blue
        "#164e63", // teal-black
        "#1f2937", // dark gray-black
      ];

      for (let i = 0; i < 8; i++) {
        const geometry = geometries[i % geometries.length];
        const color = new THREE.Color(colors[i % colors.length]);

        const material = new THREE.MeshPhongMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.1,
          wireframe: i % 4 === 0,
          transparent: true,
          opacity: 0.4,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15
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

      // Wrap around boundaries
      if (Math.abs(mesh.position.x) > 10) mesh.userData.speedX *= -1;
      if (Math.abs(mesh.position.y) > 10) mesh.userData.speedY *= -1;
      if (Math.abs(mesh.position.z) > 10) mesh.userData.speedZ *= -1;
    });
  });

  return <group ref={group} />;
}

function Particles() {
  const ref = useRef<THREE.Points>(null);

  useMemo(() => {
    const positions = new Float32Array(1500 * 3);
    for (let i = 0; i < 1500; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return positions;
  }, []);

  const pointsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(1500 * 3);
    for (let i = 0; i < 1500; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
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
        size={0.04}
        color="#1e40af"
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function DynamicBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-linear-to-br from-[#07111f] via-[#0b1d35] to-[#123465]">
      <Canvas camera={{ position: [0, 0, 25] }}>
        <ambientLight intensity={0.28} />
        <pointLight position={[10, 10, 10]} intensity={0.24} color="#60a5fa" />
        <pointLight position={[-10, -10, 10]} intensity={0.18} color="#38bdf8" />
        <pointLight position={[0, 0, -15]} intensity={0.14} color="#93c5fd" />

        <AnimatedShapes />
        <Particles />
      </Canvas>
    </div>
  );
}