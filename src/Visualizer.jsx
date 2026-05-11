import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const N = 300;
const X_SPREAD = 6.0;
const DAMPING = 0.88;
const SPRING = 0.03;
const NEIGHBOR_PULL = 0.18;
const IMPULSE_CHANCE = 0.35;
const IMPULSE_STRENGTH = 0.55;

export function Visualizer({ playing }) {
  const { scene } = useThree();
  const amp = useRef(0);
  const yPos = useRef(new Float32Array(N));
  const yVel = useRef(new Float32Array(N));
  const posAttr = useRef(null);
  const wasPlaying = useRef(playing);

  useEffect(() => {
    const positions = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      positions[i * 3]     = (i / (N - 1) - 0.5) * X_SPREAD;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
    }

    const geometry = new THREE.BufferGeometry();
    const attr = new THREE.BufferAttribute(positions, 3);
    geometry.setAttribute("position", attr);
    posAttr.current = attr;

    const material = new THREE.PointsMaterial({
      color: "#aaaaaa",
      size: 0.04,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
    });

    const points = new THREE.Points(geometry, material);
    points.position.set(0, 0, 0);
    scene.add(points);

    return () => {
      scene.remove(points);
      geometry.dispose();
      material.dispose();
    };
  }, [scene]);

  useFrame(() => {
    if (!posAttr.current) return;
    amp.current += ((playing ? 1 : 0) - amp.current) * 0.28;

    const a = amp.current;
    const y = yPos.current;
    const v = yVel.current;

    // Detect transition edges
    if (playing && !wasPlaying.current) {
      // Play burst: slam 40 random particles with large impulses
      for (let k = 0; k < 40; k++) {
        const i = Math.floor(Math.random() * N);
        v[i] += (Math.random() - 0.5) * 2 * IMPULSE_STRENGTH * 3;
      }
    }
    if (!playing && wasPlaying.current) {
      // Pause snap: kill velocities instantly
      for (let i = 0; i < N; i++) v[i] *= 0.05;
    }
    wasPlaying.current = playing;

    for (let k = 0; k < 4; k++) {
      if (Math.random() < IMPULSE_CHANCE * a) {
        const i = Math.floor(Math.random() * N);
        v[i] += (Math.random() - 0.5) * 2 * IMPULSE_STRENGTH * a;
      }
    }

    for (let i = 0; i < N; i++) {
      const left  = i > 0     ? y[i - 1] : 0;
      const right = i < N - 1 ? y[i + 1] : 0;
      v[i] += ((left + right) * 0.5 - y[i]) * NEIGHBOR_PULL;
      v[i] -= y[i] * SPRING;
      v[i] *= DAMPING;
      y[i] += v[i];
    }

    const arr = posAttr.current.array;
    for (let i = 0; i < N; i++) {
      arr[i * 3 + 1] = y[i];
    }
    posAttr.current.needsUpdate = true;
  });

  return null;
}
