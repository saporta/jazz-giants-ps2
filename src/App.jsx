import { Canvas } from "@react-three/fiber";
import { useState, useRef, Suspense, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import { Model, ScrollInterceptor } from "./Model";
import { SceneFilter } from "./SceneFilter";
import { Visualizer } from "./Visualizer";
import { MODELS } from "./artists";
import { LogoViewer } from "./LogoViewer";
import { MediaPlayer } from "./MediaPlayer";

export default function App() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const model = MODELS[index];
  const cursorRef = useRef(null);

  // Move custom cursor with mouse
  useEffect(() => {
    const onMove = (e) => {
      if (cursorRef.current)
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // rAF watchdog: keep every canvas cursor forced to none so OrbitControls can't reassert it
  useEffect(() => {
    let id;
    const tick = () => {
      document.querySelectorAll("canvas").forEach((c) => {
        if (c.style.cursor !== "none") c.style.cursor = "none";
      });
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  const handleScroll = (deltaY) => {
    setIndex((prev) =>
      deltaY > 0
        ? (prev + 1) % MODELS.length
        : (prev - 1 + MODELS.length) % MODELS.length
    );
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", background: "#000" }}>

      {/* Custom cursor */}
      <div ref={cursorRef} style={{
        position: "fixed", top: 0, left: 0,
        pointerEvents: "none", zIndex: 9999,
        transform: "translate(-100px, -100px)",
      }}>
        <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg"
             style={{ filter: "drop-shadow(0 1px 2px #000a)" }}>
          <path d="M2 2L2 19L6.5 14L9.5 21L12 20L9 13.5L15 13.5Z"
                fill={model.color} stroke="#111" strokeWidth="1" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Layer 0: visualizer — behind artist name */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", filter: "blur(1px)" }}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ alpha: true }}
          onCreated={({ gl }) => gl.setClearColor(0, 0, 0, 0)}
        >
          <Visualizer playing={playing} />
        </Canvas>
      </div>

      {/* Layer 1: artist counter + name — behind the 3D canvas */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        pointerEvents: "none", padding: "3rem",
      }}>
        <div style={{ textAlign: "left" }}>
          <p style={{ color: "#888", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0, lineHeight: 1, fontFamily: "'Lexend Deca', sans-serif", fontWeight: 200 }}>
            {index + 1} / {MODELS.length}
          </p>
          <h1 style={{
            color: playing ? model.color : "#555", fontSize: "clamp(4rem, 9vw, 8rem)",
            fontWeight: 900, margin: "0", lineHeight: 0.95,
            fontFamily: "'Playfair Display', serif", transition: "color 0.4s",
          }}>
            {model.label.split(" ").map((word, i) => (
              <span key={i} style={{ display: "block" }}>{word}</span>
            ))}
          </h1>
        </div>
      </div>

      {/* Layer 2: transparent 3D canvas — model appears in front of name */}
      <Canvas
        style={{ position: "absolute", inset: 0, zIndex: 5 }}
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ alpha: true }}
        onCreated={({ gl }) => gl.setClearColor(0, 0, 0, 0)}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <ScrollInterceptor onScroll={handleScroll} />
        <Suspense fallback={null}>
          <Model key={model.path} path={model.path} />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} enableDamping dampingFactor={0.05} />
        <SceneFilter />
      </Canvas>

      {/* Layer 3: description, media player, nav dots — above canvas */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 10,
        pointerEvents: "none", display: "flex",
        flexDirection: "column", justifyContent: "flex-end",
        padding: "3rem",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "2rem" }}>
          <div style={{ textAlign: "left" }}>
            <p style={{ color: "#a6a6a6", maxWidth: "380px", fontSize: "1rem", lineHeight: 1.6, margin: 0, fontFamily: "'Lexend Deca', sans-serif" }}>
              {(() => {
                const sep = model.description.indexOf('. ');
                const first = sep !== -1 ? model.description.slice(0, sep + 1) : model.description;
                const rest  = sep !== -1 ? model.description.slice(sep + 2) : '';
                return (<>
                  <span style={{ fontWeight: 400 }}>{first}</span>
                  {rest && <span style={{ fontWeight: 100 }}> {rest}</span>}
                </>);
              })()}
            </p>
            <p style={{ color: "#555", fontSize: "11px", letterSpacing: "0.1em", margin: "0.75rem 0 0", fontFamily: "'Lexend Deca', sans-serif", fontWeight: 200 }}>
              scroll to navigate
            </p>
          </div>

          <MediaPlayer model={model} color={model.color} onPlayingChange={setPlaying} />
        </div>
      </div>

      <LogoViewer />
    </div>
  );
}
