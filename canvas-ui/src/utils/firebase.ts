import { FIREBASE_API_KEY, leader, node, nodeID } from "@/consts/config";
import { initializeApp } from "firebase/app";
import { get, getDatabase, ref } from "firebase/database";

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "canvas-irvinehacks.firebaseapp.com",
  projectId: "canvas-irvinehacks",
  databaseURL: "https://canvas-irvinehacks.firebaseio.com",
  storageBucket: "canvas-irvinehacks.appspot.com",
  messagingSenderId: "670447803617",
  appId: "1:670447803617:web:37307b236800726e05aba0",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export const getNodes = async () => {
  console.log("getting nodes");
  get(ref(db, "nodes")).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
    } else {
      console.log("No data available");
    }
  });
};

// export const registerNode = async () => {
//   if (node.id === "") {
//     const docRef = await addDoc(collection(db, "nodes"), {
//       age: new Date(),
//     });
//     node.id = docRef.id;
//   }
//   setInterval(async () => {
//     await updateDoc(doc(db, `nodes/${node.id}`), {
//       age: new Date(),
//     });
//   }, 1000);
// };

// const listenForLeader = onSnapshot(doc(db, "nodes/leader"), (doc) => {
//   if (doc.exists()) {
//     let leaderId = doc.data().id;
//     console.log("New leader: ", leaderId);
//     if (leaderId === node.id) {
//       node.leader = true;
//       console.log("I am the leader!");
//     }
//     leader.id = leaderId;
//   }
// });
