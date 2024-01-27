import "./App.css";
import React from "react";
import { useToast } from "./components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Button } from "./components/ui/button";
import { BACKEND_SOCKET_URL } from "./consts/config";
import getObjectFitSize from "./utils/getObjectFitSize";

const socket = io(`ws://${BACKEND_SOCKET_URL}`);

function App() {
  const { toast } = useToast();
  const [serverMessage, setServerMessage] = React.useState(null);
  const [src, setSrc] = React.useState("");

  const sendToServer = () => {
    socket.emit("to-server", "hello");
  };

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const displayRef = React.useRef<HTMLCanvasElement>(null);

  function calibrateCanvas(canvasRef: React.RefObject<HTMLCanvasElement>) {
    if (canvasRef.current) {
      const originalHeight = canvasRef.current?.height;
      const originalWidth = canvasRef.current?.width;
      var myCanvas = canvasRef.current;
      let dimensions = getObjectFitSize(
        true,
        myCanvas.clientWidth,
        myCanvas.clientHeight,
        myCanvas.width,
        myCanvas.height,
      );
      const dpr = window.devicePixelRatio || 1;
      if (canvasRef.current) {
        canvasRef.current.width = dimensions.width * dpr;
        canvasRef.current.height = dimensions.height * dpr;
      }

      let ctx = myCanvas.getContext("2d");
      console.log("ctx in rescale", ctx);
      let ratio = Math.min(
        myCanvas.clientWidth / originalWidth,
        myCanvas.clientHeight / originalHeight,
      );
      if (ctx) {
        ctx.scale(ratio * dpr, ratio * dpr); //adjust this!
      }
    }
  }

  const drawHoverCircle = (x: number, y: number) => {
    if (canvasRef.current) {
      let canvas = canvasRef.current;
      let width = canvas?.width;
      let height = canvas?.height;
      let ctx = canvas ? canvas.getContext("2d") : null;
      if (ctx) {
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.arc(x * width, y * height, 16, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const drawPoint = (x: number, y: number) => {
    if (canvasRef.current) {
      let canvas = canvasRef.current;
      let ctx = canvas ? canvas.getContext("2d") : null;
      let width = canvas?.width;
      let height = canvas?.height;
      if (ctx) {
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.fillRect(x * width, y * height, 1, 1);
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

  socket.on("from-server", (msg) => {
    setServerMessage(msg);
    toast({
      title: "Server message",
      description: msg,
    });
    console.log("msg", msg);
    var json = JSON.parse(msg);
    drawHoverCircle(json["x"], json["y"]);
  });

  React.useEffect(() => {
    calibrateCanvas(canvasRef);
  }, []);

  return (
    <>
      <div className="flex">
        <div className="h-screen w-full overflow-y-auto bg-black">
          <div className="flex flex-col p-16">
            <h1 className="w-full text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
              Canvas
            </h1>
            <div className="absolute right-0 top-0 m-8 h-32 w-64 rounded-xl border-2 border-yellow-700 bg-slate-500 bg-opacity-50 p-4">
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
