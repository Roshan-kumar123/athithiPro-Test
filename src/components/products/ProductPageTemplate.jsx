import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Layout from "../layouts/Layout";

const ProductPageTemplate = ({
  module,
  problems,
  solutions,
  features,
  faqs,
}) => {
  const navigate = useNavigate();

  const isLive = module.launch_status === "live";

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

  // Function to render SVG from string
  const renderSVG = (svgString) => {
    return <div dangerouslySetInnerHTML={{ __html: svgString }} />;
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="gradient-bg px-6 md:px-12 lg:px-20 pt-12 pb-20 md:pt-20 md:pb-32">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="reveal-animation">
            <span className="bg-travel-lightblue text-travel-blue px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
              {isLive ? "Available Now" : "Coming Soon"}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-travel-blue mb-6">
              {module.name}
            </h1>
            <p className="text-xl text-travel-gray mb-6">{module.tagline}</p>
            <p className="text-travel-gray mb-8">{module.description}</p>
            {isLive ? (
              <Button
                onClick={() => navigate("/onboarding")}
                className="bg-travel-orange hover:bg-orange-600 text-white font-semibold px-8 py-6 text-lg"
              >
                Get Started Free
              </Button>
            ) : (
              <Button
                onClick={() => navigate(`/waitlist/${module.key}`)}
                className="bg-travel-teal hover:bg-teal-600 text-white font-semibold px-8 py-6 text-lg"
              >
                Join Waitlist
              </Button>
            )}
          </div>

          <div className="reveal-animation delay-200">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-travel-blue/10 p-2 border-b border-gray-100">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
              <div className="p-4 h-[280px] md:h-[400px] bg-gray-50 flex items-center justify-center">
                {module.heroImage ? (
                  <img
                    src={module.heroImage}
                    alt={`${module.name} demo`}
                    className="max-w-full max-h-full object-contain rounded-md shadow-sm"
                  />
                ) : (
                  <>
                    <div className="w-20 h-20 bg-travel-teal/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-travel-teal"
                      >
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                      </svg>
                    </div>
                    <p className="text-travel-gray">
                      {module.name} product demo
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem-Solution Section */}
      <section className="py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            <div className="reveal-animation">
              <h2 className="text-2xl md:text-3xl font-bold text-travel-blue mb-8">
                The Challenges
              </h2>

              <div className="space-y-6">
                {problems.map((problem, index) => (
                  <div key={index} className="flex">
                    <div className="mr-4 pt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-red-500"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-2">
                        {problem.title}
                      </h3>
                      <p className="text-travel-gray">{problem.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal-animation delay-200">
              <h2 className="text-2xl md:text-3xl font-bold text-travel-blue mb-8">
                Our Solution
              </h2>

              <div className="space-y-6">
                {solutions.map((solution, index) => (
                  <div key={index} className="flex">
                    <div className="mr-4 pt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-2">
                        {solution.title}
                      </h3>
                      <p className="text-travel-gray">{solution.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-20 px-6 md:px-12 lg:px-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal-animation">
            <h2 className="text-3xl md:text-4xl font-bold text-travel-blue mb-4">
              Key Features
            </h2>
            <p className="text-xl text-travel-gray max-w-3xl mx-auto">
              Everything you need to optimize your {module.name.toLowerCase()}{" "}
              workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white p-8 rounded-lg shadow-sm border border-gray-100 reveal-animation delay-${
                  (index % 4) * 100
                }`}
              >
                <div className="mb-4 p-3 bg-travel-lightblue rounded-lg w-12 h-12 flex items-center justify-center text-travel-blue">
                  {renderSVG(feature.icon)}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-travel-gray">{feature.description}</p>
              </div>
            ))}

            {!isLive && (
              // ... keep existing code (placeholder feature cards for coming soon products)
              <>
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 reveal-animation delay-400 opacity-70">
                  <div className="mb-4 p-3 bg-gray-100 rounded-lg w-12 h-12 flex items-center justify-center text-gray-400">
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
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="12" y1="8" x2="12" y2="16"></line>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Coming Soon</h3>
                  <p className="text-travel-gray">
                    More features in development for enhanced functionality.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 reveal-animation delay-500 opacity-70">
                  <div className="mb-4 p-3 bg-gray-100 rounded-lg w-12 h-12 flex items-center justify-center text-gray-400">
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
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="12" y1="8" x2="12" y2="16"></line>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">In Development</h3>
                  <p className="text-travel-gray">
                    Advanced features planned for future releases.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Demo or Waitlist */}
      <section className="py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto text-center reveal-animation">
          {isLive ? (
            <>
              <h2 className="text-3xl md:text-4xl font-bold text-travel-blue mb-6">
                See {module.name} in Action
              </h2>
              <p className="text-xl text-travel-gray mb-8 max-w-3xl mx-auto">
                Schedule a personalized demo to see how {module.name} can
                transform your agency operations.
              </p>
              <Button
                onClick={() => navigate("/demo")}
                className="bg-travel-blue hover:bg-travel-blue/90 text-white px-8 py-6 text-lg"
              >
                Book a Demo
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-3xl md:text-4xl font-bold text-travel-blue mb-6">
                Join the {module.name} Waitlist
              </h2>
              <p className="text-xl text-travel-gray mb-8 max-w-3xl mx-auto">
                Be the first to know when {module.name} launches. Get early
                access and exclusive benefits.
              </p>

              <div className="max-w-md mx-auto">
                <form className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-grow"
                  />
                  <Button
                    type="submit"
                    className="bg-travel-teal hover:bg-teal-600 text-white"
                  >
                    Join Waitlist
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Integrations Bar */}
      <section className="py-16 px-6 md:px-12 lg:px-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 reveal-animation">
            <h2 className="text-2xl font-bold text-travel-blue mb-4">
              Seamless Integrations
            </h2>
            <p className="text-travel-gray max-w-2xl mx-auto">
              Connect with the tools you already use
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-12 reveal-animation">
            <div className="text-center opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 mx-auto mb-2">
                <svg viewBox="0 0 24 24" width="64" height="64">
                  <path
                    fill="#EA4335"
                    d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600">Gmail</p>
            </div>

            <div className="text-center opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 mx-auto mb-2">
                <svg viewBox="0 0 24 24" width="64" height="64">
                  <path
                    fill="#25D366"
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600">WhatsApp</p>
            </div>

            <div className="text-center opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 mx-auto mb-2">
                <svg viewBox="0 0 24 24" width="64" height="64">
                  <path
                    fill="#1877F2"
                    d="M24 12.073c0-5.8-4.2-10.527-9.404-10.527H9.404C4.2 1.546 0 6.273 0 12.073c0 5.8 4.2 10.528 9.404 10.528h5.192C19.8 22.6 24 17.874 24 12.073z"
                  />
                  <path
                    fill="#FFF"
                    d="M16.722 14.109l.472-2.992h-2.95V9.02c0-.797.405-1.594 1.622-1.594h1.28V4.833s-1.165-.193-2.268-.193c-2.311 0-3.826 1.367-3.826 3.84v2.637H8.325v2.992h2.727v7.245c1.106-.135 2.142-.472 3.106-.958v-6.287h2.564z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600">Facebook</p>
            </div>

            <div className="text-center opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                <svg width="64" height="24" viewBox="0 0 100 33">
                  <path
                    fill="#0B3560"
                    d="M94.751 32.372h-24.56c-2.905 0-5.633-1.26-7.593-3.35-1.652-1.757-2.665-4.099-2.665-6.605 0-5.356 4.351-9.955 9.997-9.955h24.82c2.929 0 5.306 2.37 5.306 5.285 0 2.916-2.377 5.286-5.306 5.286H71.874a1.763 1.763 0 0 1-1.768-1.762c0-.971.795-1.762 1.768-1.762h23.138v-3.524h-24.82c-3.385 0-6.46 2.916-6.46 6.431 0 3.525 3.075 6.431 6.7 6.431h24.32c4.574 0 8.382-3.524 8.382-8.05s-3.808-8.05-8.382-8.05H66.57c-5.974 0-10.77 4.964-10.77 10.957 0 2.916 1.073 5.595 3.075 7.595 2.408 2.444 5.744 3.759 9.311 3.759h26.565v-2.684zM39.079 28.358c-6.485 0-11.766-5.262-11.766-11.726 0-6.463 5.281-11.725 11.766-11.725s11.766 5.262 11.766 11.725c.007 6.464-5.274 11.726-11.766 11.726m0-20.03c-4.59 0-8.333 3.728-8.333 8.304 0 4.577 3.742 8.304 8.333 8.304s8.333-3.727 8.333-8.304c.007-4.576-3.735-8.304-8.333-8.304M6.413 32.372H3.46c-1.913 0-3.46-1.54-3.46-3.444V3.444C0 1.54 1.547 0 3.46 0h3.904c7.202 0 13.056 5.832 13.056 13.002 0 7.17-5.854 13.003-13.056 13.003H6.413v6.367zm0-9.788h.95c5.362 0 9.623-4.2 9.623-9.582 0-5.382-4.261-9.581-9.622-9.581H3.433v19.163h2.98z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600">Amadeus</p>
            </div>

            <div className="text-center opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                <svg width="64" height="24" viewBox="0 0 512 110">
                  <path
                    fill="#1D80B7"
                    d="M164.258 41.668c20.029 0 36.291 16.25 36.291 36.26 0 20.026-16.262 36.274-36.291 36.274-19.996 0-36.258-16.248-36.258-36.275 0-20.01 16.262-36.259 36.258-36.259zm0 56.945c11.457 0 20.732-9.272 20.732-20.701 0-11.418-9.275-20.676-20.732-20.676-11.427 0-20.7 9.26-20.7 20.676 0 11.43 9.273 20.7 20.7 20.7zm-113.191-27.759l37.539-34.765h-45.16v-14.76h74.175v15.332l-37.505 34.75h38.94v14.756h-68V70.854zm227.1-34.765h14.395v64.838h-14.395V36.089zm213.649 0h14.395v64.838H491.81V36.089h.006zM292.31 92.85c-6.237 5.854-14.778 10.713-26.96 10.713-20.73 0-35.173-16.375-35.173-36.313 0-19.882 14.41-36.225 34.905-36.225 11.75 0 21.388 5.55 27.666 11.862l-9.09 11.376c-4.726-4.736-10.363-8.814-18.095-8.814-13.31 0-21.305 10.567-21.305 21.8 0 11.278 7.983 21.891 21.28 21.891 7.863 0 14.122-4.077 18.873-8.863l7.898 12.572h.001zm153.41-28.132h32.485v-14.26h-32.485v-14.37h35.264V21.833h-49.659v79.095h50.72V86.67h-36.325v-21.95zM400.743 43.97l-18.438 30.287-18.572-30.286h-15.777v56.958h14.364V58.285l15.77 26.142h8.435l15.758-26.142v42.644h14.358V43.971h-15.898zm-281.938-7.902h-14.395v64.838h44.058v-14.75h-29.663V36.068z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600">Sabre</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 reveal-animation">
            <h2 className="text-3xl md:text-4xl font-bold text-travel-blue mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-travel-gray">
              Everything you need to know about {module.name}
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="reveal-animation">
                <h3 className="text-xl font-bold text-travel-blue mb-3">
                  {faq.question}
                </h3>
                <p className="text-travel-gray">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-6 md:px-12 lg:px-20 bg-travel-blue text-white">
        <div className="max-w-4xl mx-auto text-center reveal-animation">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to transform your agency?
          </h2>
          <p className="text-xl text-travel-lightblue mb-8">
            Join hundreds of travel agencies already using AthitiPRO.
          </p>
          <Button
            onClick={() => navigate("/onboarding")}
            className="bg-travel-orange hover:bg-orange-600 text-white px-8 py-6 text-lg"
          >
            Get Started Free
          </Button>
        </div>
      </section>
    </Layout>
  );
};

// Missing components that would be needed when used
const Input = ({ type = "text", placeholder = "", className = "" }) => (
  <input
    type={type}
    placeholder={placeholder}
    className={`border border-gray-300 rounded-lg px-4 py-2 w-full ${className}`}
  />
);

export default ProductPageTemplate;
