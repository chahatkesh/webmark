import React from "react";

const Footer = () => {
  return (
    <section>
      <div className="pl-4 pr-4 sm:pl-6 sm:pr-6 max-w-[72rem] ml-auto mr-auto">
        <div className="pt-8 pb-8 md:pt-12 md:pb-12 grid gap-10 sm:grid-cols-12">
          <div className="sm:col-span-12 lg:col-span-4">
            <div>
              <a className="inline-flex pl-1" href="/">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="27"
                  viewBox="0 0 26 27"
                  fill="none">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.62864 4.60001C5.44056 5.25646 5.73424 5.20464 7.25445 5.10099L21.5755 4.23724C21.8864 4.23724 21.6273 3.92628 21.5236 3.89173L19.1397 2.1815C18.6905 1.836 18.0686 1.4214 16.9112 1.52505L3.05661 2.54428C2.55563 2.5961 2.45198 2.85523 2.65928 3.04526L4.62864 4.60001ZM5.49239 7.9341V22.9979C5.49239 23.8099 5.88972 24.1035 6.8053 24.0517L22.5429 23.1361C23.4584 23.0843 23.5621 22.5315 23.5621 21.8751V6.91487C23.5621 6.25842 23.303 5.89564 22.7502 5.94746L6.30432 6.91487C5.69969 6.96669 5.49239 7.27764 5.49239 7.9341ZM1.89918 1.16228L16.3238 0.108497C18.0859 -0.0469782 18.5523 0.0566724 19.6579 0.8686L24.2531 4.09903C25.0132 4.65184 25.2723 4.80731 25.2723 5.41194V23.1534C25.2723 24.259 24.875 24.9155 23.4584 25.0191L6.71892 26.0384C5.64787 26.0902 5.14689 25.9347 4.59409 25.2264L1.1909 20.8213C0.586274 20.0094 0.327148 19.4047 0.327148 18.6965V2.92433C0.327148 2.00875 0.74175 1.26593 1.89918 1.16228Z"
                    fill="#1361F5"
                  />
                  <path
                    d="M19.4853 9.93028C19.4853 9.53487 19.1541 9.22009 18.7592 9.24017L10.8126 9.64431C10.4451 9.663 10.1567 9.96643 10.1567 10.3344V21.814L14.5466 19.4033L19.4853 21.301V9.93028Z"
                    fill="#1361F5"
                  />
                </svg>
              </a>
            </div>
            <div className="mt-2 text-[#4b5563] text-[0.875rem] leading-[1.5715]">
              © Webmark.in - All rights reserved
            </div>
          </div>
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2 text-[0.875rem] leading-[1.5715]">
            <h3 className="font-[500] text-[#111827]">Product</h3>
            <ul className="mt-2 text-[#4b5563]">
              <li>
                <a href="#">Features</a>
              </li>
              <li className="mt-2">
                <a href="#">How to use</a>
              </li>
              <li className="mt-2">
                <a href="#">Pricing &amp; Plans</a>
              </li>
              <li className="mt-2">
                <a href="#">Tips</a>
              </li>
              <li className="mt-2">
                <a href="#">Blogs</a>
              </li>
            </ul>
          </div>
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2 text-[0.875rem] leading-[1.5715]">
            <h3 className="font-[500] text-[#111827]">Company</h3>
            <ul className="mt-2 text-[#4b5563]">
              <li>
                <a href="#">About us</a>
              </li>
              <li className="mt-2">
                <a href="#">Diversity and Inclusion</a>
              </li>
              <li className="mt-2">
                <a href="#">Careers</a>
              </li>
              <li className="mt-2">
                <a href="#">Hiring</a>
              </li>
              <li className="mt-2">
                <a href="#">Financial Statements</a>
              </li>
            </ul>
          </div>
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2 text-[0.875rem] leading-[1.5715]">
            <h3 className="font-[500] text-[#111827]">Resources</h3>
            <ul className="mt-2 text-[#4b5563]">
              <li>
                <a href="#">Community</a>
              </li>
              <li className="mt-2">
                <a href="#">Term of Service</a>
              </li>
              <li className="mt-2">
                <a href="#">Report a Vulnerability</a>
              </li>
            </ul>
          </div>
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2 text-[0.875rem] leading-[1.5715]">
            <h3 className="font-[500] text-[#111827]">Social</h3>
            <ul className="flex gap-1">
              <li className="cursor-pointer">
                <a href="">
                  <svg
                    className="opacity-85 hover:opacity-100"
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none">
                    <path
                      d="M14.6786 14.0223C14.4186 14.1961 14.1953 14.4195 14.0217 14.6796C13.848 14.9397 13.7272 15.2314 13.6663 15.5382C13.5432 16.1577 13.6713 16.8008 14.0223 17.3259C14.3734 17.851 14.9187 18.2151 15.5382 18.3382C16.1577 18.4613 16.8008 18.3332 17.3259 17.9821C17.851 17.6311 18.2151 17.0858 18.3382 16.4663C18.4613 15.8467 18.3332 15.2037 17.9821 14.6786C17.6311 14.1535 17.0858 13.7893 16.4663 13.6663C15.8467 13.5432 15.2037 13.6713 14.6786 14.0223ZM21.0313 10.9688C20.7991 10.7366 20.5179 10.5536 20.2098 10.433C19.4018 10.1161 17.6384 10.1295 16.5 10.1429C16.317 10.1429 16.1473 10.1473 16 10.1473C15.8527 10.1473 15.6786 10.1473 15.4911 10.1429C14.3527 10.1295 12.5982 10.1116 11.7902 10.433C11.4821 10.5536 11.2054 10.7366 10.9688 10.9688C10.7321 11.2009 10.5536 11.4821 10.433 11.7902C10.1161 12.5982 10.1339 14.3661 10.1429 15.5045C10.1429 15.6875 10.1473 15.8571 10.1473 16C10.1473 16.1429 10.1473 16.3125 10.1429 16.4955C10.1339 17.6339 10.1161 19.4018 10.433 20.2098C10.5536 20.5179 10.7366 20.7946 10.9688 21.0313C11.2009 21.2679 11.4821 21.4464 11.7902 21.567C12.5982 21.8839 14.3616 21.8705 15.5 21.8571C15.683 21.8571 15.8527 21.8527 16 21.8527C16.1473 21.8527 16.3214 21.8527 16.5089 21.8571C17.6473 21.8705 19.4018 21.8884 20.2098 21.567C20.5179 21.4464 20.7946 21.2634 21.0313 21.0313C21.2679 20.7991 21.4464 20.5179 21.567 20.2098C21.8884 19.4062 21.8705 17.6473 21.8571 16.5045C21.8571 16.317 21.8527 16.1429 21.8527 15.9955C21.8527 15.8482 21.8527 15.6786 21.8571 15.4866C21.8705 14.3482 21.8884 12.5893 21.567 11.7813C21.4464 11.4732 21.2634 11.1964 21.0313 10.9598V10.9688ZM18.0357 12.9554C18.8432 13.4953 19.4031 14.3338 19.5924 15.2866C19.7816 16.2393 19.5845 17.2282 19.0446 18.0357C18.7773 18.4355 18.4338 18.7788 18.0338 19.0459C17.6339 19.313 17.1852 19.4987 16.7134 19.5924C15.7607 19.7816 14.7718 19.5845 13.9643 19.0446C13.1568 18.5053 12.5966 17.6673 12.407 16.715C12.2174 15.7627 12.4138 14.774 12.9531 13.9665C13.4924 13.159 14.3304 12.5989 15.2828 12.4092C16.2351 12.2196 17.2238 12.416 18.0313 12.9554H18.0357ZM19.3393 12.8973C19.2009 12.8036 19.0893 12.6696 19.0223 12.5134C18.9554 12.3571 18.942 12.1875 18.9732 12.0179C19.0045 11.8482 19.0893 11.7009 19.2054 11.5804C19.3214 11.4598 19.4777 11.3795 19.6429 11.3482C19.808 11.317 19.9821 11.3304 20.1384 11.3973C20.2946 11.4643 20.4286 11.5714 20.5223 11.7098C20.6161 11.8482 20.6652 12.0134 20.6652 12.183C20.6652 12.2946 20.6429 12.4063 20.6027 12.5089C20.5625 12.6116 20.4955 12.7054 20.4196 12.7857C20.3438 12.8661 20.2455 12.9286 20.1429 12.9732C20.0402 13.0179 19.9286 13.0402 19.817 13.0402C19.6473 13.0402 19.4821 12.9911 19.3438 12.8973H19.3393ZM26 8.85714C26 7.28125 24.7188 6 23.1429 6H8.85714C7.28125 6 6 7.28125 6 8.85714V23.1429C6 24.7188 7.28125 26 8.85714 26H23.1429C24.7188 26 26 24.7188 26 23.1429V8.85714ZM21.9375 21.9375C21.1027 22.7723 20.0893 23.0357 18.9464 23.0938C17.7679 23.1607 14.2321 23.1607 13.0536 23.0938C11.9107 23.0357 10.8973 22.7723 10.0625 21.9375C9.22768 21.1027 8.96429 20.0893 8.91071 18.9464C8.84375 17.7679 8.84375 14.2321 8.91071 13.0536C8.96875 11.9107 9.22768 10.8973 10.0625 10.0625C10.8973 9.22768 11.9152 8.96429 13.0536 8.91071C14.2321 8.84375 17.7679 8.84375 18.9464 8.91071C20.0893 8.96875 21.1027 9.22768 21.9375 10.0625C22.7723 10.8973 23.0357 11.9107 23.0893 13.0536C23.1562 14.2277 23.1562 17.7589 23.0893 18.942C23.0312 20.0848 22.7723 21.0982 21.9375 21.933V21.9375Z"
                      fill="#1361F5"
                    />
                  </svg>
                </a>
              </li>
              <li className="cursor-pointer">
                <a href="">
                  <svg
                    className="opacity-85 hover:opacity-100"
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none">
                    <path
                      d="M8.85714 6C7.28125 6 6 7.28125 6 8.85714V23.1429C6 24.7188 7.28125 26 8.85714 26H13.2411V19.4911H10.8839V16H13.2411V14.4955C13.2411 10.6071 15 8.80357 18.8214 8.80357C19.5446 8.80357 20.7946 8.94643 21.308 9.08929V12.25C21.0402 12.2232 20.5714 12.2054 19.9866 12.2054C18.1116 12.2054 17.3884 12.9152 17.3884 14.7589V16H21.1205L20.4777 19.4911H17.3839V26H23.1429C24.7188 26 26 24.7188 26 23.1429V8.85714C26 7.28125 24.7188 6 23.1429 6H8.85714Z"
                      fill="#1361F5"
                    />
                  </svg>
                </a>
              </li>
              <li className="cursor-pointer">
                <a href="">
                  <svg
                    className="opacity-85 hover:opacity-100"
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none">
                    <path
                      d="M7.875 9C6.83984 9 6 9.83984 6 10.875C6 11.4648 6.27734 12.0195 6.75 12.375L15.25 18.75C15.6953 19.082 16.3047 19.082 16.75 18.75L25.25 12.375C25.7227 12.0195 26 11.4648 26 10.875C26 9.83984 25.1602 9 24.125 9H7.875ZM6 13.375V21.5C6 22.8789 7.12109 24 8.5 24H23.5C24.8789 24 26 22.8789 26 21.5V13.375L17.5 19.75C16.6094 20.418 15.3906 20.418 14.5 19.75L6 13.375Z"
                      fill="#1361F5"
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* BIG TEXT */}
      <div className="relative w-full h-60 mt-[-4rem] -z-[1]">
        <div className="pointer-events-none absolute left-[50%] text-center text-[352px] font-[700] translate-x-[-50%] leading-none text-gray-100">
          <span className="drop-shadow-sm">Webmark</span>
        </div>
        {/* GLOW */}
        <div className="translate-y-[66%] translate-x-[-50%] left-[50%] bottom-0 absolute">
          <div className="w-56 h-56 blur-[80px] border-[#1d4ed8] border-[20px] rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
