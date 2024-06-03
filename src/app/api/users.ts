import { NextApiRequest, NextApiResponse } from 'next';
import { readUsersFromFile, writeUsersToFile } from '../../lib/file-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const users = await readUsersFromFile();
    return res.status(200).json(users);
  }

  if (req.method === 'POST') {
    const users = await readUsersFromFile();
    const newUser = req.body;
    users.push(newUser);
    await writeUsersToFile(users);
    return res.status(201).json(newUser);
  }

  return res.status(405).end();
}
