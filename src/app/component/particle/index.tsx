import React, { useState, useEffect } from "react";

interface ParticleProps {
  size: number;
  angle: number;
  distance: number;
  duration: number;
  color: string;
}

interface Position {
  x: number;
  y: number;
  rotate: number;
}

interface ParticleData extends ParticleProps {
  id: number;
}

interface CrossExplosionProps {
  onComplete?: () => void;
}

const CrossParticle: React.FC<ParticleProps> = ({
  size,
  angle,
  distance,
  duration,
  color,
}) => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0, rotate: 0 });
  const [opacity, setOpacity] = useState<number>(1);

  useEffect(() => {
    const endX = Math.cos(angle) * distance;
    const endY = Math.sin(angle) * distance;
    const rotate = Math.random() * 360;

    setPosition({ x: 0, y: 0, rotate: 0 });

    requestAnimationFrame(() => {
      setPosition({ x: endX, y: endY, rotate });
    });

    const fadeTimer = setTimeout(() => {
      setOpacity(0);
    }, duration * 0.7);

    return () => clearTimeout(fadeTimer);
  }, [angle, distance, duration]);

  return (
    <div
      className="absolute"
      style={{
        transform: `translate(${position.x}px, ${position.y}px) rotate(${position.rotate}deg)`,
        opacity,
        transition: `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${duration * 0.3}ms ease-out`,
      }}
    >
      {/* Horizontal line */}
      <div
        className="absolute"
        style={{
          width: `${size}px`,
          height: "2px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: color,
        }}
      />
      {/* Vertical line */}
      <div
        className="absolute"
        style={{
          width: "2px",
          height: `${size}px`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: color,
        }}
      />
    </div>
  );
};

const CrossExplosion: React.FC<CrossExplosionProps> = ({ onComplete }) => {
  const [particles, setParticles] = useState<ParticleData[]>([]);

  useEffect(() => {
    const particleCount = 150;
    const newParticles: ParticleData[] = Array.from({
      length: particleCount,
    }).map((_, i) => {
      // Generate a random gray value between 128-255 for lighter grays
      const grayValue = Math.floor(Math.random() * 128) + 128;

      return {
        id: i,
        size: Math.random() * 10 + 5, // 5-15px
        angle: (i * 2 * Math.PI) / particleCount + (Math.random() - 0.5) * 0.5,
        distance: 100 + Math.random() * 100, // 100-200px distance
        duration: 500 + Math.random() * 500, // 500-1000ms
        color: `rgb(${grayValue}, ${grayValue}, ${grayValue})`,
      };
    });

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
      if (onComplete) onComplete();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
      {particles.map((particle) => (
        <CrossParticle key={particle.id} {...particle} />
      ))}
    </div>
  );
};

export default CrossExplosion;
