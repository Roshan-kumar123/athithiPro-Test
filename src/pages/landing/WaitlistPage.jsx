import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";
import Layout from "../../components/layouts/Layout";

const WaitlistPage = () => {
  const { productKey } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Map product keys to readable names
  const productNames = {
    create: "Create",
    plan: "Plan",
    assist: "Assist",
  };

  const productName = productNames[productKey || ""] || "this product";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }

    // In a real app, this would submit to an API
    console.log("Waitlist submission:", { email, name, productKey });
    setSubmitted(true);
    toast.success("You've been added to the waitlist!");
  };

  return (
    <Layout>
      <div className="min-h-[70vh] px-6 md:px-12 lg:px-20 py-20 gradient-bg">
        <div className="max-w-3xl mx-auto text-center">
          {!submitted ? (
            <>
              <h1 className="text-4xl md:text-5xl font-bold text-travel-blue mb-6">
                Join the {productName} Waitlist
              </h1>
              <p className="text-xl text-travel-gray mb-12">
                Be the first to know when we launch {productName}. Get early
                access and exclusive benefits.
              </p>

              <div className="bg-white p-8 rounded-lg shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2 text-left">
                    <label htmlFor="name" className="block text-sm font-medium">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2 text-left">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium"
                    >
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-travel-teal hover:bg-teal-600 text-white"
                  >
                    Join Waitlist
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="bg-white p-12 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
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
                  className="text-green-600"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-travel-blue mb-4">
                You're on the list!
              </h2>

              <p className="text-xl text-travel-gray mb-8">
                Thanks for your interest in {productName}. We'll notify you as
                soon as it's available.
              </p>

              <div className="space-y-4">
                <Button
                  onClick={() => navigate("/")}
                  className="bg-travel-blue hover:bg-travel-blue/90 text-white"
                >
                  Return to Homepage
                </Button>

                <p className="text-sm text-gray-500 mt-4">
                  Want to explore what we already offer?
                </p>

                <Button
                  variant="outline"
                  onClick={() => navigate("/products/leads")}
                  className="border-travel-blue text-travel-blue hover:bg-travel-blue/10"
                >
                  Check out our Leads product
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default WaitlistPage;
