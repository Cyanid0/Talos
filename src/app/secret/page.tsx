"use client";

import { useState, useEffect } from "react";
import TextScramble from "../component/glitch";
import face1 from "@/../public/face1.png";
import CrossExplosion from "../component/particle";

const SecretPage: React.FC = () => {
  const [flipStyles, setFlipStyles] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [failed, setFailed] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [particles, setParticles] = useState<JSX.Element[]>([]);
  const [showExplosion, setShowExplosion] = useState(false);

  useEffect(() => {
    // Initialize maxAttempts randomly to 1 or 2
    setMaxAttempts(Math.random() < 0.5 ? 1 : 2);
  }, []);

  useEffect(() => {
    // Reset 'failed' state after animation duration
    if (failed) {
      const timeout = setTimeout(() => {
        setFailed(false);
      }, 5000); // Match animation duration

      return () => clearTimeout(timeout);
    }
  }, [failed]);

  const handleClick = () => {
    if (flipped) return;

    if (attempt < maxAttempts) {
      // Trigger a failed flip animation
      triggerFailedFlip();
    } else {
      // Trigger successful flip and explosion
      triggerSuccessfulFlip();
    }
  };

  const triggerFailedFlip = () => {
    const nudgeTranslateY = (Math.random() - 0.5) * 10; // Random Y nudge
    const nudgeTranslateX = (Math.random() - 0.5) * 10; // Random X nudge
    const randomRotateX = (Math.random() - 0.5) * 50; // RotateX: -25° to 25°
    const randomRotateY = (Math.random() - 0.5) * 50; // RotateY: -25° to 25°
    const randomRotateZ = (Math.random() - 0.5) * 10; // RotateZ: -5° to 5°

    setFlipStyles(
      `perspective(500px) rotateX(${randomRotateX}deg) rotateY(${randomRotateY}deg) rotateZ(${randomRotateZ}deg) translateX(${nudgeTranslateX}px) translateY(${nudgeTranslateY}px)`,
    );

    setTimeout(() => {
      setFlipStyles("perspective(500px)");
    }, 300);

    setAttempt((prev) => prev + 1);
    setFailed(true);
  };

  const triggerSuccessfulFlip = () => {
    setFailed(false);
    setFlipped(true);

    const flipOnX = Math.random() < 0.5;
    const randomRotateX = flipOnX ? 180 : (Math.random() - 0.5) * 40;
    const randomRotateY = flipOnX ? (Math.random() - 0.5) * 40 : 180;
    const randomRotateZ = (Math.random() - 0.5) * 30;

    const translateX = (Math.random() - 0.5) * 60;
    const translateY = -100 + (Math.random() - 0.5) * 40;

    setFlipStyles(
      `perspective(500px) 
       rotateX(${randomRotateX}deg) 
       rotateY(${randomRotateY}deg) 
       rotateZ(${randomRotateZ}deg) 
       translateX(${translateX}px) 
       translateY(${translateY}px) 
       scale(3)`,
    );

    setTimeout(() => {
      setFlipStyles(
        `perspective(500px) 
         rotateX(${randomRotateX}deg) 
         rotateY(${randomRotateY}deg) 
         rotateZ(${Math.round(randomRotateZ / 360) * 360}deg) 
         translateX(${translateX}px) 
         translateY(${translateY}px) 
         scale(1)`,
      );
      setShowExplosion(true);
    }, 200);
  };

  return (
    <div
      className="h-screen w-screen flex flex-col items-center relative overflow-hidden"
      style={{
        background: `
          linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.3)),
          url(${face1.src})
        `,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="flex justify-center items-center h-1/2 bg-auto">
        {failed ? (
          <TextScramble
            phrases={["Failed"]}
            className="text-xl lg:text-5xl text-red-900"
          />
        ) : flipped ? (
          <div className="flex flex-col items-center">
            <TextScramble
              phrases={["Neural Nexus Unveils Epoch"]}
              onlyOnce={true}
              className="text-2xl lg:text-5xl text-green-500"
            />
            <TextScramble
              phrases={["Keep Vigil", "#talos 4.0"]}
              className="text-2xl lg:text-5xl text-green-600"
            />
          </div>
        ) : (
          <TextScramble
            phrases={["Flip the paper?"]}
            className="text-xl lg:text-5xl"
          />
        )}
      </div>
      <div
        className={`w-40 h-40 relative transform-gpu transition-all ease-linear duration-300`}
        style={{
          transform: flipStyles || "perspective(500px)",
          transformStyle: "preserve-3d",
        }}
        onClick={handleClick}
      >
        {/* Front Face */}
        <div
          className="absolute w-full h-full bg-red-500 backface-hidden"
          style={{
            backfaceVisibility: "hidden",
          }}
        ></div>
        {/* Back Face */}
        <div
          className="absolute w-full h-full bg-blue-500 backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* X Marks on the Back Face */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-black transform rotate-45"></div>
          <div className="absolute top-1/2 left-0 w-full h-1 bg-black transform -rotate-45"></div>
        </div>
        {showExplosion && <CrossExplosion />}
      </div>
    </div>
  );
};

export default SecretPage;

