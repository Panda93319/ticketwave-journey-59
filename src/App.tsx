
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import About from "./pages/About";
import Merchandise from "./pages/Merchandise";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";
import PassCard from "./pages/PassCard";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import AdminDashboard from "./pages/admin/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/merchandise" element={<Merchandise />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/register" 
            element={
              <ProtectedRoute requireAuth={true} requireAdmin={true}>
                <AdminRegister />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute requireAuth={true} requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requireAuth={true} requireVerified={true}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Requires authentication, email verification, and ticket */}
          <Route 
            path="/pass" 
            element={
              <ProtectedRoute requireAuth={true} requireVerified={true} requireTicket={true}>
                <PassCard />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
