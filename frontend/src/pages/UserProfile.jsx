import { useEffect, useState } from 'react';
import axiosClient from '../lib/axios';
import { useStateContext } from '../contexts/ContextProvider';
import { Link } from 'react-router-dom';

export default function UserProfile() {
    const { user, token } = useStateContext();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        console.log('UserProfile: Effect triggered. Token:', token ? 'Present' : 'Missing');

        const fetchBookings = async () => {
            try {
                console.log('UserProfile: Fetching bookings...');
                const response = await axiosClient.get('/my-bookings');
                console.log('UserProfile: Bookings fetched:', response.data);
                if (isMounted) {
                    setBookings(response.data);
                }
            } catch (error) {
                console.error('Error fetching bookings:', error);
                // Do not clear bookings on error if we had them? 
                // Actually if it fails, we probably should leave it as is or show error.
                // For now, let's keep previous state if any.
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        if (token) {
            fetchBookings();
        } else {
            console.log('UserProfile: No token, skipping fetch.');
            if (isMounted) setLoading(false);
        }

        return () => {
            isMounted = false;
        };
    }, [token]);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6">
            <div className="container mx-auto max-w-5xl">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">My Profile</h1>
                    <p className="text-gray-500">Manage your account and view your ticket history.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* User Info Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 h-32 relative">
                                <div className="absolute -bottom-10 left-6">
                                    <div className="w-20 h-20 rounded-full bg-white p-1 shadow-lg">
                                        <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
                                            {user.name?.[0]?.toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-12 pb-8 px-6">
                                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                                <p className="text-gray-500 mb-6">{user.email}</p>

                                <div className="space-y-3">
                                    <button className="w-full py-2 px-4 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-left flex items-center justify-between">
                                        Edit Profile
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </button>
                                    <button className="w-full py-2 px-4 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-left flex items-center justify-between">
                                        Change Password
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking History */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Booking History</h3>

                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : bookings.length > 0 ? (
                                <div className="space-y-4">
                                    {bookings.map((booking) => (
                                        <div key={booking.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all cursor-pointer group">
                                            {/* Date Box */}
                                            <div className="sm:w-20 sm:h-20 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-center group-hover:bg-white group-hover:shadow-sm transition-all">
                                                <span className="text-xs font-bold text-gray-400 uppercase">
                                                    {new Date(booking.screening.start_time).toLocaleString('default', { month: 'short' })}
                                                </span>
                                                <span className="text-2xl font-black text-gray-900">
                                                    {new Date(booking.screening.start_time).getDate()}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(booking.screening.start_time).getFullYear()}
                                                </span>
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                                                        {booking.screening.movie.title}
                                                    </h4>
                                                    {booking.status === 'confirmed' ? (
                                                        <Link to="/movie-registration" className="px-3 py-1.5 text-xs font-bold rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors shadow-sm border border-yellow-200" onClick={(e) => e.stopPropagation()}>
                                                            Must Registrate first
                                                        </Link>
                                                    ) : (
                                                        <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {booking.status}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-500 mb-2">
                                                    {new Date(booking.screening.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {booking.screening.hall.name}
                                                </div>
                                                <div className="flex items-center text-sm font-medium text-gray-700">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 text-purple-600">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v4.5c0 .621.504 1.125 1.125 1.125h4.5c.621 0 1.125-.504 1.125-1.125V6.375c0-.621-.504-1.125-1.125-1.125H3.375zm0 13.5c-.621 0-1.125.504-1.125 1.125v4.5c0 .621.504 1.125 1.125 1.125h4.5c.621 0 1.125-.504 1.125-1.125v-4.5c0-.621-.504-1.125-1.125-1.125H3.375z" />
                                                    </svg>
                                                    {booking.seat_count} Seats • {booking.total_price}€
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v4.5c0 .621.504 1.125 1.125 1.125h4.5c.621 0 1.125-.504 1.125-1.125V6.375c0-.621-.504-1.125-1.125-1.125H3.375zm0 13.5c-.621 0-1.125.504-1.125 1.125v4.5c0 .621.504 1.125 1.125 1.125h4.5c.621 0 1.125-.504 1.125-1.125v-4.5c0-.621-.504-1.125-1.125-1.125H3.375z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">No bookings yet</h3>
                                    <p className="text-gray-500 mb-6">Looks like you haven't booked any movies yet.</p>
                                    <Link to="/" className="inline-flex items-center px-4 py-2 bg-gray-900 text-white font-bold rounded-lg hover:bg-purple-900 transition-colors">
                                        Browse Movies
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
