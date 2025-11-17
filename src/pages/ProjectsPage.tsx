import { useEffect, useState } from "react";
import { Plus, Folder, MoreVertical, Trash2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@ui/button";
import { Card } from "@ui/card";
import { Badge } from "@ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { Input } from "@ui/input";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectProjects, selectIsLoadingList, selectIsLoadingCreateProject } from "../store/selectors/projectsSelectors";
import { deleteProject, fetchProjects } from "../store/slices/projectsSlice";
import { openDialog } from "../store/slices/uiSlice";
import { CreateProjectDialog } from "@components/CreateProjectDialog";

export function ProjectsPage() {
  const dispatch = useAppDispatch();
  const projects = useAppSelector(selectProjects);
  const isLoadingList = useAppSelector(selectIsLoadingList);
  const isLoadingCreateProject = useAppSelector(selectIsLoadingCreateProject);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleDeleteProject = (id: number) => {
    if (confirm("Вы уверены, что хотите удалить этот проект?")) {
      dispatch(deleteProject(id));
    }
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
          <h1 className="text-3xl mb-2 text-foreground">Мои проекты</h1>
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
        onClick={() => navigate(`/projects/${project.projectId}`)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Folder className="h-6 w-6 text-primary" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <button className="h-8 w-8 rounded-md inline-flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent hover:text-accent-foreground">
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                <Edit className="h-4 w-4 mr-2" />
                Редактировать
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(project.projectId);
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
          Обновлено: {project.lastUpdated}
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
          <div>Загрузка...</div>
        ) : filteredProjects.length === 0 && searchQuery ? (
          <ProjectsNotFound />
        ) : projects.length === 0 ? (
          <ProjectsEmpty />
        ) : (
          <ProjectsGrid projects={filteredProjects} onDelete={handleDeleteProject} />
        )}
      </div>
      <CreateProjectDialog isLoading={isLoadingCreateProject}/>
    </div>
  );
}