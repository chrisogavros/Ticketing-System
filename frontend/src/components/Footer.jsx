import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white pt-12 pb-8 border-t border-gray-800 mt-auto">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-8 gap-8">
                    {/* Brand Column */}
                    <div className="text-center md:text-left">
                        <Link to="/" className="text-3xl font-black tracking-tighter text-white mb-4 block">
                            CINE<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">CGP</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                            Σύστημα Διαχείρισης Κρατήσεων και Εισόδου. 
                            Μια ολοκληρωμένη λύση για σύγχρονους κινηματογράφους.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="text-center md:text-right">
                        <h3 className="text-lg font-bold mb-4 text-white uppercase tracking-wider">Σελιδες</h3>
                        <ul className="flex flex-col space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-purple-400 transition-colors text-sm font-medium">
                                    Αρχική Σελίδα (Ταινίες)
                                </Link>
                            </li>
                            <li>
                                <Link to="/entry/register" className="text-gray-400 hover:text-purple-400 transition-colors text-sm font-medium">
                                    Καταγραφή Επισκέπτη
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-gray-400 hover:text-purple-400 transition-colors text-sm font-medium">
                                    Είσοδος / Εγγραφή
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col justify-center items-center gap-2 text-center">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} CINE CGP. All rights reserved.
                    </p>
                    <div className="text-gray-400 font-medium text-sm mt-2">
                        Christos Tzampazis, Panagiotis Bekiaris, Giorgos Stylianopoulos
                    </div>
                </div>
            </div>
        </footer>
    );
}
