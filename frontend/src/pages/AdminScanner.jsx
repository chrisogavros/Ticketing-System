import { useState, useEffect, useRef } from "react";
import axiosClient from "../lib/axios";
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';

export default function EntryScanner() {
    const [identifier, setIdentifier] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [showScanner, setShowScanner] = useState(false);
    
    // We need to keep track of the scanner instance to clean it up
    const scannerRef = useRef(null);

    const handleScan = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        
        const searchValue = typeof e === 'string' ? e : identifier;
        if (!searchValue.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);
        
        // Stop the scanner if it's running when a scan is successful
        if (showScanner) {
            stopScanner();
        }

        axiosClient.get(`/admin/entry/verify?identifier=${encodeURIComponent(searchValue)}`)
            .then(({ data }) => {
                setResult(data);
                setIdentifier(""); // clear input for next scan
            })
            .catch((err) => {
                setError(err.response?.data?.message || "Σφάλμα κατά την αναζήτηση");
                // Don't close scanner on error so they can try taking another picture
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const startScanner = () => {
        setShowScanner(true);
        setError(null);
    };

    const stopScanner = () => {
        setShowScanner(false);
        if (scannerRef.current) {
            scannerRef.current.clear().catch(console.error);
            scannerRef.current = null;
        }
    };

    // Initialize scanner when showScanner becomes true
    useEffect(() => {
        if (showScanner) {
            const scanner = new Html5QrcodeScanner(
                "qr-reader",
                { 
                    fps: 10, 
                    qrbox: { width: 250, height: 250 },
                    supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
                    rememberLastUsedCamera: true
                },
                false
            );
            
            scanner.render(
                (decodedText) => {
                    // Success callback
                    setIdentifier(decodedText);
                    // Manually trigger the fetch since state update is async
                    handleScan(decodedText);
                },
                (errorMessage) => {
                    // Ignore scan errors as they happen constantly until a QR is found
                }
            );

            scannerRef.current = scanner;
        }

        // Cleanup on unmount or when scanner is closed
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(console.error);
                scannerRef.current = null;
            }
        };
    }, [showScanner]);

    const resetScan = () => {
        setResult(null);
        setError(null);
        setIdentifier("");
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 shadow-sm border border-purple-200">
                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/></svg>
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Είσοδος Επισκεπτών</h1>
                    <p className="mt-2 text-sm text-gray-500">Σαρώστε ή πληκτρολογήστε Email ή Τηλέφωνο</p>
                </div>

                {/* Scan Input Form (Hidden when showing success result) */}
                {!result?.bookings && (
                    <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-gray-100 mb-6">
                        
                        {/* QR Camera Toggle */}
                        <div className="mb-6">
                            {!showScanner ? (
                                <button
                                    onClick={startScanner}
                                    type="button"
                                    className="w-full flex justify-center items-center py-4 px-4 border-2 border-dashed border-purple-300 rounded-2xl text-purple-700 bg-purple-50 hover:bg-purple-100 font-bold transition-colors"
                                >
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    Σάρωση QR Code (Κάμερα)
                                </button>
                            ) : (
                                <div className="rounded-2xl overflow-hidden border-2 border-purple-500 relative">
                                    <div id="qr-reader" className="w-full bg-black"></div>
                                    <button
                                        onClick={stopScanner}
                                        type="button"
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 z-50"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="relative flex items-center mb-6">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium uppercase tracking-wider">ή</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        <form onSubmit={handleScan} className="space-y-6">
                            <div>
                                <label htmlFor="identifier" className="block text-sm font-bold text-gray-700 mb-2">
                                    Χειροκίνητη Εισαγωγή 
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                    </div>
                                    <input
                                        type="text"
                                        id="identifier"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-4 sm:text-lg border-2 border-gray-200 rounded-2xl focus:ring-0 focus:border-purple-500 transition-colors bg-gray-50 focus:bg-white"
                                        placeholder="Email / Κινητό / Κωδικός Κράτησης"
                                        autoFocus={!showScanner}
                                        required={!showScanner}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-md text-lg font-bold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70 transition-all active:scale-[0.98]"
                            >
                                {loading ? (
                                    <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : (
                                    "Αναζήτηση"
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm animate-pulse mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Ticket Modal/Card */}
                {result?.bookings && (
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-fade-in-up">
                        {/* Welcome Header */}
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-8 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-white opacity-10 rounded-full blur-lg"></div>
                            
                            <div className="relative z-10">
                                {result.user.avatar ? (
                                    <img src={result.user.avatar} alt={result.user.name} className="w-20 h-20 rounded-full mx-auto border-4 border-white shadow-md mb-3 object-cover"/>
                                ) : (
                                    <div className="w-20 h-20 rounded-full mx-auto border-4 border-white shadow-md mb-3 bg-white flex items-center justify-center text-3xl font-black text-green-600">
                                        {result.user.name.charAt(0)}{result.user.surname ? result.user.surname.charAt(0) : ''}
                                    </div>
                                )}
                                <h2 className="text-2xl font-black text-white tracking-tight">Καλωσήρθες,</h2>
                                <p className="text-green-50 text-xl font-bold mt-1">
                                    {result.user.name} {result.user.surname}
                                </p>
                            </div>
                        </div>

                        {/* Earliest Booking Details */}
                        <div className="p-6">
                            <div className="uppercase tracking-widest text-xs font-bold text-gray-400 mb-4 border-b pb-2">
                                Στοιχεια Κρατησης
                            </div>
                            
                            <div className="space-y-5">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Ταινία</p>
                                    <p className="text-xl font-bold text-gray-900 leading-tight">
                                        {result.bookings[0].screening.movie.title}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Αίθουσα</p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {result.bookings[0].screening.hall.name}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1 text-purple-600">Θέσεις</p>
                                        <div className="flex items-center justify-end gap-1">
                                            <span className="text-3xl font-black text-purple-600">
                                                {result.bookings[0].seat_count}
                                            </span>
                                            <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <p className="text-xs text-center text-gray-400 font-mono">
                                        Booking Ref: {result.bookings[0].booking_reference}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={resetScan}
                                className="mt-8 w-full py-4 text-center font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors active:scale-95"
                            >
                                Νέα Σάρωση
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
