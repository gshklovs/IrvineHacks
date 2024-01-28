export const BACKEND_SOCKET_URL =
  import.meta.env.VITE_BACKEND_SOCKET_URL ?? "localhost:30000";

export const FIREBASE_API_KEY =
  import.meta.env.VITE_FIREBASE_API_KEY ?? "MISSING FIREBASE API KEY";

export const node = { id: "", leader: false };
export const leader = { id: "" };

export const shouldClearCanvas = { value: false };

export const lastCoords = [
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
];

export const handColors = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "pink",
  "brown",
  "black",
];
