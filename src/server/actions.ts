"use server";

import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { files_table } from "./db/schema";
import { auth } from "@clerk/nextjs/server";
import { utapi } from "@/app/api/uploadthing/core";
import { cookies } from "next/headers";
import { MUTATIONS } from "./db/mutations";

export const deleteFile = async (fileId: number) => {
  const session = await auth();
  if (!session.userId) {
    return { error: "User not authenticated" };
  }

  const [file] = await db
    .select()
    .from(files_table)
    .where(
      and(eq(files_table.id, fileId), eq(files_table.ownerId, session.userId)),
    );

  if (!file) {
    return { error: "File not found" };
  }

  const result = await utapi.deleteFiles(file.fileKey);

  if (!result.success) {
    return { error: "Failed to delete file from storage" };
  }

  const dbResult = await db
    .delete(files_table)
    .where(eq(files_table.id, fileId));

  if (dbResult[0].affectedRows === 0) {
    return { error: "Failed to delete file from database" };
  }

  // "hack" to force a refresh of the page
  const c = await cookies();
  c.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
};

export const createFolder = async (parentId: number, name: string) => {
  const session = await auth();
  if (!session.userId) {
    return { error: "User not authenticated" };
  }

  await MUTATIONS.createFolder({
    name,
    parent: parentId,
    ownerId: session.userId,
  });

  // "hack" to force a refresh of the page
  const c = await cookies();
  c.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
};

export const renameFolder = async (parentId: number, name: string) => {
  const session = await auth();
  if (!session.userId) {
    return { error: "User not authenticated" };
  }

  await MUTATIONS.renameFolder(parentId, name);

  // "hack" to force a refresh of the page
  const c = await cookies();
  c.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
};
