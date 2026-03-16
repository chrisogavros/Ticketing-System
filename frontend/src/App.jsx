import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminRegister from './pages/AdminRegister';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import AdminCalendar from './pages/AdminCalendar';
import AdminSpaces from './pages/AdminSpaces';
import AdminScanner from './pages/AdminScanner';
import AdminUsers from './pages/AdminUsers';
import OAuthCallback from './pages/OAuthCallback';
import GuestLayout from './components/GuestLayout';
import DefaultLayout from './components/DefaultLayout';
import MovieRegistration from './pages/MovieRegistration';
import VisitorEntry from './pages/VisitorEntry';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with Navbar */}
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/movie-registration" element={<VisitorEntry />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/calendar" element={<AdminCalendar />} />
          <Route path="/admin/spaces" element={<AdminSpaces />} />
          <Route path="/admin/scanner" element={<AdminScanner />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>

        {/* Guest Routes (Login/Register) */}
        <Route element={<GuestLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/register" element={<AdminRegister />} />
        </Route>

        {/* Standalone Route for Visitor Entry form (Mobile Friendly) */}
        <Route path="/entry/register" element={<VisitorEntry />} />

        {/* OAuth Callback — outside layouts, standalone */}
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
