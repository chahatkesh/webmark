import React from "react";
import { AlertCircle } from "lucide-react";

const ReportProblem = () => {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center p-4 mt-20">
      <div className="text-center max-w-xl mx-auto space-y-8">
        {/* Icon */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-blue-500 rounded-xl blur-lg opacity-20 animate-pulse [animation-duration:3s]"></div>
          <div className="relative bg-white p-6 rounded-xl shadow-lg">
            <AlertCircle className="w-16 h-16 text-blue-500 mx-auto" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Report System Coming Soon
          </h1>
          <p className="text-lg text-gray-600">
            We're building a robust problem reporting system to better assist
            you with any issues
          </p>
        </div>

        {/* Upcoming Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-blue-500 flex-shrink-0" />
            <div className="text-left">
              <h3 className="font-semibold">Issue Tracking</h3>
              <p className="text-sm text-gray-600">
                Track your reported issues
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-blue-500 flex-shrink-0" />
            <div className="text-left">
              <h3 className="font-semibold">Status Updates</h3>
              <p className="text-sm text-gray-600">
                Real-time resolution updates
              </p>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="pt-4 text-sm text-gray-500">
          Stay tuned for these exciting features that will make your bookmarking
          smarter and more efficient
        </div>
      </div>
    </div>
  );
};

export default ReportProblem;
