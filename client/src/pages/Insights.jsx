import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { data } from '../services/api';
import ChartCard from '../components/ChartCard';

const Insights = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsResponse, chartResponse] = await Promise.all([
          data.getStats(),
          data.getChartData('all')
        ]);
        setStats(statsResponse.data);
        setChartData(chartResponse.data);
      } catch (err) {
        setError('Failed to load insights data');
        console.error('Error fetching insights:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

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
            Data Insights
          </h1>
          <p className="text-xl text-gray-600">
            Analyze your data with interactive visualizations
          </p>
        </motion.div>

        {/* KPIs */}
        {stats && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {Object.entries(stats).map(([key, value], index) => (
              <motion.div
                key={key}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {key.replace(/_/g, ' ').toUpperCase()}
                </h3>
                <p className="text-3xl font-bold text-indigo-600">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Charts */}
        {chartData && Object.entries(chartData).map(([title, data], index) => (
          <motion.div
            key={title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="mb-8"
          >
            <ChartCard
              title={title}
              type={data.type || 'line'}
              data={data}
              options={data.options}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Insights; 