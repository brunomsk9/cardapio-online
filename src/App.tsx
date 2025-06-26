
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Kitchen from "./pages/Kitchen";
import Admin from "./pages/Admin";
import SuperAdmin from "./pages/SuperAdmin";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import SubdomainAccessGuard from "./components/SubdomainAccessGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SubdomainAccessGuard>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Rota protegida para Kitchen */}
            <Route element={<ProtectedRoute allowedRoles={["kitchen", "admin", "super_admin"]} />}>
              <Route path="/kitchen" element={<Kitchen />} />
            </Route>

            {/* Rota protegida para Admin */}
            <Route element={<ProtectedRoute allowedRoles={["admin", "super_admin"]} />}>
              <Route path="/admin" element={<Admin />} />
            </Route>

            {/* Rota protegida para Super Admin */}
            <Route element={<ProtectedRoute allowedRoles={["super_admin"]} />}>
              <Route path="/super-admin" element={<SuperAdmin />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SubdomainAccessGuard>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
