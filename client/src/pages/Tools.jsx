import {
  Sparkles,
  Bot,
  Brain,
  Share2,
  BookOpen,
  Code,
  Rocket,
  Palette,
  UserCheck,
} from "lucide-react";

const Tools = () => {
  // Tools array for easier management of tools
  const toolsList = [
    {
      id: 1,
      name: "AI Suggestions",
      description: "Smart bookmark categorization",
      icon: Bot,
      bgColor: "bg-blue-50",
      textColor: "text-blue-500",
      url: "#",
      isComingSoon: true,
    },
    {
      id: 2,
      name: "Smart Tags",
      description: "Automated tagging system",
      icon: Brain,
      bgColor: "bg-purple-50",
      textColor: "text-purple-500",
      url: "#",
      isComingSoon: true,
    },
    {
      id: 3,
      name: "Related Links",
      description: "Discover connected content",
      icon: Share2,
      bgColor: "bg-green-50",
      textColor: "text-green-500",
      url: "#",
      isComingSoon: true,
    },
    {
      id: 4,
      name: "Web Portfolio",
      description: "Create a shareable portfolio",
      icon: Palette,
      bgColor: "bg-amber-50",
      textColor: "text-amber-500",
      url: "https://chahat.me",
      isComingSoon: false,
    },
    {
      id: 5,
      name: "Developer Blog",
      description: "Technical tutorials and insights",
      icon: Code,
      bgColor: "bg-rose-50",
      textColor: "text-rose-500",
      url: "https://devblog.chahat.me",
      isComingSoon: false,
    },
    {
      id: 6,
      name: "Public Dashboards",
      description: "Data visualization tools",
      icon: Rocket,
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-500",
      url: "#",
      isComingSoon: true,
    },
  ];

  return (
    <div className="w-[95vw] h-auto m-auto bg-white rounded-md px-6 py-8 mt-11">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-blue-50 rounded-xl mb-3">
            <Sparkles className="h-6 w-6 text-blue-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tools & Resources
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore additional tools created by the Webmark team to enhance your
            digital experience
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolsList.map((tool) => (
            <a
              key={tool.id}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block group transition-all duration-300 hover:shadow-lg ${
                tool.isComingSoon ? "pointer-events-none" : ""
              }`}>
              <div className="border border-gray-200 rounded-xl p-6 h-full flex flex-col">
                <div
                  className={`${tool.bgColor} ${tool.textColor} p-3 rounded-lg w-fit mb-4`}>
                  <tool.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
                  {tool.name}
                  {tool.isComingSoon && (
                    <span className="ml-2 text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </h3>
                <p className="text-gray-600 mb-4 flex-grow">
                  {tool.description}
                </p>

                {!tool.isComingSoon && (
                  <div className="text-sm font-medium text-blue-600 flex items-center mt-2 group-hover:underline">
                    View Resource
                    <svg
                      className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>

        {/* Footer Section */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <UserCheck className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-gray-900">Creator Profile</span>
          </div>
          <a
            href="https://chahat.me"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200">
            <BookOpen className="h-5 w-5 mr-2" />
            Visit Creator's Website
          </a>
          <p className="text-gray-500 mt-4">
            Have a suggestion for a new tool? <br />
            <a
              href="mailto:contact@webmark.site"
              className="text-blue-500 hover:underline">
              Let us know
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Tools;
