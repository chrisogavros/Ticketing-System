
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../lib/axios";
import { useStateContext } from "../contexts/ContextProvider";

export default function AdminRegister() {
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmationRef = useRef();
    const { setToken, setUser } = useStateContext();
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
        axiosClient.post("/admin/register", payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.access_token);
                // Slight delay or force update to ensure context propagates before redirect
                setTimeout(() => {
                    navigate('/admin');
                    window.location.reload(); // Force reload to ensure all components pick up the new admin status
                }, 100);
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
                <div className="absolute inset-0 z-10 bg-gradient-to-br from-gray-900 to-black opacity-90"></div>
                <img
                    src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2670&auto=format&fit=crop"
                    alt="Cinema Admin"
                    className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale"
                />
                <div className="relative z-20 p-12 text-white text-right">
                    <h2 className="text-5xl font-black mb-6 tracking-tighter leading-tight">
                        Cinema <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Management</span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-md ml-auto leading-relaxed border-r-4 border-red-500 pr-6">
                        Authorized personnel only. Access system controls, bookings, and user management.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 relative overflow-y-auto bg-gray-50">
                <div className="w-full max-w-md space-y-8 my-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="text-center">
                        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Access</h1>
                        <p className="mt-2 text-sm text-gray-500">Create a privileged account to manage the system.</p>
                    </div>

                    {errors && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm">
                            {Object.keys(errors).map((key) => (
                                <p key={key} className="text-sm font-medium">{errors[key][0]}</p>
                            ))}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="mt-8 space-y-5">
                        <div className="relative group">
                            <input
                                ref={nameRef}
                                type="text"
                                required
                                className="peer w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                placeholder="Full Name"
                                id="admin-name"
                            />
                            <label htmlFor="admin-name" className="absolute left-4 -top-2.5 bg-white px-1 text-xs font-semibold text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-red-500 peer-focus:text-xs">
                                Full Name
                            </label>
                        </div>

                        <div className="relative group">
                            <input
                                ref={emailRef}
                                type="email"
                                required
                                className="peer w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                placeholder="Email address"
                                id="admin-email"
                            />
                            <label htmlFor="admin-email" className="absolute left-4 -top-2.5 bg-white px-1 text-xs font-semibold text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-red-500 peer-focus:text-xs">
                                Email Address
                            </label>
                        </div>

                        <div className="relative group">
                            <input
                                ref={passwordRef}
                                type="password"
                                required
                                className="peer w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                placeholder="Password"
                                id="admin-password"
                            />
                            <label htmlFor="admin-password" className="absolute left-4 -top-2.5 bg-white px-1 text-xs font-semibold text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-red-500 peer-focus:text-xs">
                                Password
                            </label>
                        </div>

                        <div className="relative group">
                            <input
                                ref={passwordConfirmationRef}
                                type="password"
                                required
                                className="peer w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                placeholder="Confirm Password"
                                id="admin-password-confirmation"
                            />
                            <label htmlFor="admin-password-confirmation" className="absolute left-4 -top-2.5 bg-white px-1 text-xs font-semibold text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-red-500 peer-focus:text-xs">
                                Confirm Password
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all shadow-lg transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? 'Registering System...' : 'Access Dashboard'}
                        </button>
                    </form>

                    <div className="mt-6 text-center border-t border-gray-100 pt-6">
                        <p className="text-gray-500 text-sm">
                            Not an admin?{' '}
                            <Link to="/login" className="font-semibold text-gray-900 hover:text-red-600 transition-colors">
                                Return to Store
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
