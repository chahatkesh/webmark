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
import HowtoUse from "../components/HomeComponents/HowtoUse";
import StatsSection from "../components/HomeComponents/StatsSection";
import SEO from "../components/SEO";

const Home = () => {
  return (
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
