import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/app/(panel)/dashboard/_components/sidebar/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { getDesktops } from "./_data-access/get-desktops";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect('/')
  }
  const desktops = await getDesktops();
  return (
    <SidebarProvider>
      <AppSidebar desktops={desktops} userData={session} />
      <main className="w-full px-2 pt-4">
        <SidebarTrigger className="fixed" />
        {children}
      </main>
    </SidebarProvider>
  )
}