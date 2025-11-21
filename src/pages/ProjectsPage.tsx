import { useEffect, useState } from "react";
import { Plus, Folder, MoreVertical, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@ui/button";
import { Card } from "@ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIconButtonTrigger,
  DropdownMenuItem,
} from "@ui/dropdown-menu";
import { Input } from "@ui/input";
import { selectProjects, selectIsLoadingList, selectIsLoadingActionProject } from "../store/selectors/projectsSelectors";
import { CreateProjectDialog } from "@components/CreateProjectDialog";
import { deleteProject, fetchProjects } from "@store/slices/projectsSlice";
import { openDialog } from "@store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { Loading } from "@components/Loading";
import { AlertDialog } from "@components/AlertDialog";
import { formatShortDateTime } from "@utils/date";

export function ProjectsPage() {
  const dispatch = useAppDispatch();
  const projects = useAppSelector(selectProjects);
  const isLoadingList = useAppSelector(selectIsLoadingList);
  const isLoadingActionProject = useAppSelector(selectIsLoadingActionProject);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<{ name: string; projectId: string }>({ name: '', projectId: '' });

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteProject(selectedProject.projectId));
      dispatch(fetchProjects());
    } catch {}
  };

  const filteredProjects = projects.filter((project) =>
    project.name?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery?.toLowerCase())
  );

  const ProjectsHeader = () => {
    const dispatch = useAppDispatch();

    return (
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl mb-2 text-foreground">Проекты</h1>
          <p className="text-sm text-muted-foreground">
            Управляйте своими проектами и отслеживайте прогресс
          </p>
        </div>

        <Button
          onClick={() => dispatch(openDialog("createProjectsDialog"))}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          Новый проект
        </Button>
      </div>
    );
  };

  const ProjectsSearch = ({ value, onChange }) => (
    <div className="mb-8">
      <Input
        placeholder="Поиск проектов..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-md bg-input-background border-border"
      />
    </div>
  );

  const ProjectsEmpty = () => {
    const dispatch = useAppDispatch();

    return (
      <Card className="p-12 text-center border border-dashed">
        <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg mb-2 text-foreground">Нет проектов</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Создайте свой первый проект, чтобы начать работу
        </p>

        <Button
          onClick={() => dispatch(openDialog("createProjectsDialog"))}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          Создать проект
        </Button>
      </Card>
    );
  };

  const ProjectsNotFound = () => (
    <Card className="p-12 text-center border border-dashed">
      <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg mb-2 text-foreground">Ничего не найдено</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Попробуйте изменить параметры поиска
      </p>
    </Card>
  );

  const ProjectCard = ({ project, onDelete }) => {
    const navigate = useNavigate();

    return (
      <Card
        className="p-6 border border-border hover:shadow-lg transition-all cursor-pointer group"
        onClick={() => navigate(`/projects/${project.shortId}`)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Folder className="h-6 w-6 text-primary" />
          </div>

          <DropdownMenu>
            <DropdownMenuIconButtonTrigger icon={<MoreVertical className="h-4 w-4" />} onClick={(e) => e.stopPropagation()}></DropdownMenuIconButtonTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProject({ name: project.name, projectId: project.projectId });
                  openDeleteDialog();
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h3 className="text-lg mb-2 text-foreground">{project.name}</h3>

        {project.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {project.description}
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          Обновлено: {formatShortDateTime(project.lastUpdated)}
        </p>
      </Card>
    );
  };

  const ProjectsGrid = ({ projects, onDelete }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.projectId} project={project} onDelete={onDelete} />
      ))}
    </div>
  );

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-8">
        <ProjectsHeader />
        <ProjectsSearch value={searchQuery} onChange={setSearchQuery} />

        {isLoadingList ? (
          <Loading />
        ) : filteredProjects.length === 0 && searchQuery ? (
          <ProjectsNotFound />
        ) : projects.length === 0 ? (
          <ProjectsEmpty />
        ) : (
          <ProjectsGrid projects={filteredProjects} onDelete={openDeleteDialog} />
        )}
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Удалить проект?"
        description={
          <>
            Вы уверены, что хотите удалить проект <strong>{selectedProject.name}</strong>?
            <br />
            Все данные будут удалены навсегда.
          </>
        }
        confirmText="Удалить"
        onConfirm={handleConfirmDelete}
      />
      <CreateProjectDialog isLoading={isLoadingActionProject} />
    </div>
  );
}