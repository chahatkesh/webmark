import { Link } from "react-router-dom";
import { assets } from "../assets/assests";
import { reportError } from "../utils/errorReporter";
import { useEffect } from "react";
import SEO from "../components/SEO";

const NotFoundPage = () => {
  // Report 404 error for analytics
  useEffect(() => {
    reportError(new Error("404 Page Not Found"), {
      source: "NotFoundPage",
      path: window.location.pathname,
    });
  }, []);

  return (
    <>
      <SEO
        title="Page Not Found - 404 Error"
        description="Sorry, the page you are looking for does not exist or has been moved."
        canonicalUrl="https://webmark.chahatkesh.me/404"
        keywords="404, page not found, error, webmark"
        indexPage={false}
      />
      <div className="relative min-h-screen overflow-hidden bg-[#02050c] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(29,78,216,0.14),rgba(2,5,12,0)_42%)]" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-6 text-center">
          <img
            src={assets.logo_color}
            alt="Webmark Logo"
            className="mb-10 h-10 w-auto md:mb-12 md:h-12"
          />

          <div className="relative">
            <p className="select-none text-[7.5rem] font-bold leading-none tracking-[-0.05em] text-white/[0.06] md:text-[13rem]">
              404
            </p>
            <h1 className="absolute inset-0 flex items-center justify-center text-[2rem] font-semibold tracking-[-0.02em] text-white md:text-[2.15rem]">
              Nothing here.
            </h1>
          </div>

          <p className="mt-6 max-w-2xl text-[1.05rem] leading-8 text-white/60 md:text-[1.1rem]">
            The page you&apos;re looking for doesn&apos;t exist, or it was moved
            somewhere else.
          </p>

          <Link
            to="/"
            className="mt-9 inline-flex items-center justify-center rounded-xl border border-white/20 px-8 py-3 text-lg font-medium text-white transition hover:border-white/35 hover:bg-white/5"
          >
            Go home
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
