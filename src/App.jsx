import { Canvas } from "@react-three/fiber";
import { useState, useRef, Suspense } from "react";
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

  const handleScroll = (deltaY) => {
    setIndex((prev) =>
      deltaY > 0
        ? (prev + 1) % MODELS.length
        : (prev - 1 + MODELS.length) % MODELS.length
    );
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", background: "#000" }}>

      <div style={{
        position: "absolute", inset: 0, zIndex: 10,
        pointerEvents: "none", display: "flex",
        flexDirection: "column", justifyContent: "space-between",
        padding: "3rem",
      }}>
        <div style={{ textAlign: "left" }}>
          <p style={{ color: "#888", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0, lineHeight: 1 }}>
            {index + 1} / {MODELS.length}
          </p>
          <h1 style={{
            color: model.color, fontSize: "clamp(2rem, 5vw, 4rem)",
            fontWeight: 900, margin: "0", lineHeight: 1,
            fontFamily: "'Playfair Display', serif", transition: "color 0.4s",
          }}>
            {model.label}
          </h1>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "2rem" }}>
          <div style={{ textAlign: "left" }}>
            <p style={{ color: "#ccc", maxWidth: "380px", fontSize: "1rem", lineHeight: 1.6, margin: 0, fontFamily: "'Libre Baskerville', serif" }}>
              {model.description}
            </p>
            <p style={{ color: "#555", fontSize: "11px", letterSpacing: "0.1em", margin: "0.75rem 0 0" }}>
              scroll to navigate
            </p>
          </div>

          <MediaPlayer model={model} color={model.color} onPlayingChange={setPlaying} />
        </div>

        <div style={{
          position: "absolute", right: "3rem", top: "50%",
          transform: "translateY(-50%)", display: "flex",
          flexDirection: "column", gap: "10px",
        }}>
          {MODELS.map((m, i) => (
            <div key={i} style={{
              width: i === index ? "8px" : "6px",
              height: i === index ? "8px" : "6px",
              borderRadius: "50%",
              background: i === index ? m.color : "#444",
              transition: "all 0.3s",
            }} />
          ))}
        </div>
      </div>

      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <ScrollInterceptor onScroll={handleScroll} />
        <Suspense fallback={null}>
          <Model key={model.path} path={model.path} />
        </Suspense>
        <Visualizer playing={playing} />
        <OrbitControls enableZoom={false} enablePan={false} enableDamping dampingFactor={0.05} />
        <SceneFilter />
      </Canvas>
      <LogoViewer />
    </div>
  );
}
