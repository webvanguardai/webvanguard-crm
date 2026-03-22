'use client';

import { useState, useEffect, useCallback } from 'react';
import { Lead, LeadFormData, Level, Status } from '@/app/types/lead';
import StatsBar from '@/app/components/StatsBar';
import LeadCard from '@/app/components/LeadCard';
import LeadForm from '@/app/components/LeadForm';
import Modal from '@/app/components/Modal';
import PricingModal from '@/app/components/PricingModal';

const ALL = 'All';
const STORAGE_KEY = 'webvanguard_crm_leads';

const SEED_LEADS: Lead[] = [
  {
    id: 'lead_001',
    businessName: 'Lumière Wellness Studio',
    sector: 'Spa/Beauty',
    contactName: 'Sophie Laurent',
    phone: '+971 50 123 4567',
    email: 'sophie@lumierewellness.ae',
    instagram: '@lumierewellnessdubai',
    source: 'Instagram',
    level: 'Hot',
    status: 'Contacted',
    demoUrl: 'https://lumiere-wellness.vercel.app',
    proposalUrl: 'https://webvanguardai.github.io/proposal-lumiere',
    assignedPlan: 'Growth',
    priceQuoted: 4500,
    lastContact: '2026-03-20',
    notes: 'Very interested. Said she\'ll review the demo this weekend. Follow up Monday.',
    createdAt: '2026-03-15T10:00:00.000Z',
  },
  {
    id: 'lead_002',
    businessName: 'Apex Properties Dubai',
    sector: 'Real Estate',
    contactName: 'Ahmed Al Mansoori',
    phone: '+971 55 987 6543',
    email: 'ahmed@apexproperties.ae',
    instagram: '@apexpropertiesdxb',
    source: 'Google Maps',
    level: 'Warm',
    status: 'Contacted',
    demoUrl: 'https://apex-properties.vercel.app',
    proposalUrl: 'https://webvanguardai.github.io/proposal-apex-properties',
    assignedPlan: 'Premium',
    priceQuoted: 8000,
    lastContact: '2026-03-14',
    notes: 'Met at a networking event. Has an old website but wants a full rebrand. Budget is flexible.',
    createdAt: '2026-03-10T09:00:00.000Z',
  },
  {
    id: 'lead_003',
    businessName: 'Al Bayt Restaurant',
    sector: 'Restaurant',
    contactName: 'Omar Khalid',
    phone: '+971 4 321 9876',
    email: '',
    instagram: '@albaytuae',
    source: 'Walking',
    level: 'Cold',
    status: 'New',
    demoUrl: '',
    proposalUrl: '',
    assignedPlan: 'Starter',
    priceQuoted: 1500,
    lastContact: '2026-03-01',
    notes: 'Traditional Arabic restaurant in JBR. No website at all. Saw them on a walk. Needs basic landing page with menu and reservation form.',
    createdAt: '2026-03-01T14:00:00.000Z',
  },
];

function loadLeads(): Lead[] {
  if (typeof window === 'undefined') return SEED_LEADS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null as unknown as Lead[];
    return JSON.parse(raw) as Lead[];
  } catch {
    return null as unknown as Lead[];
  }
}

