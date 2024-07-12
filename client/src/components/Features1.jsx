import React from "react";
import { assets } from "../assets/assests";

const Features1 = () => {
  return (
    <section className="relative bg-[#111827]">
      <div className="pl-4 pr-4 sm:pl-6 sm:pr-6 max-w-[72rem] ml-auto mr-auto">
        <div className="pt-12 pb-12 md:pt-20 md:pb-20">
          <div className="max-w-[48rem] pb-16 md:pb-20 text-center ml-auto mr-auto">
            <h2 className="md:leading-[1.2777] leading-[1.3333] text-[1.875rem] tracking-[-0.037em] md:text-[2.25rem] text-[#e5e7eb] font-[700]">
              Organize, Manage, and Personalize Your Bookmarks with Webmark!
            </h2>
          </div>
          <div className="pb-16 md:pb-20 pointer-events-none flex justify-center items-center">
            <div className="flex relative w-[75vw] md:w-[55vw] ">
              <img
                className="w-[75vw] md:w-[55vw] rounded-lg opacity-85"
                src={assets.feature_product}
                alt=""
              />
              <img
                className="absolute w-[24vw] md:w-[17vw] top-[8vw] md:top-[110px] left-[-8vw] md:left-[-9vw] opacity-75 rounded-xl shadow-[2px_2px_2px_#000000] animate-bounce"
                src={assets.features_card}
                alt=""
              />
              <img
                className="absolute w-[24vw] md:w-[17vw] bottom-[16vw] md:bottom-[110px] right-[-8vw] md:right-[-9vw] opacity-75 rounded-xl shadow-[2px_2px_2px_#000000] animate-bounce"
                src={assets.features_card}
                alt=""
              />
            </div>
          </div>
          <div className="grid overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
            {/* feature-1 */}
            <div className="sm-feature-border-right">
              <article className="relative p-6 md:p-10 feature-border-bottom">
                <h3 className="text-[#e5e7eb] flex items-center font-[500] mb-2">
                  <svg
                    className="fill-[#3b82f6]"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16">
                    <path d="M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Zm2-4a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4Zm1 10a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H5Z"></path>
                  </svg>
                  <span className="ml-2">Instant Analytics</span>
                </h3>
                <p className="text-[#9ca3af] text-[15px]">
                  Collect essential insights about how visitors are using your
                  site with in-depth page view metrics like pages, referring
                  sites, and more.
                </p>
              </article>
            </div>
            {/* feature-2 */}
            <div className="lg-feature-border-right">
              <article className="relative p-6 md:p-10 feature-border-bottom">
                <h3 className="text-[#e5e7eb] flex items-center font-[500] mb-2">
                  <svg
                    className="fill-[#3b82f6]"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16">
                    <path d="M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Zm2-4a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4Zm1 10a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H5Z"></path>
                  </svg>
                  <span className="ml-2">Instant Analytics</span>
                </h3>
                <p className="text-[#9ca3af] text-[15px]">
                  Collect essential insights about how visitors are using your
                  site with in-depth page view metrics like pages, referring
                  sites, and more.
                </p>
              </article>
            </div>
            {/* feature-3 */}
            <div className="sm-feature-border-right lg-feature-border-right-hidden">
              <article className="relative p-6 md:p-10 feature-border-bottom">
                <h3 className="text-[#e5e7eb] flex items-center font-[500] mb-2">
                  <svg
                    className="fill-[#3b82f6]"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16">
                    <path d="M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Zm2-4a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4Zm1 10a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H5Z"></path>
                  </svg>
                  <span className="ml-2">Instant Analytics</span>
                </h3>
                <p className="text-[#9ca3af] text-[15px]">
                  Collect essential insights about how visitors are using your
                  site with in-depth page view metrics like pages, referring
                  sites, and more.
                </p>
              </article>
            </div>
            {/* feature-4 */}
            <div className="lg-feature-border-right">
              <article className="relative p-6 md:p-10 feature-border-bottom lg-feature-border-bottom-hidden">
                <h3 className="text-[#e5e7eb] flex items-center font-[500] mb-2">
                  <svg
                    className="fill-[#3b82f6]"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16">
                    <path d="M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Zm2-4a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4Zm1 10a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H5Z"></path>
                  </svg>
                  <span className="ml-2">Instant Analytics</span>
                </h3>
                <p className="text-[#9ca3af] text-[15px]">
                  Collect essential insights about how visitors are using your
                  site with in-depth page view metrics like pages, referring
                  sites, and more.
                </p>
              </article>
            </div>
            {/* feature-5 */}
            <div className="sm-feature-border-right">
              <article className="relative p-6 md:p-10 feature-border-bottom sm-feature-border-bottom-hidden">
                <h3 className="text-[#e5e7eb] flex items-center font-[500] mb-2">
                  <svg
                    className="fill-[#3b82f6]"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16">
                    <path d="M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Zm2-4a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4Zm1 10a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H5Z"></path>
                  </svg>
                  <span className="ml-2">Instant Analytics</span>
                </h3>
                <p className="text-[#9ca3af] text-[15px]">
                  Collect essential insights about how visitors are using your
                  site with in-depth page view metrics like pages, referring
                  sites, and more.
                </p>
              </article>
            </div>
            {/* feature-6 */}
            <div>
              <article className="relative p-6 md:p-10">
                <h3 className="text-[#e5e7eb] flex items-center font-[500] mb-2">
                  <svg
                    className="fill-[#3b82f6]"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16">
                    <path d="M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Zm2-4a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4Zm1 10a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H5Z"></path>
                  </svg>
                  <span className="ml-2">Instant Analytics</span>
                </h3>
                <p className="text-[#9ca3af] text-[15px]">
                  Collect essential insights about how visitors are using your
                  site with in-depth page view metrics like pages, referring
                  sites, and more.
                </p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features1;
