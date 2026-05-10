import { Canvas } from "@react-three/fiber";
import { useState, useRef, useEffect, Suspense, useCallback } from "react";
import { OrbitControls } from "@react-three/drei";
import { Model, ScrollInterceptor } from "./Model";
import { SceneFilter } from "./SceneFilter";
import { MODELS } from "./artists";
import { useDeezerSongs } from "./useDeezerSongs";

function MediaPlayer({ model, color }) {
  const [songIndex, setSongIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const { songs, loading } = useDeezerSongs(model.label, model.tracks);
  const song = songs[songIndex];

  useEffect(() => {
    setSongIndex(0);
    setPlaying(false);
  }, [model]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song?.preview) return;
    audio.src = song.preview;
    audio.load();
    if (playing) audio.play().catch(() => setPlaying(false));
  }, [song]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.play().catch(() => setPlaying(false));
    else audio.pause();
  }, [playing]);

  useEffect(() => {
    if (!loading && songs[0]?.preview) setPlaying(true);
  }, [loading]);

  const skip = useCallback(() => {
    setSongIndex((i) => (i + 1) % model.tracks.length);
    setPlaying(true);
  }, [model]);

  const prev = useCallback(() => {
    setSongIndex((i) => (i - 1 + model.tracks.length) % model.tracks.length);
    setPlaying(true);
  }, [model]);

  return (
    <div style={{
      pointerEvents: "all",
      width: 220,
      background: "rgba(10,10,10,0.7)",
      border: "1px solid #222",
      borderRadius: 8,
      padding: "10px 14px",
      backdropFilter: "blur(12px)",
    }}>
      <audio ref={audioRef} onEnded={skip} />

      <p style={{
        margin: "0 0 8px",
        color: loading ? "#444" : "#ccc",
        fontSize: 12,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}>
        {loading ? "loading…" : "Now playing: " + (song?.title ?? model.tracks[songIndex])}
      </p>

      <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
        {model.tracks.map((_, i) => (
          <button
            key={i}
            onClick={() => { setSongIndex(i); setPlaying(true); }}
            style={{
              flex: 1, height: 2, borderRadius: 1,
              background: i === songIndex ? color : "#333",
              border: "none", cursor: "pointer", padding: 0,
              transition: "background 0.2s",
            }}
          />
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "center" }}>
        <button
          onClick={prev}
          style={{
            background: "none", border: "none",
            color: "#555", fontSize: 13,
            cursor: "pointer", padding: 0, lineHeight: 1,
          }}
        >
          ⏮
        </button>
        <button
          onClick={() => setPlaying((p) => !p)}
          disabled={!song?.preview}
          style={{
            background: "none", border: "none",
            color: song?.preview ? color : "#444",
            fontSize: 16, cursor: song?.preview ? "pointer" : "default",
            padding: 0, lineHeight: 1,
          }}
        >
          {playing ? "■" : "▶"}
        </button>
        <button
          onClick={skip}
          style={{
            background: "none", border: "none",
            color: "#555", fontSize: 13,
            cursor: "pointer", padding: 0, lineHeight: 1,
          }}
        >
          ⏭
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [index, setIndex] = useState(0);
  const model = MODELS[index];

  const handleScroll = (deltaY) => {
    setIndex((prev) =>
      deltaY > 0
        ? (prev + 1) % MODELS.length
        : (prev - 1 + MODELS.length) % MODELS.length
    );
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", background: "#0a0a0a" }}>

      <div style={{
        position: "absolute", inset: 0, zIndex: 10,
        pointerEvents: "none", display: "flex",
        flexDirection: "column", justifyContent: "space-between",
        padding: "3rem",
      }}>
        <div style={{ textAlign: "left" }}>
          <p style={{ color: "#888", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 }}>
            {index + 1} / {MODELS.length}
          </p>
          <h1 style={{
            color: model.color, fontSize: "clamp(2rem, 5vw, 4rem)",
            fontWeight: 700, margin: "0.25rem 0 0",
            fontFamily: "Georgia, serif", transition: "color 0.4s",
          }}>
            {model.label}
          </h1>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "2rem" }}>
          <div style={{ textAlign: "left" }}>
            <p style={{
              color: "#ccc", maxWidth: "380px", fontSize: "1rem",
              lineHeight: 1.6, margin: 0,
            }}>
              {model.description}
            </p>
            <p style={{ color: "#555", fontSize: "11px", letterSpacing: "0.1em", margin: "0.75rem 0 0" }}>
              scroll to navigate
            </p>
          </div>

          <MediaPlayer model={model} color={model.color} />
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
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.05}
        />
        <SceneFilter />
      </Canvas>
    </div>
  );
}