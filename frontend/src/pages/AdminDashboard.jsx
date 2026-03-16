
import { useEffect, useState } from "react";
import axiosClient from "../lib/axios";
import { useStateContext } from "../contexts/ContextProvider";
import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, token } = useStateContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        axiosClient.get('/admin/bookings')
            .then(({ data }) => {
                setBookings(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
                // navigate('/'); // Optional: redirect if unauthorized
            });
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg font-semibold border border-purple-200">
                    Total Bookings: {bookings.length}
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <Link to="/admin/calendar" className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-3 hover:border-purple-300 hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    </div>
                    <span className="font-semibold text-gray-700 text-sm">Calendar</span>
                </Link>
                <Link to="/admin/spaces" className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-3 hover:border-purple-300 hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                    </div>
                    <span className="font-semibold text-gray-700 text-sm">Spaces</span>
                </Link>
                <Link to="/admin/scanner" className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-3 hover:border-purple-300 hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/></svg>
                    </div>
                    <span className="font-semibold text-gray-700 text-sm">Scanner</span>
                </Link>
                <Link to="/entry/register" className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-3 hover:border-purple-300 hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </div>
                    <span className="font-semibold text-gray-700 text-sm">Visitor Entry</span>
                </Link>
                <Link to="/admin/users" className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-3 hover:border-purple-300 hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                    </div>
                    <span className="font-semibold text-gray-700 text-sm">User Management</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                <th className="px-6 py-4">Booking Ref</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Movie</th>
                                <th className="px-6 py-4">Showtime</th>
                                <th className="px-6 py-4">Hall</th>
                                <th className="px-6 py-4 text-center">Seats</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-sm text-gray-600">
                                        #{booking.booking_reference}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{booking.user.name}</div>
                                        <div className="text-xs text-gray-500">{booking.user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-800">
                                        {booking.screening.movie.title}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                            {new Date(booking.screening.start_time).toLocaleDateString()}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(booking.screening.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {booking.screening.hall.name}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="bg-blue-100 text-blue-800 py-1 px-2 rounded text-xs font-bold">
                                            {booking.seat_count}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {booking.is_attended ? (
                                            <span className="bg-green-100 text-green-800 py-1 px-2 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                ✓ Προσήλθε
                                            </span>
                                        ) : booking.status === 'cancelled' ? (
                                            <span className="bg-red-100 text-red-800 py-1 px-2 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                Ακυρώθηκε
                                            </span>
                                        ) : (
                                            <span className="bg-gray-100 text-gray-800 py-1 px-2 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                Εκκρεμεί
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-green-600">
                                        ${booking.total_price}
                                    </td>
                                </tr>
                            ))}
                            {bookings.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                        No bookings found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
