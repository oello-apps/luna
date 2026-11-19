import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

interface ContactPayload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactPayload;
    const name = (body.name || '').trim();
    const email = (body.email || '').trim();
    const subject = (body.subject || '').trim();
    const message = (body.message || '').trim();

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: 'Please enter your name.' },
        { status: 400 }
      );
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!message || message.length < 10) {
      return NextResponse.json(
        { error: 'Please enter a message of at least 10 characters.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'Contact email service is not configured yet. Add RESEND_API_KEY to your environment variables to enable sending.',
        },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);
    const toEmail = process.env.CONTACT_TO_EMAIL || 'ebimakelvin31@gmail.com';
    const fromEmail =
      process.env.RESEND_FROM_EMAIL || 'Lune <onboarding@resend.dev>';

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: email,
      subject: subject ? `[Lune Contact] ${subject}` : `[Lune Contact] Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || 'General inquiry'}\n\n${message}`,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Failed to send message via Resend.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Unable to process your contact request.' },
      { status: 500 }
    );
  }
}
