import React from "react";
import { assets } from "../assets/assests";

const Message = () => {
  return (
    <section className="pl-4 pr-4 md:pl-6 md:pr-6 max-w-[42rem] ml-auto mr-auto">
      <div className="pt-12 pb-12 md:pt-20 md:pb-20">
        <div className="text-center">
          <div className="inline-flex relative">
            <svg
              className="absolute -z-10 top-[-0.5rem] left-[-1.5rem]"
              width="40"
              height="49"
              viewBox="0 0 40 49"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.7976 -0.000136375L39.9352 23.4746L33.4178 31.7234L13.7686 11.4275L22.7976 -0.000136375ZM9.34947 17.0206L26.4871 40.4953L19.9697 48.7441L0.320491 28.4482L9.34947 17.0206Z"
                fill="#D1D5DB"></path>
            </svg>
            <img
              className="rounded-full"
              width={48}
              height={48}
              src={assets.chahat}
              alt=""
            />
          </div>
          <p className="text-[#111827] font-[700] text-[1.5rem] leading-[1.415] tracking-[-0.037em] mt-3">
            “Simple has simplified my life in more ways than one. From managing
            my sites to{" "}
            <em className="text-[#6b7280] italic">keeping track of tasks</em>,
            it&apos;s become my go-to tool for everything.”
          </p>
          <div className="text-[#374151] mt-3 font-[500] text-[0.875rem] leading-[1.5715]">
            <span>Chahat Kesharwani</span>
            <span className="text-[#9ca3af]">/</span>
            <a className="text-blue-500 hover:text-blue-600" href="#">
              Founder Webmark
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Message;
