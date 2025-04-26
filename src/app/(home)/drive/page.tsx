import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { QUERIES } from "@/server/db/queries";
import { MUTATIONS } from "@/server/db/mutations";

export default async function DrivePage() {
  const session = await auth();

  if (!session.userId) {
    return redirect("/sign-in");
  }

  const rootFolder = await QUERIES.getRootFolderForUser(session.userId);

  if (!rootFolder) {
    return (
      <div>
        <h1 className="mb-8 text-2xl">
          Looks like you have no drive yet. Lets create one!
        </h1>
        <form
          action={async () => {
            "use server";
            const session = await auth();

            if (!session.userId) {
              return redirect("/sign-in");
            }

            const rootFolderId = await MUTATIONS.onboardUser(session.userId);

            return redirect(`/drive/${rootFolderId}`);
          }}
        >
          <Button
            size="lg"
            className="border border-neutral-700 bg-neutral-800 text-white transition-colors hover:bg-neutral-700"
          >
            Create new Drive
          </Button>
        </form>
      </div>
    );
  }

  return redirect(`/drive/${rootFolder.id}`);
}
