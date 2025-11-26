import { useEffect, useState } from "react";
import HeroContent from "../components/HomeComponents/HeroContent";
import Background from "../components/HomeComponents/Background/Background";
import Circle1 from "../components/HomeComponents/Background/Circle1";
import Circle2 from "../components/HomeComponents/Background/Circle2";
import Circle3 from "../components/HomeComponents/Background/Circle3";
import Navbar from "../components/HomeComponents/Navbar";
import Message from "../components/HomeComponents/Message";
import Footer from "../components/HomeComponents/Footer";
import Cta from "../components/HomeComponents/Cta";
import Testimonial from "../components/HomeComponents/Testimonial";
import Features from "../components/HomeComponents/Features";
import Loader from "../components/Loader";
import HowtoUse from "../components/HomeComponents/HowtoUse";
import StatsSection from "../components/HomeComponents/StatsSection";
import SEO from "../components/SEO";
import Prefetcher from "../components/Prefetcher";

const Home = () => {
  // loader start
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);
  // loder ends

  return loading ? (
    <Loader type="text" size="lg" fullScreen={true} text="Webmark" />
  ) : (
    <>
      <SEO
        title="Webmark - Modern Bookmark Management Application"
        description="Simplify your digital life with Webmark, the ultimate bookmark management tool. Organize, categorize, and access your bookmarks efficiently."
        canonicalUrl="https://webmark.chahatkesh.me"
        keywords="bookmark manager, bookmark organization, web bookmarks, bookmark tool, productivity tool, bookmark management system"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Webmark",
          url: "https://webmark.chahatkesh.me",
          description:
            "A modern bookmark management application designed to help users efficiently organize and manage their bookmarks",
          applicationCategory: "Productivity Software",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          screenshot: "https://webmark.chahatkesh.me/hero_image.png",
          featureList: [
            "Custom bookmark categories",
            "Quick search functionality",
            "Cloud synchronization",
            "User-friendly interface",
            "Secure bookmark storage",
          ],
        }}
      />
      <Prefetcher />
      <Navbar />
      <main className="flex-grow">
        <section className="relative">
          <Background />
          <Circle1 />
          <Circle2 />
          <Circle3 />
          <HeroContent />
        </section>
        <Message />
        <Features />
        <StatsSection />
        <HowtoUse />
        <Testimonial />
        <Cta />
      </main>
      <Footer />
    </>
  );
};

export default Home;
