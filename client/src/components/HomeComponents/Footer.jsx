import React from "react";
import { Mail } from "lucide-react";

const Footer = () => {
  return (
    <section id="contact" className="relative">
      {/* BIG TEXT - Move it to the top of the component but behind other content */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ zIndex: 0 }}>
        <div className="relative w-full h-60 top-[75%] sm:top-[65%] lg:top-[45%] opacity-65">
          {/* Text */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-[352px] font-bold leading-none text-gray-100">
            <span className="drop-shadow-sm">Webmark</span>
          </div>

          {/* GLOW */}
          <div className="translate-y-[66%] translate-x-[-50%] left-[50%] bottom-0 absolute">
            <div className="w-56 h-56 blur-[80px] border-[#1d4ed8] border-[20px] rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Footer Content - Add a background and ensure it's above the big text */}
      <div className="relative" style={{ zIndex: 1 }}>
        <div className="pl-4 pr-4 sm:pl-6 sm:pr-6 max-w-[72rem] ml-auto mr-auto">
          <div className="pt-8 pb-8 md:pt-12 md:pb-32 grid gap-10 sm:grid-cols-12">
            <div className="sm:col-span-12 lg:col-span-4">
              <div>
                <a className="inline-flex pl-1" href="/">
                  {/* Original SVG Logo */}
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
                © 2024 Webmark - Simplifying Bookmark Management
              </div>
            </div>
            <div className="sm:col-span-6 md:col-span-3 lg:col-span-2 text-[0.875rem] leading-[1.5715]">
              <h3 className="font-[500] text-[#111827]">Features</h3>
              <ul className="mt-2 text-[#4b5563]">
                <li>
                  <a href="#features">Smart Bookmarking</a>
                </li>
                <li className="mt-2">
                  <a href="#features">Search & Tags</a>
                </li>
                <li className="mt-2">
                  <a href="#features">Custom Collection</a>
                </li>
                <li className="mt-2">
                  <a href="#features">Smart Search</a>
                </li>
                <li className="mt-2">
                  <a href="#features">Social Sharing*</a>
                </li>
              </ul>
            </div>
            <div className="sm:col-span-6 md:col-span-3 lg:col-span-2 text-[0.875rem] leading-[1.5715]">
              <h3 className="font-[500] text-[#111827]">Support</h3>
              <ul className="mt-2 text-[#4b5563]">
                <li>
                  <a href="#getting-started">Getting Started</a>
                </li>
                <li className="mt-2">
                  <a href="#guide">User Guide</a>
                </li>
                <li className="mt-2">
                  <a href="#faqs">FAQs</a>
                </li>
                <li className="mt-2">
                  <a href="#contact-support">Contact Support</a>
                </li>
                <li className="mt-2">
                  <a href="#whats-new">What's New</a>
                </li>
              </ul>
            </div>
            <div className="sm:col-span-6 md:col-span-3 lg:col-span-2 text-[0.875rem] leading-[1.5715]">
              <h3 className="font-[500] text-[#111827]">Legal</h3>
              <ul className="mt-2 text-[#4b5563]">
                <li>
                  <a href="/privacy-policy">Privacy Policy</a>
                </li>
                <li className="mt-2">
                  <a href="/terms">Terms of Service</a>
                </li>
              </ul>
            </div>
            <div className="sm:col-span-6 md:col-span-3 lg:col-span-2 text-[0.875rem] leading-[1.5715]">
              <h3 className="font-[500] text-[#111827]">Connect With Us</h3>
              <ul className="mt-2 text-[#4b5563]">
                <li className="inline-flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  <a href="mailto:webmark.care@gmail.com">Via Mail</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
