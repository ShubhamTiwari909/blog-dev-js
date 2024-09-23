"use client";
import createGlobe from "cobe";
import { useEffect, useRef } from "react";

export function Cobe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const focusRef = useRef([0, 0]);
  const locationToAngles = (lat: number, long: number) => {
    return [
      Math.PI - ((long * Math.PI) / 180 - Math.PI / 2),
      (lat * Math.PI) / 180,
    ];
  };
  useEffect(() => {
    let phi = 0;
    let width = 0;

    const onResize = () =>
      canvasRef.current &&
      (width = (canvasRef.current as HTMLCanvasElement).offsetWidth);
    window.addEventListener("resize", onResize);
    onResize();

    if (canvasRef.current) {
      const globe = createGlobe(canvasRef?.current, {
        devicePixelRatio: 2,
        width: width * 1.2,
        height: width * 1.2,
        phi: 0.3,
        theta: 0.8,
        dark: 1,
        diffuse: 2,
        mapSamples: 40000,
        mapBrightness: 3,
        baseColor: [0.3, 0.5, 0.8],
        markerColor: [251 / 255, 100 / 255, 21 / 255],
        glowColor: [0.3, 0.5, 0.8],
        markers: [],
        onRender: (state) => {
          // Called on every animation frame.
          // `state` will be an empty object, return updated params.
          state.phi = phi;
          phi += 0.005;
          state.width = width * 2;
          state.height = width * 2;
        },
      });
      setTimeout(() => {
        if (canvasRef.current) {
          (canvasRef.current as HTMLCanvasElement).style.opacity = "1";
        }
      });
      return () => {
        globe.destroy();
        window.removeEventListener("resize", onResize);
      };
    } else {
      console.error("Canvas element not found");
    }
  }, []);
  return (
    <div className="w-full max-w-[600px] aspect-square m-auto relative px-5">
      <canvas
        ref={canvasRef}
        style={{
          contain: "layout paint size",
        }}
        className="w-full h-full opacity-0 transition-all duration-1000 ea"
      />
    </div>
  );
}
