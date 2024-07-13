import React, { useEffect } from "react";
import { assets } from "../assets/assests";

const Testimonial = () => {
  useEffect(() => {
    const scrollers = document.querySelectorAll(".scroller");
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      addAnimation();
    }

    function addAnimation() {
      scrollers.forEach((scroller) => {
        scroller.setAttribute("data-animated", true);

        const scrollerInner = scroller.querySelector(".scroller-inner");
        const scrollerContent = Array.from(scrollerInner.children);

        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true);
          duplicatedItem.setAttribute("aria-hidden", true);
          scrollerInner.appendChild(duplicatedItem);
        });
      });
    }
  }, []);
  return (
    <section className="relative pt-12 md:pt-20">
      <div className="pl-4 pr-4 sm:pl-6 sm:pr-6 max-w-[72rem] ml-auto mr-auto">
        <div className="max-w-[48rem] text-center ml-auto mr-auto">
          <h2 className="md:leading-[1.2777] leading-[1.3333] text-[1.875rem] tracking-[-0.037em] md:text-[2.25rem] font-[700]">
            Trusted and loved by Professionals
          </h2>
        </div>
      </div>
      <div className="flex relative w-[100vw] justify-center ml-auto mr-auto">
        <div className="translate-x-[-9rem] absolute bottom-[5rem] -z-10">
          <div className="blur-[160px] opacity-35 to-[#111827] from-[#3b82f6] bg-gradient-to-tr h-80 w-80 rounded-full"></div>
        </div>
        <div className="absolute bottom-[-2.5rem] -z-10">
          <div className="blur-[160px] opacity-40 to-[#111827] from-[#3b82f6] bg-gradient-to-tr h-80 w-80 rounded-full"></div>
        </div>
        <div className="absolute bottom-0 -z-10">
          <div className="blur-[20px] h-56 w-56 rounded-full border-[20px] border-white"></div>
        </div>
        <div className="scroller w-[90vw] pt-12 pb-12 md:pt-20 md:pb-20 flex">
          <div className="scroller-inner flex">
            {/* item 1 */}
            <article className="rotate-[-1deg] ml-3 mr-3 shadow p-5 bg-[#ffffffb3] rounded-2xl flex flex-col w-[22rem] relative">
              <header className="flex items-center mb-4 gap-3">
                <img
                  className="rounded-full flex-shrink-0 max-w-full h-auto"
                  width={44}
                  height={44}
                  src={assets.chahat}
                  alt=""
                />
                <div>
                  <div className="font-[700]">Chahat K</div>
                  <div>
                    <a
                      className="text-[#6b7280cc] text-[0.875rem] leading-[1.5715em] font-[500]"
                      href="">
                      @chahat_kesh
                    </a>
                  </div>
                </div>
              </header>
              <div className="text-[#374151] text-[0.875rem] leading-[1.5715em] flex-grow">
                Simple has revolutionized the way I manage my work. Its
                intuitive interface and seamless functionality make staying
                organized effortless. I can&apos;t imagine my life without it.
              </div>
              <footer className="text-[#374151] gap-2.5 flex items-center mt-4">
                <svg
                  className="fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="15"
                  fill="none">
                  <path
                    fillRule="evenodd"
                    d="M16.928 14.054H11.99L8.125 9.162l-4.427 4.892H1.243L6.98 7.712.928.054H5.99L9.487 4.53 13.53.054h2.454l-5.358 5.932 6.303 8.068Zm-4.26-1.421h1.36L5.251 1.4H3.793l8.875 11.232Z"></path>
                </svg>
                <div className="text-[0.75rem] leading-[1.5]">Apr 12, 2024</div>
              </footer>
            </article>
            {/* item 2 */}
            <article className="rotate-[1deg] ml-3 mr-3 shadow p-5 bg-[#ffffffb3] rounded-2xl flex flex-col w-[22rem] relative">
              <header className="flex items-center mb-4 gap-3">
                <img
                  className="rounded-full flex-shrink-0 max-w-full h-auto"
                  width={44}
                  height={44}
                  src={assets.chahat}
                  alt=""
                />
                <div>
                  <div className="font-[700]">Chahat Kesharwani</div>
                  <div>
                    <a
                      className="text-[#6b7280cc] text-[0.875rem] leading-[1.5715em] font-[500]"
                      href="">
                      @chahat_kesh
                    </a>
                  </div>
                </div>
              </header>
              <div className="text-[#374151] text-[0.875rem] leading-[1.5715em] flex-grow">
                Simple has revolutionized the way I manage my work. Its
                intuitive interface and seamless functionality make staying
                organized effortless. I can&apos;t imagine my life without it.
              </div>
              <footer className="text-[#374151] gap-2.5 flex items-center mt-4">
                <svg
                  className="fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="15"
                  fill="none">
                  <path
                    fillRule="evenodd"
                    d="M16.928 14.054H11.99L8.125 9.162l-4.427 4.892H1.243L6.98 7.712.928.054H5.99L9.487 4.53 13.53.054h2.454l-5.358 5.932 6.303 8.068Zm-4.26-1.421h1.36L5.251 1.4H3.793l8.875 11.232Z"></path>
                </svg>
                <div className="text-[0.75rem] leading-[1.5]">Apr 12, 2024</div>
              </footer>
            </article>
            {/* item 3 */}
            <article className="rotate-[-1deg] ml-3 mr-3 shadow p-5 bg-[#ffffffb3] rounded-2xl flex flex-col w-[22rem] relative">
              <header className="flex items-center mb-4 gap-3">
                <img
                  className="rounded-full flex-shrink-0 max-w-full h-auto"
                  width={44}
                  height={44}
                  src={assets.chahat}
                  alt=""
                />
                <div>
                  <div className="font-[700]">Chahat Kesharwani</div>
                  <div>
                    <a
                      className="text-[#6b7280cc] text-[0.875rem] leading-[1.5715em] font-[500]"
                      href="">
                      @chahat_kesh
                    </a>
                  </div>
                </div>
              </header>
              <div className="text-[#374151] text-[0.875rem] leading-[1.5715em] flex-grow">
                Simple has revolutionized the way I manage my work. Its
                intuitive interface and seamless functionality make staying
                organized effortless. I can&apos;t imagine my life without it.
              </div>
              <footer className="text-[#374151] gap-2.5 flex items-center mt-4">
                <svg
                  className="fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="15"
                  fill="none">
                  <path
                    fillRule="evenodd"
                    d="M16.928 14.054H11.99L8.125 9.162l-4.427 4.892H1.243L6.98 7.712.928.054H5.99L9.487 4.53 13.53.054h2.454l-5.358 5.932 6.303 8.068Zm-4.26-1.421h1.36L5.251 1.4H3.793l8.875 11.232Z"></path>
                </svg>
                <div className="text-[0.75rem] leading-[1.5]">Apr 12, 2024</div>
              </footer>
            </article>
            {/* item 4 */}
            <article className="rotate-[1deg] ml-3 mr-3 shadow p-5 bg-[#ffffffb3] rounded-2xl flex flex-col w-[22rem] relative">
              <header className="flex items-center mb-4 gap-3">
                <img
                  className="rounded-full flex-shrink-0 max-w-full h-auto"
                  width={44}
                  height={44}
                  src={assets.chahat}
                  alt=""
                />
                <div>
                  <div className="font-[700]">Chahat Kesharwani</div>
                  <div>
                    <a
                      className="text-[#6b7280cc] text-[0.875rem] leading-[1.5715em] font-[500]"
                      href="">
                      @chahat_kesh
                    </a>
                  </div>
                </div>
              </header>
              <div className="text-[#374151] text-[0.875rem] leading-[1.5715em] flex-grow">
                Simple has revolutionized the way I manage my work. Its
                intuitive interface and seamless functionality make staying
                organized effortless. I can&apos;t imagine my life without it.
              </div>
              <footer className="text-[#374151] gap-2.5 flex items-center mt-4">
                <svg
                  className="fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="15"
                  fill="none">
                  <path
                    fillRule="evenodd"
                    d="M16.928 14.054H11.99L8.125 9.162l-4.427 4.892H1.243L6.98 7.712.928.054H5.99L9.487 4.53 13.53.054h2.454l-5.358 5.932 6.303 8.068Zm-4.26-1.421h1.36L5.251 1.4H3.793l8.875 11.232Z"></path>
                </svg>
                <div className="text-[0.75rem] leading-[1.5]">Apr 12, 2024</div>
              </footer>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
