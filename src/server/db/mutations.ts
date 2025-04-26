import "server-only";

import { eq } from "drizzle-orm";
import { db } from ".";
import { type DB_FileType, files_table, folders_table } from "./schema";

export const MUTATIONS = {
  createFile: async (file: Omit<DB_FileType, "id" | "createdAt">) => {
    return await db.insert(files_table).values(file);
  },
  onboardUser: async function (userId: string) {
    const [rootFolder] = await db
      .insert(folders_table)
      .values({
        name: "Root",
        parent: null,
        ownerId: userId,
      })
      .$returningId();

    const rootFolderId = rootFolder!.id;

    await db.insert(folders_table).values([
      {
        name: "Trash",
        parent: rootFolderId,
        ownerId: userId,
      },
      {
        name: "Shared",
        parent: rootFolderId,
        ownerId: userId,
      },
      {
        name: "Documents",
        parent: rootFolderId,
        ownerId: userId,
      },
    ]);

    return rootFolderId;
  },
  createFolder: async (folder: {
    name: string;
    parent: number;
    ownerId: string;
  }) => {
    return await db.insert(folders_table).values(folder);
  },
  renameFolder: async (folderId: number, newName: string) => {
    return await db
      .update(folders_table)
      .set({ name: newName })
      .where(eq(folders_table.id, folderId));
  },
};
