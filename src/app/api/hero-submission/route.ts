import { NextResponse } from 'next/server';

const SCRIPT_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbybbQ6VDZ3Rz6d4GPgO98GGESJgKgQhmhimr2dKCRyfRox0BJR5vsIRAnBHacT5nEYdWQ/exec';

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const response = await fetch(SCRIPT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        mobile: payload.mobile,
        class: payload.class,
        batch: payload.batch ?? payload.prefer_batch,
        subject: payload.subject,
        prefer_batch: payload.prefer_batch,
      }),
    });

    const responseText = await response.text();
    let result: { success?: boolean; message?: string };

    try {
      result = JSON.parse(responseText);
    } catch {
      result = {
        success: response.ok,
        message: responseText,
      };
    }

    if (!result.success) {
      throw new Error(result.message || 'Google Script rejected the submission');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Hero submission failed', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || 'Unknown error' },
      { status: 500 }
    );
  }
}
