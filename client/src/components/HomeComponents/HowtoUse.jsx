import React from "react";
import { UserPlus, Link, Pencil, ArrowRight, Check } from "lucide-react";

const HowToUse = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Create a Free Account",
      description: "Get started with Webmark in less than 2 minutes",
      details: [
        "No credit card required",
        "Access to basic features",
        "Secure authentication",
      ],
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
    },
    {
      icon: Link,
      title: "Copy the Link",
      description: "Save any web page with a single click",
      details: [
        "Support for all websites",
        "Automatic metadata extraction",
        "Quick save functionality",
      ],
      color: "bg-gradient-to-r from-indigo-500 to-indigo-600",
    },
    {
      icon: Pencil,
      title: "Customize the Bookmark",
      description: "Organize your bookmarks your way",
      details: ["Add custom tags", "Create collections", "Add personal notes"],
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
    },
  ];

  return (
    <section id="how-to-use" className="bg-[#f5f7fb] py-16 md:py-24">
      <div className="px-4 sm:px-6 max-w-[72rem] ml-auto mr-auto">
        <div className="py-12 md:py-16 flex flex-col gap-6">
          {/* Heading */}
          <div className="pb-12 md:pb-28 text-center max-w-[48rem] ml-auto mr-auto">
            <h2 className="mb-4 md:leading-[1.2777] leading-[1.3333] text-[1.875rem] tracking-[-0.037em] md:text-[2.25rem] text-[#111827] font-[700]">
              Get Started in Minutes
            </h2>
            <p className="text-[#374151] leading-[1.5] text-[1.125rem] tracking-[-0.017em]">
              Follow these simple steps to start organizing your web bookmarks
              like a pro
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="group relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 left-[calc(100%_-_2rem)] w-16 border-t-2 border-dashed border-gray-300 -translate-y-1/2"></div>
                )}

                {/* Card */}
                <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  {/* Icon */}
                  <div
                    className={`mb-6 w-16 h-16 rounded-full ${step.color} p-4 mx-auto transform transition-transform duration-300 group-hover:scale-110`}>
                    <step.icon className="w-full h-full text-white" />
                  </div>

                  {/* Content */}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mb-6">{step.description}</p>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3">
                    {step.details.map((detail, detailIndex) => (
                      <li
                        key={detailIndex}
                        className="flex items-center text-gray-700">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <Check className="w-3 h-3 text-blue-600" />
                        </span>
                        <span className="text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <a
              href="/auth"
              className="inline-flex items-center gap-2 px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToUse;
