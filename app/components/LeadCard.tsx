'use client';

import { Lead } from '@/app/types/lead';
import { useState } from 'react';

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

function getDaysSince(dateStr: string): number {
  if (!dateStr) return 999;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getFollowUpBadge(lead: Lead): { text: string; className: string } | null {
  const days = getDaysSince(lead.lastContact);
  if (lead.level === 'Hot' && days >= 2) {
    return { text: '🚨 URGENT', className: 'bg-red-500 text-white animate-pulse' };
  }
  if (lead.level === 'Warm' && days >= 7) {
    return { text: '⚡ Follow up', className: 'bg-yellow-500 text-black' };
  }
  if (lead.level === 'Cold' && days >= 14) {
    return { text: '📧 Follow up', className: 'bg-blue-500 text-white' };
  }
  return null;
}

const levelColors: Record<string, string> = {
  Hot: 'bg-red-900/40 text-red-400 border-red-700',
  Warm: 'bg-yellow-900/40 text-yellow-400 border-yellow-700',
  Cold: 'bg-blue-900/40 text-blue-400 border-blue-700',
};

const statusColors: Record<string, string> = {
  New: 'bg-zinc-700 text-zinc-300',
  Contacted: 'bg-blue-900 text-blue-300',
  Replied: 'bg-purple-900 text-purple-300',
  Negotiating: 'bg-orange-900 text-orange-300',
  Closed: 'bg-green-900 text-green-300',
  Discarded: 'bg-zinc-800 text-zinc-500',
};

const levelEmoji: Record<string, string> = {
  Hot: '🔴',
  Warm: '🟡',
  Cold: '❄️',
};

export default function LeadCard({ lead, onEdit, onDelete }: LeadCardProps) {
  const [copied, setCopied] = useState(false);
  const followUp = getFollowUpBadge(lead);

  const whatsappMsg = `Hi ${lead.contactName || lead.businessName}, I came across ${lead.businessName} and love what you do. I actually built a website concept for you — would love to show you. No strings attached: ${lead.proposalUrl || lead.demoUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(whatsappMsg).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDelete = () => {
    if (confirm(`Delete ${lead.businessName}?`)) {
      onDelete(lead.id);
    }
  };

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 flex flex-col gap-3 hover:border-copper/50 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-white text-base truncate">{lead.businessName}</h3>
            {followUp && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${followUp.className}`}>
                {followUp.text}
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-400 mt-0.5">{lead.sector}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${levelColors[lead.level]}`}>
            {levelEmoji[lead.level]} {lead.level}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[lead.status]}`}>
            {lead.status}
          </span>
        </div>
      </div>

      {/* Contact */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-400">
        {lead.contactName && <span>👤 {lead.contactName}</span>}
        {lead.phone && (
          <a href={`tel:${lead.phone}`} className="hover:text-copper transition-colors">
            📞 {lead.phone}
          </a>
        )}
        {lead.instagram && <span>📸 {lead.instagram}</span>}
      </div>

      {/* Plan & Price */}
      {(lead.assignedPlan || lead.priceQuoted) && (
        <div className="flex items-center gap-3 text-sm">
          {lead.assignedPlan && (
            <span className="bg-copper/20 text-copper border border-copper/30 px-2 py-0.5 rounded-lg text-xs font-semibold">
              {lead.assignedPlan}
            </span>
          )}
          {lead.priceQuoted > 0 && (
            <span className="text-zinc-300 font-semibold">AED {lead.priceQuoted.toLocaleString()}</span>
          )}
          {lead.lastContact && (
            <span className="text-zinc-500 text-xs ml-auto">
              Last: {new Date(lead.lastContact).toLocaleDateString('en-AE', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>
      )}

      {/* Links */}
      {(lead.demoUrl || lead.proposalUrl) && (
        <div className="flex gap-3 text-xs">
          {lead.demoUrl && (
            <a
              href={lead.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
            >
              🌐 Demo
            </a>
          )}
          {lead.proposalUrl && (
            <a
              href={lead.proposalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-copper hover:text-copper/80 underline underline-offset-2"
            >
              📄 Proposal
            </a>
          )}
        </div>
      )}

      {/* Notes */}
      {lead.notes && (
        <p className="text-xs text-zinc-500 italic border-t border-zinc-700 pt-2 line-clamp-2">
          {lead.notes}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-zinc-700">
        <button
          onClick={handleCopy}
          className={`flex-1 text-xs py-2 rounded-lg font-medium transition-all ${
            copied
              ? 'bg-green-700 text-green-200'
              : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300'
          }`}
        >
          {copied ? '✅ Copied!' : '📋 Copy WA Message'}
        </button>
        <button
          onClick={() => onEdit(lead)}
          className="px-4 py-2 text-xs bg-copper/20 hover:bg-copper/30 text-copper border border-copper/30 rounded-lg font-medium transition-colors"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-2 text-xs bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/30 rounded-lg transition-colors"
        >
          🗑
        </button>
      </div>
    </div>
  );
}
