import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function DefaultLayout() {
    const { token } = useStateContext();

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans transition-colors duration-300 flex flex-col">
            <Navbar />
            <main className="pt-24 flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
