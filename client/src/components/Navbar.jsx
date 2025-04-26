import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-xl font-bold text-indigo-600">
                                IntelliDash
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center">
                        {user ? (
                            <button
                                onClick={logout}
                                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Logout
                            </button>
                        ) : (
                            <div className="flex space-x-4">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 