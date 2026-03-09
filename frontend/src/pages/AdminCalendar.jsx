import { useEffect, useState } from "react";
import axiosClient from "../lib/axios";

export default function AdminCalendar() {
    const [screenings, setScreenings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
    const [showAll, setShowAll] = useState(false); // Toggle to show everything regardless of date

    useEffect(() => {
        fetchCalendarData();
    }, []);

    const fetchCalendarData = () => {
        setLoading(true);
        axiosClient.get("/admin/calendar")
            .then(({ data }) => {
                setScreenings(data);
                setError(null);
            })
            .catch((err) => {
                console.error("Failed to fetch calendar data:", err);
                setError("Failed to load schedule. Please try again later.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const toggleAttendance = (bookingId) => {
        axiosClient.post(`/admin/bookings/${bookingId}/attend`)
            .then(() => {
                // Refresh data to show updated counts
                fetchCalendarData();
            })
            .catch((err) => {
                console.error("Failed to update attendance:", err);
                alert("Failed to confirm attendance. Please try again.");
            });
    };

    // Use consistent local date formatting function
    const getLocalDateString = (isoString) => {
        const d = new Date(isoString);
        // Returns YYYY-MM-DD in LOCAL time
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Filter screenings based on selected date (unless "Show All" is checked)
    const filteredScreenings = screenings.filter(screening => {
        if (showAll) return true;
        
        // Exact local YYYY-MM-DD extraction
        const screeningDate = getLocalDateString(screening.start_time);
        return screeningDate === selectedDate;
    });

    // Group the *filtered* screenings by Date for better display
    const groupedScreenings = filteredScreenings.reduce((acc, screening) => {
        // Group by human readable local date
        const date = new Date(screening.start_time).toLocaleDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(screening);
        return acc;
    }, {});


    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl m-4 border border-red-100">
                {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Admin Calendar</h1>
                    <p className="text-gray-500 mt-1">Manage screenings and verify ticket holder attendance.</p>
                </div>
                
                {/* Date Filters & Controls */}
                <div className="flex flex-wrap items-center gap-4 bg-white p-3 border border-gray-100 shadow-sm rounded-xl">
                    <div className="flex items-center space-x-2 pl-2 border-r border-gray-100 pr-4">
                        <label htmlFor="show-all" className="text-sm font-semibold text-gray-700 cursor-pointer select-none">Show All Dates</label>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input 
                                type="checkbox" 
                                name="toggle" 
                                id="show-all" 
                                checked={showAll}
                                onChange={(e) => setShowAll(e.target.checked)}
                                className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-300 ease-in-out peer checked:translate-x-5 checked:border-purple-600 border-gray-200"
                            />
                            <label htmlFor="show-all" className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-200 cursor-pointer peer-checked:bg-purple-600 transition-colors duration-300"></label>
                        </div>
                    </div>

                    {!showAll && (
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-semibold text-gray-700">Date:</label>
                            <input 
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full px-3 py-1.5 font-medium"
                            />
                        </div>
                    )}

                    <button 
                        onClick={fetchCalendarData}
                        className="flex items-center space-x-2 bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-1.5 rounded-lg border border-purple-100 transition-colors ml-auto font-semibold text-sm"
                        title="Refresh Data"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            <div className="space-y-8">
                {Object.keys(groupedScreenings).length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                        <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h3 className="mt-4 text-lg font-semibold text-gray-800">No screenings scheduled</h3>
                        <p className="mt-1 text-gray-500">
                            {showAll 
                                ? "There are no upcoming screenings in the database." 
                                : `There are no screenings scheduled for the selected date.`}
                        </p>
                    </div>
                ) : (
                    Object.entries(groupedScreenings).map(([date, dateScreenings]) => (
                        <div key={date} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {date} 
                                </h2>
                                <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full border border-indigo-200">
                                    {dateScreenings.length} Screenings
                                </span>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {dateScreenings.map(screening => {
                                    const time = new Date(screening.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                    const availableSeats = screening.total_capacity ? screening.total_capacity - screening.booked_seats : "Unknown";
                                    
                                    // Calculate fullness percentage mathematically
                                    const fullnessPercentage = screening.total_capacity 
                                        ? Math.round((screening.booked_seats / screening.total_capacity) * 100)
                                        : 0;
                                        
                                    // Calculate actual attendance percentage
                                    const attendancePercentage = screening.total_capacity 
                                        ? Math.round((screening.attended_seats / screening.total_capacity) * 100)
                                        : 0;

                                    return (
                                        <div key={screening.id} className="p-6">
                                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                                                {/* Left: Movie & Stats */}
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="text-xl font-bold text-gray-900">{screening.movie_title}</h3>
                                                            <div className="flex flex-wrap items-center text-sm text-gray-600 mt-2 gap-4">
                                                                <span className="flex items-center gap-1.5 font-medium bg-gray-100 px-2 py-1 rounded-md">
                                                                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                    {time}
                                                                </span>
                                                                <span className="flex items-center gap-1.5 font-medium text-gray-600">
                                                                    <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                                                    {screening.hall_code} - {screening.hall_name}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4 flex items-center space-x-2">
                                                            <div className={`px-3 py-1 rounded-md text-xs font-bold border ${
                                                                fullnessPercentage >= 90 ? 'bg-red-50 text-red-700 border-red-200' :
                                                                fullnessPercentage >= 60 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                                'bg-green-50 text-green-700 border-green-200'
                                                            }`}>
                                                                {fullnessPercentage}% Booked
                                                            </div>
                                                            <div className="px-3 py-1 rounded-md text-xs font-bold border bg-purple-50 text-purple-700 border-purple-200">
                                                                {attendancePercentage}% Attended
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex space-x-6 mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                                        <div>
                                                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Available</p>
                                                            <p className="text-xl font-bold text-gray-800 mt-0.5">{availableSeats}</p>
                                                        </div>
                                                        <div className="border-l border-gray-200 pl-6">
                                                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Booked</p>
                                                            <p className="text-xl font-bold text-blue-600 mt-0.5">{screening.booked_seats}</p>
                                                        </div>
                                                        <div className="border-l border-gray-200 pl-6">
                                                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Attended</p>
                                                            <p className="text-xl font-bold text-purple-600 mt-0.5">{screening.attended_seats}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right: Booking Table (Dashboard Style) */}
                                                <div className="flex-1 lg:max-w-xl w-full">
                                                    <h4 className="text-sm font-semibold text-gray-800 mb-3 ml-1">Screening Bookings</h4>
                                                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                                        {screening.bookings && screening.bookings.length > 0 ? (
                                                            <div className="max-h-60 overflow-y-auto">
                                                                <table className="w-full text-left border-collapse">
                                                                    <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm">
                                                                        <tr className="border-b border-gray-200 text-[11px] uppercase text-gray-500 font-bold tracking-wider">
                                                                            <th className="px-4 py-2.5">Customer</th>
                                                                            <th className="px-4 py-2.5 text-center">Seats</th>
                                                                            <th className="px-4 py-2.5 text-right">Action</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-gray-100">
                                                                        {screening.bookings.map(booking => (
                                                                            <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                                                                                <td className="px-4 py-3">
                                                                                    <div className="font-medium text-gray-900 text-sm leading-tight">{booking.user?.name || "Unknown"}</div>
                                                                                    <div className="text-xs text-gray-500 font-mono mt-0.5">#{booking.id}</div>
                                                                                </td>
                                                                                <td className="px-4 py-3 text-center">
                                                                                    <span className="bg-blue-100 text-blue-800 py-0.5 px-2 rounded font-bold text-xs inline-block">
                                                                                        {booking.seat_count}
                                                                                    </span>
                                                                                </td>
                                                                                <td className="px-4 py-3 text-right">
                                                                                    <button
                                                                                        onClick={() => toggleAttendance(booking.id)}
                                                                                        className={`px-3 py-1.5 rounded-md text-[11px] font-bold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                                                                            booking.is_attended
                                                                                                ? "bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200 focus:ring-purple-500"
                                                                                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-400"
                                                                                        }`}
                                                                                    >
                                                                                        {booking.is_attended ? "Verified (Undo)" : "Check-in"}
                                                                                    </button>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        ) : (
                                                            <div className="p-6 text-center text-sm text-gray-500 bg-gray-50">
                                                                No bookings yet for this screening.
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
