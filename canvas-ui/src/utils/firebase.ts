import {
  FIREBASE_API_KEY,
  leader,
  node,
  shouldClearCanvas,
} from "@/consts/config";
import { initializeApp } from "firebase/app";
import {
  child,
  get,
  getDatabase,
  onValue,
  push,
  ref,
  set,
} from "firebase/database";

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "canvas-irvinehacks.firebaseapp.com",
  projectId: "canvas-irvinehacks",
  databaseURL: "https://canvas-irvinehacks-default-rtdb.firebaseio.com/",
  storageBucket: "canvas-irvinehacks.appspot.com",
  messagingSenderId: "670447803617",
  appId: "1:670447803617:web:37307b236800726e05aba0",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export const registerNode = async () => {
  if (node.id === "") {
    // const id = push(ref(db, "nodes"), new Date().toJSON()).key;
    // node.id = id ?? "";
    node.id = generateId();
  }
  setInterval(async () => {
    set(ref(db, "nodes/" + node.id), new Date().toJSON());
  }, 250);
};

export const uploadState = async (state: string) => {
  set(ref(db, "canvas-state"), state);
};

export const downloadState = async () => {
  const snapshot = await get(child(ref(db), "canvas-state"));
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return null;
  }
};

const generateId = () => {
  const id = Math.floor(10000000 + Math.random() * 90000000)
    .toString()
    .substring(0, 6);
  return id;
};

// Listen for leader changes
onValue(ref(db, "leader"), (snapshot) => {
  const data = snapshot.val();
  console.log("new leader: ", data);
  leader.id = data;
  node.leader = leader.id == node.id;
});

// Listen for canvas state changes
onValue(ref(db, "canvas-state"), (snapshot) => {
  const data = snapshot.val();
  if (data == "empty") {
    shouldClearCanvas.value = true;
  }
});
