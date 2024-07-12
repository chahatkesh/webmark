import React from "react";

const Features2 = () => {
  return (
    <section className="relative">
      <div className="pointer-events-none absolute translate-x-[-50%] translate-y-[-50%] top-0 left-[50%] -z-10">
        <div className="filter blur-[160px] opacity-50 from-[#3b82f6] to-[#111827] bg-gradient-to-tr rounded-full w-80 h-80"></div>
      </div>
      <div className="pl-4 pr-4 sm:pl-6 sm:pr-6 max-w-[72rem] ml-auto mr-auto">
        <div className="pt-12 pb-12 md:pt-20 md:pb-20">
          <div className="pb-24 md:pb-28 text-center max-w-[48rem] ml-auto mr-auto">
            <h2 className="mb-4 md:leading-[1.2777] leading-[1.3333] text-[1.875rem] tracking-[-0.037em] md:text-[2.25rem] text-[#111827] font-[700]">
              Share your web collection with friends.
            </h2>
            <p className="text-[#374151] leading-[1.5] text-[1.125rem] tracking-[-0.017em]">
              Use powerful yet familiar tools to create your ultimate website
              design. Import your files everywhere, including Figma.
            </p>
          </div>
          <div></div>
          <div className="grid lg:grid-cols-3 overflow-hidden border-in-header">
            {/* feature-1 */}
            <article className="relative p-6 md:p-10">
              <h3 className="text-[#111827] flex items-center font-[500] mb-2">
                <svg
                  className="fill-[#3b82f6]"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16">
                  <path d="M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Zm2-4a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4Zm1 10a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H5Z"></path>
                </svg>
                <span className="ml-2">Instant Analytics</span>
              </h3>
              <p className="text-[#374151] text-[15px]">
                Collect essential insights about how visitors are using your
                site with in-depth page view metrics like pages, referring
                sites, and more.
              </p>
            </article>
            {/* feature-2 */}
            <article className="relative p-6 md:p-10 lg-border-in-header-2">
              <h3 className="text-[#111827] flex items-center font-[500] mb-2">
                <svg
                  className="fill-[#3b82f6]"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16">
                  <path d="M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Zm2-4a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4Zm1 10a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H5Z"></path>
                </svg>
                <span className="ml-2">Instant Analytics</span>
              </h3>
              <p className="text-[#374151] text-[15px]">
                Collect essential insights about how visitors are using your
                site with in-depth page view metrics like pages, referring
                sites, and more.
              </p>
            </article>
            {/* feature-3 */}
            <article className="relative p-6 md:p-10">
              <h3 className="text-[#111827] flex items-center font-[500] mb-2">
                <svg
                  className="fill-[#3b82f6]"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16">
                  <path d="M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Zm2-4a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4Zm1 10a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H5Z"></path>
                </svg>
                <span className="ml-2">Instant Analytics</span>
              </h3>
              <p className="text-[#374151] text-[15px]">
                Collect essential insights about how visitors are using your
                site with in-depth page view metrics like pages, referring
                sites, and more.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features2;
