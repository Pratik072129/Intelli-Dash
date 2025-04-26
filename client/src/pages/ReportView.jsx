import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { report } from '../services/api';

const ReportView = () => {
    const location = useLocation();
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(location.state?.analytics || null);
    const [message, setMessage] = useState(location.state?.message || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Report Generation
                    </h1>
                    <p className="text-xl text-gray-600">
                        Generate detailed reports from your data
                    </p>
                </motion.div>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg shadow-sm mb-8"
                    >
                        {message}
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg shadow-sm mb-8"
                    >
                        {error}
                    </motion.div>
                )}

                {analytics ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white shadow-lg rounded-lg overflow-hidden"
                        >
                            <div className="px-4 py-5 sm:p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Data Summary
                                </h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-indigo-50 p-4 rounded-lg">
                                            <p className="text-sm text-indigo-600">Total Records</p>
                                            <p className="text-2xl font-bold text-indigo-900">{analytics.total_records}</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <p className="text-sm text-green-600">Features</p>
                                            <p className="text-2xl font-bold text-green-900">{analytics.features.length}</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Feature Summary</h3>
                                        <div className="space-y-2">
                                            {analytics.features.map((feature, index) => (
                                                <div key={index} className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">{feature.name}</span>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {feature.type}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white shadow-lg rounded-lg overflow-hidden"
                        >
                            <div className="px-4 py-5 sm:p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Generate Report
                                </h2>
                                <div className="space-y-6">
                                    <div className="flex flex-col space-y-4">
                                        <button
                                            onClick={() => setLoading(true)}
                                            disabled={loading}
                                            className={`w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white ${
                                                loading
                                                    ? 'bg-indigo-400 cursor-not-allowed'
                                                    : 'bg-indigo-600 hover:bg-indigo-700'
                                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
                                        >
                                            {loading ? (
                                                <motion.span
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                >
                                                    Generating Report...
                                                </motion.span>
                                            ) : (
                                                'Generate Report'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <p className="text-gray-500 mb-4">No data available for report generation</p>
                        <button
                            onClick={() => window.history.back()}
                            className="text-indigo-600 hover:text-indigo-500 font-medium"
                        >
                            Go back to upload data
                        </button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default ReportView; 