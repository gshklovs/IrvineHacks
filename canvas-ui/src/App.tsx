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
  const [src, setSrc] = React.useState("");

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

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const displayRef = React.useRef<HTMLCanvasElement>(null);

  const drawHoverCircle = (x = 140, y = 100) => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas ? canvas.getContext("2d") : null;
      if (ctx) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const drawPoint = (x = 146, y = 50) => {
    if (canvasRef.current) {
      let canvas = canvasRef.current;
      let ctx = canvas ? canvas.getContext("2d") : null;
      if (ctx) {
        ctx.beginPath();
        ctx.fillRect(x, y, 1, 1);
        ctx.stroke();
      }
    }
  };

  const displayImage = () => {
    if (canvasRef.current) {
      let canvas = canvasRef.current;
      setSrc(canvas.toDataURL("image/png"));
      var img = new Image();
      img.src = src;
      displayRef.current?.getContext("2d")?.drawImage(img, 0, 0);
      console.log("src", src);
    }
  };

  React.useEffect(() => {
    drawHoverCircle();
    drawPoint();
  }, []);

  return (
    <>
      <div className="flex">
        <div className="h-screen w-full overflow-y-auto bg-black">
          <div className="flex flex-col p-16">
            <h1 className="w-full text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
              Canvas
            </h1>
            <div className="border-slate-70 absolute right-0 top-0 m-8 h-64 w-64 rounded-md bg-slate-500 p-4 backdrop-opacity-50">
              <p className="text-2xl text-white opacity-100">Legend</p>
            </div>
            <p className="mt-4">
              Server: <span>{serverMessage}</span>
            </p>
            <div className="mt-2">
              <Button onClick={sendToServer}>Send</Button>
            </div>
            <div className="mt-2">
              <Button onClick={displayImage}>Display Image</Button>
            </div>
            <canvas
              id="canvas"
              ref={canvasRef}
              className=" mx-40 aspect-video min-w-[70%] bg-stone-200"
            ></canvas>
            {src && (
              <>
                <h1 className="w-full text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
                  Result
                </h1>
                <canvas
                  ref={displayRef}
                  className="mx-40 aspect-video bg-blue-200"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
