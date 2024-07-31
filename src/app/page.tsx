"use client";
import { Canvas } from "@react-three/fiber";
import Navbar from "./component/topBar";
import dynamic from "next/dynamic";
import Footer from "./component/footer/index";
import { Suspense } from "react";

const ParticleText = dynamic(
  () => import("./component/particleText/ParticalText"),
  {
    ssr: false,
  },
);

const Home = () => {
  return (
    <div className="flex-shrink h-screen w-screen overflow-hidden">
      <Navbar />
      <Canvas className="z-[-1]" camera={{ position: [0, 0, 100], fov: 65 }}>
        <ParticleText text="Be Vigil" />
      </Canvas>
      <Footer />
    </div>
  );
};

export default Home;
