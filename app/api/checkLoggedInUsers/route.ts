export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('xaena_db');
    const usersCollection = db.collection('login_user');

    const cookieStore = cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json({ loggedInUsers: [] });
    }

    const loggedInUsers = await usersCollection
      .find({ sessionToken, loggedIn: true })
      .toArray();

    console.log('Logged in users:', loggedInUsers);

    return NextResponse.json({
      loggedInUsers: loggedInUsers.map((user) => user.username),
    });
  } catch (error) {
    console.error('Error checking logged-in users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

