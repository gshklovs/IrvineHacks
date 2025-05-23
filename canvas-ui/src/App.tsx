import "./App.css";
import React from "react";
import { useToast } from "./components/ui/use-toast";
import { io } from "socket.io-client";
import { Button } from "./components/ui/button";
import {
  BACKEND_SOCKET_URL,
  lastCoords,
  leader,
  node,
  shouldClearCanvas,
} from "./consts/config";
import openPalm from "./assets/open_palm1.png";
import closedFist from "./assets/closed_fist.png";
import calibrateCanvas from "./utils/calibrateCanvas";
import {
  clearCanvas,
  drawHoverCircle,
  drawLine,
} from "./utils/drawingUtils";
import { downloadState, registerNode, uploadState } from "./utils/firebase";

const socket = io(`ws://${BACKEND_SOCKET_URL}`);

function App() {
  const { toast } = useToast();
  const [serverJSON, setServerJSON] = React.useState([]);
  const [showDebug, setShowDebug] = React.useState(true);

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const transparentCanvasRef = React.useRef<HTMLCanvasElement>(null);

  socket.on("from-server", (msg) => {
    const json = JSON.parse(msg);
    setServerJSON(json);
    let cur_hand;
    let x: number;
    let y: number;
    for (let i = 0; i < json.length; i++) {
      cur_hand = json[i];
      x = cur_hand["x"];
      y = cur_hand["y"];
      if (json[i]["gesture"] == "Closed_Fist") {
        drawLine(canvasRef, i, x, y);
      } else {
        lastCoords[i] = { x: x, y: y };
      }
    }
    drawHoverCircle(transparentCanvasRef, json);
  });

  const recoverCanvasState = async () => {
    const state = await downloadState();
    if (state != null) {
      const ctx = canvasRef.current?.getContext("2d");
      const img = new Image();
      img.onload = function () {
        if (ctx) ctx.drawImage(img, 0, 0);
      };
      img.src = state;
    }
  };

  const saveCanvasState = () => {
    setInterval(() => {
      if (node.leader) {
        const state = canvasRef.current?.toDataURL("image/png");
        if (state != null) {
          uploadState(state);
        }
      } else if (shouldClearCanvas.value) {
        clearCanvas(canvasRef);
        shouldClearCanvas.value = false;
      }
    }, 1000);
  };

  const DebugJsonComponent = ({ json }: { json: any }) => {
    return (
      <div className="ml-4">
        {"{"}
        {Object.keys(json).map((key) => (
          <p className="ml-4" key={key}>
            {key}: {json[key]}
          </p>
        ))}
        {"},"}
      </div>
    );
  };

  React.useEffect(() => {
    calibrateCanvas(canvasRef);
    calibrateCanvas(transparentCanvasRef);
    registerNode();
    recoverCanvasState();
    saveCanvasState();
  }, []);

  return (
    <>
      <div className="flex">
        <div className="h-screen w-full overflow-y-auto bg-black">
          <div className="flex flex-col p-16">
            <h1 className="w-full text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
              Canvas
            </h1>
            <div className="z-2 absolute right-0 top-0 m-8 min-h-48 w-64 rounded-xl border-2 border-yellow-700 bg-slate-500 bg-opacity-50 p-4">
              <p className="pb-2 text-2xl text-white opacity-100">
                How to draw
              </p>
              <p className="text-white opacity-100">Find your cursor: </p>
              <img className="right-0 m-2 h-12 invert" src={openPalm} />
              <p className="text-white opacity-100">Draw: </p>
              <img className=" h-16 invert" src={closedFist} />
            </div>
            <div className="flex flex-row">
              <div className="m-1">
                <Button
                  onClick={() => setShowDebug(!showDebug)}
                  variant="secondary"
                >
                  {showDebug ? "Hide" : "Show"} Debug
                </Button>
              </div>
              <div className="m-1">
                <Button
                  onClick={() => {
                    if (node.leader) {
                      clearCanvas(canvasRef);
                    } else {
                      toast({
                        title: "Error",
                        description: "Only the leader can reset the canvas!",
                      });
                    }
                  }}
                  variant={node.leader ? "secondary" : "outline"}
                >
                  Reset Canvas
                </Button>
              </div>
            </div>
            <pre className={`m-4 ${showDebug ? "visible" : "hidden"}`}>
              <div
                className={`${node.leader ? "text-green-400" : "text-orange-400"}`}
              >
                Leader: {leader.id} {node.leader ? "(ME)" : ""}
              </div>
              <div>ID: {node.id}</div>
              Last Frame: {"["}
              {serverJSON.map((item, index) => {
                return <DebugJsonComponent key={index} json={item} />;
              })}
              {"]"}
              <br />
            </pre>
            <div className="z-0 mt-4 h-[36rem] w-[64rem] border border-yellow-50">
              <canvas
                id="canvas"
                ref={canvasRef}
                className="absolute z-0 h-[36rem] w-[64rem] bg-neutral-100"
              />
              <canvas
                id="transparentCanvas"
                ref={transparentCanvasRef}
                className="z-1 absolute h-[36rem] w-[64rem]"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
