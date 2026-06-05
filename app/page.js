'use client';
import { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ClipboardList, Plus, TrendingUp, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10" />
        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-full px-4 py-2 mb-6">
            <Zap size={14} className="text-orange-400" />
            <span className="text-orange-300 text-sm font-medium">AI-Powered Incident Management</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Restaurant Incident <span className="text-orange-400">Command Center</span>
          </h1>
          <p className="text-slate-400 text-xl mb-10 max-w-2xl mx-auto">
            Streamline your QSR operations. Report, track, and resolve incidents faster with intelligent automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/report" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg shadow-orange-500/25">
              <Plus size={20} /> Report Incident
            </Link>
            <Link href="/dashboard" className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105 border border-slate-600">
              <ClipboardList size={20} /> View Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', title: 'Real-Time Reporting', desc: 'Submit operational incidents instantly from any device with structured, validated forms.' },
            { icon: ClipboardList, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', title: 'Smart Dashboard', desc: 'Filter, search, and manage all incidents with status tracking and priority visibility.' },
            { icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', title: 'AI Summaries', desc: 'Claude AI auto-generates incident summaries and category recommendations on submission.' },
          ].map(({ icon: Icon, color, bg, title, desc }) => (
            <div key={title} className={`rounded-2xl border p-6 ${bg}`}>
              <Icon className={`${color} mb-3`} size={28} />
              <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}