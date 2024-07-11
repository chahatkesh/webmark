import React from "react";
import HeroContent from "./components/HeroContent";
import Background from "./components/Background/Background";
import Circle1 from "./components/Background/Circle1";
import Circle2 from "./components/Background/Circle2";
import Circle3 from "./components/Background/Circle3";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="overflow-hidden flex flex-col min-h-[100vh]">
      <header className="z-30 w-full top-4 md:top-6 fixed">
        <Navbar />
      </header>
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative">
          <Background />
          <Circle1 />
          <Circle2 />
          <Circle3 />
          <div className="max-w-[72rem] ml-auto mr-auto pl-4 pr-4 md:pl-6 md:pr-6">
            <HeroContent />
          </div>
        </section>
        {/* features */}
      </main>
      <footer></footer>
    </div>
  );
};

export default App;
