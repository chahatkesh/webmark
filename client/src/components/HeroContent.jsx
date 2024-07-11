import React from "react";
import { assets } from "../assets/assests";

const Hero = () => {
  return (
    <div className="max-w-[72rem] ml-auto mr-auto pl-4 pr-4 md:pl-6 md:pr-6">
      <div className="w-full pt-32 md:pt-40 pb-12 md:pb-20">
        <div className="pb-12 md:pb-16 text-center">
          <div className="border-t-1 border-b-1 mb-6 border border-transparent border-in-header">
            <div className="flex justify-center ml-[-2px] mr-[-2px]">
              <img
                className="border-2 border-opacity-0 border-[#f9fafb] rounded-full box-content"
                width={32}
                src={assets.icon01}
                alt=""
              />
              <img
                className="border-2 border-opacity-1 border-[#f9fafb] rounded-full box-content space-x-reverse ml-[-12px]"
                width={32}
                src={assets.icon02}
                alt=""
              />
              <img
                className="border-2 border-opacity-1 border-[#f9fafb] rounded-full box-content space-x-reverse ml-[-12px] "
                width={32}
                src={assets.icon03}
                alt=""
              />
              <img
                className="border-2 border-opacity-1 border-[#f9fafb] rounded-full box-content space-x-reverse ml-[-12px] "
                width={32}
                src={assets.icon04}
                alt=""
              />
              <img
                className="border-2 border-opacity-1 border-[#f9fafb] rounded-full box-content space-x-reverse ml-[-12px] "
                width={32}
                src={assets.icon05}
                alt=""
              />
              <img
                className="border-2 border-opacity-1 border-[#f9fafb] rounded-full box-content space-x-reverse ml-[-12px]"
                width={32}
                src={assets.icon06}
                alt=""
              />
            </div>
          </div>
          <h1 className="leading-none text-[2.9rem] md:text-[56px] font-[700] tracking-[-0.037em] border-in-header mb-6 border border-transparent border-t-1 border-b-1">
            Simplify Your Bookmark Management
            <br />
            <span className="hidden md:block"> - with Webmark</span>
          </h1>
          <div className="max-w-[48rem] ml-auto mr-auto">
            <p className="text-[#374151] text-opacity-100 text-lg leading-normal tracking-[-0.017em] mb-8">
              Easily manage, customize, and search your bookmarks with webmark.
            </p>
            <div className="relative border-in-header border border-transparent border-t-1 border-b-1">
              <div className="ml-auto mr-auto max-w-80 md:max-w-none md:flex md:justify-center">
                <a
                  className="w-full md:w-auto md:mb-0 mb-4 shadow text-white bg-blue-500 hover:bg-blue-600 pl-4 pr-4 pt-2.5 pb-2.5 inline-flex items-center justify-center rounded-[8px] leading-[1.5715] font-[500] whitespace-nowrap text-[0.875rem]"
                  href="">
                  <span className="inline-flex items-center relative ">
                    Get Started
                    <span className="tracking-[0rem] ml-1 text-[#93c5fd]">
                      -&gt;
                    </span>
                  </span>
                </a>
                <a
                  className="w-full md:w-auto md:ml-4 shadow pl-4 pr-4 pt-2.5 pb-2.5 inline-flex items-center justify-center rounded-[8px] leading-[1.5715] font-[500] whitespace-nowrap text-[0.875rem] text-[#1f2937] bg-white hover:bg-gray-50"
                  href="">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-[48rem] ml-auto mr-auto border-t-1 border-b-1 border border-transparent border-in-header ">
          <div className=" border-in-header-2 p-4">
            <div className="relative shadow-xl pt-3 pb-3 pl-5 pr-5 rounded-xl md:rounded-2xl bg-[#111827] aspect-[16/9]">
              <img src={assets.hero_image} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
