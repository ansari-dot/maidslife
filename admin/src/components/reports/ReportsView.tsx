import React, { useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  CalendarDays,
  Download,
  Users2,
  PieChart,
  Briefcase
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  Legend,
  Cell,
  PieChart as RechartsPieChart,
  Pie
} from 'recharts';
import { useAdmin } from '../../context/AdminContext';

export const ReportsView: React.FC = () => {
  const { bookings, cleaners, customers } = useAdmin();

  // Dynamic calculations based on context data
  const { totalRevenue, completedBookings, totalCustomers } = useMemo(() => {
    let rev = 0;
    let completed = 0;
    bookings.forEach(b => {
      if (b.status === 'completed' || b.paymentStatus === 'paid') {
        rev += b.totalAmount;
        completed++;
      }
    });
    return {
      totalRevenue: rev,
      completedBookings: completed,
      totalCustomers: customers.length,
    };
  }, [bookings, customers]);

  // Aggregate daily revenue dynamically from the actual bookings
  const dailyData = useMemo(() => {
    const dataMap: Record<string, { date: string; revenue: number; bookings: number }> = {};
    
    // Group bookings by date
    bookings.forEach(b => {
      const d = b.date || new Date().toISOString().split('T')[0];
      if (!dataMap[d]) {
        dataMap[d] = { date: d, revenue: 0, bookings: 0 };
      }
      dataMap[d].bookings += 1;
      if (b.status === 'completed' || b.paymentStatus === 'paid') {
        dataMap[d].revenue += b.totalAmount;
      }
    });

    return Object.values(dataMap)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-14); // Show last 14 days of dynamic data
  }, [bookings]);

  // Compute category distribution dynamically
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    bookings.forEach(b => {
      const cat = b.serviceName || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    const COLORS = ['#0284c7', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
    return Object.keys(counts).map((key, index) => ({
      name: key,
      value: counts[key],
      color: COLORS[index % COLORS.length]
    })).sort((a, b) => b.value - a.value).slice(0, 5); // top 5
  }, [bookings]);

  // Compute top cleaners dynamically
  const topCleaners = useMemo(() => {
    return [...cleaners]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  }, [cleaners]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            Dynamic Analytics & Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time financial summaries, volume tracking, and service distribution
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition active:scale-95">
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Top Metric KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:border-indigo-200 transition group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-100/50 to-transparent rounded-bl-full -z-10" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              AED {totalRevenue.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-indigo-600 font-medium mt-1">Calculated from completed/paid bookings</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:border-emerald-200 transition group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-100/50 to-transparent rounded-bl-full -z-10" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Jobs</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {completedBookings}
            </span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Total successfully serviced</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:border-amber-200 transition group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-100/50 to-transparent rounded-bl-full -z-10" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Customers</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {totalCustomers}
            </span>
          </div>
          <p className="text-[11px] text-amber-600 font-medium mt-1">Registered clients in DB</p>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-sky-500" />
                Revenue Trend (Last 14 Active Days)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Dynamically populated from bookings</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => {
                    const d = new Date(val);
                    return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
                  }}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `AED ${(val/1000).toFixed(0)}k`} 
                />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`AED ${value.toLocaleString()}`, 'Revenue']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Popularity Pie */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 flex flex-col">
          <div className="mb-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-purple-500" />
              Service Distribution
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Top services by volume</p>
          </div>
          <div className="h-48 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${value} bookings`, 'Volume']}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {categoryData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="truncate max-w-[120px]">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">Top Performing Cleaners</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Highest rated staff based on dynamic cleaner profiles</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-5">Staff Member</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Completed Jobs</th>
                <th className="py-3 px-5 text-right">Avg Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {topCleaners.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400">No cleaner data available</td>
                </tr>
              ) : (
                topCleaners.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <img src={c.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.fullName)}`} alt={c.fullName} className="w-7 h-7 rounded-full bg-slate-200" />
                        <span className="font-semibold text-slate-800">{c.fullName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{c.emirate}</td>
                    <td className="py-3 px-4 text-slate-900 font-mono">{c.completedJobs || 0}</td>
                    <td className="py-3 px-5 text-right">
                      <div className="flex items-center justify-end gap-1 font-bold text-amber-500 font-mono">
                        {c.rating.toFixed(2)} <span className="text-[10px]">★</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
