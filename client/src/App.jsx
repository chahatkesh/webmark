import React from "react";
import HeroContent from "./components/HeroContent";
import Background from "./components/Background/Background";
import Circle1 from "./components/Background/Circle1";
import Circle2 from "./components/Background/Circle2";
import Circle3 from "./components/Background/Circle3";
import Navbar from "./components/Navbar";
import Message from "./components/Message";
import Footer from "./components/Footer";
import Cta from "./components/Cta";

const App = () => {
  return (
    <div className="overflow-hidden flex flex-col min-h-[100vh]">
      <Navbar />
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative">
          <Background />
          <Circle1 />
          <Circle2 />
          <Circle3 />
          <HeroContent />
        </section>
        {/* founder messages */}
        <Message />
        {/* Call to Action */}
        <Cta />
      </main>
      <Footer />
    </div>
  );
};

export default App;
