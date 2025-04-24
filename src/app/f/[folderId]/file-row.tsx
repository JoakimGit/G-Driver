import { Button } from "@/components/ui/button";
import { deleteFile } from "@/server/actions";
import type { DB_FileType, DB_FolderType } from "@/server/db/schema";
import { FileIcon, Folder, Trash2 } from "lucide-react";
import Link from "next/link";

export const FileRow = ({ file }: { file: DB_FileType }) => {
  return (
    <li
      key={file.id}
      className="hover:bg-gray-750 border-b border-gray-700 px-6 py-4"
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
            variant="ghost"
            size="icon"
            onClick={() => deleteFile(file.id)}
          >
            <Trash2 className="!size-6" />
          </Button>
        </div>
      </div>
    </li>
  );
};

export const FolderRow = ({ folder }: { folder: DB_FolderType }) => {
  return (
    <li
      key={folder.id}
      className="hover:bg-gray-750 border-b border-gray-700 px-6 py-4"
    >
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-6 flex items-center">
          <Link
            href={`/f/${folder.id}`}
            className="flex items-center text-gray-100 hover:text-blue-400"
          >
            <Folder className="mr-3" size={20} />
            {folder.name}
          </Link>
        </div>
        <div className="col-span-3 text-gray-400"></div>
        <div className="col-span-3 text-gray-400"></div>
      </div>
    </li>
  );
};
