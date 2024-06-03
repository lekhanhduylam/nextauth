import { promises as fs } from "fs";
import path from "path";

const usersFilePath = path.join(process.cwd(), "data/users.json");

export interface User {
	id?: string;
	name?: string;
	password?: string | number;
	email?: string;
	role?: string;
	image?: string;
  }

export const readUsersFromFile = async (): Promise<User[]> => {
  try {
    const data = await fs.readFile(usersFilePath, "utf-8");
    return JSON.parse(data) as User[];
  } catch (error: any) {
    if (error.code === "ENOENT") {
      // If file does not exist, return an empty array
      return [];
    }
    throw error;
  }
};

export const writeUsersToFile = async (users: User[]): Promise<void> => {
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), "utf-8");
};
