import { QUERIES } from "@/server/db/queries";
import { DriveContents } from "./drive-contents";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function GoogleDriveClone(props: {
  params: Promise<{ folderId: string }>;
}) {
  const session = await auth();

  if (!session.userId) {
    return redirect("/sign-in");
  }

  const params = await props.params;
  const parsedFolderId = parseInt(params.folderId, 10);

  if (isNaN(parsedFolderId)) {
    return <div>Invalid folder ID</div>;
  }

  const [folders, files, parents] = await Promise.all([
    QUERIES.getSubFoldersByFolderId(parsedFolderId),
    QUERIES.getFilesByFolderId(parsedFolderId),
    QUERIES.getAllParentsForFolder(parsedFolderId),
  ]);

  if (folders.some((folder) => folder.ownerId !== session.userId)) {
    return redirect("/sign-in");
  }

  return (
    <DriveContents
      files={files}
      folders={folders}
      parents={parents}
      currentFolderId={parsedFolderId}
    />
  );
}
