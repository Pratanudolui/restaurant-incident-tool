'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Filter, RefreshCw, AlertTriangle, Clock, CheckCircle, XCircle, Zap, Trash2, ChevronDown } from 'lucide-react';

const CATEGORIES = ['All', 'POS Issue', 'Delivery Delay', 'Inventory', 'Kitchen Equipment', 'Customer Complaint', 'Staff Issue', 'Other'];
const SEVERITIES = ['All', 'Low', 'Medium', 'High', 'Critical'];
const STATUSES = ['All', 'Open', 'In Progress', 'Resolved', 'Closed'];

const SEVERITY_BADGE = {
  Low: 'bg-green-500/20 text-green-400 border-green-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  High: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Critical: 'bg-red-500/20 text-red-400 border-red-500/30'
};

const STATUS_BADGE = {
  Open: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'In Progress': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
  Closed: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
};

const STATUS_ICONS = { Open: AlertTriangle, 'In Progress': Clock, Resolved: CheckCircle, Closed: XCircle };

export default function DashboardPage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: 'All', severity: 'All', status: 'All', search: '' });
  const [expandedId, setExpandedId] = useState(null);

  const fetchIncidents = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v && v !== 'All') params.append(k, v); });
    const res = await fetch(`/api/incidents?${params}`);
    const data = await res.json();
    setIncidents(data);
    setLoading(false);
  }, [filters]);

  useEffect(() => { fetchIncidents(); }, [fetchIncidents]);

  const updateStatus = async (id, status) => {
    await fetch(`/api/incidents/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    fetchIncidents();
  };

  const deleteIncident = async (id) => {
    if (!confirm('Delete this incident?')) return;
    await fetch(`/api/incidents/${id}`, { method: 'DELETE' });
    fetchIncidents();
  };

  const stats = {
    total: incidents.length,
    open: incidents.filter(i => i.status === 'Open').length,
    critical: incidents.filter(i => i.severity === 'Critical').length,
    resolved: incidents.filter(i => i.status === 'Resolved').length,
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-2 transition-colors text-sm">
              <ArrowLeft size={14} /> Home
            </Link>
            <h1 className="text-3xl font-bold text-white">Incident Dashboard</h1>
          </div>
          <Link href="/report" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all hover:scale-105">
            + New Incident
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'text-white' },
            { label: 'Open', value: stats.open, color: 'text-blue-400' },
            { label: 'Critical', value: stats.critical, color: 'text-red-400' },
            { label: 'Resolved', value: stats.resolved, color: 'text-green-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
              <p className="text-slate-400 text-sm mb-1">{label}</p>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mb-6">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-48 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                placeholder="Search incidents..." />
            </div>
            {[['category', CATEGORIES], ['severity', SEVERITIES], ['status', STATUSES]].map(([key, opts]) => (
              <select key={key} value={filters[key]} onChange={e => setFilters({...filters, [key]: e.target.value})}
                className="bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 capitalize">
                {opts.map(o => <option key={o}>{o}</option>)}
              </select>
            ))}
            <button onClick={fetchIncidents} className="bg-slate-700 border border-slate-600 text-slate-300 hover:text-white rounded-xl px-4 py-2.5 transition-colors">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Incidents List */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading incidents...</div>
        ) : incidents.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <AlertTriangle size={48} className="mx-auto mb-3 opacity-30" />
            <p>No incidents found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {incidents.map(incident => {
              const StatusIcon = STATUS_ICONS[incident.status] || AlertTriangle;
              const isExpanded = expandedId === incident.id;
              return (
                <div key={incident.id} className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
                  <div className="p-5 cursor-pointer hover:bg-slate-750" onClick={() => setExpandedId(isExpanded ? null : incident.id)}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${SEVERITY_BADGE[incident.severity]}`}>
                            {incident.severity}
                          </span>
                          <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${STATUS_BADGE[incident.status]}`}>
                            <StatusIcon size={10} />{incident.status}
                          </span>
                          <span className="text-xs text-slate-500 bg-slate-700 px-2.5 py-1 rounded-full">{incident.category}</span>
                        </div>
                        <h3 className="text-white font-semibold text-base truncate">{incident.title}</h3>
                        <p className="text-slate-400 text-sm mt-0.5">{incident.store_location} · {new Date(incident.reported_at).toLocaleString()}</p>
                      </div>
                      <ChevronDown size={16} className={`text-slate-400 mt-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-slate-700 p-5 space-y-4">
                      <p className="text-slate-300 text-sm leading-relaxed">{incident.description}</p>
                      {incident.ai_summary && (
                        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Zap size={12} className="text-orange-400" />
                            <span className="text-orange-300 text-xs font-semibold">AI Summary</span>
                          </div>
                          <p className="text-slate-300 text-sm">{incident.ai_summary}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-slate-400 text-sm">Update Status:</span>
                        {['Open','In Progress','Resolved','Closed'].map(s => (
                          <button key={s} onClick={() => updateStatus(incident.id, s)}
                            className={`text-xs px-3 py-1.5 rounded-lg border transition-all hover:scale-105 ${incident.status === s ? STATUS_BADGE[s] + ' opacity-100' : 'border-slate-600 text-slate-400 hover:text-white'}`}>
                            {s}
                          </button>
                        ))}
                        <button onClick={() => deleteIncident(incident.id)}
                          className="ml-auto text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}