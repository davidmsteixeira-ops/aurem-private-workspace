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
          {/* <Route path="/decisions" element={<Decisions />} /> */}
          <Route path="/decisions" element={<ProtectedRoute><Decisions /></ProtectedRoute>} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
