import { useState, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Model } from "./Model";
import { SceneFilter } from "./SceneFilter";
import { LogoViewer } from "./LogoViewer";
import { MediaPlayer } from "./MediaPlayer";
import { MODELS } from "./artists";

export function MobileApp() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const model = MODELS[index];

  const lastTap = useRef(0);
  const touchStart = useRef({ x: 0, y: 0 });

  const handleTouchStart = (e) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e) => {
    const t = e.changedTouches[0];
    const dx = Math.abs(t.clientX - touchStart.current.x);
    const dy = Math.abs(t.clientY - touchStart.current.y);
    if (dx > 10 || dy > 10) return; // was a scroll, not a tap

    const now = Date.now();
    if (now - lastTap.current < 350) {
      setIndex((prev) => (prev + 1) % MODELS.length);
      lastTap.current = 0;
    } else {
      lastTap.current = now;
    }
  };

  const descSep = model.description.indexOf(". ");
  const descFirst = descSep !== -1 ? model.description.slice(0, descSep + 1) : model.description;
  const descRest  = descSep !== -1 ? model.description.slice(descSep + 2) : "";

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* Header: logo */}
      <div style={{ flexShrink: 0, height: 72, borderBottom: "1px solid #111", position: "relative" }}>
        <LogoViewer containerStyle={{
          position: "absolute", top: 0, left: "50%",
          transform: "translateX(-50%)",
          width: 220, height: 72,
          right: "unset", zIndex: 1,
        }} />
      </div>

      {/* Scrollable content — double-tap to advance artist */}
      <div
        style={{ flex: 1, overflowY: "auto", padding: "1.75rem 1.5rem 1rem" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <p style={{
          color: "#555", fontSize: "11px", letterSpacing: "0.15em",
          textTransform: "uppercase", margin: "0 0 0.4rem",
          fontFamily: "'Lexend Deca', sans-serif", fontWeight: 200,
        }}>
          {index + 1} / {MODELS.length}
        </p>

        <h1 style={{
          color: playing ? model.color : "#555",
          fontSize: "clamp(3rem, 14vw, 5rem)",
          fontWeight: 900, margin: "0 0 1.25rem", lineHeight: 0.95,
          fontFamily: "'Playfair Display', serif", transition: "color 0.4s",
        }}>
          {model.label.split(" ").map((word, i) => (
            <span key={i} style={{ display: "block" }}>{word}</span>
          ))}
        </h1>

        {/* 3D model */}
        <div style={{ width: "100%", height: "55vw", maxHeight: 320, marginBottom: "1.5rem" }}>
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
            <SceneFilter />
          </Canvas>
        </div>

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
          marginBottom: "0.5rem",
        }}>
          double tap to next artist
        </p>
      </div>

      {/* Footer: media player */}
      <div style={{ flexShrink: 0, padding: "0.75rem 1.5rem", borderTop: "1px solid #111" }}>
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
