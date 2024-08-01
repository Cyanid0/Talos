import Image from "next/image";
import Logo from "@/../public/Logo.png"
import ClgLogo from "@/../public/CIT White.png"
const Navbar = () => {
  return (
    <div className="absolute top-0 flex justify-between items-center px-5 pl-0 pt-14 w-full h-[40px] z-100">
      <Image src={Logo} alt="logo" className="w-[120px] pt-5" />
      <Image src={ClgLogo} alt="logo" className="w-[120px]" />
    </div>
  );
};

export default Navbar;

