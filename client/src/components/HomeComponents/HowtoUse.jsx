import React from "react";
import { UserPlus, Link, Pencil } from "lucide-react";

const HowToUse = () => {
  return (
    <section id="how-to-use" className="bg-[#f5f7fb] py-16 md:py-24">
      <div className="px-4 sm:px-6 max-w-[72rem] ml-auto mr-auto">
        <div className="py-12 md:py-16 flex flex-col gap-6">
          {/* Heading */}
          <div className="pb-12 md:pb-28 text-center max-w-[48rem] ml-auto mr-auto">
            <h2 className="mb-4 md:leading-[1.2777] leading-[1.3333] text-[1.875rem] tracking-[-0.037em] md:text-[2.25rem] text-[#111827] font-[700]">
              How to Use?
            </h2>
            <p className="text-[#374151] leading-[1.5] text-[1.125rem] tracking-[-0.017em]">
              3 Simple Steps to get started with Webmark.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="mb-6">
                <UserPlus className="h-16 w-16 mx-auto text-blue-500" />
              </div>
              <h3 className="text-[1.25rem] font-bold text-[#0a2c51] mb-2">
                Create a Free Account
              </h3>
              <p className="text-[#4b5563] leading-[1.6]">
                Sign up for a free Webmark account to get started.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="mb-6">
                <Link className="h-16 w-16 mx-auto text-blue-500" />
              </div>
              <h3 className="text-[1.25rem] font-bold text-[#0a2c51] mb-2">
                Copy the Link
              </h3>
              <p className="text-[#4b5563] leading-[1.6]">
                Copy the link you want to bookmark.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="mb-6">
                <Pencil className="h-16 w-16 mx-auto text-blue-500" />
              </div>
              <h3 className="text-[1.25rem] font-bold text-[#0a2c51] mb-2">
                Customize the Bookmark
              </h3>
              <p className="text-[#4b5563] leading-[1.6]">
                Customize the bookmark as per your choice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToUse;
