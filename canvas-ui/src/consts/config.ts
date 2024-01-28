export const BACKEND_SOCKET_URL =
  import.meta.env.VITE_BACKEND_SOCKET_URL ?? "localhost:30000";

export const FIREBASE_API_KEY =
  import.meta.env.VITE_FIREBASE_API_KEY ?? "MISSING FIREBASE API KEY";

export var node = { id: "", leader: false };
export var leader = { id: "" };

export var lastCoords = [
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
];

export var handColors = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "pink",
  "brown",
  "black",
];
