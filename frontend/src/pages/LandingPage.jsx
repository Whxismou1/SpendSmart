import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { HeroContent } from "./HeroContent";

const LandingPage = () => {
  return (
    <div  className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      <Navbar /> 
      <HeroContent/>
      <Footer />
    </div>
  );
};

export default LandingPage;
