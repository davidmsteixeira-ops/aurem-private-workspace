import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateOffice from "./pages/PrivateOffice";
import BrandVault from "./pages/BrandVault";
import BrandIntelligence from "./pages/BrandIntelligence";
import Decisions from "./pages/Decisions";
import Assets from "./pages/Assets";
import Settings from "./pages/Settings";
import ProfileSettings from "./pages/settings/ProfileSettings";
import NotificationsSettings from "./pages/settings/NotificationsSettings";
import SecuritySettings from "./pages/settings/SecuritySettings";
import DocumentsSettings from "./pages/settings/DocumentsSettings";
import SupportSettings from "./pages/settings/SupportSettings";
import Portfolio from "./pages/admin/Portfolio";
import IntelligencePulse from "./pages/admin/IntelligencePulse";
import StrategicPipeline from "./pages/admin/StrategicPipeline";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/AuthProvider";
import Login from "./pages/Login";

const queryClient = new QueryClient();



const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PrivateOffice />} />
          <Route path="/login" element={<Login />} />
          <Route path="/brand-vault" element={<BrandVault />} />
          <Route path="/brand-intelligence" element={<BrandIntelligence />} />
          <Route path="/decisions" element={<ProtectedRoute><Decisions /></ProtectedRoute>} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/profile" element={<ProfileSettings />} />
          <Route path="/settings/notifications" element={<NotificationsSettings />} />
          <Route path="/settings/security" element={<SecuritySettings />} />
          <Route path="/settings/documents" element={<DocumentsSettings />} />
          <Route path="/settings/support" element={<SupportSettings />} />
          {/* Admin Routes */}
          <Route path="/admin/portfolio" element={<Portfolio />} />
          <Route path="/admin/intelligence" element={<IntelligencePulse />} />
          <Route path="/admin/pipeline" element={<StrategicPipeline />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
