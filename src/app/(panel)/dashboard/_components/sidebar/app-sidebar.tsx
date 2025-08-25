"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dock,
  MoreHorizontal,
  Home,
  Plus,
  Edit2,
  MonitorSpeaker,
  Trash
} from "lucide-react"
import Link from "next/link"
import { DesktopForm } from "./desktop-form"
import { Desktop } from "@/generated/prisma"
import { Button } from "@/components/ui/button"
import { deleteDesktop } from "../../_actions/delete-desktop"
import { toast } from "react-toastify"
import { useState, useCallback } from "react"
import { Menu } from "./menu"
import { Session } from "next-auth"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { FaTasks } from "react-icons/fa"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type NavigationLink =
  | {
    title: string;
    url: string;
    icon: React.ElementType;
  }
  | {
    title: string;
    icon: React.ElementType;
    sublinks: {
      title: string;
      url: string;
    }[];
  };

const navigationLinks: NavigationLink[] = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Metas",
    icon: FaTasks,
    sublinks: [
      {
        title: "Visão Geral",
        url: "/dashboard/goals",
      },
      {
        title: "Métricas",
        url: "/dashboard/goals/metrics",
      },
    ],
  },
];

interface AppSidebarProps {
  desktops: Desktop[];
  userData: Session;
}

interface EditingState {
  isEditing: boolean;
  desktop: Desktop | null;
}

export function AppSidebar({ desktops, userData }: AppSidebarProps) {
  const pathname = usePathname();
  const [isAddingDesktop, setIsAddingDesktop] = useState(false);
  const [editingState, setEditingState] = useState<EditingState>({
    isEditing: false,
    desktop: null
  });
  const [deletingDesktopId, setDeletingDesktopId] = useState<string | null>(null);

  const handleStartAddingDesktop = useCallback(() => {
    setIsAddingDesktop(true);
  }, []);

  const handleFinishAddingDesktop = useCallback((value: boolean) => {
    setIsAddingDesktop(value);
    return value;
  }, []);

  const handleStartEditingDesktop = useCallback((desktop: Desktop) => {
    setEditingState({
      isEditing: true,
      desktop
    });
  }, []);

  const handleFinishEditingDesktop = useCallback((value: boolean) => {
    setEditingState({
      isEditing: value,
      desktop: value ? editingState.desktop : null
    });
    return value;
  }, [editingState.desktop]);

  const handleDeleteDesktop = useCallback(async (desktopId: string) => {
    if (deletingDesktopId) return; // Prevent double deletion

    setDeletingDesktopId(desktopId);

    try {
      const response = await deleteDesktop(desktopId);

      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success(response.data || "Desktop deletado com sucesso!");
    } catch (error) {
      toast.error("Erro inesperado ao deletar desktop");
    } finally {
      setDeletingDesktopId(null);
    }
  }, [deletingDesktopId]);

  const isDesktopBeingEdited = (desktopId: string) => {
    return editingState.isEditing && editingState.desktop?.id === desktopId;
  };

  const isDesktopBeingDeleted = (desktopId: string) => {
    return deletingDesktopId === desktopId;
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <MonitorSpeaker className="h-6 w-6" />
          <span className="font-semibold text-lg">Espaço de trabalho</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Painel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationLinks.map((link) => (
                <div key={link.title}>
                  {('sublinks' in link) ? (
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-full justify-start">
                          <link.icon className="h-4 w-4" />
                          <span>{link.title}</span>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="ml-4">
                        <SidebarMenu>
                          {link.sublinks.map((sublink) => (
                            <SidebarMenuItem
                              key={sublink.title}
                              className={cn("",
                                pathname === sublink.url && "border border-primary rounded-md")}
                            >
                              <SidebarMenuButton asChild>
                                <Link href={sublink.url}>
                                  <span>{sublink.title}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenu>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem
                      className={cn("",
                        pathname === link.url && "border border-primary rounded-md")}
                    >
                      <SidebarMenuButton asChild>
                        <Link href={link.url}>
                          <link.icon className="h-4 w-4" />
                          <span>{link.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Áreas de Trabalho</SidebarGroupLabel>
          <SidebarGroupContent>
            {/* Add Desktop Section */}
            <div className="px-2 mb-2">
              {!isAddingDesktop ? (
                <Button
                  variant="outline"
                  onClick={handleStartAddingDesktop}
                  className="w-full border-dashed bg-transparent hover:bg-muted/50 justify-start"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Desktop
                </Button>
              ) : (
                <DesktopForm setAddDesktop={handleFinishAddingDesktop} />
              )}
            </div>

            {/* Desktop List */}
            <SidebarMenu>
              {desktops.map((desktop) => (
                <div key={desktop.id}>
                  {isDesktopBeingEdited(desktop.id) ? (
                    <div className="px-2">
                      <DesktopForm
                        desktopId={editingState.desktop?.id}
                        initialValues={{
                          title: editingState.desktop?.title || ""
                        }}
                        setAddDesktop={handleFinishEditingDesktop}
                      />
                    </div>
                  ) : (
                    <SidebarMenuItem>
                      <div className={cn("flex items-center w-full",
                        pathname === `/dashboard/desktop/${desktop.id}` && "border border-primary rounded-md")
                      }>
                        <SidebarMenuButton asChild className="flex-1">
                          <Link href={`/dashboard/desktop/${desktop.id}`}>
                            <Dock className="h-4 w-4" />
                            <span className="truncate">{desktop.title}</span>
                          </Link>
                        </SidebarMenuButton>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              disabled={isDesktopBeingDeleted(desktop.id)}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Opções para {desktop.title}</span>
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Opções</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() => handleStartEditingDesktop(desktop)}
                              className="cursor-pointer"
                            >
                              <Edit2 className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleDeleteDesktop(desktop.id)}
                              disabled={isDesktopBeingDeleted(desktop.id)}
                              className="cursor-pointer"
                              variant="destructive"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              {isDesktopBeingDeleted(desktop.id) ? "Deletando..." : "Deletar"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </SidebarMenuItem>
                  )}
                </div>
              ))}
            </SidebarMenu>

            {desktops.length === 0 && !isAddingDesktop && (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                Nenhuma Desktop criada
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Menu userData={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}