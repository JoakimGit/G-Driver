import { mockFiles, mockFolders } from "@/lib/mock-data";
import { db } from "@/server/db";
import { files_table, folders_table } from "@/server/db/schema";

export default async function Sandbox() {
  return (
    <div>
      <form
        action={async () => {
          "use server";

          await db
            .insert(folders_table)
            .values(
              mockFolders.map((folder, index) => ({
                id: index + 1,
                name: folder.name,
                parent: index !== 0 ? 1 : null,
              })),
            );

            await db
            .insert(files_table)
            .values(
                mockFiles.map((file, index) => ({
                id: index + 1,
                name: file.name,
                size: parseFloat(file.size) * 1000,
                url: file.url,
                parent: (index % 3) +1,
              })),
            );
        }}
      >
        <button type="submit">Create file</button>
      </form>
    </div>
  );
}
