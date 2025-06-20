import { Button } from "../../components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Layout from "../../components/layouts/Layout";

const PricingPage = () => {
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
    <Layout>
      <section className="gradient-bg px-6 md:px-12 lg:px-20 pt-12 pb-20 md:pt-20 md:pb-32">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-travel-blue mb-6 reveal-animation">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-travel-gray max-w-3xl mx-auto reveal-animation">
              Get everything you need to run your travel agency efficiently, all
              in one platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white border rounded-xl shadow-lg overflow-hidden reveal-animation">
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-travel-blue mb-2">
                  Free Beta
                </h3>
                <div className="text-4xl font-bold mb-1">
                  <span className="text-xl">$</span>0
                </div>
                <p className="text-sm text-travel-gray">Limited Time Only</p>
              </div>

              <div className="border-t"></div>

              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check
                      size={18}
                      className="text-travel-teal mr-3 flex-shrink-0"
                    />
                    <span className="text-sm">3 active modules</span>
                  </li>
                  <li className="flex items-center">
                    <Check
                      size={18}
                      className="text-travel-teal mr-3 flex-shrink-0"
                    />
                    <span className="text-sm">50 leads per month</span>
                  </li>
                  <li className="flex items-center">
                    <Check
                      size={18}
                      className="text-travel-teal mr-3 flex-shrink-0"
                    />
                    <span className="text-sm">Basic AI features</span>
                  </li>
                </ul>

                <Button
                  onClick={() => navigate("/onboarding")}
                  className="w-full mt-6 bg-travel-blue hover:bg-travel-blue/90 text-white"
                >
                  Get Started
                </Button>
              </div>
            </div>

            <div className="bg-white border-2 border-travel-teal rounded-xl shadow-lg overflow-hidden transform md:scale-110 md:-my-4 reveal-animation">
              <div className="bg-travel-teal/10 p-6 text-center relative">
                <div className="absolute top-0 right-0 bg-travel-teal text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  MOST POPULAR
                </div>
                <h3 className="text-xl font-bold text-travel-blue mb-2">
                  Standard
                </h3>
                <div className="text-4xl font-bold mb-1">
                  <span className="text-xl">$</span>99
                </div>
                <p className="text-sm text-travel-gray">per month</p>
              </div>

              <div className="border-t"></div>

              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check
                      size={18}
                      className="text-travel-teal mr-3 flex-shrink-0"
                    />
                    <span className="text-sm">All available modules</span>
                  </li>
                  <li className="flex items-center">
                    <Check
                      size={18}
                      className="text-travel-teal mr-3 flex-shrink-0"
                    />
                    <span className="text-sm">250 leads per month</span>
                  </li>
                  <li className="flex items-center">
                    <Check
                      size={18}
                      className="text-travel-teal mr-3 flex-shrink-0"
                    />
                    <span className="text-sm">Standard AI features</span>
                  </li>
                  <li className="flex items-center">
                    <Check
                      size={18}
                      className="text-travel-teal mr-3 flex-shrink-0"
                    />
                    <span className="text-sm">5 team members</span>
                  </li>
                  <li className="flex items-center">
                    <Check
                      size={18}
                      className="text-travel-teal mr-3 flex-shrink-0"
                    />
                    <span className="text-sm">Email support</span>
                  </li>
                </ul>

                <Button
                  onClick={() => navigate("/onboarding")}
                  className="w-full mt-6 bg-travel-orange hover:bg-orange-600 text-white"
                >
                  Get Started Free
                </Button>

                <p className="text-center text-xs text-gray-500 mt-2">
                  Free during beta, then $99/month
                </p>
              </div>
            </div>

            <div className="bg-white border rounded-xl shadow-lg overflow-hidden reveal-animation">
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-travel-blue mb-2">
                  Enterprise
                </h3>
                <div className="text-4xl font-bold mb-1">Custom</div>
                <p className="text-sm text-travel-gray">Contact Sales</p>
              </div>

              <div className="border-t"></div>

              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check
                      size={18}
                      className="text-travel-teal mr-3 flex-shrink-0"
                    />
                    <span className="text-sm">
                      All modules + priority access
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check
                      size={18}
                      className="text-travel-teal mr-3 flex-shrink-0"
                    />
                    <span className="text-sm">Unlimited leads</span>
                  </li>
                  <li className="flex items-center">
                    <Check
                      size={18}
                      className="text-travel-teal mr-3 flex-shrink-0"
                    />
                    <span className="text-sm">Advanced AI features</span>
                  </li>
                  <li className="flex items-center">
                    <Check
                      size={18}
                      className="text-travel-teal mr-3 flex-shrink-0"
                    />
                    <span className="text-sm">Unlimited team members</span>
                  </li>
                  <li className="flex items-center">
                    <Check
                      size={18}
                      className="text-travel-teal mr-3 flex-shrink-0"
                    />
                    <span className="text-sm">Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <Check
                      size={18}
                      className="text-travel-teal mr-3 flex-shrink-0"
                    />
                    <span className="text-sm">Custom integrations</span>
                  </li>
                </ul>

                <Button
                  variant="outline"
                  onClick={() => navigate("/contact-sales")}
                  className="w-full mt-6 border-travel-blue text-travel-blue hover:bg-travel-blue/10"
                >
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal-animation">
            <h2 className="text-3xl md:text-4xl font-bold text-travel-blue mb-6">
              Compare Features
            </h2>
          </div>

          <div className="overflow-x-auto reveal-animation">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="px-6 py-4 text-left text-lg font-semibold">
                    Features
                  </th>
                  <th className="px-6 py-4 text-center text-lg font-semibold">
                    Free Beta
                  </th>
                  <th className="px-6 py-4 text-center text-lg font-semibold text-travel-orange">
                    Standard
                  </th>
                  <th className="px-6 py-4 text-center text-lg font-semibold">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4">Available modules</td>
                  <td className="px-6 py-4 text-center">3 modules</td>
                  <td className="px-6 py-4 text-center">All modules</td>
                  <td className="px-6 py-4 text-center">
                    All modules + priority access
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4">Monthly leads</td>
                  <td className="px-6 py-4 text-center">50</td>
                  <td className="px-6 py-4 text-center">250</td>
                  <td className="px-6 py-4 text-center">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4">Team members</td>
                  <td className="px-6 py-4 text-center">2</td>
                  <td className="px-6 py-4 text-center">5</td>
                  <td className="px-6 py-4 text-center">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4">AI features</td>
                  <td className="px-6 py-4 text-center">Basic</td>
                  <td className="px-6 py-4 text-center">Standard</td>
                  <td className="px-6 py-4 text-center">Advanced</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4">Support</td>
                  <td className="px-6 py-4 text-center">Community</td>
                  <td className="px-6 py-4 text-center">Email</td>
                  <td className="px-6 py-4 text-center">
                    Priority + Dedicated Manager
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4">Custom integrations</td>
                  <td className="px-6 py-4 text-center">❌</td>
                  <td className="px-6 py-4 text-center">❌</td>
                  <td className="px-6 py-4 text-center">✅</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4">White labeling</td>
                  <td className="px-6 py-4 text-center">❌</td>
                  <td className="px-6 py-4 text-center">❌</td>
                  <td className="px-6 py-4 text-center">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12 lg:px-20 bg-travel-blue text-white">
        <div className="max-w-4xl mx-auto text-center reveal-animation">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Still have questions?
          </h2>
          <p className="text-xl text-travel-lightblue mb-8">
            Our team is ready to help you find the right plan for your agency.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() => navigate("/contact-sales")}
              className="bg-white text-travel-blue hover:bg-gray-100 px-8 py-6 text-lg"
            >
              Contact Sales
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                window.open("https://calendly.com/athitipro/demo", "_blank")
              }
              className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
            >
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PricingPage;
