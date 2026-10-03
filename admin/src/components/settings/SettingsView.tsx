import React, { useState } from 'react';
import {
  Settings,
  Shield,
  History,
  RotateCcw,
  CheckCircle,
  Bell,
  Globe,
  Sliders,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export const SettingsView: React.FC = () => {
  const { auditLogs, resetToFactoryDefaults, notify, currentRole } = useAdmin();

  // Settings State
  const [currency, setCurrency] = useState('AED');
  const [vatRate, setVatRate] = useState(5);
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [leadTimeHours, setLeadTimeHours] = useState(2);
  const [cancellationWindow, setCancellationWindow] = useState(4);
  const [emirates, setEmirates] = useState({
    Dubai: true,
    AbuDhabi: true,
    Sharjah: true,
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    notify('Platform operating configurations updated successfully', 'success');
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo data back to clean factory seed state?')) {
      resetToFactoryDefaults();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">System Settings & Audit Logs</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure operations rules, tax compliance, dispatch automation, and view security logs
          </p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3.5 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Factory Data</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Operations Configuration */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-4">
              <Sliders className="w-4 h-4 text-sky-600" />
              Operations & Regional Rules
            </h3>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Operating Currency
                  </label>
                  <input
                    type="text"
                    value={currency}
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-700 cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-400">United Arab Emirates Dirham</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    UAE VAT Standard (%)
                  </label>
                  <input
                    type="number"
                    value={vatRate}
                    onChange={(e) => setVatRate(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-sky-500/20"
                  />
                  <span className="text-[10px] text-slate-400">Federal Tax Authority compliance</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Min. Lead Time (Hours)
                  </label>
                  <input
                    type="number"
                    value={leadTimeHours}
                    onChange={(e) => setLeadTimeHours(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Free Cancellation Window (Hours)
                  </label>
                  <input
                    type="number"
                    value={cancellationWindow}
                    onChange={(e) => setCancellationWindow(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Active Service Coverage Emirates
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emirates.Dubai}
                      onChange={(e) => setEmirates({ ...emirates, Dubai: e.target.checked })}
                      className="w-4 h-4 text-sky-600 rounded"
                    />
                    <span>Dubai (Marina, Business Bay, Downtown, JLT, Palm)</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emirates.AbuDhabi}
                      onChange={(e) => setEmirates({ ...emirates, AbuDhabi: e.target.checked })}
                      className="w-4 h-4 text-sky-600 rounded"
                    />
                    <span>Abu Dhabi (Al Reem, Yas Island, Corniche)</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emirates.Sharjah}
                      onChange={(e) => setEmirates({ ...emirates, Sharjah: e.target.checked })}
                      className="w-4 h-4 text-sky-600 rounded"
                    />
                    <span>Sharjah (Al Majaz, Al Nahda)</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoDispatch}
                    onChange={(e) => setAutoDispatch(e.target.checked)}
                    className="w-4 h-4 text-sky-600 rounded"
                  />
                  <div>
                    <span className="font-semibold block">Smart Cleaner Proximity Matching</span>
                    <span className="text-[11px] text-slate-400">
                      Auto-suggest available maids based on neighborhood cluster
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
                >
                  Save Platform Settings
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Security & Real-Time Audit Log */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-sm">Real-Time Audit Log</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                {auditLogs.length} events logged
              </span>
            </div>

            <div className="space-y-3 mt-4 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 text-xs flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                      {log.action.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">{log.changeDelta || log.details}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/40">
                    <span>Role: <strong className="text-slate-600 font-medium">{log.userRole || log.role || 'Admin'}</strong></span>
                    <span>Target: <strong className="text-slate-600 font-mono">{log.targetEntity || log.target || log.entityId}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
