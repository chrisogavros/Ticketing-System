import { Link, useNavigate } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';
import axiosClient from '../lib/axios';
import { useState } from 'react';

export default function Navbar() {
    const { user, token, setUser, setToken } = useStateContext();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // User fetching is handled by ContextProvider



    const onLogout = (ev) => {
        ev.preventDefault();
        axiosClient.post('/logout')
            .then(() => {
                setUser({});
                setToken(null);
                navigate('/');
            });
    };

    return (
        <header className="fixed w-full top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
            {/* Gradient Line at the bottom */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>

            <div className="container mx-auto px-6 py-4 flex justify-between items-center relative z-10">

                {/* Mobile Menu Toggle Button */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-gray-300 hover:text-white focus:outline-none focus:text-white p-2"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            {isMobileMenuOpen ? (
                                <path d="M6 18L18 6M6 6l12 12"></path>
                            ) : (
                                <path d="M4 6h16M4 12h16M4 18h16"></path>
                            )}
                        </svg>
                    </button>
                </div>

                {/* Logo */}
                <Link to="/" className="group flex items-center space-x-2 absolute left-1/2 md:relative md:left-auto transform -translate-x-1/2 md:translate-x-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                            <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white">
                        CINE<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">CGP</span>
                    </span>
                </Link>

                {/* Navigation Links */}
                <nav className="hidden md:flex space-x-1 items-center bg-white/5 px-2 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                    <Link to="/" className="px-5 py-2 rounded-full text-sm font-semibold text-white bg-white/10 border border-white/5 hover:bg-white/20 transition-all shadow-sm">
                        MOVIES
                    </Link>
                    {/* Add more links here if needed in future */}
                </nav>

                {/* Desktop Auth Buttons */}
                <div className="hidden md:flex items-center space-x-4">
                    {token ? (
                        <div className="flex items-center space-x-4 pl-4 border-l border-white/10">
                            <div className="text-right">
                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Welcome</p>
                                <div className="flex flex-col items-end">
                                    <Link to="/profile" className="text-sm font-bold text-white leading-none hover:text-purple-400 transition-colors">
                                        {user.name}
                                    </Link>
                                    {(user.is_admin === 1 || user.is_admin === true) && (
                                        <Link to="/admin" className="text-[10px] text-purple-400 hover:text-purple-300 mt-0.5">
                                            Admin Dashboard
                                        </Link>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={onLogout}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-white/5 rounded-full transition-all"
                                title="Logout"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Link to="/login" className="px-4 py-2 text-sm font-bold text-gray-300 hover:text-white transition-colors">
                                Log In
                            </Link>
                            <Link to="/register" className="group relative px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full overflow-hidden shadow-lg shadow-purple-500/20 transition-all hover:shadow-purple-500/40 hover:scale-105 active:scale-95">
                                <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center">
                                    Sign Up
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1 opacity-70 group-hover:translate-x-1 transition-transform">
                                        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-gray-900 border-t border-white/10 px-6 py-4 absolute w-full shadow-2xl z-50">
                    <div className="flex flex-col space-y-4">
                        <Link
                            to="/"
                            className="text-white font-semibold py-2 border-b border-white/5 hover:text-purple-400 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            MOVIES
                        </Link>

                        {token ? (
                            <>
                                <Link
                                    to="/profile"
                                    className="text-gray-300 font-medium py-2 hover:text-white transition-colors flex items-center justify-between"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    My Profile
                                    <span className="text-xs bg-white/10 px-2 py-1 rounded text-purple-300">{user.name}</span>
                                </Link>

                                {(user.is_admin === 1 || user.is_admin === true) && (
                                    <Link
                                        to="/admin"
                                        className="text-purple-400 font-medium py-2 hover:text-purple-300 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Admin Dashboard
                                    </Link>
                                )}

                                <button
                                    onClick={(e) => {
                                        setIsMobileMenuOpen(false);
                                        onLogout(e);
                                    }}
                                    className="text-red-400 font-medium py-2 hover:text-red-300 transition-colors text-left"
                                >
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-300 font-medium py-2 hover:text-white transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-6 py-3 mt-2 text-center text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
