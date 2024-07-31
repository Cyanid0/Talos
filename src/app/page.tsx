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
  }
);

const Home = () => {
  return (
    <div className="flex-shrink h-screen w-screen overflow-hidden">
      <link rel="icon" href="/Logo.png" sizes="any" />
      <Navbar />
      <Suspense
        fallback={
          <div className="flex justify-center h-screen w-screen items-center text-white">
            Loading...
          </div>
        }
      >
        <Canvas className="z-[-1]" camera={{ position: [0, 0, 100], fov: 65 }}>
          <ParticleText text="Be Vigil" />
        </Canvas>
      </Suspense>

      <Footer />
    </div>
  );
};

export default Home;
