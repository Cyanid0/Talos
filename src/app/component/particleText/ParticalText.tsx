"use client";
import React, { useRef, useEffect, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture, useFont } from "@react-three/drei";
import akiraFont from "./asset/Akira Expanded_Super Bold.json";

interface ParticleData {
  amount: number;
  particleSize: number;
  particleColor: number;
  textSize: number;
  area: number;
  ease: number;
}

interface ParticleTextProps {
  text: string;
}

const fragmentShader = `
  uniform vec3 color;
  uniform sampler2D pointTexture;
  varying vec3 vColor;
  void main() {
    gl_FragColor = vec4(color * vColor, 1.0);
    gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
  }
`;

const vertexShader = `
  attribute float size;
  attribute vec3 customColor;
  varying vec3 vColor;
  void main() {
    vColor = customColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const ParticleText: React.FC<ParticleTextProps> = ({ text }) => {
  const font = useFont(akiraFont as any);
  const particleImg = useTexture(
    "https://res.cloudinary.com/dfvtkoboz/image/upload/v1605013866/particle_a64uzf.png"
  );
  const { camera, size } = useThree();
  const planeRef = useRef<THREE.Mesh>(null);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouse = useMemo(() => new THREE.Vector2(0, 0), []);

  const [particles, setParticles] = useState<THREE.Points | null>(null);
  const [disperse, setDisperse] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [transform, setTransform] = useState(false);

  const data: ParticleData = useMemo(
    () => ({
      amount: 1500,
      particleSize: 1,
      particleColor: 0xffffff,
      textSize: 16,
      area: 200,
      ease: 0.01,
    }),
    []
  );

  const createParticles = (text: string): THREE.BufferGeometry | null => {
    if (!font) return null;

    const shapes = font.generateShapes(text, data.textSize);
    const geometry = new THREE.ShapeGeometry(shapes);
    geometry.computeBoundingBox();

    const xMid =
      -0.5 * (geometry.boundingBox!.max.x - geometry.boundingBox!.min.x);
    const yMid =
      (geometry.boundingBox!.max.y - geometry.boundingBox!.min.y) / 2.85;

    geometry.center();

    const holeShapes: THREE.Shape[] = [];
    shapes.forEach((shape) => {
      if (shape.holes && shape.holes.length > 0) {
        shape.holes.forEach((hole) => {
          holeShapes.push(hole as any);
        });
      }
    });
    shapes.push(...holeShapes);

    const thePoints: THREE.Vector3[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];

    shapes.forEach((shape) => {
      const amountPoints =
        shape.type === "Path" ? data.amount / 2 : data.amount;
      const points = shape.getSpacedPoints(amountPoints);
      points.forEach((point) => {
        thePoints.push(new THREE.Vector3(point.x, point.y, 0));
        colors.push(1, 1, 1);
        sizes.push(1);
      });
    });

    const geoParticles = new THREE.BufferGeometry().setFromPoints(thePoints);
    geoParticles.translate(xMid, yMid, 0);
    geoParticles.setAttribute(
      "customColor",
      new THREE.Float32BufferAttribute(colors, 3)
    );
    geoParticles.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(sizes, 1)
    );

    return geoParticles;
  };

  useEffect(() => {
    if (!font || !particleImg) return;

    const initialParticles = createParticles(text);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0xffffff) },
        pointTexture: { value: particleImg },
      },
      vertexShader,
      fragmentShader,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
    });

    setParticles(new THREE.Points(initialParticles!, material));

    const timer = setTimeout(() => {
      setDisperse(true);
      setTimeout(() => {
        setDisperse(false);
        setTransitionProgress(0);
        setTransform(true);
      }, 2000);
    }, 5000);

    return () => clearTimeout(timer);
  }, [font, particleImg, text]);

  useEffect(() => {
    mouse.set(-1, -1);

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / size.width) * 2 - 1;
      mouse.y = -(event.clientY / size.height) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouse, size]);

  useFrame(() => {
    if (!particles || !planeRef.current) return;

    const pos = particles.geometry.attributes.position.array as Float32Array;
    const colors = particles.geometry.attributes.customColor.array as Float32Array;
    const sizes = particles.geometry.attributes.size.array as Float32Array;

    if (disperse) {
      for (let i = 0; i < pos.length; i += 3) {
        pos[i] += (Math.random() - 0.5) * 20;
        pos[i + 1] += (Math.random() - 0.5) * 20;
        pos[i + 2] += (Math.random() - 0.5) * 20;
      }
    } else if (transform) {
      const targetParticles = createParticles("TALOS");
      if (targetParticles) {
        const targetPos = targetParticles.attributes.position.array as Float32Array;
        for (let i = 0; i < pos.length; i += 3) {
          pos[i] += (targetPos[i] - pos[i]) * 0.05;
          pos[i + 1] += (targetPos[i + 1] - pos[i + 1]) * 0.05;
          pos[i + 2] += (targetPos[i + 2] - pos[i + 2]) * 0.05;
        }
        setTransitionProgress((prev) => (prev >= 1 ? 1 : prev + 0.01));
      }
    }

    particles.geometry.attributes.position.needsUpdate = true;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(planeRef.current!);
    if (intersects.length > 0) {
      const mx = intersects[0].point.x;
      const my = intersects[0].point.y;
      for (let i = 0; i < pos.length; i += 3) {
        const colorChange = new THREE.Color();
        colorChange.setHSL(0.5, 1, 1);
        colors[i] = colorChange.r;
        colors[i + 1] = colorChange.g;
        colors[i + 2] = colorChange.b;

        sizes[i / 3] = data.particleSize;

        let dx = mx - pos[i];
        let dy = my - pos[i + 1];

        const mouseDistance = Math.sqrt(dx * dx + dy * dy);
        const d = dx * dx + dy * dy;
        const f = -data.area / d;

        if (mouseDistance < data.area) {
          const t = Math.atan2(dy, dx);
          pos[i] += f * Math.cos(t);
          pos[i + 1] += f * Math.sin(t);

          colorChange.setHSL(0.15, 1.0, 0.5);
          colors[i] = colorChange.r;
          colors[i + 1] = colorChange.g;
          colors[i + 2] = colorChange.b;

          sizes[i / 3] = data.particleSize * 1.3;
        }
      }

      particles.geometry.attributes.position.needsUpdate = true;
      particles.geometry.attributes.customColor.needsUpdate = true;
      particles.geometry.attributes.size.needsUpdate = true;
    }
  });

  return (
    <group>
      {particles && <primitive object={particles} />}
      <mesh ref={planeRef} visible={false}>
        <planeGeometry args={[1000, 1000]} />
        <meshBasicMaterial color={0x00ff00} transparent opacity={0.1} />
      </mesh>
    </group>
  );
};

export default ParticleText;
