
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 py-12 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-xl font-heading font-bold text-travel-blue flex items-center mb-4">
              <span className="text-travel-teal">Athiti</span>PRO
            </Link>
            <p className="text-gray-600 text-sm">
              Six AI-powered tools, one simple workspace for travel agencies.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://linkedin.com" target="_blank" rel="noopener" className="text-travel-gray hover:text-travel-blue transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M18.335 18.339H15.67v-4.177c0-.996-.02-2.278-1.39-2.278-1.389 0-1.601 1.084-1.601 2.205v4.25h-2.666V9.75h2.56v1.17h.035c.358-.674 1.228-1.387 2.528-1.387 2.7 0 3.2 1.778 3.2 4.091v4.715zM7.003 8.575a1.546 1.546 0 01-1.548-1.549 1.548 1.548 0 111.547 1.549zm1.336 9.764H5.666V9.75H8.34v8.589zM19.67 3H4.329C3.593 3 3 3.58 3 4.297v15.406C3 20.42 3.594 21 4.328 21h15.338C20.4 21 21 20.42 21 19.703V4.297C21 3.58 20.4 3 19.666 3h.003z"></path>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener" className="text-travel-gray hover:text-travel-blue transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Products</h3>
            <ul className="space-y-3">
              <li><Link to="/products/leads" className="text-gray-600 hover:text-travel-blue transition-colors">Leads</Link></li>
              <li><Link to="/products/create" className="text-gray-600 hover:text-travel-blue transition-colors">Create</Link></li>
              <li><Link to="/products/target" className="text-gray-600 hover:text-travel-blue transition-colors">Target</Link></li>
              <li><Link to="/products/plan" className="text-gray-600 hover:text-travel-blue transition-colors">Plan</Link></li>
              <li><Link to="/products/assist" className="text-gray-600 hover:text-travel-blue transition-colors">Assist</Link></li>
              <li><Link to="/products/docuhelp" className="text-gray-600 hover:text-travel-blue transition-colors">DocuHelp</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/pricing" className="text-gray-600 hover:text-travel-blue transition-colors">Pricing</Link></li>
              <li><Link to="/resources" className="text-gray-600 hover:text-travel-blue transition-colors">Resources</Link></li>
              <li><a href="#" className="text-gray-600 hover:text-travel-blue transition-colors">About</a></li>
              <li><a href="#" className="text-gray-600 hover:text-travel-blue transition-colors">Careers</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-gray-600 hover:text-travel-blue transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-travel-blue transition-colors">Terms</Link></li>
              <li><Link to="/cookies" className="text-gray-600 hover:text-travel-blue transition-colors">Cookies</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 text-sm text-gray-500">
          <p>&copy; {currentYear} AthitiPRO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
