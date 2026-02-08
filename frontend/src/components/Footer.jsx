import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800 mt-auto">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-3xl font-black tracking-tighter text-white mb-6 block">
                            CINE<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">CGP</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Experience movies like never before in our state-of-the-art theaters.
                            Immersive sound, crystal clear visuals, and ultimate comfort.
                        </p>
                        <div className="flex space-x-4">
                            {/* Social Icons (SVG) */}
                            {['twitter', 'facebook', 'instagram', 'youtube'].map((social) => (
                                <a key={social} href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-purple-600 transition-colors group">
                                    <span className="sr-only">{social}</span>
                                    <div className="w-5 h-5 bg-gray-400 group-hover:bg-white transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Quick Links</h3>
                        <ul className="space-y-3">
                            {['Now Showing', 'Coming Soon', 'Cinemas', 'Experiences'].map((item) => (
                                <li key={item}>
                                    <Link to="/" className="text-gray-400 hover:text-purple-400 transition-colors text-sm font-medium">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Support</h3>
                        <ul className="space-y-3">
                            {['FAQ', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map((item) => (
                                <li key={item}>
                                    <Link to="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm font-medium">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Stay Updated</h3>
                        <p className="text-gray-400 text-sm mb-4">Subscribe to our newsletter for the latest updates and exclusive offers.</p>
                        <form className="flex">
                            <input
                                type="email"
                                placeholder="Enter email"
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-purple-500 text-gray-300 text-sm"
                            />
                            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-r-lg transition-colors text-white font-bold">
                                &rarr;
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} CINE CGP. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <span className="text-gray-600 text-xs">Designed with ❤️ for Cinema Lovers</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
