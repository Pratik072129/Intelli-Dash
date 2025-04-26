import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ChartCard = ({ title, type, data, options }) => {
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: title,
            },
        },
        ...options,
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            {type === 'line' ? (
                <Line options={chartOptions} data={data} />
            ) : (
                <Bar options={chartOptions} data={data} />
            )}
        </div>
    );
};

export default ChartCard; 