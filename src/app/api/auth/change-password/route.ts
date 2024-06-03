import { NextRequest, NextResponse } from 'next/server';
import { readUsersFromFile, writeUsersToFile } from '../../../../lib/file-utils';
import { getSession, useSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Current and new passwords are required' }, { status: 400 });
  }

  const users = await readUsersFromFile();
  const userIndex = users.findIndex((user) => user.email === session.user?.email);

  if (userIndex === -1) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const user = users[userIndex];

  if (user.password !== currentPassword) {
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 403 });
  }

  users[userIndex].password = newPassword;
  await writeUsersToFile(users);

  return NextResponse.json({ message: 'Password updated successfully' });
}
