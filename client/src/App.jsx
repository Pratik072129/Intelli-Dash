import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Insights from './pages/Insights';
import AIHelper from './pages/AIHelper';
import ReportView from './pages/ReportView';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-8">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/upload"
                    element={
                      <ProtectedRoute>
                        <Upload />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/insights"
                    element={
                      <ProtectedRoute>
                        <Insights />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/ai-helper"
                    element={
                      <ProtectedRoute>
                        <AIHelper />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/reports"
                    element={
                      <ProtectedRoute>
                        <ReportView />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App; 