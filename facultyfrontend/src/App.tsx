import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import Navigation from './components/Navigation';
import FacultyDashboard from './pages/FacultyDashboard';
import PendingReviews from './pages/PendingReviews';
import ReviewHistory from './pages/ReviewHistory';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

const App = () => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <Router>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="ml-0 p-6 md:ml-64 md:pt-6">
          <Routes>
            <Route path="/" element={<FacultyDashboard />} />
            <Route path="/faculty" element={<FacultyDashboard />} />
            <Route path="/faculty/reviews" element={<PendingReviews />} />
            <Route path="/faculty/history" element={<ReviewHistory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  </ThemeProvider>
);

export default App;
