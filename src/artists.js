const base = import.meta.env.BASE_URL;

export const MODELS = [
  {
    path: `${base}coltrane.glb`,
    label: "John Coltrane",
    description: "A relentless seeker who pushed the saxophone into spiritual territory — from hard bop to the free cosmos of A Love Supreme.",
    color: "#ffab7b",
    tracks: ["A Love Supreme Acknowledgement", "Giant Steps", "Good Bait"],
  },
  {
    path: `${base}mingus.glb`,
    label: "Charles Mingus",
    description: "Bassist, composer, force of nature. Mingus bent jazz toward raw emotion and social fury, refusing to let the music stay comfortable.",
    color: "#a8d5a2",
    tracks: ["Pithecantropus Erectus", "Haitian Fight Song", "The Shoes of the Fisherman's Wife"],
  },
  {
    path: `${base}davis.glb`,
    label: "Miles Davis",
    description: "Cool, then modal, then electric. Miles reinvented jazz five times over and made silence sound as essential as any note.",
    color: "#ffd97d",
    tracks: ["So What", "I Loves You Porgy", "Bitches Brew"],
  },
  {
    path: `${base}rollins.glb`,
    label: "Sonny Rollins",
    description: "The Colossus. Rollins built solos like cathedrals — long, searching, and structurally inevitable, with a tenor tone that could fill any room on earth.",
    color: "#a8d8ea",
    tracks: ["God Bless the Child", "You Don't Know What Love Is", "East Broadway Run Down"],
  },
  {
    path: `${base}monk.glb`,
    label: "Thelonious Monk",
    description: "Angular, deliberate, sui generis. Monk's compositions sound like no one else's — architecture built from wrong notes that turn out to be exactly right.",
    color: "#c3a6f5",
    tracks: ["Ruby My Dear", "Straight No Chaser", "Lulu's Back in Town"],
  },
];
