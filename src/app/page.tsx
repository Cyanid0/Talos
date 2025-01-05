"use client";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import Navbar from "./component/topBar";
import dynamic from "next/dynamic";
import Footer from "./component/footer/index";
import { Suspense } from "react";
import Link from "next/link";

const ParticleText = dynamic(
  () => import("./component/particleText/ParticalText"),
  {
    ssr: false,
  }
);

const Home = () => {
  const [showFooter,setShowFooter] = useState(false);

  useEffect(() => {
  setTimeout(() => {
    setShowFooter(true);
  }, 9000);
    }
  , []);
  return (
    <div className="flex flex-col h-screen items-center justify-center overflow-hidden">
      <Navbar />
      <Suspense
        fallback={
          <div className="flex justify-center h-screen w-screen items-center text-white">
            Loading...
          </div>
        }
      >
        <Canvas className="z-[-1]" camera={{ position: [0, 0, 100], fov: 65 }}>
          <ParticleText text="Keep Vigil" />
        </Canvas>
      </Suspense>
      {showFooter && <Footer />}
    </div>
  );
};

export default Home;
