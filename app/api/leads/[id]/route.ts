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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body: LeadFormData = await request.json();
  const leads = readLeads();
  const index = leads.findIndex((l) => l.id === params.id);

  if (index === -1) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }

  leads[index] = { ...leads[index], ...body };
  writeLeads(leads);

  return NextResponse.json(leads[index]);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const leads = readLeads();
  const index = leads.findIndex((l) => l.id === params.id);

  if (index === -1) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }

  const deleted = leads.splice(index, 1)[0];
  writeLeads(leads);

  return NextResponse.json(deleted);
}
