import LevelUpPage from "./pages/LevelUpPage";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navigation from "./components/Navigation";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import CertificateUpload from "./components/CertificateUpload";
import Achievements from "./pages/Achievements";
import Certificates from "./pages/Certificates";
import Portfolio from "./pages/Portfolio";
import Profile from "./pages/Profile";
import MatchPage from "./pages/MatchPage";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background w-full">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/" element={
                <ProtectedRoute requiredRole="student">
                  <Navigation />
                  <main className="md:ml-64 p-6">
                    <StudentDashboard />
                  </main>
                </ProtectedRoute>
              } />
              <Route path="/achievements" element={
                <ProtectedRoute requiredRole="student">
                  <Navigation />
                  <main className="md:ml-64 p-6">
                    <Achievements />
                  </main>
                </ProtectedRoute>
              } />
              <Route path="/certificates" element={
                <ProtectedRoute requiredRole="student">
                  <Navigation />
                  <main className="md:ml-64 p-6">
                    <Certificates />
                  </main>
                </ProtectedRoute>
              } />
              <Route path="/portfolio" element={
                <ProtectedRoute requiredRole="student">
                  <Navigation />
                  <main className="md:ml-64 p-6">
                    <Portfolio />
                  </main>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute requiredRole="student">
                  <Navigation />
                  <main className="md:ml-64 p-6">
                    <Profile />
                  </main>
                </ProtectedRoute>
              } />
              <Route path="/match" element={
                <ProtectedRoute requiredRole="student">
                  <Navigation />
                  <main className="md:ml-64 p-6">
                    <MatchPage />
                  </main>
                </ProtectedRoute>
              } />
              <Route path="/levelup" element={
                <ProtectedRoute requiredRole="student">
                  <Navigation />
                  <main className="md:ml-64 p-6">
                    <LevelUpPage />
                  </main>
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
