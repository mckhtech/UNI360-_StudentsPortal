import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import Universities from "./pages/Universities";
import Visa from "./pages/Visa";
import Finances from "./pages/Finances";
import Documents from "./pages/Documents";
import Resources from "./pages/Resources";
import AITools from "./pages/AITools";
import AskAI from "./pages/AskAI";
import Profile from "./pages/Profile";
import ProfileBuilder from "./pages/ProfileBuilder";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const currentPathname = window.location.pathname;
    console.log(currentPathname);

    if (currentPathname === "/") {
      window.location.replace("/dashboard");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public login route */}
              <Route path="/login" element={<Login />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />

              {/* Protected routes - ensure ProtectedRoute wraps AppLayout, not individual routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<AppLayout />}>
                  <Route element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="applications" element={<Applications />} />
                  <Route path="universities" element={<Universities />} />
                  <Route path="visa" element={<Visa />} />
                  <Route path="finances" element={<Finances />} />
                  <Route path="documents" element={<Documents />} />
                  <Route path="resources" element={<Resources />} />
                  <Route path="ai-tools" element={<AITools />} />
                  <Route path="ask-ai" element={<AskAI />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="profilebuilder" element={<ProfileBuilder />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Route>

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
