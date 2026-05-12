import { clone } from "three/examples/jsm/utils/SkeletonUtils";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";

export function Model({ path }) {
  const { scene } = useGLTF(path);
  const clonedScene = useMemo(() => clone(scene), [scene]);
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.4;
  });
  return <primitive ref={ref} object={clonedScene} />;
}

export function ScrollInterceptor({ onScroll }) {
  const { gl } = useThree();
  useEffect(() => {
    const el = gl.domElement;
    const handle = (e) => { e.preventDefault(); onScroll(e.deltaY); };
    el.addEventListener("wheel", handle, { passive: false });
    return () => el.removeEventListener("wheel", handle);
  }, [gl, onScroll]);
  return null;
}
