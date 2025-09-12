import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import FacultyDashboard from './pages/FacultyDashboard';
import PendingReviews from './pages/PendingReviews';
import ReviewHistory from './pages/ReviewHistory';
import Profile from './pages/Profile';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

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
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/" element={
                <ProtectedRoute requiredRole="faculty">
                  <Navigation />
                  <main className="ml-0 p-6 md:ml-64 md:pt-6">
                    <FacultyDashboard />
                  </main>
                </ProtectedRoute>
              } />
              <Route path="/faculty" element={
                <ProtectedRoute requiredRole="faculty">
                  <Navigation />
                  <main className="ml-0 p-6 md:ml-64 md:pt-6">
                    <FacultyDashboard />
                  </main>
                </ProtectedRoute>
              } />
              <Route path="/faculty/reviews" element={
                <ProtectedRoute requiredRole="faculty">
                  <Navigation />
                  <main className="ml-0 p-6 md:ml-64 md:pt-6">
                    <PendingReviews />
                  </main>
                </ProtectedRoute>
              } />
              <Route path="/faculty/history" element={
                <ProtectedRoute requiredRole="faculty">
                  <Navigation />
                  <main className="ml-0 p-6 md:ml-64 md:pt-6">
                    <ReviewHistory />
                  </main>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute requiredRole="faculty">
                  <Navigation />
                  <main className="ml-0 p-6 md:ml-64 md:pt-6">
                    <Profile />
                  </main>
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
