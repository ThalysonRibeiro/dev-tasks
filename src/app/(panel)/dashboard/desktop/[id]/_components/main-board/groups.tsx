"use client"
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { GroupWithItems } from "./group-content";
import { GroupForm } from "./group-form";
import { toast } from "react-toastify";
import { CreateItemsForm } from "./create-item-form";
import { ItemsTables } from "./items-tables";
import { deleteGroup } from "../../_actions/delete-group";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils";

export function Groups({ groupsData, desktopId }: { groupsData: GroupWithItems[], desktopId: string }) {
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [addingItemToGroupId, setAddingItemToGroupId] = useState<string | null>(null);
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());

  const toggleDropdown = (groupId: string) => {
    setOpenGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  function handleEditGroup(group: GroupWithItems) {
    setEditingGroupId(group.id);
  }

  function handleAddItem(groupId: string) {
    setAddingItemToGroupId(groupId);
  }

  function closeEditForm(value: boolean) {
    if (!value) {
      setEditingGroupId(null);
    }
    return value;
  }

  function closeAddGroupForm(value: boolean) {
    setIsAddingGroup(value);
    return value;
  }

  function closeAddItemForm(value: boolean) {
    if (!value) {
      setAddingItemToGroupId(null);
    }
    return value;
  }

  async function handleDeleteGroup(id: string) {
    try {
      await deleteGroup(id);
      toast.success("Grupo deletado com sucesso!");
      // Remove o grupo do estado de grupos abertos
      setOpenGroups(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (error) {
      toast.error("Erro ao deletar grupo");
    }
  }

  return (
    <div className="space-y-6">
      {/* Lista de grupos */}
      <div className="space-y-6">
        {groupsData.map((group, index) => {
          const isGroupOpen = openGroups.has(group.id);

          return (
            <div key={group.id} className="space-y-4">
              {editingGroupId === group.id ? (
                <GroupForm
                  desktopId={desktopId}
                  setAddGroup={closeEditForm}
                  groupId={group.id}
                  initialValues={{
                    title: group.title,
                    textColor: group.textColor
                  }}
                />
              ) : (
                <>
                  {/* Cabeçalho do grupo */}
                  <div className="flex items-center gap-3 mb-4">
                    <h2
                      className="font-bold text-lg cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ color: group.textColor }}
                      onClick={() => handleEditGroup(group)}
                      title="Clique para editar"
                    >
                      {group.title}
                    </h2>
                    <Button
                      size="icon"
                      variant="outline"
                      className="cursor-pointer  border-dashed text-gray-600 hover:text-red-600 hover:border-red-300"
                      onClick={() => handleDeleteGroup(group.id)}
                      title="Deletar grupo"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    <button onClick={() => toggleDropdown(group.id)}>
                      <ChevronDown className={cn("transition-all duration-300", isGroupOpen && "rotate-180")} />
                    </button>
                  </div>

                  {/* Conteúdo do grupo */}
                  <Collapsible className="ml-6 space-y-4 border-l-2 border-gray-200 pl-4" open={isGroupOpen}>
                    <CollapsibleContent>
                      <ItemsTables items={group.item} />

                      {/* Formulário de adicionar item */}
                      {addingItemToGroupId === group.id ? (
                        <CreateItemsForm
                          groupId={group.id}
                          closeForm={closeAddItemForm}
                        />
                      ) : (
                        <Button
                          onClick={() => handleAddItem(group.id)}
                          variant="outline"
                          className="border-dashed text-gray-600 hover:text-blue-600 hover:border-blue-300 cursor-pointer"
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Novo item
                        </Button>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Botão/Formulário para adicionar novo grupo */}
      <div className="pt-4 border-t border-gray-200">
        {isAddingGroup ? (
          <GroupForm
            desktopId={desktopId}
            setAddGroup={closeAddGroupForm}
          />
        ) : (
          <Button
            onClick={() => setIsAddingGroup(true)}
            variant="outline"
            className="border-dashed text-gray-600 hover:text-green-600 hover:border-green-300 cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo grupo
          </Button>
        )}
      </div>
    </div>
  );
}