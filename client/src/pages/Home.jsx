import React, { useEffect, useState } from "react";
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
import Features1 from "../components/HomeComponents/Features1";
import Features2 from "../components/HomeComponents/Features2";
import Loader from "../components/Loader";
import HowtoUse from "../components/HomeComponents/HowtoUse";
import About from "../components/HomeComponents/About";

const Home = () => {
  // loader start
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);
  // loder ends

  return loading ? (
    <Loader />
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
        <Features1 />
        <Features2 />
        <HowtoUse />
        <Testimonial />
        <About />
        <Cta />
      </main>
      <Footer />
    </>
  );
};

export default Home;
