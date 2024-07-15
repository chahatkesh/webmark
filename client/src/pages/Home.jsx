import React from "react";
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

const Home = () => {
  return (
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
        <Testimonial />
        <Cta />
      </main>
      <Footer />
    </>
  );
};

export default Home;
