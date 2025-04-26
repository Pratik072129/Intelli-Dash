import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { upload } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user, token } = useAuth();
    const navigate = useNavigate();

    // Check authentication on component mount
    useEffect(() => {
        if (!user || !token) {
            navigate('/login', { 
                state: { 
                    from: '/upload',
                    message: 'Please log in to upload files'
                }
            });
        }
    }, [user, token, navigate]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
                setFile(selectedFile);
                setError('');
                setSuccess('');
                
                // Preview first few rows
                const reader = new FileReader();
                reader.onload = (e) => {
                    const text = e.target.result;
                    const rows = text.split('\n').slice(0, 6).join('\n');
                    setPreview(rows);
                };
                reader.readAsText(selectedFile);
            } else {
                setError('Please upload a CSV file');
                setFile(null);
                setPreview(null);
            }
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file to upload');
            return;
        }

        if (!user || !token) {
            navigate('/login', { 
                state: { 
                    from: '/upload',
                    message: 'Please log in to upload files'
                }
            });
            return;
        }

        setUploading(true);
        setError('');
        setSuccess('');

        try {
            const response = await upload.uploadFile(file);
            setSuccess('File uploaded successfully!');
            setFile(null);
            setPreview(null);
            
            // Navigate to ReportView after successful upload
            navigate('/reports', { 
                state: { 
                    message: 'File uploaded successfully!'
                }
            });
        } catch (err) {
            console.error('Upload error:', err);
            if (err.response?.status === 401) {
                navigate('/login', { 
                    state: { 
                        from: '/upload',
                        message: 'Session expired. Please log in again.'
                    }
                });
            } else {
                setError(err.response?.data?.error || 'Error uploading file. Please try again.');
            }
        } finally {
            setUploading(false);
        }
    };

    // Show loading state while checking authentication
    if (!user || !token) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
        >
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Upload Data
                    </h1>
                    <p className="text-xl text-gray-600">
                        Upload your CSV file to generate reports
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white shadow-lg rounded-lg overflow-hidden"
                >
                    <div className="px-4 py-5 sm:p-6">
                        <div className="space-y-6">
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg shadow-sm"
                                    >
                                        {error}
                                    </motion.div>
                                )}
                                
                                {success && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg shadow-sm"
                                    >
                                        {success}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                className="relative"
                            >
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload CSV File
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors duration-200">
                                    <div className="space-y-1 text-center">
                                        <motion.svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 48 48"
                                            aria-hidden="true"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            <path
                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </motion.svg>
                                        <div className="flex text-sm text-gray-600">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                            >
                                                <span>Upload a file</span>
                                                <input
                                                    id="file-upload"
                                                    name="file-upload"
                                                    type="file"
                                                    className="sr-only"
                                                    accept=".csv"
                                                    onChange={handleFileChange}
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            CSV up to 10MB
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            <AnimatePresence>
                                {preview && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-700">
                                            Preview
                                        </label>
                                        <div className="mt-1">
                                            <pre className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-60 border border-gray-200">
                                                {preview}
                                            </pre>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <button
                                    type="button"
                                    onClick={handleUpload}
                                    disabled={!file || uploading}
                                    className={`w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white ${
                                        !file || uploading
                                            ? 'bg-indigo-400 cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-700'
                                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
                                >
                                    {uploading ? (
                                        <motion.span
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >
                                            Uploading...
                                        </motion.span>
                                    ) : (
                                        'Upload'
                                    )}
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Upload; 