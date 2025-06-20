import { Button } from "../../ui/button";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".reveal-animation");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div
      className="gradient-bg px-6 md:px-12 lg:px-20 pt-12 pb-20 md:pt-24 md:pb-32"
      ref={heroRef}
    >
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-travel-blue mb-6 reveal-animation">
          Run Your Travel Agency on Autopilot
        </h1>
        <p className="text-xl md:text-2xl text-travel-gray mb-12 max-w-3xl mx-auto reveal-animation">
          Six AI-powered tools, one simple workspace
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 reveal-animation">
          <Button
            onClick={() => navigate("/onboarding")}
            className="bg-travel-orange hover:bg-orange-600 text-white font-semibold px-8 py-6 text-lg"
          >
            Get Started Free
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/demo")}
            className="border-travel-blue text-travel-blue hover:bg-travel-blue/10 font-semibold px-8 py-6 text-lg"
          >
            Book a Demo
          </Button>
        </div>
        <div className="mt-16 md:mt-24 max-w-5xl mx-auto reveal-animation">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-travel-blue/10 p-2 border-b border-gray-100 flex items-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </div>
            <div className="p-4 h-[280px] md:h-[400px] bg-gray-50 flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src="/dashboard_overview.png"
                  alt="Dashboard preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
