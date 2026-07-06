import { FieldValue } from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from 'next/server';

import { getAdminFirestore } from '@/lib/firebase/admin';
import { verifyRequestUser } from '@/lib/server/firebase-request-auth';

const allowedMoods = new Set([
  'Happy',
  'Calm',
  'Okay',
  'Anxious',
  'Sad',
  'Angry',
  'Lonely',
  'Tired',
  'Overwhelmed',
  'Numb',
]);

const allowedLifeAreas = new Set([
  'Work',
  'Relationship',
  'Family',
  'Sleep',
  'Habits',
  'Digital usage',
  'Money',
  'Health',
  'Self-worth',
  'Other',
]);

export async function GET(request: NextRequest) {
  try {
    const decodedToken = await verifyRequestUser(request);
    if (!decodedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getAdminFirestore();
    const clientId = decodedToken.uid;

    const userDoc = await db.collection('users').doc(clientId).get();
    const userData = userDoc.data();

    if (!userData || userData.role !== 'client') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const entriesSnapshot = await db
      .collection('users')
      .doc(clientId)
      .collection('journalEntries')
      .orderBy('createdAt', 'desc')
      .get();

    const entries = entriesSnapshot.docs.map((doc) => mapJournalEntry(doc.id, doc.data()));

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch journal entries' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const decodedToken = await verifyRequestUser(request);
    if (!decodedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as {
      text?: unknown;
      mood?: unknown;
      lifeArea?: unknown;
      prompt?: unknown;
    };

    const text = typeof body.text === 'string' ? body.text.trim() : '';
    const mood = typeof body.mood === 'string' ? body.mood : '';
    const lifeArea = typeof body.lifeArea === 'string' ? body.lifeArea : '';
    const prompt =
      typeof body.prompt === 'string' && body.prompt.trim().length > 0
        ? body.prompt.trim()
        : undefined;

    if (!text || !allowedMoods.has(mood) || !allowedLifeAreas.has(lifeArea)) {
      return NextResponse.json(
        { error: 'A valid text, mood, and life area are required.' },
        { status: 400 },
      );
    }

    const db = getAdminFirestore();
    const clientId = decodedToken.uid;

    const userDoc = await db.collection('users').doc(clientId).get();
    const userData = userDoc.data();

    if (!userData || userData.role !== 'client') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const entryRef = db
      .collection('users')
      .doc(clientId)
      .collection('journalEntries')
      .doc();

    await entryRef.set({
      clientId,
      text,
      mood,
      lifeArea,
      prompt: prompt ?? null,
      metadata: {
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    const savedEntry = await entryRef.get();

    return NextResponse.json({
      entry: mapJournalEntry(savedEntry.id, savedEntry.data()),
    });
  } catch (error) {
    console.error('Error creating journal entry:', error);
    return NextResponse.json(
      { error: 'Failed to create journal entry' },
      { status: 500 },
    );
  }
}

function mapJournalEntry(id: string, data: FirebaseFirestore.DocumentData | undefined) {
  return {
    id,
    text: data?.text ?? '',
    mood: data?.mood ?? 'Okay',
    lifeArea: data?.lifeArea ?? 'Other',
    prompt: data?.prompt ?? undefined,
    createdAt:
      data?.createdAt?.toDate?.()?.toISOString() ??
      data?.metadata?.createdAt?.toDate?.()?.toISOString() ??
      new Date().toISOString(),
  };
}
