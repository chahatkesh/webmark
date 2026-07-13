import React from "react";
import { motion } from "framer-motion";
import { assets } from "../../assets/assests";
import LandingButton from "./LandingButton";
import { useStats } from "../../hooks/useStats";

const fmtStat = (n) => {
  if (!n) return null;
  if (n >= 1000) return `${Math.floor(n / 1000)}k+`;
  return n.toLocaleString();
};

const Hero = () => {
  const { stats } = useStats();
  const users = fmtStat(stats?.totalUsers);
  const bookmarks = fmtStat(stats?.totalBookmarks);
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
      className="max-w-[72rem] ml-auto mr-auto pl-4 pr-4 md:pl-6 md:pr-6"
    >
      <div className="w-full pt-32 md:pt-40 pb-12 md:pb-20">
        <div className="pb-12 md:pb-16 text-center">
          <motion.div
            className="mb-6 border-in-header"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
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
            className="leading-none text-[2.9rem] md:text-[56px] font-[700] tracking-[-0.037em] border-in-header mb-6 selection:text-white selection:bg-black"
          >
            Simplify Your Bookmark Management
            <br />
            <span className="hidden md:block"> - with Webmark</span>
          </motion.h1>

          <motion.div
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="max-w-[48rem] ml-auto mr-auto"
          >
            <p className="text-[#374151] text-opacity-100 text-lg leading-normal tracking-[-0.017em] mb-8">
              Easily manage, customize, and search your bookmarks with webmark.
            </p>
            <div className="relative border-in-header">
              <div className="ml-auto mr-auto max-w-80 sm:max-w-none flex flex-col sm:flex-row sm:justify-center gap-4">
                <LandingButton href="/auth" variant="primary" fullWidth arrow>
                  Get Started
                </LandingButton>
                <LandingButton href="#features" variant="secondary" fullWidth>
                  Learn More
                </LandingButton>
              </div>
            </div>
            {users && bookmarks && (
              <p className="mt-5 text-center text-[13px] text-[#9ca3af]">
                <span className="font-medium text-[#374151]">
                  {users} people
                </span>
                {" have saved "}
                <span className="font-medium text-[#374151]">
                  {bookmarks} bookmarks
                </span>
                {" with Webmark"}
              </p>
            )}
          </motion.div>
        </div>

        <motion.div
          variants={imageVariants}
          initial="hidden"
          animate="visible"
          className="max-w-[56rem] aspect-video ml-auto mr-auto border-t-1 border-b-1 border border-transparent border-in-header"
        >
          <div className="border-in-header-2 p-2 md:p-4">
            <div className="relative shadow-xl rounded-xl md:rounded-2xl bg-[#111827]">
              <video
                src={assets.hero_video}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster={assets.hero_image}
                className="h-full w-full rounded-lg md:rounded-xl object-cover pointer-events-none select-none"
                aria-hidden="true"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
