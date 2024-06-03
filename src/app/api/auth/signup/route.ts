import { User, readUsersFromFile, writeUsersToFile } from '../../../../lib/file-utils';
import { v4 as uuidv4 } from 'uuid';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {

  const body = await req.json();
  const { email, password, name, image } = body;

  if (!email || !password || !name) {
    return NextResponse.json({ error: 'Email, password, and name are required' }, { status: 400 });
  }

  const users = await readUsersFromFile();

  const existingUser = users.find((user: User) => user.email === email);
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  const newUser: User = {
    id: uuidv4(),
    email,
    password,
    name,
    image,
  };

  users.push(newUser);
  await writeUsersToFile(users);

  return NextResponse.json(newUser, { status: 201 });
}