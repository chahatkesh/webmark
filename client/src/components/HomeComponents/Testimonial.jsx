import React, { useEffect } from "react";

// Separate testimonial data with real avatar URLs
const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    handle: "@sarahchen_dev",
    image: "https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg",
    content:
      "Webmark has completely transformed how I organize my dev resources. The ability to categorize and tag bookmarks makes finding documentation and tutorials so much faster. The search functionality is incredibly powerful!",
    date: "Apr 15, 2024",
    rotation: -1,
  },
  {
    id: 2,
    name: "Alex Thompson",
    handle: "@alexdev",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    content:
      "As a full-stack developer, I juggle countless resources daily. Webmark's collections feature helps me keep everything organized by project, and the dark mode is perfect for late-night coding sessions.",
    date: "Apr 13, 2024",
    rotation: 1,
  },
  {
    id: 3,
    name: "Maria García",
    handle: "@maria_ux",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    content:
      "The custom tagging system in Webmark is a game-changer for UX research. I can easily sort and find inspiration from different sources. The quick search feature saves me hours every week!",
    date: "Apr 10, 2024",
    rotation: -1,
  },
  {
    id: 4,
    name: "James Wilson",
    handle: "@jwilson_tech",
    image: "https://randomuser.me/api/portraits/men/86.jpg",
    content:
      "Love how Webmark syncs across all my devices. The smart collections and drag-and-drop interface make organizing bookmarks actually enjoyable. It's become an essential part of my daily workflow.",
    date: "Apr 8, 2024",
    rotation: 1,
  },
  {
    id: 5,
    name: "Emily Zhang",
    handle: "@em_codes",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    content:
      "The Chrome extension is fantastic! One-click saving with automatic tag suggestions has made my research workflow so much more efficient. Webmark is my digital library organizer!",
    date: "Apr 5, 2024",
    rotation: -1,
  },
  {
    id: 6,
    name: "David Kumar",
    handle: "@david_k",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
    content:
      "Finally found the perfect bookmark manager! The ability to add notes to bookmarks helps me remember why I saved something. The search feature is lightning fast!",
    date: "Apr 3, 2024",
    rotation: 1,
  },
];

const Testimonial = () => {
  useEffect(() => {
    const initializeScroller = () => {
      const scrollers = document.querySelectorAll(".scroller");

      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        addAnimation(scrollers);
      }
    };

    const addAnimation = (scrollers) => {
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
    };

    initializeScroller();
  }, []);

  const TestimonialCard = ({ testimonial }) => (
    <article
      className={`
        rotate-[${testimonial.rotation}deg] 
        ml-3 mr-3 shadow p-5 
        bg-[#ffffffb3] rounded-2xl 
        flex flex-col w-[22rem] relative
        hover:shadow-lg transition-shadow duration-300
      `}>
      <header className="flex items-center mb-4 gap-3">
        <img
          className="rounded-full flex-shrink-0 max-w-full h-auto object-cover"
          width={44}
          height={44}
          src={testimonial.image}
          alt={`${testimonial.name}'s profile picture`}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(testimonial.name);
          }}
        />
        <div>
          <div className="font-[700]">{testimonial.name}</div>
          <div>
            <a
              className="text-[#6b7280cc] text-[0.875rem] leading-[1.5715em] font-[500] hover:text-blue-600 transition-colors duration-300"
              href="#"
              rel="noopener noreferrer">
              {testimonial.handle}
            </a>
          </div>
        </div>
      </header>
      <div className="text-[#374151] text-[0.875rem] leading-[1.5715em] flex-grow">
        {testimonial.content}
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
            d="M16.928 14.054H11.99L8.125 9.162l-4.427 4.892H1.243L6.98 7.712.928.054H5.99L9.487 4.53 13.53.054h2.454l-5.358 5.932 6.303 8.068Zm-4.26-1.421h1.36L5.251 1.4H3.793l8.875 11.232Z"
          />
        </svg>
        <div className="text-[0.75rem] leading-[1.5]">{testimonial.date}</div>
      </footer>
    </article>
  );

  return (
    <section className="relative py-12 md:py-20">
      <div className="pl-4 pr-4 sm:pl-6 sm:pr-6 max-w-[72rem] ml-auto mr-auto">
        <div className="max-w-[48rem] text-center ml-auto mr-auto">
          <h2 className="md:leading-[1.2777] leading-[1.3333] text-[1.875rem] tracking-[-0.037em] md:text-[2.25rem] font-[700]">
            Trusted and loved by Professionals
          </h2>
        </div>
      </div>
      <div className="flex relative w-[100vw] justify-center ml-auto mr-auto">
        {/* Background effects */}
        <div className="translate-x-[-9rem] absolute bottom-[5rem] -z-10">
          <div className="blur-[160px] opacity-35 to-[#111827] from-[#3b82f6] bg-gradient-to-tr h-80 w-80 rounded-full" />
        </div>
        <div className="absolute bottom-[-2.5rem] -z-10">
          <div className="blur-[160px] opacity-40 to-[#111827] from-[#3b82f6] bg-gradient-to-tr h-80 w-80 rounded-full" />
        </div>
        <div className="absolute bottom-0 -z-10">
          <div className="blur-[20px] h-56 w-56 rounded-full border-[20px] border-white" />
        </div>

        {/* Testimonial scroller */}
        <div className="scroller w-[90vw] pt-12 pb-12 md:pt-20 md:pb-20 flex">
          <div className="scroller-inner flex">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
