import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminRegister from './pages/AdminRegister';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import GuestLayout from './components/GuestLayout';
import DefaultLayout from './components/DefaultLayout';
import MovieRegistration from './pages/MovieRegistration';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with Navbar (Home, Profile, etc.) */}
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/movie-registration" element={<MovieRegistration />} />
          {/* We can make Profile protected later if we want, but for now it's here */}
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Guest Routes (Login/Register) - Redirect to Home if logged in */}
        <Route element={<GuestLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/register" element={<AdminRegister />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

