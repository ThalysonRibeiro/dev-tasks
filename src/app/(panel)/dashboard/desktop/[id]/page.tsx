import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { getGroups } from "./_data-access/get-groups";
import { DesktopContent } from "./_components/desktop-content";


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
  const groupsData = await getGroups({ desktopId: desktopId as string });



  return (
    <main className="container mx-auto px-6 pt-6">
      <DesktopContent
        groupsData={groupsData}
        desktopId={desktopId}
      />
    </main>
  )
}