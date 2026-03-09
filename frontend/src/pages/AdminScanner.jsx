import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import axiosClient from "../lib/axios";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";

export default function AdminScanner() {
    const { token, user } = useStateContext();
    const navigate = useNavigate();
    
    const [scanResult, setScanResult] = useState(null); // {status: 'success'|'error', message: '', data: null}
    const [isScanning, setIsScanning] = useState(true);
    const scannerRef = useRef(null);
    const processingRef = useRef(false); // Ref to prevent double-scanning the same code rapidly

    useEffect(() => {
        if (!token || user?.is_admin === 0) {
            navigate('/');
            return;
        }

        const scanner = new Html5QrcodeScanner(
            "reader",
            { 
                fps: 10, 
                qrbox: {width: 250, height: 250},
                supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
                rememberLastUsedCamera: true
            },
            false
        );
        
        scannerRef.current = scanner;

        scanner.render(
            (decodedText) => {
                if (processingRef.current) return;
                handleScan(decodedText);
            },
            (error) => {
                // Ignore frequent scan errors
            }
        );

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear html5QrcodeScanner. ", error);
                });
            }
        };
    }, [token]);

    const handleScan = async (reference) => {
        processingRef.current = true;
        
        // Pause the scanner visual if possible, or just ignore new codes via the ref
        try {
            const res = await axiosClient.post('/admin/scan', { reference });
            setScanResult({
                status: 'success',
                message: res.data.message || 'Access Granted. Ticket Valid!',
                data: res.data.booking
            });
            
            // Auto reset after 5 seconds
            setTimeout(() => {
                resetScanner();
            }, 5000);
            
        } catch (error) {
            const msg = error.response?.data?.message || 'Error communicating with server.';
            const booking = error.response?.data?.booking || null;
            
            setScanResult({
                status: 'error',
                message: msg,
                data: booking
            });
            
            // Auto reset after 5 seconds
            setTimeout(() => {
                resetScanner();
            }, 5000);
        }
    };

    const resetScanner = () => {
        setScanResult(null);
        processingRef.current = false;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-8 pb-12">
            <div className="container mx-auto px-4 max-w-2xl flex-1 flex flex-col">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Ticket Scanner</h1>
                    <p className="text-gray-500 mt-2">Point scanner at guest's QR code to verify entrance.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex-1 flex flex-col">
                    
                    {/* Scanner Video Area */}
                    <div className={`relative ${scanResult ? 'hidden' : 'block'}`}>
                        <div id="reader" className="w-full text-center border-none"></div>
                        <style>{`
                            #reader {
                                background-color: #111827;
                                color: #ffffff;
                                padding: 2rem 0;
                            }
                            #reader a {
                                color: #a78bfa !important;
                                text-decoration: underline;
                            }
                            #reader button {
                                background-color: #7c3aed !important;
                                color: white !important;
                                border: none !important;
                                padding: 0.5rem 1rem !important;
                                border-radius: 0.5rem !important;
                                font-weight: bold !important;
                                margin-top: 10px;
                                cursor: pointer;
                                transition: background-color 0.2s;
                            }
                            #reader button:hover {
                                background-color: #6d28d9 !important;
                            }
                            #reader select {
                                background-color: #374151 !important;
                                color: white !important;
                                border: 1px solid #4b5563 !important;
                                padding: 0.5rem !important;
                                border-radius: 0.5rem !important;
                                margin-bottom: 10px;
                            }
                        `}</style>
                    </div>

                    {/* Result Area */}
                    {scanResult && (
                        <div className={`p-8 flex-1 flex flex-col items-center justify-center text-center animate-fade-in-up ${scanResult.status === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                            
                            {scanResult.status === 'success' ? (
                                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-inner mx-auto mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-12 h-12">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </div>
                            ) : (
                                <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 shadow-inner mx-auto mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-12 h-12">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            )}
                            
                            <h2 className={`text-3xl font-black mb-2 ${scanResult.status === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                                {scanResult.message}
                            </h2>

                            {scanResult.data && (
                                <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200 w-full text-left">
                                    <div className="mb-4 pb-4 border-b border-gray-100">
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Guest</p>
                                        <p className="text-lg font-bold text-gray-900">{scanResult.data.user?.name}</p>
                                    </div>
                                    <div className="mb-4 pb-4 border-b border-gray-100">
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Movie</p>
                                        <p className="text-lg font-bold text-gray-900">{scanResult.data.screening?.movie?.title}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Hall</p>
                                            <p className="font-bold text-gray-900">{scanResult.data.screening?.hall?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Seats</p>
                                            <p className="font-bold text-indigo-600">{scanResult.data.seat_count}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button 
                                onClick={resetScanner}
                                className="mt-8 px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition"
                            >
                                Tap to Scan Next
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
