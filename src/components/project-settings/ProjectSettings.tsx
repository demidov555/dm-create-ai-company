import { useAppDispatch, useAppSelector } from "@store/hooks";
import { ProjectSettingsCard } from "./ProjectSettingsCard";
import { ProjectSettingsInfo, refetchProject, updateProject } from "@store/slices/projectDetailsSlice";
import { AlertDialog } from "../AlertDialog";
import { useState } from "react";
import { deleteProject } from "@store/slices/projectsSlice";
import { useNavigate } from "react-router-dom";
import { selectIsLoadingIsLoadingUpdateProject } from "@store/selectors/projectDetailsSelectors";
import { Loading } from "@components/Loading";

interface ProjectSettingsProps {
  projectId: string;
  shortId: string;
  name: string;
  description: string;
}

export function ProjectSettings({ projectId, shortId, name, description }: ProjectSettingsProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectIsLoadingIsLoadingUpdateProject)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleUpdate = async (updated: ProjectSettingsInfo) => {
    await dispatch(updateProject({ projectId, ...updated })).unwrap();

    dispatch(refetchProject(shortId));
  };

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    const action = dispatch(deleteProject(projectId));

    if (deleteProject.fulfilled.match(action)) {
      const createdProjectId = action.payload;

      navigate(`/projects/${createdProjectId}`);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

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