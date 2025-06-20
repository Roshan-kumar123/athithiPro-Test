import { useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Link } from "react-router-dom";
import { Menu, ChevronDown, X } from "lucide-react";

const MainNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="py-4 px-6 md:px-12 lg:px-20 w-full flex items-center justify-between bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="flex items-center">
        <Link
          to="/"
          className="text-2xl font-heading font-bold text-travel-blue flex items-center"
        >
          <span className="text-travel-teal">Athiti</span>PRO
        </Link>
      </div>

      {/* Mobile menu button */}
      <button
        className="md:hidden"
        onClick={toggleMenu}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop menu */}
      <div className="hidden md:flex items-center space-x-8">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center focus:outline-none text-gray-600 hover:text-travel-blue transition-colors">
            Products <ChevronDown size={16} className="ml-1" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56 p-2">
            <DropdownMenuItem className="cursor-pointer">
              <Link to="/products/leads" className="w-full">
                Leads
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link to="/products/create" className="w-full">
                Create
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link to="/products/target" className="w-full">
                Target
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link to="/products/plan" className="w-full">
                Plan
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link to="/products/assist" className="w-full">
                Assist
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link to="/products/docuhelp" className="w-full">
                DocuHelp
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link
          to="/pricing"
          className="text-gray-600 hover:text-travel-blue transition-colors"
        >
          Pricing
        </Link>
        <Link
          to="/resources"
          className="text-gray-600 hover:text-travel-blue transition-colors"
        >
          Resources
        </Link>
        <Link
          to="/login"
          className="text-gray-600 hover:text-travel-blue transition-colors"
        >
          Login
        </Link>

        <Button
          onClick={() => (window.location.href = "/onboarding")}
          className="bg-travel-orange hover:bg-orange-600 text-white"
        >
          Get Started
        </Button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-white border-b shadow-lg p-4 z-40 h-screen">
          <div className="flex flex-col space-y-4">
            <div className="py-2 font-medium">Products</div>
            <Link
              to="/products/leads"
              className="pl-4 py-2 text-gray-600 hover:text-travel-blue"
            >
              Leads
            </Link>
            <Link
              to="/products/create"
              className="pl-4 py-2 text-gray-600 hover:text-travel-blue"
            >
              Create
            </Link>
            <Link
              to="/products/target"
              className="pl-4 py-2 text-gray-600 hover:text-travel-blue"
            >
              Target
            </Link>
            <Link
              to="/products/plan"
              className="pl-4 py-2 text-gray-600 hover:text-travel-blue"
            >
              Plan
            </Link>
            <Link
              to="/products/assist"
              className="pl-4 py-2 text-gray-600 hover:text-travel-blue"
            >
              Assist
            </Link>
            <Link
              to="/products/docuhelp"
              className="pl-4 py-2 text-gray-600 hover:text-travel-blue"
            >
              DocuHelp
            </Link>

            <div className="border-t my-2"></div>

            <Link
              to="/pricing"
              className="py-2 text-gray-600 hover:text-travel-blue"
            >
              Pricing
            </Link>
            <Link
              to="/resources"
              className="py-2 text-gray-600 hover:text-travel-blue"
            >
              Resources
            </Link>
            <Link
              to="/login"
              className="py-2 text-gray-600 hover:text-travel-blue"
            >
              Login
            </Link>

            <Button
              onClick={() => (window.location.href = "/onboarding")}
              className="mt-4 bg-travel-orange hover:bg-orange-600 text-white w-full"
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default MainNavigation;
