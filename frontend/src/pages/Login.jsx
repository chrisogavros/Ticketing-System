import { useRef, useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import axiosClient from "../lib/axios";
import { useStateContext } from "../contexts/ContextProvider";

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { setToken, setUser, token } = useStateContext();
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Layout handles redirection now


    const [role, setRole] = useState('user'); // 'user' or 'admin'

    const onSubmit = (ev) => {
        ev.preventDefault();
        setLoading(true);
        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };
        setErrors(null);
        
        const endpoint = role === 'admin' ? '/admin/login' : '/login';

        axiosClient.post(endpoint, payload)
            .then(({ data }) => {
                console.log("LOGIN SUCCESS:", data); // DEBUG
                setUser(data.user);
                setToken(data.access_token);
                navigate('/');
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    if (response.data.errors) {
                        setErrors(response.data.errors);
                    } else {
                        setErrors({ email: [response.data.message] });
                    }
                } else if (response && response.status === 401) {
                    setErrors({ email: [response.data.message] });
                } else {
                    // Catch-all for 500s or other errors
                    console.error("LOGIN ERROR:", err);
                    alert("Something went wrong! " + (response?.data?.message || err.message));
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="flex h-screen w-full bg-white overflow-hidden">
            {/* Left Side - Image/Brand */}
            <div className="hidden lg:flex w-1/2 bg-gray-900 relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-10 bg-gradient-to-br from-purple-900/80 to-gray-900/90 mix-blend-multiply"></div>
                <img
                    src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2670&auto=format&fit=crop"
                    alt="Cinema Theater"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="relative z-20 p-12 text-white">
                    <h2 className="text-5xl font-black mb-6 tracking-tighter">
                        Unlock the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Cinematic Universe</span>
                    </h2>
                    <p className="text-lg text-gray-300 max-w-md leading-relaxed">
                        Log in to access exclusive screenings, manage your bookings, and experience movies like never before.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 relative">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back</h1>
                        <p className="mt-2 text-sm text-gray-500">Please enter your details to sign in.</p>
                    </div>

                    {/* Role Selection Tabs */}
                    <div className="flex p-1 space-x-1 bg-gray-100/50 rounded-xl">
                        <button
                            onClick={() => setRole('user')}
                            className={`w-full py-2.5 text-sm font-bold rounded-lg transition-all ${
                                role === 'user'
                                    ? 'bg-white text-purple-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            User
                        </button>
                        <button
                            onClick={() => setRole('admin')}
                            className={`w-full py-2.5 text-sm font-bold rounded-lg transition-all ${
                                role === 'admin'
                                    ? 'bg-white text-purple-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Administrator
                        </button>
                    </div>

                    {errors && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm animate-pulse">
                            {Object.keys(errors).map((key) => (
                                <p key={key} className="text-sm font-medium">{errors[key][0]}</p>
                            ))}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="mt-8 space-y-6">
                        <div className="space-y-5">
                            <div className="relative group">
                                <input
                                    ref={emailRef}
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="peer w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all shadow-sm"
                                    placeholder="Email address"
                                />
                                <label
                                    htmlFor="email"
                                    className="absolute left-4 -top-2.5 bg-white px-1 text-xs font-semibold text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-purple-600 peer-focus:text-xs"
                                >
                                    Email address
                                </label>
                            </div>

                            <div className="relative group">
                                <input
                                    ref={passwordRef}
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="peer w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all shadow-sm"
                                    placeholder="Password"
                                />
                                <label
                                    htmlFor="password"
                                    className="absolute left-4 -top-2.5 bg-white px-1 text-xs font-semibold text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-purple-600 peer-focus:text-xs"
                                >
                                    Password
                                </label>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="font-medium text-purple-600 hover:text-purple-500">Forgot password?</a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed ${
                                role === 'admin' 
                                    ? 'bg-purple-900 hover:bg-purple-800 focus:ring-purple-900' 
                                    : 'bg-gray-900 hover:bg-gray-800 focus:ring-gray-900'
                            }`}
                        >
                            {loading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : null}
                            Sign in {role === 'admin' ? 'as Admin' : ''}
                        </button>
                    </form>

                    <div className="mt-6 text-center space-y-2">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-80 transition-opacity">
                                Create an account free
                            </Link>
                        </p>
                        {role === 'admin' && (
                           <p className="text-xs text-gray-500 mt-2">
                                New admin?{' '}
                                <Link to="/admin/register" className="font-semibold text-purple-500 hover:text-purple-700">
                                    Register here
                                </Link>
                            </p> 
                        )}
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="text-purple-600 animate-spin-slow">
                        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" strokeDasharray="10 5" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
