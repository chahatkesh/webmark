import React from "react";
import { assets } from "../../assets/assests";

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
        <div className="absolute translate-y-[50%] translate-x-[-50%] bottom-0 left-[50%]">
          <div className="filter blur-[64px] h-56 border-[#3b82f6] border-[20px] rounded-full w-[480px] "></div>
        </div>
        <div className="pl-4 pr-4 md:pl-12 md:pr-12 pt-12 pb-12 md:pt-20 md:pb-20">
          <h2 className="border-in-header-1 text-[#e5e7eb] font-[700] text-[1.4rem] leading-[1.3333] tracking-[-0.037em] md:text-[2.25rem] md:leading-[1.2777] mb-6 md:mb-12">
            Master Your Bookmarks - Simplify Your Web Experience
          </h2>
          <div className="ml-auto mr-auto max-w-80 sm:max-w-none sm:flex sm:justify-center">
            <a
              className="w-full sm:w-auto sm:mb-0 mb-4 shadow text-white bg-blue-500 hover:bg-blue-600 pl-4 pr-4 pt-2.5 pb-2.5 inline-flex items-center justify-center rounded-[8px] leading-[1.5715] font-[500] whitespace-nowrap text-[0.875rem]"
              href="/auth">
              <span className="inline-flex items-center relative ">
                Get Started
                <span className="tracking-[0rem] ml-1 text-[#93c5fd]">
                  -&gt;
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;
