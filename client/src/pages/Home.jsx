import React from "react";
import HeroContent from "../components/HeroContent";
import Background from "../components/Background/Background";
import Circle1 from "../components/Background/Circle1";
import Circle2 from "../components/Background/Circle2";
import Circle3 from "../components/Background/Circle3";
import Navbar from "../components/Navbar";
import Message from "../components/Message";
import Footer from "../components/Footer";
import Cta from "../components/Cta";
import Testimonial from "../components/Testimonial";
import Features1 from "../components/Features1";
import Features2 from "../components/Features2";

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
