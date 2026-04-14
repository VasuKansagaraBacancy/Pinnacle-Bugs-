import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(req: NextRequest) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    return NextResponse.json({ error: 'Twilio credentials not configured' }, { status: 500 });
  }

  try {
    const { to, body } = await req.json();

    if (!to || !body) {
      return NextResponse.json({ error: 'Missing "to" or "body"' }, { status: 400 });
    }

    const client = twilio(accountSid, authToken);
    await client.messages.create({ body, from: fromNumber, to });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to send SMS';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
