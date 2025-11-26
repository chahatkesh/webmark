import {
  BookOpen,
  Bookmark,
  SearchIcon,
  FolderPlus,
  Share2,
  Settings,
} from "lucide-react";
import SEO from "../components/SEO";

const Docs = () => {
  // Define documentation sections
  const docSections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: BookOpen,
      content: (
        <>
          <p className="mb-4">
            Welcome to Webmark! This quick guide will help you get started with
            organizing and managing your bookmarks efficiently.
          </p>
          <p>
            Webmark provides an intuitive interface for saving, categorizing,
            and accessing your bookmarks from anywhere. Start by adding your
            first category and bookmark using the dashboard.
          </p>
        </>
      ),
    },
    {
      id: "adding-bookmarks",
      title: "Adding Bookmarks",
      icon: Bookmark,
      content: (
        <>
          <p className="mb-2">To add a new bookmark:</p>
          <ol className="list-decimal pl-5 space-y-2 mb-4">
            <li>Navigate to the dashboard</li>
            <li>Find the category where you want to add the bookmark</li>
            <li>Click the &ldquo;+&rdquo; button in that category</li>
            <li>Enter the website URL</li>
            <li>Click Save</li>
          </ol>
          <p>
            The system will automatically fetch the website&apos;s Name and
            favicon for visual identification.
          </p>
        </>
      ),
    },
    {
      id: "organizing",
      title: "Organizing with Categories",
      icon: FolderPlus,
      content: (
        <>
          <p className="mb-2">Categories help you group related bookmarks:</p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>
              Create categories for different topics (Work, Entertainment,
              Learning, etc.)
            </li>
            <li>Customize category colors and emojis</li>
            <li>Drag and drop to rearrange bookmarks within categories</li>
          </ul>
          <p>
            A well-organized bookmark collection makes it easier to find what
            you need quickly.
          </p>
        </>
      ),
    },
    {
      id: "searching",
      title: "Finding Bookmarks",
      icon: SearchIcon,
      content: (
        <>
          <p className="mb-4">
            Quickly locate any bookmark using the search bar at the top of the
            dashboard. Search works across:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Bookmark names</li>
            <li>URLs</li>
            <li>Category names</li>
          </ul>
          <p>
            Results appear instantly as you type, helping you find exactly what
            you need.
          </p>
        </>
      ),
    },
    {
      id: "sharing",
      title: "Sharing and Collaboration",
      icon: Share2,
      content: (
        <p>
          Share your Webmark experience with friends and colleagues. Invite
          others to create their own accounts and organize their digital lives
          more effectively. Collaborative features like shared collections are
          coming soon!
        </p>
      ),
    },
    {
      id: "account",
      title: "Account Settings",
      icon: Settings,
      content: (
        <>
          <p className="mb-2">Manage your account settings:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Update your profile information</li>
            <li>View account activity</li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <>
      <SEO
        title="Documentation - Webmark"
        description="Learn how to use Webmark's features efficiently. Step-by-step guides on bookmarking, categorization, search, and more."
        canonicalUrl="https://webmark.chahatkesh.me/docs"
        keywords="webmark documentation, bookmark tutorial, how to use webmark, bookmark management guide"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "How do I add a new bookmark in Webmark?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "To add a new bookmark: Navigate to the dashboard, find the category where you want to add the bookmark, click the '+' button in that category, enter the website URL, and click Save. The system will automatically fetch the website's Name and favicon for visual identification.",
              },
            },
            {
              "@type": "Question",
              name: "How do I organize bookmarks with categories?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Categories help you group related bookmarks. You can create categories for different topics (Work, Entertainment, Learning, etc.), customize category colors and emojis, and drag and drop to rearrange bookmarks within categories. A well-organized bookmark collection makes it easier to find what you need quickly.",
              },
            },
            {
              "@type": "Question",
              name: "How do I find a specific bookmark?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Quickly locate any bookmark using the search bar at the top of the dashboard. Search works across bookmark names, URLs, and category names. Results appear instantly as you type, helping you find exactly what you need.",
              },
            },
          ],
        }}
      />
      <div className="w-[95vw] h-auto m-auto bg-white rounded-md px-6 py-8 mt-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Documentation
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your complete guide to using Webmark efficiently
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-gray-50 rounded-lg p-5 mb-10">
            <h2 className="text-lg font-semibold mb-3">Quick Navigation</h2>
            <ul className="space-y-1">
              {docSections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition-colors">
                    <section.icon className="w-4 h-4" />
                    <span>{section.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Documentation Sections */}
          <div className="space-y-12">
            {docSections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2.5 rounded-lg bg-blue-50 text-blue-600`}>
                    <section.icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {section.title}
                  </h2>
                </div>
                <div className="text-gray-700 leading-relaxed pl-11">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          {/* Help Footer */}
          <div className="mt-16 p-6 bg-blue-50 rounded-xl text-center">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              Need More Help?
            </h3>
            <p className="text-gray-700 mb-4">
              We&apos;re constantly improving our documentation. If you have
              specific questions or feedback, don&apos;t hesitate to reach out.
            </p>
            <a
              href="mailto:webmark.care@gmail.com"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Docs;
