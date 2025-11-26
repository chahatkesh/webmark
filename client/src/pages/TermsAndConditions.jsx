import { Link } from "react-router-dom";
import { assets } from "../assets/assests";
import { ChevronLeft } from "lucide-react";
import SEO from "../components/SEO";

const TermsAndConditions = () => {
  return (
    <>
      <SEO
        title="Terms and Conditions - Webmark"
        description="Read the terms and conditions for using Webmark's bookmark management service. Understand our service terms, user responsibilities, and legal agreements."
        canonicalUrl="https://webmark.chahatkesh.me/terms"
        keywords="webmark terms, terms and conditions, user agreement, service terms"
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
              Terms and Conditions
            </h1>
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-4">Last Updated: May 19, 2025</p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 mb-4">
                Welcome to Webmark ("we," "our," or "us"). By accessing or using
                our bookmark management service, you agree to be bound by these
                Terms and Conditions. Please read them carefully.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                2. Definitions
              </h2>
              <p className="text-gray-700 mb-4">
                <strong>"Service"</strong> refers to the Webmark application,
                including all features, functionalities, and user interfaces.
                <br />
                <strong>"User"</strong> refers to any individual who accesses or
                uses our Service.
                <br />
                <strong>"Content"</strong> refers to all bookmarks, categories,
                and other data stored by users on our Service.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                3. Account Registration
              </h2>
              <p className="text-gray-700 mb-4">
                To use our Service, you must register for an account using
                Google Authentication. You are responsible for maintaining the
                confidentiality of your account and for all activities that
                occur under your account.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                4. User Content
              </h2>
              <p className="text-gray-700 mb-4">
                You retain ownership of all content you store on our Service. By
                using our Service, you grant us a license to host, store, and
                display your content solely for the purpose of providing the
                Service to you.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                5. Acceptable Use
              </h2>
              <p className="text-gray-700 mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc pl-8 mb-4 text-gray-700">
                <li>Violate any applicable laws or regulations</li>
                <li>Store or share illegal or harmful content</li>
                <li>
                  Infringe upon the intellectual property rights of others
                </li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of the Service</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                6. Service Availability
              </h2>
              <p className="text-gray-700 mb-4">
                While we strive to provide uninterrupted access to our Service,
                we do not guarantee that the Service will be available at all
                times. We reserve the right to modify, suspend, or discontinue
                the Service at any time without notice.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                7. Changes to Terms
              </h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these Terms at any time. We will
                notify you of any significant changes by updating the "Last
                Updated" date. Your continued use of the Service after any such
                changes constitutes your acceptance of the new Terms.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                8. Termination
              </h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account at our discretion,
                without notice, for conduct that we believe violates these Terms
                or is harmful to other users, us, or third parties, or for any
                other reason.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                9. Disclaimer of Warranties
              </h2>
              <p className="text-gray-700 mb-4">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY
                WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                10. Contact Information
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms, please contact us
                at support@webmark.com.
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

export default TermsAndConditions;
