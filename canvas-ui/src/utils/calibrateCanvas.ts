import getObjectFitSize from "./getObjectFitSize";
import React from "react";

export default function calibrateCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement>,
) {
  if (canvasRef.current) {
    const originalHeight = canvasRef.current?.height;
    const originalWidth = canvasRef.current?.width;
    const myCanvas = canvasRef.current;
    const dimensions = getObjectFitSize(
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

    const ctx = myCanvas.getContext("2d");
    console.log("ctx in rescale", ctx);
    const ratio = Math.min(
      myCanvas.clientWidth / originalWidth,
      myCanvas.clientHeight / originalHeight,
    );
    if (ctx) {
      ctx.scale(ratio * dpr, ratio * dpr); //adjust this!
    }
  }
}
