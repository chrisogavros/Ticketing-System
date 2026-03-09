import { useRef, useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import axiosClient from "../lib/axios";
import { useStateContext } from "../contexts/ContextProvider";

export default function Register() {
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmationRef = useRef();
    const { setToken, setUser, token } = useStateContext();
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Layout handles redirection now


    const onSubmit = (ev) => {
        ev.preventDefault();
        setLoading(true);
        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: passwordConfirmationRef.current.value,
        };

        setErrors(null);
        axiosClient.post("/register", payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.access_token);
                navigate('/');
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                } else {
                    console.error("REGISTER ERROR:", err);
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
                <div className="absolute inset-0 z-10 bg-gradient-to-bl from-indigo-900/80 to-purple-900/90 mix-blend-multiply"></div>
                <img
                    src="https://images.unsplash.com/photo-1517604931442-710c8ef5ad25?q=80&w=2669&auto=format&fit=crop"
                    alt="Cinema Seats"
                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
                <div className="relative z-20 p-12 text-white text-right">
                    <h2 className="text-5xl font-black mb-6 tracking-tighter leading-tight">
                        Join the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-l from-pink-400 to-indigo-400">Revolution</span>
                    </h2>
                    <p className="text-lg text-gray-300 max-w-md ml-auto leading-relaxed">
                        Create your account to start booking seats instantly and get personalized movie recommendations.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 relative overflow-y-auto">
                <div className="w-full max-w-md space-y-8 my-auto">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</h1>
                        <p className="mt-2 text-sm text-gray-500">Sign up in seconds. No credit card required.</p>
                    </div>

                    {errors && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm animate-pulse">
                            {Object.keys(errors).map((key) => (
                                <p key={key} className="text-sm font-medium">{errors[key][0]}</p>
                            ))}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="mt-8 space-y-5">
                        <div className="relative group">
                            <input
                                ref={nameRef}
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="peer w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-sm"
                                placeholder="Full Name"
                            />
                            <label
                                htmlFor="name"
                                className="absolute left-4 -top-2.5 bg-white px-1 text-xs font-semibold text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-indigo-600 peer-focus:text-xs"
                            >
                                Full Name
                            </label>
                        </div>

                        <div className="relative group">
                            <input
                                ref={emailRef}
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="peer w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-sm"
                                placeholder="Email address"
                            />
                            <label
                                htmlFor="email"
                                className="absolute left-4 -top-2.5 bg-white px-1 text-xs font-semibold text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-indigo-600 peer-focus:text-xs"
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
                                className="peer w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-sm"
                                placeholder="Password"
                            />
                            <label
                                htmlFor="password"
                                className="absolute left-4 -top-2.5 bg-white px-1 text-xs font-semibold text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-indigo-600 peer-focus:text-xs"
                            >
                                Password
                            </label>
                        </div>

                        <div className="relative group">
                            <input
                                ref={passwordConfirmationRef}
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                required
                                className="peer w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-sm"
                                placeholder="Confirm Password"
                            />
                            <label
                                htmlFor="password_confirmation"
                                className="absolute left-4 -top-2.5 bg-white px-1 text-xs font-semibold text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-indigo-600 peer-focus:text-xs"
                            >
                                Confirm Password
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-all shadow-lg hover:shadow-indigo-500/30 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? 'Creating Account...' : 'Get Started'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600 mb-2">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                                Sign in instead
                            </Link>
                        </p>
                        <p className="text-xs text-gray-500">
                            Looking to become an Admin?{' '}
                            <Link to="/admin/register" className="font-semibold text-purple-500 hover:text-purple-700 transition-colors">
                                Register as Administrator
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
