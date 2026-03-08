import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../lib/axios';
import { useStateContext } from '../contexts/ContextProvider';

export default function MovieDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useStateContext();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    // Calendar State
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Data State
    const [screeningsForDate, setScreeningsForDate] = useState({});

    const fetchMovieData = () => {
        setLoading(true);
        axiosClient.get(`/movies/${id}`)
            .then(({ data }) => {
                setMovie(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchMovieData();
    }, [id, navigate]);

    // Calendar Handlers
    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
    };

    const handleDateClick = (day) => {
        // Use local date string to avoid timezone shifts
        const year = day.getFullYear();
        const month = String(day.getMonth() + 1).padStart(2, '0');
        const d = String(day.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${d}`;

        setSelectedDate(dateStr);
        setIsModalOpen(true);

        // Filter screenings for this date
        if (movie) {
            const relevantScreenings = movie.screenings.filter(s => {
                const sDate = new Date(s.start_time);
                const sDateString = sDate.toISOString().split('T')[0];
                return sDateString === dateStr && new Date(s.start_time).getHours() >= 18;
            });

            // Group by Hall
            const groups = {};
            relevantScreenings.forEach(s => {
                if (!groups[s.hall.id]) {
                    groups[s.hall.id] = {
                        hallName: s.hall.name,
                        screenings: []
                    };
                }
                groups[s.hall.id].screenings.push(s);
            });

            // Sort by time
            Object.values(groups).forEach(group => {
                group.screenings.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
            });

            setScreeningsForDate(groups);
        }
    };

    const handleBookTicket = async (screeningId) => {
        if (!token) {
            navigate('/login');
            return;
        }

        if (!window.confirm('Are you sure you want to book a ticket for this showtime?')) return;

        try {
            await axiosClient.post('/bookings', {
                screening_id: screeningId
            });
            alert('Booking successful! Check your profile.');
            // Refresh data to update seat count
            fetchMovieData();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Booking failed:', error);
            alert(error.response?.data?.message || 'Booking failed. Please try again.');
        }
    };

    // Calendar Generation Helper
    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay(); // 0 = Sunday

        const days = [];

        // Empty slots for previous month
        for (let i = 0; i < startingDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50 border border-gray-100"></div>);
        }

        // Days of current month
        for (let i = 1; i <= daysInMonth; i++) {
            const dayDate = new Date(year, month, i);

            // Local date string construction
            const dy = dayDate.getFullYear();
            const dm = String(dayDate.getMonth() + 1).padStart(2, '0');
            const dd = String(dayDate.getDate()).padStart(2, '0');
            const dateStr = `${dy}-${dm}-${dd}`;

            // Check today (using local time logic)
            const today = new Date();
            const todayYear = today.getFullYear();
            const todayMonth = String(today.getMonth() + 1).padStart(2, '0');
            const todayDay = String(today.getDate()).padStart(2, '0');
            const todayStr = `${todayYear}-${todayMonth}-${todayDay}`;

            const isToday = dateStr === todayStr;
            const isSelected = selectedDate === dateStr;

            // Check past
            const todayDateObj = new Date(todayYear, today.getMonth(), today.getDate());
            const isPast = dayDate < todayDateObj;

            days.push(
                <button
                    key={i}
                    disabled={isPast}
                    onClick={() => handleDateClick(dayDate)}
                    className={`h-24 p-2 border border-gray-200 flex flex-col items-start justify-start transition-all relative group
                        ${isPast ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-blue-50 cursor-pointer'}
                        ${isSelected ? 'bg-blue-100 border-blue-500' : ''}
                        ${isToday ? 'font-bold' : ''}
                    `}
                >
                    <span className={`text-sm ${isToday ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : ''}`}>
                        {i}
                    </span>
                    {!isPast && (
                        <span className="mt-auto text-xs text-blue-600 font-medium group-hover:text-blue-800">
                            Book Now
                        </span>
                    )}
                </button>
            );
        }

        return days;
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!movie) return <div className="min-h-screen flex items-center justify-center">Movie not found.</div>;

    const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="container mx-auto px-4 max-w-6xl">
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 text-blue-600 hover:text-blue-800 flex items-center transition-colors"
                >
                    &larr; Back to Movies
                </button>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row mb-8">
                    {/* Movie Info Section */}
                    <div className="md:w-1/3 h-96 md:h-auto relative">
                        <img
                            src={movie.poster_url || 'https://via.placeholder.com/400x600?text=No+Image'}
                            alt={movie.title}
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x600?text=Error'; }}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="md:w-2/3 p-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">{movie.title}</h1>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
                            <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full font-medium">{movie.genre}</span>
                            <span>{movie.duration_minutes} min</span>
                            <span>Dir: {movie.director}</span>
                        </div>
                        <p className="text-gray-600 mb-8 leading-relaxed">{movie.description}</p>
                    </div>
                </div>

                {/* Large Calendar Section */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <h2 className="text-2xl font-bold text-gray-900">Select Date</h2>
                        <div className="flex justify-between md:justify-end items-center space-x-2 md:space-x-4 w-full md:w-auto">
                            <button onClick={prevMonth} className="px-3 md:px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 whitespace-nowrap text-sm md:text-base">&larr; Prev</button>
                            <span className="text-lg md:text-xl font-semibold w-40 md:w-48 text-center">{monthName}</span>
                            <button onClick={nextMonth} className="px-3 md:px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 whitespace-nowrap text-sm md:text-base">Next &rarr;</button>
                        </div>
                    </div>

                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 mb-1 rounded-t-lg overflow-hidden">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="bg-gray-100 p-2 text-center font-bold text-gray-700 text-sm">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 pb-px">
                        {renderCalendar()}
                    </div>
                </div>
            </div>

            {/* Modal for Showtimes */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto animate-fade-in-up">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-2xl font-bold text-gray-800">
                                Showtimes for {new Date(selectedDate).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
                        </div>

                        <div className="p-6">
                            <p className="text-sm text-gray-500 mb-6 flex items-center">
                                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mr-2">NOTE</span>
                                Showing screenings after 18:00
                            </p>

                            {Object.keys(screeningsForDate).length > 0 ? (
                                <div className="space-y-8">
                                    {Object.values(screeningsForDate).map((group, index) => (
                                        <div key={index}>
                                            <h4 className="font-semibold text-lg text-gray-800 mb-4 flex items-center border-b pb-2">
                                                <span className="mr-2 text-2xl">🏢</span>
                                                <span>{group.hallName}</span>
                                            </h4>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                                {group.screenings.map((screening) => {
                                                    const date = new Date(screening.start_time);
                                                    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                                    const totalSeats = (screening.hall.total_rows * screening.hall.total_cols) || 300;
                                                    const available = screening.available_seats !== undefined ? screening.available_seats : totalSeats;
                                                    const isFull = available <= 0;

                                                    return (
                                                        <button
                                                            key={screening.id}
                                                            disabled={isFull}
                                                            onClick={() => handleBookTicket(screening.id)}
                                                            className={`flex flex-col items-center justify-center bg-gray-50 border border-gray-200 p-4 rounded-xl transition-all group scale-100 duration-200
                                                                ${isFull ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'hover:border-blue-500 hover:bg-blue-50 hover:shadow-lg hover:scale-105 cursor-pointer'}
                                                            `}
                                                        >
                                                            <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600">{timeStr}</span>
                                                            <span className="text-sm font-semibold text-green-600 mt-1">${screening.price}</span>
                                                            <span className="text-xs font-bold text-red-600 mt-1 block">
                                                                {available}/{totalSeats} seats
                                                            </span>
                                                            {!isFull && (
                                                                <span className="text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click to Book</span>
                                                            )}
                                                            {isFull && (
                                                                <span className="text-xs text-red-500 mt-1 font-bold">SOLD OUT</span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🌙</div>
                                    <p className="text-xl text-gray-500 font-medium">No evening screenings available for this date.</p>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Choose another date
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
