import { useState, useEffect } from "react";

export function useDeezerSongs(artist, tracks) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setSongs([]);

    Promise.all(
      tracks.map((track) =>
        fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(artist + " " + track)}&entity=musicTrack&limit=1&media=music`
        )
          .then((r) => r.json())
          .then((data) => {
            const hit = data.results?.[0];
            return hit
              ? { title: hit.trackName, preview: hit.previewUrl, cover: hit.artworkUrl100 }
              : { title: track, preview: null, cover: null };
          })
          .catch(() => ({ title: track, preview: null, cover: null }))
      )
    ).then((results) => {
      setSongs(results);
      setLoading(false);
    });
  }, [artist]);

  return { songs, loading };
}
