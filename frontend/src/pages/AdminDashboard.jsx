
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
