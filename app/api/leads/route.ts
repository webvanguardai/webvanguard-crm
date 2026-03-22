import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Lead, LeadFormData } from '@/app/types/lead';

const dataPath = path.join(process.cwd(), 'data', 'leads.json');

function readLeads(): Lead[] {
  try {
    const data = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeLeads(leads: Lead[]): void {
  fs.writeFileSync(dataPath, JSON.stringify(leads, null, 2));
}

export async function GET() {
  const leads = readLeads();
  return NextResponse.json(leads);
}

export async function POST(request: NextRequest) {
  const body: LeadFormData = await request.json();
  const leads = readLeads();

  const newLead: Lead = {
    id: `lead_${Date.now()}`,
    ...body,
    createdAt: new Date().toISOString(),
  };

  leads.push(newLead);
  writeLeads(leads);

  return NextResponse.json(newLead, { status: 201 });
}
