import TextScramble from "@/app/component/glitch/index";
const footer = () => {
  const phrases = [
    "Stay Tuned...",
    "Towards Advanced Level Of Science",
    "Be Vigil",
  ];
  return (
    <div className="absolute flex justify-center bottom-0 w-full h-1/4">
      <TextScramble phrases={phrases} className="lg:text-5xl"/>
    </div>
  );
};

export default footer;
