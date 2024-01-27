export const drawHoverCircle = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  x: number,
  y: number,
) => {
  if (canvasRef.current) {
    let canvas = canvasRef.current;
    let width = canvas?.width;
    let height = canvas?.height;
    let ctx = canvas ? canvas.getContext("2d") : null;
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.arc(x * width, y * height, 16, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }
};

export const drawPoint = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  x: number,
  y: number,
) => {
  if (canvasRef.current) {
    let canvas = canvasRef.current;
    let ctx = canvas ? canvas.getContext("2d") : null;
    let width = canvas?.width;
    let height = canvas?.height;
    if (ctx) {
      ctx.beginPath();
      ctx.fillStyle = "black";
      ctx.fillRect(x * width, y * height, 4, 4);
      ctx.stroke();
    }
  }
};

export const clearTransparentCanvas = (
  transparentCanvasRef: React.RefObject<HTMLCanvasElement>,
) => {
  if (transparentCanvasRef.current) {
    let canvas = transparentCanvasRef.current;
    let ctx = canvas ? canvas.getContext("2d") : null;
    let width = canvas?.width;
    let height = canvas?.height;
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
    }
  }
};
