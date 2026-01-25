import { useEffect, useRef } from 'react';

export default function HeartbeatWaveform({ color = '#4A90E2', height = 100, speed = 2 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const centerY = canvas.height / 2;
    let offset = 0;

    const drawWaveform = () => {
      ctx.clearRect(0, 0, width, canvas.height);
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const segment = ((x + offset) % 200) / 200;
        let y = centerY;

        if (segment < 0.1) {
          y = centerY;
        } else if (segment < 0.15) {
          y = centerY - 10;
        } else if (segment < 0.2) {
          y = centerY + 40;
        } else if (segment < 0.25) {
          y = centerY - 60;
        } else if (segment < 0.3) {
          y = centerY + 20;
        } else if (segment < 0.35) {
          y = centerY - 10;
        } else {
          y = centerY;
        }

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      offset += speed;
      requestAnimationFrame(drawWaveform);
    };

    drawWaveform();
  }, [color, speed]);

  return (
    <canvas
      ref={canvasRef}
      width={1200}
      height={height}
      className="w-full opacity-30"
      style={{ maxWidth: '100%' }}
    />
  );
}
