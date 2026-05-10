import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";
import { SceneFilter } from "./SceneFilter";

function LogoModel() {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}logo.glb`);
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = Math.sin(t * 0.8) * 0.1;
    ref.current.rotation.y = Math.sin(t * 0.5) * 0.5;
    ref.current.rotation.z = Math.sin(t * 0.35) * 0.1;
  });

  return (
    <group ref={ref}>
      <Center>
        <primitive object={clone(scene)} />
      </Center>
    </group>
  );
}

export function LogoViewer() {
  return (
    <div style={{
      position: "absolute",
      top: "0rem",
      right: "0rem",
      width: 280,
      height: 100,
      zIndex: 20,
      pointerEvents: "none",
    }}>
      <Canvas camera={{ position: [0, 0, 1.5], fov: 45 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={20} />
        <pointLight position={[5, 5, 5]} intensity={120} />
        <Suspense fallback={null}>
          <LogoModel />
        </Suspense>
        <SceneFilter />
      </Canvas>
    </div>
  );
}
