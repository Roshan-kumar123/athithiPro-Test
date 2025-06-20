import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Layout from "../layouts/Layout";

const OnboardingComplete = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Animation for the completion screen
    const elements = document.querySelectorAll(".animate-fade-in");

    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add("opacity-100");
        element.classList.remove("opacity-0", "translate-y-4");
      }, index * 200);
    });
  }, []);

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="mb-8 animate-fade-in opacity-0 translate-y-4 transition-all duration-500">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-travel-blue mb-4">
              Setup Complete!
            </h1>

            <p className="text-xl text-travel-gray">Your dashboard is ready.</p>
          </div>

          <div className="flex flex-col space-y-4 animate-fade-in opacity-0 translate-y-4 transition-all duration-500 delay-200">
            <Button
              onClick={() =>
                (window.location.href = "https://athitipro-leads.aionos.co/crm")
              }
              className="bg-travel-blue hover:bg-travel-blue/90"
            >
              Go to Leads
            </Button>

            <Button
              onClick={() => navigate("/login")}
              variant="outline"
              className="border-travel-blue text-travel-blue hover:bg-travel-blue/10"
            >
              Go to Login
            </Button>

            <Button
              onClick={() => navigate("/dashboard/docuhelp")}
              variant="outline"
              className="border-travel-teal text-travel-teal hover:bg-travel-teal/10"
            >
              Upload Docs
            </Button>
          </div>

          <p className="mt-8 text-sm text-gray-500 animate-fade-in opacity-0 translate-y-4 transition-all duration-500 delay-400">
            Need help getting started?{" "}
            <a href="#" className="text-travel-blue hover:underline">
              Check our guide
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default OnboardingComplete;
