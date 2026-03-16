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

                    {/* Social Sign-up */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500 font-medium">Or sign up with</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <a href="http://localhost:8000/api/auth/github/redirect" className="flex items-center justify-center gap-3 w-full py-3 px-4 border border-gray-200 rounded-xl bg-gray-900 hover:bg-gray-800 text-sm font-semibold text-white transition-all shadow-sm hover:shadow-md">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/></svg>
                                Sign up with GitHub
                            </a>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
