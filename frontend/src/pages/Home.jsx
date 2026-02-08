import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../lib/axios';

export default function Home() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosClient.get('/movies?limit=6')
            .then(({ data }) => {
                setMovies(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Now Showing</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {movies.map((movie) => (
                        <Link
                            to={`/movies/${movie.id}`}
                            key={movie.id}
                            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 block"
                        >
                            <div className="h-64 overflow-hidden relative group">
                                <img
                                    src={movie.poster_url || 'https://via.placeholder.com/300x450?text=No+Image'}
                                    alt={movie.title}
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x450?text=Error'; }}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-4">
                                <h2 className="text-lg font-bold text-gray-900 mb-1 truncate">{movie.title}</h2>
                                <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                                    <span className="bg-blue-50 text-blue-700 py-0.5 px-2 rounded-full">{movie.genre}</span>
                                    <span>{movie.duration_minutes} min</span>
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-2">
                                    {movie.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                {movies.length === 0 && (
                    <div className="text-center text-gray-500 mt-10">
                        No movies currently showing.
                    </div>
                )}
            </div>
        </div>
    );
}
