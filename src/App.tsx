
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Invoices from "./pages/Invoices";
import Clients from "./pages/Clients";
import Reminders from "./pages/Reminders";
import Analytics from "./pages/Analytics";
import Team from "./pages/Team";
import Branding from "./pages/Branding";
import Settings from "./pages/Settings";
import Domaines from "./pages/Domaines";
import Loi25 from "./pages/Loi25";
import Hebergement from "./pages/Hebergement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/invoices" element={
              <ProtectedRoute>
                <Invoices />
              </ProtectedRoute>
            } />
            <Route path="/clients" element={
              <ProtectedRoute>
                <Clients />
              </ProtectedRoute>
            } />
            <Route path="/reminders" element={
              <ProtectedRoute>
                <Reminders />
              </ProtectedRoute>
            } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } />
            <Route path="/team" element={
              <ProtectedRoute requireAdmin>
                <Team />
              </ProtectedRoute>
            } />
            <Route path="/branding" element={
              <ProtectedRoute requireAdmin>
                <Branding />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute requireAdmin>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/domaines" element={
              <ProtectedRoute>
                <Domaines />
              </ProtectedRoute>
            } />
            <Route path="/loi25" element={
              <ProtectedRoute>
                <Loi25 />
              </ProtectedRoute>
            } />
            <Route path="/hebergement" element={
              <ProtectedRoute>
                <Hebergement />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </ThemeProvider>
</QueryClientProvider>
);

export default App;
