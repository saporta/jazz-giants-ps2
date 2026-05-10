import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const POINTS = 256;
const X_HALF = 3.0;
const Z_DIST = -5;    // behind the model (model is at ~camera z=-4)
const AMPLITUDE = 0.5;

export function Visualizer({ playing }) {
  const groupRef = useRef();
  const lineRef = useRef();
  const _pos = useRef(new THREE.Vector3());
  const amp = useRef(0); // smoothly interpolated amplitude multiplier

  const positions = useMemo(() => {
    const arr = new Float32Array(POINTS * 3);
    for (let i = 0; i < POINTS; i++) {
      arr[i * 3]     = (i / (POINTS - 1)) * X_HALF * 2 - X_HALF;
      arr[i * 3 + 1] = 0;
      arr[i * 3 + 2] = 0;
    }
    return arr;
  }, []);

  useFrame(({ camera, clock }) => {
    const group = groupRef.current;
    const line = lineRef.current;
    if (!group || !line) return;

    // Lock to camera so OrbitControls doesn't tilt it
    _pos.current.set(0, 0, Z_DIST).applyMatrix4(camera.matrixWorld);
    group.position.copy(_pos.current);
    group.quaternion.copy(camera.quaternion);

    // Smooth transition between flat and active
    amp.current += ((playing ? 1 : 0) - amp.current) * 0.04;

    const pos = line.geometry.attributes.position;
    const t = clock.getElapsedTime();
    for (let i = 0; i < POINTS; i++) {
      const x = i / (POINTS - 1);
      pos.array[i * 3 + 1] = amp.current * AMPLITUDE * (
        Math.sin(x * 18 + t * 4.2) * 0.55
        + Math.sin(x * 7  + t * 2.7) * 0.30
        + Math.sin(x * 32 + t * 6.8) * 0.15
      );
    }
    pos.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <line ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={POINTS}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#888888" transparent opacity={0.65} />
      </line>
    </group>
  );
}
