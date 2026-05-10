import { useState, useRef, useEffect, useCallback } from "react";
import { useDeezerSongs } from "./useDeezerSongs";

function MarqueeText({ text, style }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    setScrolling(false);
    const id = setTimeout(() => {
      const c = containerRef.current;
      const t = textRef.current;
      if (c && t) setScrolling(t.offsetWidth > c.offsetWidth);
    }, 0);
    return () => clearTimeout(id);
  }, [text]);

  return (
    <div ref={containerRef} style={{ overflow: "hidden", whiteSpace: "nowrap", ...style }}>
      {scrolling ? (
        <span style={{ display: "inline-block", animation: "marquee 10s linear infinite" }}>
          <span ref={textRef} style={{ paddingRight: "2em" }}>{text}</span>
          <span style={{ paddingRight: "2em" }}>{text}</span>
        </span>
      ) : (
        <span ref={textRef}>{text}</span>
      )}
    </div>
  );
}

export function MediaPlayer({ model, color, onPlayingChange }) {
  const [songIndex, setSongIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const { songs, loading } = useDeezerSongs(model.label, model.tracks);
  const song = songs[songIndex];

  const setAndNotify = useCallback((val) => {
    setPlaying(val);
    onPlayingChange(val);
  }, [onPlayingChange]);

  useEffect(() => {
    setSongIndex(0);
    setAndNotify(false);
  }, [model]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song?.preview) return;
    audio.src = song.preview;
    audio.load();
    if (playing) audio.play().catch(() => setAndNotify(false));
  }, [song]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.play().catch(() => setAndNotify(false));
    else audio.pause();
  }, [playing]);

  useEffect(() => {
    if (!loading && songs[0]?.preview) setAndNotify(true);
  }, [loading]);

  const skip = useCallback(() => {
    setSongIndex((i) => (i + 1) % model.tracks.length);
    setAndNotify(true);
  }, [model, setAndNotify]);

  const prev = useCallback(() => {
    setSongIndex((i) => (i - 1 + model.tracks.length) % model.tracks.length);
    setAndNotify(true);
  }, [model, setAndNotify]);

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

      <MarqueeText
        text={loading ? "loading…" : "Now playing: " + (song?.title ?? model.tracks[songIndex])}
        style={{ margin: "0 0 8px", color: loading ? "#444" : "#ccc", fontSize: 12 }}
      />

      <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
        {model.tracks.map((_, i) => (
          <button
            key={i}
            onClick={() => { setSongIndex(i); setAndNotify(true); }}
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
        <button onClick={prev} style={{ background: "none", border: "none", color: "#555", fontSize: 13, cursor: "pointer", padding: 0, lineHeight: 1 }}>
          ⏮
        </button>
        <button
          onClick={() => setAndNotify(!playing)}
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
        <button onClick={skip} style={{ background: "none", border: "none", color: "#555", fontSize: 13, cursor: "pointer", padding: 0, lineHeight: 1 }}>
          ⏭
        </button>
      </div>
    </div>
  );
}
