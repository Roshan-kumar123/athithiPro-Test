import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { toast } from "sonner";
import Layout from "../../components/layouts/Layout";
import { loginUser } from "../../store/slices/auth/authThunk";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      console.log("Dispatching login action");
      const resultAction = await dispatch(loginUser({ email, password }));
      
      if (loginUser.fulfilled.match(resultAction)) {
        // Store token in localStorage
        const token = resultAction.payload.token;
        localStorage.setItem('authToken', token);
        
        toast.success("Login successful!");
        navigate("/crm", { replace: true });
      } else if (loginUser.rejected.match(resultAction)) {
        const errorMsg = resultAction.payload || "Login failed";
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <Link
                to="/"
                className="text-2xl font-heading font-bold text-travel-blue flex items-center"
              >
                <span className="text-travel-teal">Athiti</span>PRO
              </Link>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h1>
            <p className="text-gray-500 mb-8">
              Sign in to access your CRM dashboard
            </p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-sm font-medium text-travel-blue hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full"
                  required
                  disabled={loading}
                />
              </div>

              <div className="flex items-center">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                    disabled={loading}
                  />
                  <label htmlFor="remember" className="text-sm text-gray-500">
                    Remember me
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-travel-blue hover:bg-travel-blue/90 text-white py-6"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/onboarding"
                className="font-medium text-travel-blue hover:underline"
              >
                Get started
              </Link>
            </p>
          </div>
        </div>

        {/* Right side - Image/Graphic */}
        <div className="hidden md:block md:w-1/2 bg-travel-blue">
          <div className="h-full flex items-center justify-center p-12">
            <div className="max-w-md text-white text-center">
              <h2 className="text-3xl font-bold mb-4">
                Run Your Travel Agency on Autopilot
              </h2>
              <p className="text-travel-lightblue mb-8">
                Six AI-powered tools, one simple workspace for travel agencies.
              </p>
              <div className="flex justify-center">
                <div className="bg-white/10 w-32 h-32 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="8 12 12 16 16 12"></polyline>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
