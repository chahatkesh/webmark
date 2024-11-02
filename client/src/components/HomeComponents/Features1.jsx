import React from "react";
import { assets } from "../../assets/assests";

const Features1 = () => {
  return (
    <section id="features" className="relative bg-[#111827]">
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
            <div className="sm-feature-border-right">
              <article className="relative p-6 md:p-10 feature-border-bottom">
                <h3 className="text-[#e5e7eb] flex items-center font-[500] mb-2">
                  <svg
                    className="fill-[#3b82f6]"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16">
                    <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z M7 6.75a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5A.75.75 0 0 1 7 6.75zm0 3a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5A.75.75 0 0 1 7 9.75z"></path>
                  </svg>
                  <span className="ml-2">Smart Bookmarking</span>
                </h3>
                <p className="text-[#9ca3af] text-[15px]">
                  Effortlessly organize your bookmarks with collections,
                  categories, and tags. Our intuitive drag-and-drop interface
                  makes managing your digital library a breeze.
                </p>
              </article>
            </div>
            <div className="lg-feature-border-right">
              <article className="relative p-6 md:p-10 feature-border-bottom">
                <h3 className="text-[#e5e7eb] flex items-center font-[500] mb-2">
                  <svg
                    className="fill-[#3b82f6]"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                  </svg>
                  <span className="ml-2">Powerful Search</span>
                </h3>
                <p className="text-[#9ca3af] text-[15px]">
                  Find any bookmark instantly with our integrated search engine.
                  Search through your bookmarks, notes, and tags to quickly
                  locate exactly what you need.
                </p>
              </article>
            </div>
            <div className="sm-feature-border-right lg-feature-border-right-hidden">
              <article className="relative p-6 md:p-10 feature-border-bottom">
                <h3 className="text-[#e5e7eb] flex items-center font-[500] mb-2">
                  <svg
                    className="fill-[#3b82f6]"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16">
                    <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"></path>
                  </svg>
                  <span className="ml-2">Personalized Experience</span>
                </h3>
                <p className="text-[#9ca3af] text-[15px]">
                  Make Webmark yours with custom themes, colors, and icons.
                  Choose between dark and light modes, and arrange your
                  bookmarks in list or grid views.
                </p>
              </article>
            </div>
            <div className="lg-feature-border-right">
              <article className="relative p-6 md:p-10 feature-border-bottom lg-feature-border-bottom-hidden">
                <h3 className="text-[#e5e7eb] flex items-center font-[500] mb-2">
                  <svg
                    className="fill-[#3b82f6]"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16">
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
                  </svg>
                  <span className="ml-2">Enhanced Privacy</span>
                </h3>
                <p className="text-[#9ca3af] text-[15px]">
                  Keep your bookmarks private by default, with the option to
                  share collections publicly. Your data security and privacy are
                  our top priorities.
                </p>
              </article>
            </div>
            <div className="sm-feature-border-right">
              <article className="relative p-6 md:p-10 feature-border-bottom sm-feature-border-bottom-hidden">
                <h3 className="text-[#e5e7eb] flex items-center font-[500] mb-2">
                  <svg
                    className="fill-[#3b82f6]"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16">
                    <path d="M14 5.5V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h7.5L14 5.5zM3 2v12h10V6h-4V2H3z M10 8v1h-3v1h3v1h-3v1h3v-1h1v-1h-1V8h-1z"></path>
                  </svg>
                  <span className="ml-2">Smart Notes</span>
                </h3>
                <p className="text-[#9ca3af] text-[15px]">
                  Add detailed, multiline notes to your bookmarks for better
                  context and recall. Never forget why you saved that important
                  link again.
                </p>
              </article>
            </div>
            <div>
              <article className="relative p-6 md:p-10">
                <h3 className="text-[#e5e7eb] flex items-center font-[500] mb-2">
                  <svg
                    className="fill-[#3b82f6]"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16">
                    <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z"></path>
                  </svg>
                  <span className="ml-2">Social Sharing (Coming Soon)</span>
                </h3>
                <p className="text-[#9ca3af] text-[15px]">
                  Share your public collections and collaborate with others.
                  Connect with like-minded individuals and discover new
                  resources together.
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
