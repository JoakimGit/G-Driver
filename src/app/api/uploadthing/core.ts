import { MUTATIONS } from "@/server/db/queries";
import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const appFileRouter = {
  // define a route for uploading images
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // check if user is authenticated before uploading
      const user = await auth();
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (!user.userId) throw new UploadThingError("Unauthorized");

      // attach metadata available at 'onUploadComplete' callback
      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);

      await MUTATIONS.createFile({ ...file, parent: 1 });

      // send data back to client side 'onClientUploadComplete' callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof appFileRouter;
