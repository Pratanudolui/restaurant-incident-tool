'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, Loader2, CheckCircle, Zap } from 'lucide-react';

const CATEGORIES = ['POS Issue', 'Delivery Delay', 'Inventory', 'Kitchen Equipment', 'Customer Complaint', 'Staff Issue', 'Other'];
const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];
const SEVERITY_COLORS = { Low: 'text-green-400', Medium: 'text-yellow-400', High: 'text-orange-400', Critical: 'text-red-400' };

export default function ReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', category: '', store_location: '', severity: '',
    reported_at: new Date().toISOString().slice(0, 16)
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.category) e.category = 'Category is required';
    if (!form.store_location.trim()) e.store_location = 'Store location is required';
    if (!form.severity) e.severity = 'Severity is required';
    if (!form.reported_at) e.reported_at = 'Date/time is required';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setAiSummary(data.ai_summary || '');
        setSuccess(true);
        setTimeout(() => router.push('/dashboard'), 3000);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (success) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-10 max-w-lg w-full text-center">
        <CheckCircle className="text-green-400 mx-auto mb-4" size={56} />
        <h2 className="text-2xl font-bold text-white mb-2">Incident Reported!</h2>
        <p className="text-slate-400 mb-4">Redirecting to dashboard...</p>
        {aiSummary && (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 text-left mt-4">
            <div className="flex items-center gap-2 mb-2"><Zap size={14} className="text-orange-400" /><span className="text-orange-300 text-sm font-semibold">AI Summary</span></div>
            <p className="text-slate-300 text-sm">{aiSummary}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-1">Report an Incident</h1>
          <p className="text-slate-400 text-sm mb-8">Fill out all fields. AI will auto-generate a summary.</p>

          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="text-slate-300 text-sm font-medium mb-1 block">Incident Title *</label>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="e.g. POS Terminal 3 Unresponsive" />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="text-slate-300 text-sm font-medium mb-1 block">Description *</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                rows={4} className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                placeholder="Describe what happened in detail..." />
              {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
            </div>

            {/* Category + Severity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 text-sm font-medium mb-1 block">Category *</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors">
                  <option value="">Select...</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
              </div>
              <div>
                <label className="text-slate-300 text-sm font-medium mb-1 block">Severity *</label>
                <select value={form.severity} onChange={e => setForm({...form, severity: e.target.value})}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors">
                  <option value="">Select...</option>
                  {SEVERITIES.map(s => <option key={s} className={SEVERITY_COLORS[s]}>{s}</option>)}
                </select>
                {errors.severity && <p className="text-red-400 text-xs mt-1">{errors.severity}</p>}
              </div>
            </div>

            {/* Store + DateTime */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 text-sm font-medium mb-1 block">Store Location *</label>
                <input value={form.store_location} onChange={e => setForm({...form, store_location: e.target.value})}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="e.g. Downtown #042" />
                {errors.store_location && <p className="text-red-400 text-xs mt-1">{errors.store_location}</p>}
              </div>
              <div>
                <label className="text-slate-300 text-sm font-medium mb-1 block">Date & Time *</label>
                <input type="datetime-local" value={form.reported_at} onChange={e => setForm({...form, reported_at: e.target.value})}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors" />
                {errors.reported_at && <p className="text-red-400 text-xs mt-1">{errors.reported_at}</p>}
              </div>
            </div>

            <button onClick={handleSubmit} disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg shadow-orange-500/25">
              {loading ? <><Loader2 size={18} className="animate-spin" /> Submitting & Generating AI Summary...</> : <><Send size={18} /> Submit Incident Report</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}