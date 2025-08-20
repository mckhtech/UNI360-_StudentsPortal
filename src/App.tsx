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
import Profile from "./pages/Profile";
import ProfileBuilder from "./pages/ProfileBuilder";
import Settings from "./pages/Settings"; // Fixed: Import the actual Settings component
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="applications" element={<Applications />} />
            <Route path="universities" element={<Universities />} />
            <Route path="visa" element={<Visa />} />
            <Route path="finances" element={<Finances />} />
            <Route path="documents" element={<Documents />} />
            <Route path="resources" element={<Resources />} />
            <Route path="ai-tools" element={<AITools />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profilebuilder" element={<ProfileBuilder />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;