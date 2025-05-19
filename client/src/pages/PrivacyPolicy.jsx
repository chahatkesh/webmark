import { Link } from "react-router-dom";
import { assets } from "../assets/assests";
import { ChevronLeft } from "lucide-react";
import SEO from "../components/SEO";

const PrivacyPolicy = () => {
  return (
    <>
      <SEO
        title="Privacy Policy - Webmark"
        description="Learn about how Webmark collects, uses, and protects your personal information. Our privacy policy outlines our commitment to data security."
        canonicalUrl="https://webmark.site/privacy-policy"
        keywords="webmark privacy policy, data protection, user privacy, bookmark manager privacy"
      />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with logo */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center">
              <img
                src={assets.logo_color}
                alt="Webmark Logo"
                className="h-10 w-auto"
              />
            </Link>
            <Link
              to="/auth"
              className="flex items-center text-sm text-blue-600 hover:text-blue-800">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Sign In
            </Link>
          </div>

          {/* Content */}
          <div className="bg-white shadow rounded-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Privacy Policy
            </h1>
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-4">Last Updated: May 19, 2025</p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 mb-4">
                At Webmark, we value your privacy and are committed to
                protecting your personal information. This Privacy Policy
                explains how we collect, use, and safeguard your data when you
                use our bookmark management service.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                2. Information We Collect
              </h2>
              <p className="text-gray-700 mb-4">
                We collect the following types of information:
              </p>
              <ul className="list-disc pl-8 mb-4 text-gray-700">
                <li>
                  <strong>Account Information:</strong> When you register using
                  Google Authentication, we collect your name, email address,
                  and profile picture.
                </li>
                <li>
                  <strong>Bookmark Data:</strong> We store the bookmarks and
                  categories you create within our Service.
                </li>
                <li>
                  <strong>Usage Information:</strong> We collect data about how
                  you interact with our Service, including device information,
                  IP addresses, and session data.
                </li>
                <li>
                  <strong>Device Information:</strong> We collect information
                  about the devices you use to access our Service, including
                  browser type, operating system, and unique device identifiers.
                </li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-8 mb-4 text-gray-700">
                <li>Provide, maintain, and improve our Service</li>
                <li>Process and manage your account</li>
                <li>Respond to your requests and provide customer support</li>
                <li>Monitor and analyze usage patterns and trends</li>
                <li>Enhance the security and safety of our Service</li>
                <li>
                  Communicate with you about updates or changes to our Service
                </li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                4. Data Storage and Security
              </h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. However, no
                method of transmission over the Internet or electronic storage
                is 100% secure, and we cannot guarantee absolute security.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                5. Data Sharing and Disclosure
              </h2>
              <p className="text-gray-700 mb-4">
                We do not sell your personal information. We may share your
                information in the following circumstances:
              </p>
              <ul className="list-disc pl-8 mb-4 text-gray-700">
                <li>
                  <strong>With Service Providers:</strong> We may share your
                  information with third-party vendors who provide services on
                  our behalf.
                </li>
                <li>
                  <strong>For Legal Reasons:</strong> We may disclose your
                  information if required by law or in response to valid legal
                  requests.
                </li>
                <li>
                  <strong>With Your Consent:</strong> We may share your
                  information with your consent or at your direction.
                </li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                6. Your Rights
              </h2>
              <p className="text-gray-700 mb-4">
                Depending on your location, you may have certain rights
                regarding your personal information, including:
              </p>
              <ul className="list-disc pl-8 mb-4 text-gray-700">
                <li>The right to access your personal information</li>
                <li>
                  The right to correct inaccurate or incomplete information
                </li>
                <li>The right to delete your personal information</li>
                <li>
                  The right to restrict or object to the processing of your
                  information
                </li>
                <li>The right to data portability</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                7. Cookies and Similar Technologies
              </h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to enhance your
                experience, analyze usage patterns, and improve our Service. You
                can control cookie preferences through your browser settings.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                8. Children's Privacy
              </h2>
              <p className="text-gray-700 mb-4">
                Our Service is not intended for individuals under the age of 13.
                We do not knowingly collect personal information from children
                under 13. If we become aware that we have collected personal
                information from a child under 13, we will take steps to delete
                that information.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                9. Changes to This Privacy Policy
              </h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will
                notify you of any significant changes by updating the "Last
                Updated" date at the top of this policy. We encourage you to
                review this Privacy Policy periodically.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                10. Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions or concerns about this Privacy Policy
                or our data practices, please contact us at privacy@webmark.com.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Webmark. All rights reserved.</p>
            <div className="mt-2 flex justify-center space-x-4">
              <Link
                to="/privacy-policy"
                className="text-blue-600 hover:text-blue-800">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link to="/terms" className="text-blue-600 hover:text-blue-800">
                Terms and Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
