import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  BarChart3,
  Layers,
  Calendar,
  DollarSign,
  CalendarDays,
  Sparkles,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  BarChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  LAST_30_DAYS_DATA,
  DailyAnalyticsPoint,
  getAnalyticsSummary,
} from '../../data/analyticsData';

type ViewMode = 'combined' | 'revenue' | 'bookings';
type TimeRange = '30d' | '14d' | '7d';
type ServiceFilter = 'all' | 'residential' | 'deep' | 'move';

export const RevenueTrendChart: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('combined');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>('all');
  const [showTargetLine, setShowTargetLine] = useState<boolean>(true);

  // Filter data based on time range
  const filteredData = useMemo(() => {
    let days = 30;
    if (timeRange === '14d') days = 14;
    if (timeRange === '7d') days = 7;
    return LAST_30_DAYS_DATA.slice(-days);
  }, [timeRange]);

  // Compute metrics for current filtered range
  const summary = useMemo(() => getAnalyticsSummary(filteredData), [filteredData]);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data: DailyAnalyticsPoint = payload[0]?.payload;
    if (!data) return null;

    const avgValue = data.totalBookings > 0 ? Math.round(data.totalRevenue / data.totalBookings) : 0;

    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-xl shadow-xl p-3.5 border border-slate-700/80 text-xs min-w-[220px] z-50">
        <div className="flex items-center justify-between pb-2 border-b border-slate-700/60 mb-2">
          <div className="font-semibold text-slate-200">
            {data.dayOfWeek}, {data.date}, 2026
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {data.totalBookings} orders
          </span>
        </div>

        {/* Primary Metrics */}
        <div className="space-y-1.5 mb-2.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              Total Revenue:
            </span>
            <span className="font-bold text-sky-400 font-mono tabular-nums">
              AED {data.totalRevenue.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Booking Volume:
            </span>
            <span className="font-bold text-emerald-400 font-mono tabular-nums">
              {data.totalBookings} bookings
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
            <span>Avg Order Value:</span>
            <span className="font-mono text-slate-300 tabular-nums">AED {avgValue}</span>
          </div>
        </div>

        {/* Service Breakdown */}
        <div className="pt-2 border-t border-slate-800 text-[11px] space-y-1 text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-400">Residential:</span>
            <span className="font-mono tabular-nums">AED {data.residentialRevenue} ({data.residentialBookings})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Deep Clean:</span>
            <span className="font-mono tabular-nums">AED {data.deepCleaningRevenue} ({data.deepCleaningBookings})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Move In/Out:</span>
            <span className="font-mono tabular-nums">AED {data.moveInOutRevenue} ({data.moveInOutBookings})</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex flex-col">
      {/* Header Bar with Title & View Selectors */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sky-600" />
              <span>30-Day Revenue & Booking Volume</span>
            </h3>
            <span className="text-xs text-slate-500 hidden sm:inline">
              · Powered by Recharts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time telemetry showing daily gross revenue (AED), dispatch volume, and category distribution across the UAE.
          </p>
        </div>

        {/* Action Controls: View mode tabs & Time range */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Segmented Switcher */}
          <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('combined')}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === 'combined'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Combined Dual-Axis
            </button>
            <button
              onClick={() => setViewMode('revenue')}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === 'revenue'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Revenue (AED)
            </button>
            <button
              onClick={() => setViewMode('bookings')}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === 'bookings'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bookings Volume
            </button>
          </div>

          {/* Time Range Selector */}
          <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {(['30d', '14d', '7d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1.5 rounded-lg transition ${
                  timeRange === r
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r === '30d' ? '30 Days' : r === '14d' ? '14 Days' : '7 Days'}
              </button>
            ))}
          </div>

          {/* Target Line Toggle */}
          <button
            onClick={() => setShowTargetLine(!showTargetLine)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 ${
              showTargetLine
                ? 'border-sky-200 bg-sky-50 text-sky-700'
                : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
            title="Toggle daily target benchmark line"
          >
            <span className={`w-2 h-2 rounded-full ${showTargetLine ? 'bg-sky-600' : 'bg-slate-300'}`} />
            Target
          </button>
        </div>
      </div>

      {/* KPI Micro Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 py-3 px-4 bg-slate-50/70 rounded-xl border border-slate-100">
        <div>
          <span className="text-[11px] text-slate-500 font-medium block">Period Revenue</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-extrabold text-slate-900 font-mono tabular-nums">
              AED {summary.totalRevenue.toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +18.4% MoM
          </span>
        </div>

        <div>
          <span className="text-[11px] text-slate-500 font-medium block">Total Bookings</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-extrabold text-slate-900 font-mono tabular-nums">
              {summary.totalBookings}
            </span>
            <span className="text-xs text-slate-400">orders</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +14.2% MoM
          </span>
        </div>

        <div>
          <span className="text-[11px] text-slate-500 font-medium block">Daily Average</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-extrabold text-slate-900 font-mono tabular-nums">
              {summary.avgDailyBookings}
            </span>
            <span className="text-xs text-slate-400">bkgs · AED {summary.avgDailyRevenue.toLocaleString()}</span>
          </div>
          <span className="text-[10px] text-slate-400">Target: 30 / AED 5,000</span>
        </div>

        <div>
          <span className="text-[11px] text-slate-500 font-medium block">Avg Order Value (AOV)</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-extrabold text-slate-900 font-mono tabular-nums">
              AED {summary.avgOrderValue}
            </span>
          </div>
          <span className="text-[10px] text-slate-500">
            Peak: {summary.bestDay.date} (AED {summary.bestDay.totalRevenue.toLocaleString()})
          </span>
        </div>
      </div>

      {/* Main Recharts Area Container */}
      <div className="w-full h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'combined' ? (
            <ComposedChart
              data={filteredData}
              margin={{ top: 10, right: 15, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCombinedRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="date"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#E2E8F0' }}
                interval={timeRange === '30d' ? 2 : 0}
              />
              <YAxis
                yAxisId="left"
                stroke="#0284c7"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `AED ${(val / 1000).toFixed(1)}k`}
                domain={[0, 9000]}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#10b981"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={[0, 55]}
                tickFormatter={(val) => `${val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={32}
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}
              />

              {showTargetLine && (
                <ReferenceLine
                  yAxisId="left"
                  y={5000}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Daily Revenue Target (AED 5k)',
                    position: 'insideTopRight',
                    fill: '#94a3b8',
                    fontSize: 10,
                  }}
                />
              )}

              <Area
                yAxisId="left"
                type="monotone"
                dataKey="totalRevenue"
                name="Gross Revenue (AED)"
                stroke="#0284c7"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorCombinedRevenue)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="totalBookings"
                name="Bookings Volume"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#10b981', strokeWidth: 1, stroke: '#ffffff' }}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          ) : viewMode === 'revenue' ? (
            <AreaChart
              data={filteredData}
              margin={{ top: 10, right: 15, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorResidential" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorDeep" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorMove" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorOther" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="date"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#E2E8F0' }}
                interval={timeRange === '30d' ? 2 : 0}
              />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `AED ${(val / 1000).toFixed(1)}k`}
                domain={[0, 9000]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={32}
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}
              />

              {showTargetLine && (
                <ReferenceLine
                  y={5000}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Daily Target (AED 5,000)',
                    position: 'insideTopRight',
                    fill: '#94a3b8',
                    fontSize: 10,
                  }}
                />
              )}

              {/* Stacked Areas for Category Distribution */}
              <Area
                type="monotone"
                dataKey="residentialRevenue"
                stackId="1"
                name="Residential (AED)"
                stroke="#0284c7"
                fill="url(#colorResidential)"
              />
              <Area
                type="monotone"
                dataKey="deepCleaningRevenue"
                stackId="1"
                name="Deep Cleaning (AED)"
                stroke="#6366f1"
                fill="url(#colorDeep)"
              />
              <Area
                type="monotone"
                dataKey="moveInOutRevenue"
                stackId="1"
                name="Move In / Out (AED)"
                stroke="#f59e0b"
                fill="url(#colorMove)"
              />
              <Area
                type="monotone"
                dataKey="otherRevenue"
                stackId="1"
                name="Specialized & Add-ons (AED)"
                stroke="#06b6d4"
                fill="url(#colorOther)"
              />
            </AreaChart>
          ) : (
            <BarChart
              data={filteredData}
              margin={{ top: 10, right: 15, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="date"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#E2E8F0' }}
                interval={timeRange === '30d' ? 2 : 0}
              />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={[0, 50]}
                tickFormatter={(val) => `${val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={32}
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}
              />

              {showTargetLine && (
                <ReferenceLine
                  y={30}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Target: 30 Bookings / Day',
                    position: 'insideTopRight',
                    fill: '#94a3b8',
                    fontSize: 10,
                  }}
                />
              )}

              <Bar
                dataKey="residentialBookings"
                name="Residential Cleaning"
                fill="#0284c7"
                stackId="a"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="deepCleaningBookings"
                name="Deep Cleaning"
                fill="#6366f1"
                stackId="a"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="moveInOutBookings"
                name="Move In / Out"
                fill="#f59e0b"
                stackId="a"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="otherBookings"
                name="Specialized & Add-ons"
                fill="#06b6d4"
                stackId="a"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer Details: Category Revenue Contribution */}
      <div className="pt-3 mt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-700">Category Share:</span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
            Residential <strong className="text-slate-800 font-mono tabular-nums">{summary.categoryShare.residential}%</strong>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            Deep Clean <strong className="text-slate-800 font-mono tabular-nums">{summary.categoryShare.deepCleaning}%</strong>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Move In/Out <strong className="text-slate-800 font-mono tabular-nums">{summary.categoryShare.moveInOut}%</strong>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
            Other <strong className="text-slate-800 font-mono tabular-nums">{summary.categoryShare.other}%</strong>
          </span>
        </div>

        <div className="text-[11px] text-slate-400">
          Showing data for <span className="text-slate-600 font-medium">Dubai, Abu Dhabi & Sharjah</span>
        </div>
      </div>
    </div>
  );
};
