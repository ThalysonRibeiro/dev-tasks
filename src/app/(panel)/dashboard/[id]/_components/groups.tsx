"use client"
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { useState } from "react";
import { GroupWithItems } from "./group-content";
import { GroupForm } from "./group-form";
import { toast } from "react-toastify";
import { CreateItemsForm } from "./create-item-form";
import { ItemsTables } from "./items-tables";
import { deleteGroup } from "../_actions/delete-group";


export function Groups({ groupsData, desktopId }: { groupsData: GroupWithItems[], desktopId: string; }) {
  const [addItemGroup, setAddItemGroup] = useState<boolean>(false);
  const [addItem, setAddItem] = useState<boolean>(false);
  const [editingGroupInline, setEditingGroupInline] = useState<boolean>(false);
  const [editingGroup, setEditingGroup] = useState<null | GroupWithItems>(null);

  function handleEditeGroup(group: GroupWithItems) {
    setEditingGroupInline(true);
    setEditingGroup(group);
  }

  function updateAddItemGroup(newValue: boolean): boolean {
    setAddItemGroup(newValue);
    return newValue;
  }
  function openAddItem(newValue: boolean): boolean {
    setAddItem(newValue);
    return newValue;
  }
  function updateEditingGroupInline(newValue: boolean): boolean {
    setEditingGroupInline(newValue);
    return newValue;
  }

  function handleDeleteItemGroup(id: string) {
    deleteGroup(id);
    toast.success("Grupo deletado com sucesso!")
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {groupsData.map((itemGroup) => (
          <div key={itemGroup.id}>

            {editingGroupInline && editingGroup?.id === itemGroup.id ? (
              <GroupForm
                desktopId={desktopId}
                setAddGroup={updateEditingGroupInline}
                groupId={editingGroup ? editingGroup.id : undefined}
                initialValues={editingGroup ? {
                  title: editingGroup.title,
                  textColor: editingGroup.textColor
                } : undefined}
              />
            ) : (
              <div>
                <div className="flex gap-4 items-center mb-2">
                  <h2
                    className="font-bold text-lg"
                    style={{ color: itemGroup.textColor }}
                    onClick={() => handleEditeGroup(itemGroup)}
                  >
                    {itemGroup.title}
                  </h2>
                  <Button
                    size={"icon"}
                    variant={"outline"}
                    className="border-dashed cursor-pointer text-gray-600"
                    onClick={() => handleDeleteItemGroup(itemGroup.id)}
                  >
                    <Trash />
                  </Button>
                </div>
                <div className="ml-6 space-y-6 border">
                  <ItemsTables items={itemGroup.item} />

                  {addItem && (
                    <CreateItemsForm
                      groupId={itemGroup.id}
                      closeForm={openAddItem}
                    />
                  )}
                  {!addItem && (
                    <Button onClick={() => setAddItem(true)} variant={"outline"} className="border-dashed ml-2 mb-2 cursor-pointer text-gray-600">
                      Novo item <Plus />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <div>
          {addItemGroup && (
            <GroupForm
              desktopId={desktopId}
              setAddGroup={updateAddItemGroup}
            />
          )}
        </div>
        {!addItemGroup && (
          <Button onClick={() => setAddItemGroup(true)} variant={"outline"} className="border-dashed cursor-pointer text-gray-600">
            Novo grupo<Plus />
          </Button>
        )}
      </div>
    </div>
  )
}