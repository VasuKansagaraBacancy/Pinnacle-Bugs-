export type BugStatus = 'Not Fixed' | 'Under Process' | 'Developer Fixed' | 'Fixed';

export type Assignee = 'Alpesh' | 'Paras' | 'Kreya' | 'Devang' | 'Palak';

export const ASSIGNEES: Assignee[] = ['Alpesh', 'Paras', 'Kreya', 'Devang', 'Palak'];

export const STATUSES: BugStatus[] = ['Not Fixed', 'Under Process', 'Developer Fixed', 'Fixed'];

export interface Bug {
  id: string;
  description: string;
  image_urls: string[];
  status: BugStatus;
  assignee: Assignee;
  date: string; // ISO date string YYYY-MM-DD
  created_at: string;
  updated_at: string;
}

export interface CreateBugPayload {
  description: string;
  image_urls?: string[];
  status: BugStatus;
  assignee: Assignee;
  date: string;
}

export interface UpdateBugPayload extends Partial<CreateBugPayload> {}
