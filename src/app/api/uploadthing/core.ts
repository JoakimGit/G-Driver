import { QUERIES } from "@/server/db/queries";
import { MUTATIONS } from "@/server/db/mutations";
import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();

export const utapi = new UTApi();

export const appFileRouter = {
  // define a route for uploading images
  driveUploader: f({
    blob: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "8MB",
    },
  })
    .input(
      z.object({
        folderId: z.number(),
      }),
    )
    .middleware(async ({ input }) => {
      // check if user is authenticated before uploading
      const user = await auth();
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (!user.userId) throw new UploadThingError("Unauthorized");

      const folder = await QUERIES.getFolderById(input.folderId);
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (!folder) throw new UploadThingError("Unauthorized");

      if (folder.ownerId !== user.userId) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw new UploadThingError("Unauthorized");
      }

      // attach metadata available at 'onUploadComplete' callback
      return { userId: user.userId, folderId: input.folderId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);

      await MUTATIONS.createFile({
        name: file.name,
        size: file.size,
        url: file.ufsUrl,
        fileKey: file.key,
        parent: metadata.folderId,
        ownerId: metadata.userId,
      });

      // send data back to client side 'onClientUploadComplete' callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof appFileRouter;
