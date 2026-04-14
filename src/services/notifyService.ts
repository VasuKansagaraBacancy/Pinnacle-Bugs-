import { Assignee, ASSIGNEE_PHONES } from '@/lib/types';

interface BugSummary {
  assignee: Assignee;
  description: string;
  ticket_number?: string | null;
  priority: string;
  environment: string;
}

export async function notifyAssignee(bug: BugSummary): Promise<void> {
  const phone = ASSIGNEE_PHONES[bug.assignee];
  if (!phone) return; // no phone registered for this assignee, skip silently

  const ticket = bug.ticket_number ? `#${bug.ticket_number}` : 'General Bug';
  const desc =
    bug.description.length > 100
      ? bug.description.slice(0, 100) + '...'
      : bug.description;

  const body =
    `તમને બગ મળ્યો છે 😊
Ticket: ${ticket}
Priority: ${bug.priority}
Env: ${bug.environment}
કૃપા કરીને સમય મળે ત્યારે ચેક કરો 🙏`;

  try {
    const res = await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: phone, body }),
    });
    if (!res.ok) {
      const data = await res.json();
      console.error('[SMS] Failed to send:', data.error);
    } else {
      console.log('[SMS] Sent to', bug.assignee, phone);
    }
  } catch (err) {
    console.error('[SMS] Network error:', err);
  }
}
