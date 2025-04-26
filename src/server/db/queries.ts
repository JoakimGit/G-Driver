import "server-only";

import { db } from "@/server/db";
import { files_table, folders_table } from "@/server/db/schema";
import { and, eq, isNull } from "drizzle-orm";

export const QUERIES = {
  getAllParentsForFolder: async (folderId: number) => {
    const parents = [];
    let currentId: number | null = folderId;

    while (currentId !== null) {
      const [folder] = await db
        .select()
        .from(folders_table)
        .where(eq(folders_table.id, currentId));

      if (!folder) break;

      parents.unshift(folder);
      currentId = folder.parent;
    }
    return parents;
  },
  getSubFoldersByFolderId: (folderId: number) => {
    return db
      .select()
      .from(folders_table)
      .where(eq(folders_table.parent, folderId))
      .orderBy(folders_table.name);
  },
  getFilesByFolderId: (folderId: number) => {
    return db
      .select()
      .from(files_table)
      .where(eq(files_table.parent, folderId))
      .orderBy(files_table.name);
  },
  getFolderById: async (folderId: number) => {
    const folder = await db
      .select()
      .from(folders_table)
      .where(eq(folders_table.id, folderId));
    return folder[0];
  },
  getRootFolderForUser: async (userId: string) => {
    const [folder] = await db
      .select()
      .from(folders_table)
      .where(
        and(eq(folders_table.ownerId, userId), isNull(folders_table.parent)),
      );
    return folder;
  },
};
