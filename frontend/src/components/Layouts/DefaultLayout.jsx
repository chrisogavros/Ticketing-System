import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import Navbar from "../Navbar"; // Assuming Navbar is one level up in components

export default function DefaultLayout() {
  const { token } = useStateContext();

  // If you want to force login for the entire app (except guest routes), uncomment this:
  // if (!token) {
  //   return <Navigate to="/login" />;
  // }
  
  // For now, we allow public access to Home, so we just wrap the content with Navbar
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans transition-colors duration-300">
      <Navbar />
      <main className="pt-24">
        <Outlet />
      </main>
    </div>
  );
}
