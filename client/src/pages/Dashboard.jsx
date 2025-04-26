import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();

    const features = [
        {
            title: 'Upload Data',
            description: 'Upload your CSV file to generate reports',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
            ),
            link: '/upload'
        },
        {
            title: 'Reports',
            description: 'View and analyze your generated reports',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            link: '/reports'
        },
        {
            title: 'AI Helper',
            description: 'Get AI-powered insights about your data',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            ),
            link: '/ai-helper'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
                        Welcome back, {user?.email}
                    </h1>
                    <p className="text-xl text-gray-600">
                        What would you like to do today?
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link
                                to={feature.link}
                                className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
                                        {feature.icon}
                                    </div>
                                    <h2 className="ml-4 text-xl font-semibold text-gray-900">
                                        {feature.title}
                                    </h2>
                                </div>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 bg-white rounded-lg shadow-lg p-6"
                >
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        Recent Activity
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0">
                                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900">
                                    New analytics report generated
                                </p>
                                <p className="text-sm text-gray-500">
                                    2 hours ago
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Dashboard; 