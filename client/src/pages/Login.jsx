import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, user, token } = useAuth();
    
    const [email, setEmail] = useState(location.state?.email || '');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Clear location state after using email
    useEffect(() => {
        if (location.state?.email) {
            // Clear the state but keep the email in the form
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    // Check if user is already logged in
    useEffect(() => {
        if (user && token) {
            // Navigate to the intended page or dashboard
            const intendedPath = location.state?.from || '/dashboard';
            navigate(intendedPath, { replace: true });
        }
    }, [user, token, navigate, location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('Attempting login with:', { email });
            const response = await login(email, password);
            console.log('Login response:', response);
            
            if (response && response.data && response.data.token) {
                console.log('Login successful, token received');
                // The AuthContext will handle navigation
                return;
            } else {
                console.error('Invalid login response:', response);
                setError('Login failed. Please try again.');
            }
        } catch (err) {
            console.error('Login error:', err);
            if (err.response) {
                if (err.response.status === 401) {
                    setError('Invalid email or password. Please try again.');
                } else if (err.response.status === 400) {
                    setError(err.response.data.error || 'Invalid login data. Please check your input.');
                } else if (err.response.status === 500) {
                    setError('Server error. Please try again later.');
                } else {
                    setError('An error occurred. Please try again.');
                }
            } else if (err.message) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-md w-full space-y-8">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                >
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Or{' '}
                        <button
                            onClick={() => navigate('/register')}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            create a new account
                        </button>
                    </p>
                </motion.div>

                <motion.form
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 space-y-6"
                    onSubmit={handleSubmit}
                >
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg shadow-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <button
                                type="button"
                                onClick={() => navigate('/forgot-password')}
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Forgot your password?
                            </button>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : null}
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </motion.form>
            </div>
        </motion.div>
    );
};

export default Login; 