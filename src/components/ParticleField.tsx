"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type ParticleFieldProps = {
  /** CSS hex colors — defaults to your Rose Quartz / Serenity pair */
  colors?: [string, string];
  count?: number;
  className?: string;
};

export default function ParticleField({
  colors = ["#f7cac9", "#92a8d1"], // rose-quartz, serenity
  count = 1200,
  className = "",
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    // split the particles into two groups so we get two colors, no per-vertex shader needed
    const groupA = new THREE.BufferGeometry();
    const groupB = new THREE.BufferGeometry();
    const countA = Math.floor(count / 2);
    const countB = count - countA;

    const fillPositions = (n: number) => {
      const arr = new Float32Array(n * 3);
      for (let i = 0; i < n * 3; i++) arr[i] = (Math.random() - 0.5) * 8;
      return arr;
    };

    groupA.setAttribute("position", new THREE.BufferAttribute(fillPositions(countA), 3));
    groupB.setAttribute("position", new THREE.BufferAttribute(fillPositions(countB), 3));

    const materialA = new THREE.PointsMaterial({
      size: 0.05,
      color: new THREE.Color(colors[0]),
      transparent: true,
      opacity: 1,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const materialB = new THREE.PointsMaterial({
      size: 0.04,
      color: new THREE.Color(colors[1]),
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const pointsA = new THREE.Points(groupA, materialA);
    const pointsB = new THREE.Points(groupB, materialB);
    scene.add(pointsA, pointsB);

    const cursor = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      cursor.x = e.clientX / window.innerWidth - 0.5;
      cursor.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("mousemove", onMouseMove);

    let frameId: number;
    const clock = new THREE.Clock();

    const tick = () => {
      const t = clock.getElapsedTime();
      pointsA.rotation.y = t * 0.03;
      pointsB.rotation.y = -t * 0.02;
      pointsA.rotation.x = t * 0.01;

      camera.position.x += (cursor.x * 0.6 - camera.position.x) * 0.02;
      camera.position.y += (-cursor.y * 0.6 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      const { clientWidth, clientHeight } = canvas;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight, false);
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      resizeObserver.disconnect();
      groupA.dispose();
      groupB.dispose();
      materialA.dispose();
      materialB.dispose();
      renderer.dispose();
    };
  }, [colors, count]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}