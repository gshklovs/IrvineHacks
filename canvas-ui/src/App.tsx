import "./App.css";
import React from "react";
import { useToast } from "./components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Button } from "./components/ui/button";
import { BACKEND_SOCKET_URL } from "./consts/config";

const socket = io(`ws://${BACKEND_SOCKET_URL}`);

function App() {
  const { toast } = useToast();
  const [serverMessage, setServerMessage] = React.useState(null);

  React.useEffect(() => {}, []);

  socket.on("from-server", (msg) => {
    setServerMessage(msg);
    toast({
      title: "Server message",
      description: msg,
    });
  });

  const sendToServer = () => {
    socket.emit("to-server", "hello");
  };

  return (
    <>
      <div className="flex">
        <div className="h-screen w-full overflow-y-auto bg-black">
          <div className="flex flex-col p-16">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              Canvas
            </h1>
            <p className="mt-4">
              Server: <span>{serverMessage}</span>
            </p>
            <div className="mt-2">
              <Button onClick={sendToServer}>Send</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
