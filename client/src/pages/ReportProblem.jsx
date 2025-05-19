import React, { useState } from "react";
import { AlertCircle, Send, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { reportError } from "../utils/errorReporter";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../hooks/useAuth";

const ReportProblem = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    email: user?.email || "",
    steps: "",
    browser: navigator.userAgent,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // For now we just log the report
      reportError(new Error(formData.title), {
        source: "ReportProblem",
        userReport: formData,
        userId: user?._id,
      });

      // In a real implementation, you would send this to a server endpoint
      // await fetch('/api/report-problem', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      setIsSubmitted(true);
    } catch (error) {
      console.error("Failed to submit report", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center p-4 mt-16 mb-8">
      <div className="max-w-xl mx-auto space-y-8 w-full">
        {/* Icon */}
        <div className="relative inline-block mx-auto">
          <div className="absolute inset-0 bg-blue-500 rounded-xl blur-lg opacity-20 animate-pulse [animation-duration:3s]"></div>
          <div className="relative bg-white p-6 rounded-xl shadow-lg">
            {isSubmitted ? (
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            ) : (
              <AlertCircle className="w-16 h-16 text-blue-500 mx-auto" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {isSubmitted ? "Thanks for Your Report" : "Report a Problem"}
          </h1>
          <p className="text-lg text-gray-600">
            {isSubmitted
              ? "Our team has been notified and will look into this issue."
              : "Help us improve Webmark by reporting any issues you encounter."}
          </p>
        </div>

        {isSubmitted ? (
          <>
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-6">
                Reference ID:{" "}
                {Math.random().toString(36).substring(2, 10).toUpperCase()}
              </p>
              <Button onClick={() => setIsSubmitted(false)} variant="outline">
                Report Another Issue
              </Button>
            </div>

            {/* Upcoming Features Preview */}
            <div className="mt-10 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
                Coming Soon
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="pt-4 text-sm text-gray-500 text-center">
                Stay tuned for these exciting features that will improve your
                error reporting experience
              </div>
            </div>
          </>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Issue Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Brief description of the issue"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Please describe the issue in detail"
                  rows={5}
                  required
                />
              </div>

              <div>
                <Label htmlFor="steps">Steps to Reproduce</Label>
                <Textarea
                  id="steps"
                  name="steps"
                  value={formData.steps}
                  onChange={handleChange}
                  placeholder="What steps can we take to see this issue?"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="email">Contact Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email address"
                  required
                />
              </div>

              {/* System Information - Automatically collected */}
              <div className="mt-4 border-t pt-4 border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm font-medium text-gray-500">
                    System Information
                  </Label>
                  <span className="text-xs text-gray-400">
                    Automatically included
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-md text-xs text-gray-500 font-mono overflow-hidden">
                  <p className="truncate">Browser: {navigator.userAgent}</p>
                  <p>URL: {window.location.href}</p>
                  <p>
                    Screen: {window.innerWidth}x{window.innerHeight}
                  </p>
                </div>
              </div>
            </div>{" "}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Report"}
                <Send className="ml-2 h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
                className="sm:w-auto">
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReportProblem;
