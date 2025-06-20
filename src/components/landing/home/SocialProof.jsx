import { useEffect, useState } from "react";
import { Card } from "../../ui/card";

const SocialProof = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const testimonials = [
    {
      quote:
        "AthitiPRO has completely transformed how we manage our leads. The AI suggestions have increased our conversion rate by 23% in just two months.",
      author: "Sarah Johnson",
      position: "Operations Manager",
      company: "Wanderlust Travels",
    },
    {
      quote:
        "The DocuHelp feature saves us at least 10 hours every week. We used to manually enter data from booking confirmations, now AI does it instantly.",
      author: "Rajiv Mehta",
      position: "CEO",
      company: "Journey Beyond",
    },
    {
      quote:
        "Our clients love how quickly we can respond to their queries now. The Target module helps us send personalized offers that really resonate with them.",
      author: "Maria Rodriguez",
      position: "Customer Success",
      company: "Global Getaways",
    },
  ];

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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="py-20 px-6 md:px-12 lg:px-20 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 reveal-animation">
          <h2 className="text-3xl md:text-4xl font-bold text-travel-blue mb-4">
            Trusted by Travel Agencies
          </h2>
          <p className="text-xl text-travel-gray max-w-3xl mx-auto">
            See what our customers are saying about AthitiPRO
          </p>
        </div>

        <div className="relative reveal-animation">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="min-w-full px-4">
                  <Card className="border-0 shadow-lg p-8 md:p-12 max-w-4xl mx-auto">
                    <div className="flex flex-col items-center text-center">
                      <svg
                        className="w-10 h-10 text-travel-teal mb-6"
                        fill="currentColor"
                        viewBox="0 0 32 32"
                      >
                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                      </svg>
                      <p className="text-xl md:text-2xl font-medium text-gray-800 mb-6">
                        "{testimonial.quote}"
                      </p>
                      <div>
                        <p className="font-bold text-travel-blue">
                          {testimonial.author}
                        </p>
                        <p className="text-gray-600">
                          {testimonial.position}, {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`w-3 h-3 mx-2 rounded-full focus:outline-none ${
                  index === activeSlide ? "bg-travel-blue" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
