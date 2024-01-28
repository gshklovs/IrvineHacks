import { FIREBASE_API_KEY, leader, node, nodeID } from "@/consts/config";
import { initializeApp } from "firebase/app";
import { getDatabase, onValue, push, ref, set } from "firebase/database";

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
    let id = push(ref(db, "nodes"), new Date().toJSON()).key;
    node.id = id ?? "";
  }
  setInterval(async () => {
    set(ref(db, "nodes/" + node.id), new Date().toJSON());
  }, 1000);
};

onValue(ref(db, "leader"), (snapshot) => {
  const data = snapshot.val();
  console.log("leader: ", data);
  leader.id = data;
  node.leader = leader.id == node.id;
});
