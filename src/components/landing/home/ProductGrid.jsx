import { Badge } from "../../ui/badge";
import { Card } from "../../ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ProductGrid = () => {
  const navigate = useNavigate();

  const modules = [
    {
      key: "leads",
      name: "Leads",
      tagline: "Travel-first CRM with built-in AI",
      launch_status: "live",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
    },
    {
      key: "create",
      name: "Create",
      tagline: "GenAI content for email / WhatsApp / social",
      launch_status: "soon",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
      ),
    },
    {
      key: "target",
      name: "Target",
      tagline: "Auto-cohort segmentation from CRM data",
      launch_status: "live",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="6"></circle>
          <circle cx="12" cy="12" r="2"></circle>
        </svg>
      ),
    },
    {
      key: "plan",
      name: "Plan",
      tagline: "AI itinerary builder for travellers",
      launch_status: "soon",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
    },
    {
      key: "assist",
      name: "Assist",
      tagline: "Unified inbox for post-booking support",
      launch_status: "soon",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      ),
    },
    {
      key: "docuhelp",
      name: "DocuHelp",
      tagline: "Upload any doc; AI updates CRM fields",
      launch_status: "live",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
    },
  ];

  const handleModuleClick = (module) => {
    if (module.launch_status === "live") {
      navigate(`/products/${module.key}`);
    } else {
      navigate(`/waitlist/${module.key}`);
    }
  };

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
            All the tools your agency needs
          </h2>
          <p className="text-xl text-travel-gray max-w-3xl mx-auto">
            Purpose-built for travel agencies, our integrated suite works
            together to streamline operations and boost sales
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <Card
              key={module.key}
              className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg border-2 hover:border-travel-teal/30 reveal-animation ${
                index % 3 === 0
                  ? "delay-100"
                  : index % 3 === 1
                  ? "delay-200"
                  : "delay-300"
              }`}
              onClick={() => handleModuleClick(module)}
            >
              <div className="flex flex-col h-full">
                <div className="mb-4 p-3 bg-travel-lightblue rounded-lg w-12 h-12 flex items-center justify-center text-travel-blue">
                  {module.icon}
                </div>

                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    {module.name}
                  </h3>
                  {module.launch_status === "live" ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Live
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-amber-300 text-amber-600 hover:bg-amber-50"
                    >
                      Coming Soon
                    </Badge>
                  )}
                </div>

                <p className="text-travel-gray mb-4 flex-grow">
                  {module.tagline}
                </p>

                <div className="mt-auto">
                  {module.launch_status === "live" ? (
                    <div className="text-travel-blue font-medium flex items-center">
                      Learn more
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-1"
                      >
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </div>
                  ) : (
                    <div className="text-travel-teal font-medium flex items-center">
                      Join waitlist
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-1"
                      >
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
