import React, { useEffect, useRef } from "react";

const Footer = () => {
  const textRef = useRef(null);
  const zoneRef = useRef(null);

  useEffect(() => {
    const fitWatermark = () => {
      const text = textRef.current;
      const zone = zoneRef.current;
      if (!text || !zone) return;

      const viewportWidth = document.documentElement.clientWidth;
      const probeSize = 100;

      text.style.fontSize = `${probeSize}px`;
      const textWidth = text.getBoundingClientRect().width;
      if (!textWidth) return;

      const fittedSize = (viewportWidth / textWidth) * probeSize;
      text.style.fontSize = `${fittedSize}px`;
      zone.style.height = `${fittedSize * 0.6}px`;
    };

    fitWatermark();

    const observer = new ResizeObserver(fitWatermark);
    observer.observe(document.documentElement);

    window.addEventListener("resize", fitWatermark);
    document.fonts?.ready.then(fitWatermark).catch(() => {});

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fitWatermark);
    };
  }, []);

  return (
    <section id="contact" className="relative pt-6 sm:pt-8 md:pt-12">
      <div
        ref={zoneRef}
        className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <p
          ref={textRef}
          className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-[40%] whitespace-nowrap select-none text-center font-semibold leading-none tracking-tighter text-gray-200/65 [text-shadow:0_0_80px_rgba(209,213,219,0.35),0_0_160px_rgba(243,244,246,0.18)]"
        >
          Webmark
        </p>
      </div>
    </section>
  );
};

export default Footer;
