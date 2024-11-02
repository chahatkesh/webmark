import React from "react";

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
                  <a href="#privacy">Privacy Policy</a>
                </li>
                <li className="mt-2">
                  <a href="#terms">Terms of Service</a>
                </li>
                <li className="mt-2">
                  <a href="#security">Security</a>
                </li>
                <li className="mt-2">
                  <a href="#cookie">Cookie Policy</a>
                </li>
              </ul>
            </div>
            <div className="sm:col-span-6 md:col-span-3 lg:col-span-2 text-[0.875rem] leading-[1.5715]">
              <h3 className="font-[500] text-[#111827]">Connect With Us</h3>
              <ul className="flex gap-3 mt-2">
                <li className="cursor-pointer">
                  <a
                    href="https://www.instagram.com/webmark.site"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram">
                    <svg
                      className="w-6 h-6 text-blue-600 hover:text-blue-700 transition-colors"
                      fill="currentColor"
                      viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                </li>
                <li className="cursor-pointer">
                  <a
                    href="https://www.instagram.com/webmark.site"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn">
                    <svg
                      className="w-6 h-6 text-blue-600 hover:text-blue-700 transition-colors"
                      fill="currentColor"
                      viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </li>
                <li className="cursor-pointer">
                  <a
                    href="https://webmark.site"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Website">
                    <svg
                      className="w-6 h-6 text-blue-600 hover:text-blue-700 transition-colors"
                      fill="currentColor"
                      viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1 15.889v-2.223s2.666-.009 3-.008c-.004 1.057-.087 2.103-.249 3.127-.821-.102-1.685-.148-2.751-.176zm1.957 2.025c-.499 1.258-1.159 2.241-1.957 3.033v-2.997c.666.026 1.319.077 1.957.156v-.192zm-1.957-6.249v-2c.875-.019 1.72-.087 2.548-.196.238 1.027.389 2.111.446 3.239h-2.994v-1.043zm0-4h-.001v-3.198c.806.969 1.471 2.15 1.971 3.496-.642.084-1.3.137-1.97.165v-.463zm2.703-3.104c.991.363 1.857.934 2.637 1.663-.642.234-1.311.442-2.019.607-.344-.992-.775-1.91-1.271-2.753.213.157.425.316.653.483zm-7.241 13.594c-.244-1.039-.398-2.136-.456-3.279h2.994v2.223c-.865.034-1.714.102-2.538.222v.834zm2.538 1.592v2.997c-.798-.792-1.458-1.775-1.957-3.033.638-.079 1.291-.13 1.957-.156v.192zm-2.994-6.871c.057-1.128.207-2.212.446-3.239.827.11 1.673.177 2.548.196v2h-2.994v1.043zm1.024-4.463c.5-1.346 1.165-2.527 1.97-3.496v3.661c-.671-.028-1.329-.081-1.97-.165zm-2.005-.35c-.708-.165-1.377-.373-2.018-.607.937-.918 2.053-1.65 3.29-2.146-.496.844-.927 1.762-1.272 2.753zm-.549 1.918c-.264 1.151-.434 2.36-.492 3.611h-3.933c.165-1.658.739-3.197 1.617-4.518.88.361 1.816.67 2.808.907zm.009 9.262c-.988.236-1.92.542-2.797.9-.89-1.328-1.471-2.879-1.637-4.551h3.934c.058 1.265.231 2.488.5 3.651zm.553 1.917c.342.976.768 1.881 1.257 2.712-1.223-.49-2.326-1.211-3.256-2.115.636-.229 1.299-.435 1.999-.597zm9.924 0c.7.162 1.362.368 1.999.597-.93.903-2.033 1.625-3.257 2.115.49-.831.915-1.736 1.258-2.712z" />
                    </svg>
                  </a>
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
