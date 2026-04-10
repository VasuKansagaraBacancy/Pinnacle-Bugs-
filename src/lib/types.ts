export type BugStatus = 'Not Fixed' | 'Under Process' | 'Developer Fixed'| 'Ready for QA' | 'Fixed';

export type Assignee = 'Alpesh' | 'Paras' | 'Kreya' | 'Devang' | 'Palak';

export type Priority = 'High' | 'Medium' | 'Low';

export type Environment = 'UAT' | 'Live' | 'Demo' | 'Test';

export const ASSIGNEES: Assignee[] = ['Alpesh', 'Paras', 'Kreya', 'Devang', 'Palak'];

export const STATUSES: BugStatus[] = ['Not Fixed', 'Under Process', 'Developer Fixed', 'Ready for QA', 'Fixed'];

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
}

export interface UpdateBugPayload extends Partial<CreateBugPayload> {}
