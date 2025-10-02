import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { getGroups } from "./_data-access/get-groups";
import { DesktopContent } from "./_components/desktop-content";
import { getPriorities } from "./_data-access/get-priorities";
import { getStatus } from "./_data-access/get-status";


export default async function DesktopPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession();
  if (!session) {
    redirect('/')
  }
  const desktopId = (await params).id;
  const groupsData = await getGroups(desktopId);
  const prioritiesData = await getPriorities(desktopId);
  const statusData = await getStatus(desktopId);

  return (
    <main className="container mx-auto px-6 pt-6">
      <DesktopContent
        groupsData={groupsData}
        desktopId={desktopId}
        prioritiesData={prioritiesData}
        statusData={statusData}
      />
    </main>
  )
}