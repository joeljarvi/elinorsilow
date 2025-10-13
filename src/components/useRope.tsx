"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";

export function useRope({
  segmentCount = 12,
  segmentLength = 60,
  ropeColor = "#8b5cf6", // purple
}: {
  segmentCount?: number;
  segmentLength?: number;
  ropeColor?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const { Engine, Render, World, Bodies, Constraint, Runner, Body } = Matter;

    const engine = Engine.create();
    const world = engine.world;
    world.gravity.y = 0; // disable falling

    const canvas = canvasRef.current;
    if (!canvas) return;

    const render = Render.create({
      canvas,
      engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: "transparent",
        wireframes: false,
      },
    });

    // Create rope bodies
    const startX = window.innerWidth / 2;
    const startY = 100;
    const rope: Matter.Body[] = [];

    for (let i = 0; i < segmentCount; i++) {
      const seg = Bodies.circle(startX, startY + i * segmentLength, 2.5, {
        restitution: 0.9,
        friction: 0.2,
        render: { fillStyle: ropeColor },
      });
      rope.push(seg);

      if (i > 0) {
        const constraint = Constraint.create({
          bodyA: rope[i - 1],
          bodyB: rope[i],
          stiffness: 0.9,
          damping: 0.08,
          length: segmentLength,
        });
        World.add(world, constraint);
      }
    }

    // Anchor top point
    const topConstraint = Constraint.create({
      pointA: { x: startX, y: startY },
      bodyB: rope[0],
      stiffness: 1,
    });

    World.add(world, [topConstraint, ...rope]);

    // Run simulation
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // Gentle sway motion
    const sway = () => {
      const swayForce = 0.0003 * Math.sin(Date.now() / 250);
      Body.applyForce(rope[0], rope[0].position, { x: swayForce, y: 0 });
      requestAnimationFrame(sway);
    };
    sway();

    // Cleanup
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      World.clear(world, false);
      Engine.clear(engine);
      if (render.canvas) render.canvas.remove();
    };
  }, [segmentCount, segmentLength, ropeColor]);

  return canvasRef;
}
