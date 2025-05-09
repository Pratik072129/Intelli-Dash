import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

const KPIBox = ({ title, value, change, isPositive }) => {
    return (
        <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        {isPositive ? (
                            <ArrowUpIcon className="h-6 w-6 text-green-400" />
                        ) : (
                            <ArrowDownIcon className="h-6 w-6 text-red-400" />
                        )}
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                                {title}
                            </dt>
                            <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900">
                                    {value}
                                </div>
                                <div
                                    className={`ml-2 flex items-baseline text-sm font-semibold ${
                                        isPositive ? 'text-green-600' : 'text-red-600'
                                    }`}
                                >
                                    {change}
                                </div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KPIBox; 