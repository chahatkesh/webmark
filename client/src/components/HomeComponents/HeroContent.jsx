import React from "react";
import { motion } from "framer-motion";
import { assets } from "../../assets/assests";

const Hero = () => {
  // Stagger animation for avatar stack
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

  // Other animations remain the same
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.4,
      },
    },
  };

  const avatars = [
    { src: assets.icon01, opacity: "0" },
    { src: assets.icon02, opacity: "1" },
    { src: assets.icon03, opacity: "1" },
    { src: assets.icon04, opacity: "1" },
    { src: assets.icon05, opacity: "1" },
    { src: assets.icon06, opacity: "1" },
  ];

  return (
    <section
      id="home"
      className="max-w-[72rem] ml-auto mr-auto pl-4 pr-4 md:pl-6 md:pr-6">
      <div className="w-full pt-32 md:pt-40 pb-12 md:pb-20">
        <div className="pb-12 md:pb-16 text-center">
          <motion.div
            className="mb-6 border-in-header"
            variants={containerVariants}
            initial="hidden"
            animate="visible">
            <div className="flex justify-center ml-[-2px] mr-[-2px]">
              {avatars.map((avatar, index) => (
                <motion.img
                  key={index}
                  variants={itemVariants}
                  className={`border-2 border-opacity-${
                    avatar.opacity
                  } border-[#f9fafb] rounded-full box-content ${
                    index !== 0 ? "ml-[-12px] space-x-reverse" : ""
                  }`}
                  width={32}
                  src={avatar.src}
                  alt=""
                  loading="lazy"
                />
              ))}
            </div>
          </motion.div>

          {/* Rest of the component remains the same */}
          <motion.h1
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="leading-none text-[2.9rem] md:text-[56px] font-[700] tracking-[-0.037em] border-in-header mb-6 selection:text-white selection:bg-black">
            Simplify Your Bookmark Management
            <br />
            <span className="hidden md:block"> - with Webmark</span>
          </motion.h1>

          <motion.div
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="max-w-[48rem] ml-auto mr-auto">
            <p className="text-[#374151] text-opacity-100 text-lg leading-normal tracking-[-0.017em] mb-8">
              Easily manage, customize, and search your bookmarks with webmark.
            </p>
            <div className="relative border-in-header">
              <div className="ml-auto mr-auto max-w-80 sm:max-w-none sm:flex sm:justify-center">
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto sm:mb-0 mb-4 shadow text-white bg-blue-500 hover:bg-blue-600 hover:font-[600] pl-4 pr-4 pt-2.5 pb-2.5 inline-flex items-center justify-center rounded-[8px] leading-[1.5715] font-[500] whitespace-nowrap text-[0.875rem]"
                  href="/auth">
                  <span className="inline-flex items-center relative">
                    Get Started
                    <span className="tracking-[0rem] ml-1 text-[#93c5fd]">
                      -&gt;
                    </span>
                  </span>
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto sm:ml-4 shadow pl-4 pr-4 pt-2.5 pb-2.5 inline-flex items-center justify-center rounded-[8px] leading-[1.5715] font-[500] whitespace-nowrap text-[0.875rem] text-[#1f2937] bg-white hover:text-black hover:font-[600]"
                  href="">
                  Learn More
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={imageVariants}
          initial="hidden"
          animate="visible"
          className="max-w-[48rem] ml-auto mr-auto border-t-1 border-b-1 border border-transparent border-in-header">
          <div className="border-in-header-2 p-4">
            <div className="relative shadow-xl pt-3 pb-3 pl-5 pr-5 rounded-xl md:rounded-2xl bg-[#111827] aspect-[16/9]">
              <img src={assets.hero_image} alt="" loading="lazy" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
