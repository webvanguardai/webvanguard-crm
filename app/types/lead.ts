export type Sector =
  | 'Spa/Beauty'
  | 'Real Estate'
  | 'Restaurant'
  | 'Barbershop'
  | 'Fitness'
  | 'Dental'
  | 'Photography'
  | 'Café'
  | 'Other';

export type Source =
  | 'Google Maps'
  | 'Instagram'
  | 'Walking'
  | 'Facebook'
  | 'Referral'
  | 'Other';

export type Level = 'Cold' | 'Warm' | 'Hot';

export type Status =
  | 'New'
  | 'Contacted'
  | 'Replied'
  | 'Negotiating'
  | 'Closed'
  | 'Discarded';

export type Plan =
  | 'Starter'
  | 'Launch'
  | 'Growth'
  | 'Premium';

export interface Lead {
  id: string;
  businessName: string;
  sector: Sector;
  contactName: string;
  phone: string;
  email: string;
  instagram: string;
  source: Source;
  level: Level;
  status: Status;
  demoUrl: string;
  proposalUrl: string;
  assignedPlan: Plan;
  priceQuoted: number;
  lastContact: string;
  notes: string;
  createdAt: string;
}

export type LeadFormData = Omit<Lead, 'id' | 'createdAt'>;
