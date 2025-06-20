import { Button } from "../../ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Check } from "lucide-react";

const PricingTeaser = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = document.querySelectorAll(".reveal-animation");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section className="py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 reveal-animation">
          <h2 className="text-3xl md:text-4xl font-bold text-travel-blue mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-travel-gray max-w-3xl mx-auto">
            Free while in beta – one simple plan
          </p>
        </div>

        <div className="max-w-md mx-auto reveal-animation">
          <div className="bg-white border-2 border-travel-teal/30 rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 text-center bg-travel-teal/10">
              <h3 className="text-2xl font-bold text-travel-blue mb-2">
                Early Access
              </h3>
              <div className="text-5xl font-bold text-travel-blue mb-1">
                <span className="text-2xl">$</span>0
              </div>
              <p className="text-travel-gray">Limited Time Offer</p>
            </div>

            <div className="p-8">
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Check size={20} className="text-travel-teal mr-3" />
                  <span>All modules included</span>
                </li>
                <li className="flex items-center">
                  <Check size={20} className="text-travel-teal mr-3" />
                  <span>Unlimited leads</span>
                </li>
                <li className="flex items-center">
                  <Check size={20} className="text-travel-teal mr-3" />
                  <span>AI features (limited credits)</span>
                </li>
                <li className="flex items-center">
                  <Check size={20} className="text-travel-teal mr-3" />
                  <span>Priority access to new features</span>
                </li>
              </ul>

              <Button
                onClick={() => navigate("/onboarding")}
                className="w-full mt-8 bg-travel-orange hover:bg-orange-600 text-white"
              >
                Get Started Free
              </Button>

              <p className="text-center text-sm text-gray-500 mt-4">
                No credit card required
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingTeaser;
