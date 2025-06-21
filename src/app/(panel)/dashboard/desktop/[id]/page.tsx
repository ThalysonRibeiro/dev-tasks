import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";

import { GroupContent } from "./_components/group-content";
import { getGroups } from "../../_data-access/get-groups";
import { Header } from "../../_components/header";


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
      <Header />
      <GroupContent groupsData={groupsData || []} desktopId={desktopId} />
    </main>
  )
}