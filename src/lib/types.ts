export type BugStatus = 'Not Fixed' | 'Under Process' | 'Developer Fixed'| 'Ready for QA' | 'Developer Fixed'| 'Ready for QA' | 'Fixed';

export type Assignee = 'Alpesh' | 'Paras' | 'Kreya' | 'Devang' | 'Palak';

export type Priority = 'High' | 'Medium' | 'Low';

export type Environment = 'UAT' | 'Live' | 'Demo' | 'Test';

export type Priority = 'High' | 'Medium' | 'Low';

export type Environment = 'UAT' | 'Live' | 'Demo' | 'Test';

export const ASSIGNEES: Assignee[] = ['Alpesh', 'Paras', 'Kreya', 'Devang', 'Palak'];

// Phone numbers for SMS notifications (Indian numbers with +91)
export const ASSIGNEE_PHONES: Partial<Record<Assignee, string>> = {
  Alpesh: '+919898894419',
  Paras:  '+919173144876',
  Kreya:  '+918460536731',
  Devang: '+919023873972',
  Palak: '+919662543742'

};

export const STATUSES: BugStatus[] = ['Not Fixed', 'Under Process', 'Developer Fixed', 'Ready for QA', 'Developer Fixed', 'Ready for QA', 'Fixed'];

export const PRIORITIES: Priority[] = ['High', 'Medium', 'Low'];

export const ENVIRONMENTS: Environment[] = ['UAT', 'Live', 'Demo', 'Test'];

export const PRIORITIES: Priority[] = ['High', 'Medium', 'Low'];

export const ENVIRONMENTS: Environment[] = ['UAT', 'Live', 'Demo', 'Test'];

export interface Bug {
  id: string;
  description: string;
  image_urls: string[];
  status: BugStatus;
  assignee: Assignee;
  priority: Priority;
  environment: Environment;
  date: string;
  ticket_number?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateBugPayload {
  description: string;
  image_urls?: string[];
  status: BugStatus;
  assignee: Assignee;
  priority: Priority;
  environment: Environment;
  date: string;
  ticket_number?: string | null;
}

export interface UpdateBugPayload extends Partial<CreateBugPayload> {}
