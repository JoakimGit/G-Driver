"use client";

import { Button } from "@/components/ui/button";
import { UploadButton } from "@/components/uploadthing";
import { createFolder } from "@/server/actions";
import type { DB_FileType, DB_FolderType } from "@/server/db/schema";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { CheckCircle, ChevronRight, LucideCircleX } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileRow } from "./file-row";
import { FolderRow } from "./folder-row";

export function DriveContents(props: {
  files: Array<DB_FileType>;
  folders: Array<DB_FolderType>;
  parents: Array<DB_FolderType>;
  currentFolderId: number;
}) {
  const [showCreateFolderInput, setShowCreateFolderInput] = useState(false);
  const [folderName, setFolderName] = useState("");
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            {props.parents.map((folder) => (
              <div key={folder.id} className="flex items-center">
                <Link
                  href={`/drive/${folder.id}`}
                  className="text-gray-300 hover:text-white"
                >
                  {folder.name === "Root" ? "GDrive" : folder.name}
                </Link>
                <ChevronRight className="mx-2 text-gray-500" size={16} />
              </div>
            ))}
          </div>

          <div>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
        <div className="mb-4 rounded-lg bg-gray-800 shadow-xl">
          <div className="border-b border-gray-700 px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
              <div className="col-span-5">Name</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-4">Created At</div>
              <div className="col-span-1"></div>
            </div>
          </div>
          <ul>
            {props.folders.map((folder) => (
              <FolderRow key={folder.id} folder={folder} />
            ))}
            {props.files.map((file) => (
              <FileRow key={file.id} file={file} />
            ))}
          </ul>
        </div>

        {showCreateFolderInput ? (
          <div className="mb-4 flex items-center">
            <input
              type="text"
              placeholder="Folder Name"
              className="w-full max-w-md rounded-md border border-gray-700 bg-gray-800 p-2 text-gray-200"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />

            <Button
              type="submit"
              variant="link"
              onClick={() => {
                if (!folderName) return;
                setFolderName("");
                void createFolder(props.currentFolderId, folderName);
              }}
            >
              <CheckCircle className="size-6 text-green-400">
                Create Folder
              </CheckCircle>
            </Button>

            <Button
              type="submit"
              variant="link"
              onClick={() => setShowCreateFolderInput(false)}
            >
              <LucideCircleX className="size-6 text-yellow-400" />
            </Button>
          </div>
        ) : (
          <Button
            className="mb-4"
            variant="secondary"
            onClick={() => setShowCreateFolderInput(true)}
          >
            Create Folder
          </Button>
        )}

        <UploadButton
          content={{ button: <span className="z-50">Upload File</span> }}
          className="!items-start"
          endpoint="driveUploader"
          onClientUploadComplete={() => router.refresh()}
          input={{ folderId: props.currentFolderId }}
        />
      </div>
    </div>
  );
}
