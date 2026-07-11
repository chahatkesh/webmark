import React from "react";
import { assets } from "../../assets/assests";
import LandingButton from "./LandingButton";
import StarRepo from "./StarRepo";

const Cta = () => {
  return (
    <section className="pl-4 pr-4 sm:pl-6 sm:pr-6 max-w-[72rem] ml-auto mr-auto">
      <div className="relative shadow-xl text-center rounded-xl md:rounded-2xl overflow-hidden bg-[#111827]">
        <div className="pointer-events-none absolute transform translate-x-[-50%] top-0 left-[50%]">
          <img
            className="max-w-none"
            src={assets.stripes_dark}
            width={768}
            height={432}
            alt=""
          />
        </div>
        <div className="pointer-events-none absolute translate-y-[50%] translate-x-[-50%] bottom-0 left-[50%]">
          <div className="filter blur-[64px] h-56 border-[#3b82f6] border-[20px] rounded-full w-[480px] "></div>
        </div>
        <div className="relative z-10 pl-4 pr-4 md:pl-12 md:pr-12 pt-12 pb-12 md:pt-20 md:pb-20">
          <h2 className="border-in-header-1 text-[#e5e7eb] font-[700] text-[1.4rem] leading-[1.3333] tracking-[-0.037em] md:text-[2.25rem] md:leading-[1.2777] mb-6 md:mb-12">
            Master Your Bookmarks - Simplify Your Web Experience
          </h2>
          <div className="ml-auto mr-auto flex flex-row flex-nowrap justify-center items-center gap-2 sm:gap-4">
            <LandingButton href="/auth" variant="primary" arrow>
              Get Started
            </LandingButton>
            <StarRepo variant="cta" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;
