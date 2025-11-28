
import React, { useMemo } from 'react';
import type { Student } from '../types';
import { Status } from '../types';
import { UsersIcon, SparklesIcon } from './icons';

interface AnalyticsDashboardProps {
  students: Student[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ students }) => {
  // 1. Calculate Basic KPIs
  const kpis = useMemo(() => {
    const total = students.length;
    const onHold = students.filter(s => s.status === Status.ON_HOLD).length;
    return { total, onHold };
  }, [students]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Analytics Overview</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Real-time insights into student tracking.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-purple-600 p-6 rounded-2xl shadow-lg shadow-purple-200 dark:shadow-none text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-100">Total Students</p>
              <p className="text-3xl font-bold mt-1">{kpis.total}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl text-white">
              <UsersIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-purple-100">
            <span className="font-medium mr-1">Live</span> data from directory
          </div>
        </div>

        <div className="bg-orange-500 p-6 rounded-2xl shadow-lg shadow-orange-200 dark:shadow-none text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-100">Active On Hold</p>
              <p className="text-3xl font-bold mt-1">{kpis.onHold}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl text-white">
              <SparklesIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-orange-100">
            Requires follow-up
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
