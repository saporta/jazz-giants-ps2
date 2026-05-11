const base = import.meta.env.BASE_URL;

export const MODELS = [
  {
    path: `${base}coltrane.glb`,
    label: "John Coltrane",
    description: "The relentless seeker. Coltrane pushed the saxophone past its limits and into something closer to prayer — from the velocity of Giant Steps to the transcendence of A Love Supreme. No one in jazz searched harder, or went further.",
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
  {
    path: `${base}shorter.glb`,
    label: "Wayne Shorter",
    description: "The enigma. Shorter wrote melodies that seemed to arrive from another dimension — elusive, elliptical, and unforgettable. His tenor and soprano spoke in riddles that still haven't been fully decoded.",
    color: "#f7c5d0",
    tracks: ["Infant Eyes", "Fee Fi Fo Fum", "Miyako"],
  },
  {
    path: `${base}hancock.glb`,
    label: "Herbie Hancock",
    description: "A pianist who never stopped asking what jazz could become. From modal Miles to funk to electronica, Hancock moved across idioms with a curiosity that never felt like restlessness.",
    color: "#b5d5f5",
    tracks: ["Maiden Voyage", "Watermelon Man", "Cantaloupe Island"],
  },
  {
    path: `${base}lateef.glb`,
    label: "Yusef Lateef",
    description: "A traveler without borders. Lateef wove Middle Eastern scales, African rhythms, and Eastern philosophy into jazz decades before world music had a name, playing flute, oboe, and tenor with equal authority.",
    color: "#d4e8b0",
    tracks: ["The Plum Blossom", "Sister Mamie", "Love Theme From Spartacus"],
  },
  {
    path: `${base}dolphy.glb`,
    label: "Eric Dolphy",
    description: "Out to lunch — literally and figuratively. Dolphy's alto, bass clarinet, and flute pushed so far outside conventional harmony that every phrase sounded like a question the music itself hadn't thought to ask.",
    color: "#fde8a8",
    tracks: ["Hat and Beard", "Something Sweet Something Tender", "Out to Lunch"],
  },
  {
    path: `${base}blakey.glb`,
    label: "Art Blakey",
    description: "The hardest swinger in the room. Blakey's drums didn't keep time — they created gravity. As the engine of the Jazz Messengers, he launched more careers than any conservatory.",
    color: "#f0c8a0",
    tracks: ["Moanin", "Blues March", "Along Came Betty"],
  },
];
