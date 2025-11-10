import { useAppDispatch } from "@store/hooks";
import { ProjectSettingsCard } from "./ProjectSettingsCard";
import { deleteProject, ProjectSettingsInfo, updateProject } from "@store/slices/projectDetailsSlice";
import { AlertDialog } from "../AlertDialog";
import { useState } from "react";

interface ProjectSettingsProps {
  projectId: string
  name: string;
  description: string;
}

export function ProjectSettings({ projectId, name, description }: ProjectSettingsProps) {
  const dispatch = useAppDispatch();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleUpdate = (updated: ProjectSettingsInfo) => {
    dispatch(updateProject({ projectId, ...updated }));
  };

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteProject(projectId));
  };

  return (
    <>
      <ProjectSettingsCard
        settingsInfo={{ name, description, }}
        onUpdate={handleUpdate}
        onDelete={openDeleteDialog}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Удалить проект?"
        description={
          <>
            Вы уверены, что хотите удалить проект <strong>{name}</strong>?
            <br />
            Все данные будут удалены навсегда.
          </>
        }
        confirmText="Удалить"
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}