'use client';

import { Lead, LeadFormData, Sector, Source, Level, Status, Plan } from '@/app/types/lead';
import { useState } from 'react';

interface LeadFormProps {
  lead?: Lead;
  onSave: (data: LeadFormData) => void;
  onCancel: () => void;
}

const defaultForm: LeadFormData = {
  businessName: '',
  sector: 'Other',
  contactName: '',
  phone: '+971 ',
  email: '',
  instagram: '',
  source: 'Other',
  level: 'Cold',
  status: 'New',
  demoUrl: '',
  proposalUrl: '',
  assignedPlan: 'Starter',
  priceQuoted: 0,
  lastContact: new Date().toISOString().split('T')[0],
  notes: '',
};

const sectors: Sector[] = ['Spa/Beauty', 'Real Estate', 'Restaurant', 'Barbershop', 'Fitness', 'Dental', 'Photography', 'Café', 'Other'];
const sources: Source[] = ['Google Maps', 'Instagram', 'Walking', 'Facebook', 'Referral', 'Other'];
const levels: Level[] = ['Cold', 'Warm', 'Hot'];
const statuses: Status[] = ['New', 'Contacted', 'Replied', 'Negotiating', 'Closed', 'Discarded'];
const plans: { value: Plan; label: string }[] = [
  { value: 'Starter', label: 'Starter — AED 1,500' },
  { value: 'Launch', label: 'Launch — AED 2,500' },
  { value: 'Growth', label: 'Growth — AED 4,500' },
  { value: 'Premium', label: 'Premium — AED 8,000+' },
];

const levelEmoji: Record<Level, string> = { Cold: '🔴', Warm: '🟡', Hot: '🟢' };

const inputClass = 'w-full bg-zinc-800 border border-zinc-600 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-copper transition-colors placeholder-zinc-500';
const labelClass = 'block text-xs text-zinc-400 mb-1 font-medium';

export default function LeadForm({ lead, onSave, onCancel }: LeadFormProps) {
  const [form, setForm] = useState<LeadFormData>(
    lead
      ? {
          businessName: lead.businessName,
          sector: lead.sector,
          contactName: lead.contactName,
          phone: lead.phone,
          email: lead.email,
          instagram: lead.instagram,
          source: lead.source,
          level: lead.level,
          status: lead.status,
          demoUrl: lead.demoUrl,
          proposalUrl: lead.proposalUrl,
          assignedPlan: lead.assignedPlan,
          priceQuoted: lead.priceQuoted,
          lastContact: lead.lastContact,
          notes: lead.notes,
        }
      : defaultForm
  );

  const set = (key: keyof LeadFormData, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Business Name */}
        <div className="sm:col-span-2">
          <label className={labelClass}>Business Name *</label>
          <input
            className={inputClass}
            value={form.businessName}
            onChange={(e) => set('businessName', e.target.value)}
            placeholder="e.g. Lumière Wellness Studio"
            required
          />
        </div>

        {/* Sector */}
        <div>
          <label className={labelClass}>Sector</label>
          <select className={inputClass} value={form.sector} onChange={(e) => set('sector', e.target.value as Sector)}>
            {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Source */}
        <div>
          <label className={labelClass}>Source</label>
          <select className={inputClass} value={form.source} onChange={(e) => set('source', e.target.value as Source)}>
            {sources.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Contact Name */}
        <div>
          <label className={labelClass}>Contact Name</label>
          <input className={inputClass} value={form.contactName} onChange={(e) => set('contactName', e.target.value)} placeholder="e.g. Ahmed Al Mansoori" />
        </div>

        {/* Phone */}
        <div>
          <label className={labelClass}>Phone</label>
          <input className={inputClass} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+971 50 123 4567" />
        </div>

        {/* Email */}
        <div>
          <label className={labelClass}>Email</label>
          <input className={inputClass} type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="contact@business.ae" />
        </div>

        {/* Instagram */}
        <div>
          <label className={labelClass}>Instagram</label>
          <input className={inputClass} value={form.instagram} onChange={(e) => set('instagram', e.target.value)} placeholder="@businessname" />
        </div>

        {/* Level */}
        <div>
          <label className={labelClass}>Level</label>
          <select className={inputClass} value={form.level} onChange={(e) => set('level', e.target.value as Level)}>
            {levels.map((l) => <option key={l} value={l}>{levelEmoji[l]} {l}</option>)}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className={labelClass}>Status</label>
          <select className={inputClass} value={form.status} onChange={(e) => set('status', e.target.value as Status)}>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Demo URL */}
        <div>
          <label className={labelClass}>Demo URL</label>
          <input className={inputClass} value={form.demoUrl} onChange={(e) => set('demoUrl', e.target.value)} placeholder="https://demo.vercel.app" />
        </div>

        {/* Proposal URL */}
        <div>
          <label className={labelClass}>Proposal URL</label>
          <input className={inputClass} value={form.proposalUrl} onChange={(e) => set('proposalUrl', e.target.value)} placeholder="https://webvanguardai.github.io/proposal-..." />
        </div>

        {/* Plan */}
        <div>
          <label className={labelClass}>Assigned Plan</label>
          <select className={inputClass} value={form.assignedPlan} onChange={(e) => set('assignedPlan', e.target.value as Plan)}>
            {plans.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className={labelClass}>Price Quoted (AED)</label>
          <input className={inputClass} type="number" value={form.priceQuoted || ''} onChange={(e) => set('priceQuoted', Number(e.target.value))} placeholder="4500" />
        </div>

        {/* Last Contact */}
        <div>
          <label className={labelClass}>Last Contact</label>
          <input className={inputClass} type="date" value={form.lastContact} onChange={(e) => set('lastContact', e.target.value)} />
        </div>

        {/* Notes */}
        <div className="sm:col-span-2">
          <label className={labelClass}>Notes</label>
          <textarea
            className={`${inputClass} resize-none`}
            rows={3}
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            placeholder="Any relevant notes about this lead..."
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 py-3 bg-copper hover:bg-copper/80 text-white font-bold rounded-xl transition-colors"
        >
          {lead ? 'Save Changes' : 'Add Lead'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 font-medium rounded-xl transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
