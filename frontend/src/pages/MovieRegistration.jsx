import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MovieRegistration() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        phone: '',
        photo: null
    });
    const [photoPreview, setPhotoPreview] = useState(null);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'photo' && files && files[0]) {
            setFormData({ ...formData, photo: files[0] });
            setPhotoPreview(URL.createObjectURL(files[0]));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // At this stage, since we don't have an API endpoint to submit this to,
        // we'll just log it and simulate a success.
        console.log('Form submission:', formData);
        alert('Registration simulated successfully! (No backend endpoint configured yet)');
        navigate('/');
    };

    return (
        <div className="container mx-auto px-4 py-12 md:py-24 min-h-screen text-white flex justify-center items-center">

            <div className="w-full max-w-md bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 p-6 border-b border-white/5 relative">
                    {/* Decorative background blur */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

                    <h1 className="text-2xl md:text-3xl font-bold text-center tracking-tight relative z-10">
                        Movie Registration
                    </h1>
                    <p className="text-center text-sm text-gray-400 mt-2 relative z-10">
                        Please provide your details below.
                    </p>
                </div>

                <div className="p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Name Field */}
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                                First Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-gray-800 placeholder-gray-500"
                                placeholder="Enter your first name"
                            />
                        </div>

                        {/* Surname Field */}
                        <div className="space-y-2">
                            <label htmlFor="surname" className="block text-sm font-medium text-gray-300">
                                Surname <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                id="surname"
                                name="surname"
                                required
                                value={formData.surname}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-gray-800 placeholder-gray-500"
                                placeholder="Enter your surname"
                            />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                Email <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-gray-800 placeholder-gray-500"
                                placeholder="Enter your email address"
                            />
                        </div>

                        {/* Phone Number Field */}
                        <div className="space-y-2">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                                Phone Number <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-gray-800 placeholder-gray-500"
                                placeholder="e.g. +1 234 567 8900"
                            />
                        </div>

                        {/* Photo Field */}
                        <div className="space-y-2">
                            <label htmlFor="photo" className="block text-sm font-medium text-gray-300">
                                Photo <span className="text-red-400">*</span>
                            </label>

                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/10 border-dashed rounded-xl hover:border-purple-500/50 hover:bg-white/5 transition-all">
                                <div className="space-y-2 text-center w-full">
                                    {photoPreview ? (
                                        <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500/30 shadow-lg">
                                            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                    <div className="flex flex-col sm:flex-row text-sm text-gray-400 justify-center items-center mt-4">
                                        <label htmlFor="photo" className="relative cursor-pointer bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-2.5 rounded-full font-bold text-white shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-pink-500 focus-within:ring-offset-gray-900 transition-all hover:scale-105 active:scale-95">
                                            <span>Upload a file</span>
                                            <input id="photo" name="photo" type="file" className="sr-only" accept="image/*" required onChange={handleChange} />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        PNG, JPG, GIF up to 10MB
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-purple-500/20 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
