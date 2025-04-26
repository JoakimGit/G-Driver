"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { deleteFile } from "@/server/actions";
import type { DB_FileType } from "@/server/db/schema";
import { FileIcon, Trash2 } from "lucide-react";
import { useState } from "react";

export const FileRow = ({ file }: { file: DB_FileType }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (fileId: number) => {
    try {
      setIsDeleting(true);
      await deleteFile(fileId);
    } catch (error) {
      console.error("Error deleting file:", error);
    }

    setIsDeleting(false);
  };

  return (
    <li
      key={file.id}
      className={cn(
        "hover:bg-gray-750 border-b border-gray-700 px-6 py-4",
        isDeleting && "opacity-50",
      )}
    >
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-5 flex items-center">
          <a
            href={file.url}
            className="flex items-center text-gray-100 hover:text-blue-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FileIcon className="mr-3" size={20} />
            {file.name}
          </a>
        </div>
        <div className="col-span-2 text-gray-400">{file.size}</div>
        <div className="col-span-4 text-gray-400">
          {file.createdAt.toUTCString()}
        </div>
        <div className="col-span-1 text-gray-400">
          <Button
            variant="icon"
            size="icon"
            onClick={() => handleDelete(file.id)}
            disabled={isDeleting}
          >
            <Trash2 className="size-6 text-red-400" />
          </Button>
        </div>
      </div>
    </li>
  );
};
