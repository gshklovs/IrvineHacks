import { FIREBASE_API_KEY, leader, node } from "@/consts/config";
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
    const id = push(ref(db, "nodes"), new Date().toJSON()).key;
    node.id = id ?? "";
  }
  setInterval(async () => {
    set(ref(db, "nodes/" + node.id), new Date().toJSON());
  }, 500);
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

onValue(ref(db, "leader"), (snapshot) => {
  const data = snapshot.val();
  console.log("leader: ", data);
  leader.id = data;
  node.leader = leader.id == node.id;
});
