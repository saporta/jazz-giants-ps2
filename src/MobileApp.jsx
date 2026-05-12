import { useState, useRef, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Model } from "./Model";
import { SceneFilter } from "./SceneFilter";
import { Visualizer } from "./Visualizer";
import { LogoViewer } from "./LogoViewer";
import { MediaPlayer } from "./MediaPlayer";
import { MODELS } from "./artists";

export function MobileApp() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const model = MODELS[index];

  // Global double-tap — works even when canvas owns the touch event
  useEffect(() => {
    let lastTap = 0;
    let startX = 0, startY = 0;

    const onStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const onEnd = (e) => {
      const t = e.changedTouches[0];
      if (Math.abs(t.clientX - startX) > 10 || Math.abs(t.clientY - startY) > 10) {
        lastTap = 0; return;
      }
      const now = Date.now();
      if (now - lastTap < 350) {
        setIndex((prev) => (prev + 1) % MODELS.length);
        lastTap = 0;
      } else {
        lastTap = now;
      }
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, []);

  const descSep = model.description.indexOf(". ");
  const descFirst = descSep !== -1 ? model.description.slice(0, descSep + 1) : model.description;
  const descRest  = descSep !== -1 ? model.description.slice(descSep + 2) : "";

  return (
    <div style={{ width: "100vw", height: "100dvh", background: "#000", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* Header: logo */}
      <div style={{ flexShrink: 0, height: 90, borderBottom: "1px solid #111", position: "relative" }}>
        <LogoViewer containerStyle={{
          position: "absolute", top: 0, left: "50%",
          transform: "translateX(-50%)",
          width: 280, height: 90,
          right: "unset", zIndex: 1,
        }} />
      </div>

      {/* Content area — layers stacked absolutely so z-index handles touch routing */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>

        {/* Layer 0: Visualizer — behind everything, no touch */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", filter: "blur(3px)" }}>
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            gl={{ alpha: true }}
            onCreated={({ gl }) => gl.setClearColor(0, 0, 0, 0)}
          >
            <Visualizer playing={playing} />
          </Canvas>
        </div>

        {/* Layer 1: scrollable text — counter, name, spacer, description */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          overflowY: "auto", padding: "1.5rem 1.5rem 2rem",
        }}>
          <p style={{
            color: "#555", fontSize: "11px", letterSpacing: "0.15em",
            textTransform: "uppercase", margin: "0 0 0.3rem",
            fontFamily: "'Lexend Deca', sans-serif", fontWeight: 200,
          }}>
            {index + 1} / {MODELS.length}
          </p>
          <h1 style={{
            color: playing ? model.color : "#555",
            fontSize: "clamp(3rem, 15vw, 5.5rem)",
            fontWeight: 900, margin: 0, lineHeight: 0.95,
            fontFamily: "'Playfair Display', serif", transition: "color 0.4s",
          }}>
            {model.label.split(" ").map((word, i) => (
              <span key={i} style={{ display: "block" }}>{word}</span>
            ))}
          </h1>

          {/* Spacer matching the model canvas height so text flows below it */}
          <div style={{ height: "82vw" }} />

          <p style={{
            color: "#a6a6a6", fontSize: "0.9rem", lineHeight: 1.7,
            margin: "0 0 1.5rem", fontFamily: "'Lexend Deca', sans-serif",
          }}>
            <span style={{ fontWeight: 400 }}>{descFirst}</span>
            {descRest && <span style={{ fontWeight: 100 }}> {descRest}</span>}
          </p>

          <p style={{
            color: "#333", fontSize: "11px", letterSpacing: "0.1em",
            fontFamily: "'Lexend Deca', sans-serif", fontWeight: 100,
          }}>
            double tap to navigate · drag to rotate
          </p>
        </div>

        {/* Layer 2: 3D model canvas — large, overlaps the name, owns its touch area */}
        <div style={{
          position: "absolute", top: "2.5rem", left: 0, right: 0,
          height: "85vw", zIndex: 2, pointerEvents: "all",
        }}>
          <Canvas
            camera={{ position: [0, 0, 4], fov: 50 }}
            gl={{ alpha: true }}
            onCreated={({ gl }) => gl.setClearColor(0, 0, 0, 0)}
          >
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1.2} />
            <Suspense fallback={null}>
              <Model key={model.path} path={model.path} />
            </Suspense>
            <OrbitControls enableZoom={false} enablePan={false} enableDamping dampingFactor={0.05} />
            <SceneFilter />
          </Canvas>
        </div>

      </div>

      {/* Footer: media player full-width */}
      <div style={{ flexShrink: 0, padding: "0.75rem 1.5rem", paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))", borderTop: "1px solid #111" }}>
        <MediaPlayer
          model={model}
          color={model.color}
          onPlayingChange={setPlaying}
          style={{ width: "100%", borderRadius: 6 }}
        />
      </div>

    </div>
  );
}
