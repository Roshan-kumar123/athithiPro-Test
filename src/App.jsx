import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";

// Public Pages (Landing Site)
import Index from "./pages/landing/Index";
import LoginPage from "./pages/landing/LoginPage";
import ProductPage from "./pages/landing/ProductPage";
import WaitlistPage from "./pages/landing/WaitlistPage";
import PricingPage from "./pages/landing/PricingPage";
import NotFound from "./pages/landing/NotFound";

// CRM Pages
import CrmDashboard from "./pages/crm/CrmDashboard";
import LeadsPage from "./pages/crm/leads/LeadsPage";
import CommunicationPage from "./pages/crm/communication/CommunicationPage";
import TasksPage from "./pages/crm/tasks/TasksPage";
import BookingsPage from "./pages/crm/bookings/BookingsPage";
import InsightsPage from "./pages/crm/insights/InsightsPage";
import SegmentsPage from "./pages/crm/segments/SegmentsPage";
import LeadDetailPage from "./pages/crm/leads/LeadDetailPage";
import LeadFormPage from "./pages/crm/leads/LeadFormPage";
import TaskFormPage from "./pages/crm/tasks/TaskFormPage";
import MessageComposePage from "./pages/crm/communication/MessageComposePage";
import BookingFormPage from "./pages/crm/bookings/BookingFormPage";

// Components
import ProtectedRoute from "./components/auth/ProtectedRoute";
import CrmLayout from "./components/crm/Layout";
import ScrollToTop from "./components/landing/ScrollToTop";

// Onboarding
import OnboardingWizard from "./components/onboarding/OnboardingWizard";
import OnboardingComplete from "./components/onboarding/OnboardingComplete";
import PriorityScore from "./pages/crm/priority-score/PriorityScore";
import SubAdminPage from "./pages/crm/subAdmin/subAdminPage";
import CreateSubAdmin from "./pages/crm/subAdmin/createSubAdmin";
import CommunicationChannel from "./components/crm/BotManagement/CommunicationChannel";
import WhatsappSettings from "./components/crm/WhatsappSettings/WhatsappSettings";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/products/:productKey" element={<ProductPage />} />
            <Route path="/waitlist/:productKey" element={<WaitlistPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/onboarding" element={<OnboardingWizard />} />
            <Route
              path="/onboarding/complete"
              element={<OnboardingComplete />}
            />

            {/* Protected CRM Routes */}
            <Route
              path="/crm"
              element={
                <ProtectedRoute>
                  <CrmLayout>
                    <CrmDashboard />
                  </CrmLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm/dashboard"
              element={
                <ProtectedRoute>
                  <CrmLayout>
                    <CrmDashboard />
                  </CrmLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm/leads"
              element={
                <ProtectedRoute>
                  <CrmLayout>
                    <LeadsPage />
                  </CrmLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm/leads/:id"
              element={
                <ProtectedRoute>
                  <CrmLayout>
                    <LeadDetailPage />
                  </CrmLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm/leads/new"
              element={
                <ProtectedRoute>
                  <CrmLayout>
                    <LeadFormPage />
                  </CrmLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm/leads/:id/edit"
              element={
                <ProtectedRoute>
                  <CrmLayout>
                    <LeadFormPage />
                  </CrmLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/crm/role"
              element={
                <ProtectedRoute>
                  <CrmLayout>
                    <SubAdminPage />
                  </CrmLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm/role/new"
              element={
                <ProtectedRoute>
                  <CrmLayout>
                    <CreateSubAdmin />
                  </CrmLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm/role/:id/edit"
              element={
                <ProtectedRoute>
                  <CrmLayout>
                    <CreateSubAdmin />
                  </CrmLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm/communication"
              element={
                <ProtectedRoute>
                  <CrmLayout>
                    <CommunicationPage />
                  </CrmLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm/communication/new"
              element={
                <ProtectedRoute>
                  <CrmLayout>
                    <MessageComposePage />
                  </CrmLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm/communication/new/:leadId"
              element={
                <ProtectedRoute>
                  <CrmLayout>
                    <MessageComposePage />
                  </CrmLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm/tasks"
              element={
                <ProtectedRoute>
                  <CrmLayout>
                    <TasksPage />
                  </CrmLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm/tasks/new"
              element={
                <ProtectedRoute>
                  <CrmLayout>
                    <TaskFormPage />
                  </CrmLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm/tasks/new/:leadId"
              element={
                <ProtectedRoute>
                  <CrmLayout>
                    <TaskFormPage />
                  </CrmLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm/bookings"
              element={
                <ProtectedRoute>
                  <CrmLayout>
                    <BookingsPage />
                  </CrmLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/crm/communication-channel"
              element={
                <ProtectedRoute>
                  <CrmLayout>
                    <CommunicationChannel />
                  </CrmLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm/bookings/new"
              element={
                <ProtectedRoute>
                  <CrmLayout>
                    <BookingFormPage />
                  </CrmLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm/bookings/new/:leadId"
              element={
                <ProtectedRoute>
                  <CrmLayout>
                    <BookingFormPage />
                  </CrmLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm/insights"
              element={
                <ProtectedRoute>
                  <CrmLayout>
                    <InsightsPage />
                  </CrmLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm/segments"
              element={
                <ProtectedRoute>
                  <CrmLayout>
                    <SegmentsPage />
                  </CrmLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm/priority-score"
              element={
                <ProtectedRoute>
                  <CrmLayout>
                    <PriorityScore />
                  </CrmLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/crm/whatsapp-settings"
              element={
                <ProtectedRoute>
                  <CrmLayout>
                    <WhatsappSettings />
                  </CrmLayout>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
