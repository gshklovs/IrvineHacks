import { handColors, lastCoords } from "@/consts/config";
import { uploadState } from "./firebase";

export const drawHoverCircle = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  hands: Array<any>,
) => {
  if (canvasRef.current) {
    const canvas = canvasRef.current;
    const width = canvas?.width;
    const height = canvas?.height;
    const ctx = canvas ? canvas.getContext("2d") : null;
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < hands.length; i++) {
        const hand = hands[i];
        const x = hand.x;
        const y = hand.y;
        ctx.strokeStyle = handColors[i];
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.arc(x * width, y * height, 16, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  }
};

export const drawLine = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  index: number,
  x: number,
  y: number,
) => {
  if (canvasRef.current) {
    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext("2d") : null;
    const width = canvas?.width;
    const height = canvas?.height;
    if (ctx) {
      //choose a random color
      ctx.strokeStyle = handColors[index];
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(lastCoords[index].x * width, lastCoords[index].y * height);
      ctx.lineTo(x * width, y * height);
      ctx.stroke();
    }
    lastCoords[index] = { x: x, y: y };
  }
};

export const drawLineNoRace = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  index: number,
  x: number,
  y: number,
) => {
  if (canvasRef.current) {
    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext("2d") : null;
    const width = canvas?.width;
    const height = canvas?.height;
    let closestCoordIndex = 0;
    for (let i = 0; i < lastCoords.length; i++) {
      const lastCoord = lastCoords[i];
      if (
        Math.abs(lastCoord.x - x) <
        Math.abs(lastCoords[closestCoordIndex].x - x)
      ) {
        closestCoordIndex = i;
      }
    }
    if (ctx) {
      //choose a random color
      ctx.strokeStyle = handColors[index];
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(
        lastCoords[closestCoordIndex].x * width,
        lastCoords[closestCoordIndex].y * height,
      );
      ctx.lineTo(x * width, y * height);
      ctx.stroke();
    }
    lastCoords[closestCoordIndex] = { x: x, y: y };
  }
};

export const drawPoint = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  x: number,
  y: number,
) => {
  if (canvasRef.current) {
    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext("2d") : null;
    const width = canvas?.width;
    const height = canvas?.height;
    if (ctx) {
      ctx.beginPath();
      ctx.fillStyle = "black";
      ctx.fillRect(x * width, y * height, 4, 4);
      ctx.stroke();
    }
  }
};

export const clearCanvas = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  if (canvasRef.current) {
    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext("2d") : null;
    const width = canvas?.width;
    const height = canvas?.height;
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
      uploadState("empty");
    }
  }
};
