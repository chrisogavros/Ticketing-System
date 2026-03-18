import { useEffect, useState } from "react";
import axiosClient from "../lib/axios";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";

export default function AdminSpaces() {
    const { token, user } = useStateContext();
    const navigate = useNavigate();

    const [halls, setHalls] = useState([]);
    const [screenings, setScreenings] = useState([]);
    const [movies, setMovies] = useState([]); // Needed for creating screenings dropdown

    const [activeTab, setActiveTab] = useState('halls'); // 'halls' or 'screenings'
    const [selectedDate, setSelectedDate] = useState(''); // Added for filtering screenings

    // Modals state
    const [isHallModalOpen, setIsHallModalOpen] = useState(false);
    const [isScreeningModalOpen, setIsScreeningModalOpen] = useState(false);

    // Form state
    const [editingHall, setEditingHall] = useState(null);
    const [hallForm, setHallForm] = useState({ name: '', total_rows: 10, total_cols: 10 });

    const [editingScreening, setEditingScreening] = useState(null);
    const [screeningForm, setScreeningForm] = useState({ movie_id: '', hall_id: '', start_time: '', price: '' });

    useEffect(() => {
        if (!token || user?.is_admin === 0) {
            navigate('/');
            return;
        }
        fetchData();
        fetchMovies();
    }, [token]);

    const fetchData = async () => {
        try {
            const [hallsRes, screeningsRes] = await Promise.all([
                axiosClient.get('/admin/halls'),
                axiosClient.get('/admin/screenings')
            ]);
            setHalls(hallsRes.data);
            setScreenings(screeningsRes.data);
        } catch (error) {
            console.error("Failed to fetch space data", error);
        }
    };

    const fetchMovies = async () => {
        try {
            const res = await axiosClient.get('/movies');
            setMovies(res.data);
        } catch (error) {
            console.error("Failed to fetch movies", error);
        }
    };

    // --- HALL HANDLERS ---
    const handleHallSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingHall) {
                await axiosClient.put(`/admin/halls/${editingHall.id}`, hallForm);
                alert('Hall updated successfully');
            } else {
                await axiosClient.post('/admin/halls', hallForm);
                alert('Hall created successfully');
            }
            setIsHallModalOpen(false);
            fetchData();
        } catch (error) {
            alert('Operation failed. Check inputs.');
        }
    };

    const handleHallDelete = async (hall) => {
        if (!window.confirm(`WARNING: Deleting '${hall.name}' will ALSO DELETE ALL existing screenings and bookings inside it! Affected users will be emailed. Are you absolutely sure?`)) return;

        try {
            await axiosClient.delete(`/admin/halls/${hall.id}`);
            alert('Hall and its associations deleted successfully.');
            fetchData();
        } catch (error) {
            alert('Failed to delete Hall.');
        }
    };

    // --- SCREENING HANDLERS ---
    const handleScreeningSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingScreening) {
                await axiosClient.put(`/admin/screenings/${editingScreening.id}`, screeningForm);
                alert('Screening updated successfully! Affected users emailed if time changed.');
            } else {
                await axiosClient.post('/admin/screenings', screeningForm);
                alert('Screening created successfully');
            }
            setIsScreeningModalOpen(false);
            fetchData();
        } catch (error) {
            if (error.response && error.response.status === 422 && error.response.data.message && error.response.data.message.startsWith('OVERLAP_ERROR')) {
                alert(error.response.data.message.replace('OVERLAP_ERROR: ', ''));
            } else {
                alert('Operation failed. Check inputs.');
            }
        }
    };

    const handleScreeningDelete = async (screening) => {
        if (!window.confirm(`WARNING: Deleting this screening will ALSO DELETE ALL existing bookings! Affected users will be emailed. Are you sure?`)) return;

        try {
            await axiosClient.delete(`/admin/screenings/${screening.id}`);
            alert('Screening deleted and users notified safely.');
            fetchData();
        } catch (error) {
            alert('Failed to delete Screening.');
        }
    };

    // --- FORMATTERS ---
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Manage Spaces & Scheduling</h1>
                    <p className="text-gray-500 mt-2">Create, modify, or delete Halls and their Showtimes. Changes will automatically notify affected users via Email.</p>
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 mb-6 border-b border-gray-200">
                    <button
                        className={`pb-4 px-4 font-bold text-sm transition-colors ${activeTab === 'halls' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('halls')}
                    >
                        Halls Management
                    </button>
                    <button
                        className={`pb-4 px-4 font-bold text-sm transition-colors ${activeTab === 'screenings' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('screenings')}
                    >
                        Screenings Schedule
                    </button>
                </div>

                {/* HALLS TAB */}
                {activeTab === 'halls' && (
                    <div className="animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Available Halls</h2>
                            <button
                                onClick={() => { setEditingHall(null); setHallForm({ name: '', total_rows: 10, total_cols: 10 }); setIsHallModalOpen(true); }}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow transition"
                            >
                                + Add New Hall
                            </button>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {halls.map(hall => (
                                <div key={hall.id} className="bg-white rounded-xl shadow p-6 border border-gray-100 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-xl text-gray-900">{hall.name}</h3>
                                            <p className="text-sm text-gray-500">ID: H{String(hall.id).padStart(3, '0')}</p>
                                        </div>
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-200">
                                            {hall.total_rows * hall.total_cols} Seats
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600 mb-6 flex-grow">
                                        <p>Rows: {hall.total_rows}</p>
                                        <p>Cols: {hall.total_cols}</p>
                                        <p className="mt-2 text-indigo-600 font-semibold">{hall.screenings_count} Scheduled Screenings</p>
                                    </div>
                                    <div className="flex space-x-3 pt-4 border-t border-gray-100 mt-auto">
                                        <button
                                            onClick={() => { setEditingHall(hall); setHallForm({ name: hall.name, total_rows: hall.total_rows, total_cols: hall.total_cols }); setIsHallModalOpen(true); }}
                                            className="flex-1 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 py-2 rounded font-semibold text-sm transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleHallDelete(hall)}
                                            className="flex-1 bg-red-50 text-red-700 hover:bg-red-100 py-2 rounded font-semibold text-sm transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* SCREENINGS TAB */}
                {activeTab === 'screenings' && (
                    <div className="animate-fade-in-up">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                            <h2 className="text-xl font-bold text-gray-800">
                                {selectedDate ? `Screenings on ${new Date(selectedDate).toLocaleDateString()}` : 'All Scheduled Screenings'}
                            </h2>
                            <div className="flex items-center space-x-3 w-full md:w-auto">
                                <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                                    <div className="px-3 text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                        </svg>
                                    </div>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="py-2.5 px-2 text-sm text-gray-700 outline-none w-full"
                                    />
                                    {selectedDate && (
                                        <button
                                            onClick={() => setSelectedDate('')}
                                            className="px-3 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Clear Filter"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                <button
                                    onClick={() => { setEditingScreening(null); setScreeningForm({ movie_id: '', hall_id: '', start_time: '', price: '12.00' }); setIsScreeningModalOpen(true); }}
                                    className="bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap text-white font-bold py-2.5 px-4 rounded-lg shadow transition"
                                >
                                    + Add Screening
                                </button>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Movie</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hall</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {(selectedDate ? screenings.filter(s => s.start_time.startsWith(selectedDate)) : screenings).map(s => (
                                        <tr key={s.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.movie?.title || 'Unknown Movie'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.hall?.name || 'Unknown Hall'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                {new Date(s.start_time).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">${s.price}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => { setEditingScreening(s); setScreeningForm({ movie_id: s.movie_id, hall_id: s.hall_id, start_time: formatDateForInput(s.start_time), price: s.price }); setIsScreeningModalOpen(true); }}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleScreeningDelete(s)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {(selectedDate ? screenings.filter(s => s.start_time.startsWith(selectedDate)) : screenings).length === 0 && (
                                        <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                            {selectedDate ? 'No screenings found for the selected date.' : 'No screenings available.'}
                                        </td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* HALL MODAL */}
            {isHallModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in-up">
                        <h2 className="text-2xl font-bold mb-4">{editingHall ? 'Edit' : 'Create'} Hall</h2>
                        <form onSubmit={handleHallSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hall Name</label>
                                <input type="text" value={hallForm.name} onChange={e => setHallForm({ ...hallForm, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Rows</label>
                                    <input type="number" min="1" value={hallForm.total_rows} onChange={e => setHallForm({ ...hallForm, total_rows: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Columns</label>
                                    <input type="number" min="1" value={hallForm.total_cols} onChange={e => setHallForm({ ...hallForm, total_cols: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500" required />
                                </div>
                            </div>
                            <div className="flex pt-4 space-x-3">
                                <button type="button" onClick={() => setIsHallModalOpen(false)} className="flex-1 py-2 bg-gray-100 text-gray-700 font-bold rounded hover:bg-gray-200">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700">{editingHall ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* SCREENING MODAL */}
            {isScreeningModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in-up">
                        <h2 className="text-2xl font-bold mb-2">{editingScreening ? 'Edit' : 'Create'} Screening</h2>
                        {editingScreening && <p className="text-xs text-orange-600 mb-4 font-bold">Modifying time or deleting will notify affected users via email.</p>}

                        <form onSubmit={handleScreeningSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Movie</label>
                                <select value={screeningForm.movie_id} onChange={e => setScreeningForm({ ...screeningForm, movie_id: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500" required>
                                    <option value="">Select a Movie...</option>
                                    {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hall</label>
                                <select value={screeningForm.hall_id} onChange={e => setScreeningForm({ ...screeningForm, hall_id: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500" required>
                                    <option value="">Select a Hall...</option>
                                    {halls.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                <input type="datetime-local" value={screeningForm.start_time} onChange={e => setScreeningForm({ ...screeningForm, start_time: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 text-sm" required />
                                <p className="text-xs text-gray-400 mt-1">Η ώρα λήξης υπολογίζεται αυτόματα από τη διάρκεια της ταινίας.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Price ($)</label>
                                <input type="number" step="0.01" min="0" value={screeningForm.price} onChange={e => setScreeningForm({ ...screeningForm, price: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500" required />
                            </div>
                            <div className="flex pt-4 space-x-3">
                                <button type="button" onClick={() => setIsScreeningModalOpen(false)} className="flex-1 py-2 bg-gray-100 text-gray-700 font-bold rounded hover:bg-gray-200">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700">{editingScreening ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
