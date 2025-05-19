import { useEffect, useState } from "react";
import HeroContent from "../components/HomeComponents/HeroContent";
import Background from "../components/HomeComponents/Background/Background";
import Circle1 from "../components/HomeComponents/Background/Circle1";
import Circle2 from "../components/HomeComponents/Background/Circle2";
import Circle3 from "../components/HomeComponents/Background/Circle3";
import Navbar from "../components/HomeComponents/Navbar";
import Message from "../components/HomeComponents/Message";
import Footer from "../components/HomeComponents/Footer";
import Cta from "../components/HomeComponents/Cta";
import Testimonial from "../components/HomeComponents/Testimonial";
import Features from "../components/HomeComponents/Features";
import Loader from "../components/Loader";
import HowtoUse from "../components/HomeComponents/HowtoUse";
import StatsSection from "../components/HomeComponents/StatsSection";

const Home = () => {
  // loader start
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);
  // loder ends

  return loading ? (
    <Loader type="text" size="lg" fullScreen={true} text="Webmark" />
  ) : (
    <>
      <Navbar />
      <main className="flex-grow">
        <section className="relative">
          <Background />
          <Circle1 />
          <Circle2 />
          <Circle3 />
          <HeroContent />
        </section>
        <Message />
        <Features />
        <StatsSection />
        <HowtoUse />
        <Testimonial />
        <Cta />
      </main>
      <Footer />
    </>
  );
};

export default Home;
