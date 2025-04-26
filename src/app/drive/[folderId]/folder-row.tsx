"use client";

import { Button } from "@/components/ui/button";
import { renameFolder } from "@/server/actions";
import type { DB_FolderType } from "@/server/db/schema";
import {
  CheckCircleIcon,
  Folder,
  LucideCircleX,
  PencilIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const FolderRow = ({ folder }: { folder: DB_FolderType }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newFolderName, setNewFolderName] = useState(folder.name);

  const handleRenameFolder = async () => {
    if (newFolderName === folder.name) return;

    try {
      setIsLoading(true);
      await renameFolder(folder.id, newFolderName);
    } catch (error) {
      console.error("Error renaming folder:", error);
    } finally {
      setIsLoading(false);
      setIsEditMode(false);
      setNewFolderName(newFolderName);
    }
  };

  return (
    <li
      key={folder.id}
      className="hover:bg-gray-750 border-b border-gray-700 px-6 py-4"
    >
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-6 flex items-center">
          {isEditMode ? (
            <>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="rounded border bg-gray-800 px-2 py-1 text-gray-100"
              />
              {isEditMode && (
                <Button
                  variant="link"
                  size="icon"
                  onClick={() => setIsEditMode(false)}
                  disabled={isLoading}
                >
                  <LucideCircleX className="size-6 text-yellow-400" />
                </Button>
              )}
            </>
          ) : (
            <Link
              href={`/drive/${folder.id}`}
              className="flex items-center text-gray-100 hover:text-blue-400"
            >
              <Folder className="mr-3" size={20} />
              {folder.name}
            </Link>
          )}
        </div>
        <div className="col-span-4 text-gray-400" />
        <div className="col-span-1 text-gray-400"></div>
        <div className="col-span-1 text-gray-400">
          {isEditMode ? (
            <Button
              variant="icon"
              size="icon"
              onClick={handleRenameFolder}
              disabled={isLoading}
            >
              <CheckCircleIcon className="size-6 text-green-400" />
            </Button>
          ) : (
            <Button
              variant="icon"
              size="icon"
              onClick={() => setIsEditMode((prev) => !prev)}
              disabled={isLoading}
            >
              <PencilIcon className="size-6 text-yellow-400" />
            </Button>
          )}
        </div>
      </div>
    </li>
  );
};
