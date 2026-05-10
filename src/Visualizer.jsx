import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const POINTS = 256;
const X_HALF = 3.0;
const Z_DIST = -5;    // camera-local; model sits at ~-4, so this is behind it
const AMPLITUDE = 0.5;

export function Visualizer({ playing }) {
  const { camera, scene } = useThree();
  const lineRef = useRef(null);
  const amp = useRef(0);

  useEffect(() => {
    const positions = new Float32Array(POINTS * 3);
    for (let i = 0; i < POINTS; i++) {
      positions[i * 3]     = (i / (POINTS - 1)) * X_HALF * 2 - X_HALF;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = Z_DIST;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.LineBasicMaterial({ color: "#888888", transparent: true, opacity: 0.65 });
    const line = new THREE.Line(geometry, material);

    lineRef.current = line;
    scene.add(camera);   // camera must be in scene for its children to render
    camera.add(line);

    return () => {
      camera.remove(line);
      geometry.dispose();
      material.dispose();
    };
  }, [camera, scene]);

  useFrame(({ clock }) => {
    const line = lineRef.current;
    if (!line) return;
    amp.current += ((playing ? 1 : 0) - amp.current) * 0.04;
    const pos = line.geometry.attributes.position;
    const t = clock.getElapsedTime();
    for (let i = 0; i < POINTS; i++) {
      const x = i / (POINTS - 1);
      pos.array[i * 3 + 1] = amp.current * AMPLITUDE * (
          Math.sin(x * 18 + t * 4.2) * 0.55
        + Math.sin(x *  7 + t * 2.7) * 0.30
        + Math.sin(x * 32 + t * 6.8) * 0.15
      );
    }
    pos.needsUpdate = true;
  });

  return null;
}