function saveLeads(leads: Lead[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch {
    console.error('Failed to save leads to localStorage');
  }
}

export default function Home() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState<Level | typeof ALL>(ALL);
  const [filterStatus, setFilterStatus] = useState<Status | typeof ALL>(ALL);
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | undefined>(undefined);
  const [showPricing, setShowPricing] = useState(false);

  const initLeads = useCallback(() => {
    const stored = loadLeads();
    if (stored === null) {
      // First run — seed with example data
      saveLeads(SEED_LEADS);
      setLeads(SEED_LEADS);
    } else {
      setLeads(stored);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    initLeads();
  }, [initLeads]);

  const handleSave = (data: LeadFormData) => {
    setLeads((prev) => {
      let updated: Lead[];
      if (editingLead) {
        updated = prev.map((l) =>
          l.id === editingLead.id ? { ...l, ...data } : l
        );
      } else {
        const newLead: Lead = {
          id: `lead_${Date.now()}`,
          ...data,
          createdAt: new Date().toISOString(),
        };
        updated = [...prev, newLead];
      }
      saveLeads(updated);
      return updated;
    });
    setShowForm(false);
    setEditingLead(undefined);
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setLeads((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      saveLeads(updated);
      return updated;
    });
  };

  const handleAddNew = () => {
    setEditingLead(undefined);
    setShowForm(true);
  };

  const handleExport = () => {
    const json = JSON.stringify(leads, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `webvanguard-leads-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = leads.filter((l) => {
    if (filterLevel !== ALL && l.level !== filterLevel) return false;
    if (filterStatus !== ALL && l.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        l.businessName.toLowerCase().includes(q) ||
        l.contactName.toLowerCase().includes(q) ||
        l.sector.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const levelFilters: (Level | typeof ALL)[] = [ALL, 'Hot', 'Warm', 'Cold'];
  const statusFilters: (Status | typeof ALL)[] = [ALL, 'New', 'Contacted', 'Replied', 'Negotiating', 'Closed', 'Discarded'];

  const levelBtnClass = (f: string) =>
    `px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
      filterLevel === f
        ? 'bg-copper border-copper text-white'
        : 'bg-transparent border-zinc-600 text-zinc-400 hover:border-zinc-400'
    }`;

  const statusBtnClass = (f: string) =>
    `px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
      filterStatus === f
        ? 'bg-copper border-copper text-white'
        : 'bg-transparent border-zinc-600 text-zinc-400 hover:border-zinc-400'
    }`;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur border-b border-zinc-800 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                <span className="text-copper">Web</span>Vanguard CRM
              </h1>
              <p className="text-xs text-zinc-500">Dubai Lead Tracker</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="px-3 py-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-xl transition-colors"
                title="Export leads as JSON backup"
              >
                📥 Export
              </button>
              <button
                onClick={() => setShowPricing(true)}
                className="px-3 py-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-xl transition-colors"
              >
                💰 Plans
              </button>
              <button
                onClick={handleAddNew}
                className="px-4 py-2 text-sm font-bold bg-copper hover:bg-copper/80 text-white rounded-xl transition-colors"
              >
                + Lead
              </button>
            </div>
          </div>

          {/* Search */}
          <input
            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-copper transition-colors placeholder-zinc-500 mb-3"
            placeholder="🔍 Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Level filters */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {levelFilters.map((f) => (
              <button key={f} className={levelBtnClass(f)} onClick={() => setFilterLevel(f)}>
                {f === 'Hot' ? '🔴 Hot' : f === 'Warm' ? '🟡 Warm' : f === 'Cold' ? '❄️ Cold' : 'All'}
              </button>
            ))}
            <div className="w-px bg-zinc-700 mx-1 shrink-0" />
            {statusFilters.map((f) => (
              <button key={f} className={statusBtnClass(f)} onClick={() => setFilterStatus(f)}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-5">
        <StatsBar leads={leads} />

        {loading ? (
          <div className="text-center py-16 text-zinc-500">Loading leads...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-zinc-400">No leads found</p>
            <button onClick={handleAddNew} className="mt-4 px-5 py-2 bg-copper text-white rounded-xl text-sm font-bold">
              Add your first lead
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((lead) => (
              <LeadCard key={lead.id} lead={lead} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* Lead Form Modal */}
      <Modal
        isOpen={showForm}
        title={editingLead ? `✏️ Edit: ${editingLead.businessName}` : '➕ Add New Lead'}
        onClose={() => { setShowForm(false); setEditingLead(undefined); }}
      >
        <LeadForm
          lead={editingLead}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingLead(undefined); }}
        />
      </Modal>

      {/* Pricing Modal */}
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </main>
  );
}
