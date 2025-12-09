import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@ui/button";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectErrorProjectDetails, selectIsLoadingProjectDetails, selectProjectDetails } from "@store/selectors/projectDetailsSelectors";
import { fetchProject } from "../store/slices/projectDetailsSlice";
import { ChatCard } from "../components/chat-card/ChatCard"
import { selectMessages } from "../store/selectors/chatSelectors";
import { getHistoryMessages } from "../store/slices/chatSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import { ProjectSettings } from "@components/project-settings/ProjectSettings";
import { getAgentByIds } from "@store/slices/agentsSlice";
import { selectAgents } from "@store/selectors/agentSelectors";
import { ProjectOverview } from "@components/project-overview/ProjectOverview";
import { ProjectAgentList } from "@components/agents/ProjectAgentList";
import { selectUser } from "@store/selectors/authSelectors";
import { Loading } from "@components/Loading";
import { useProjectStatusSSE } from "@hooks/useProjectStatusSSE";
import { useChatSSE } from "@hooks/useChatSSE";
import { updateAgentStatus, updateProjectProgress, updateProjectStatus } from "@store/slices/projectStatusSlice";

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");

  const project = useAppSelector(selectProjectDetails);
  const messages = useAppSelector(selectMessages);
  const agents = useAppSelector(selectAgents);
  const isLoadingProject = useAppSelector(selectIsLoadingProjectDetails);
  const error = useAppSelector(selectErrorProjectDetails);

  const chatSSE = useChatSSE({ projectId: project?.projectId });
  const projectStatusSSE = useProjectStatusSSE({ projectId: project?.projectId });

  useEffect(() => {
    if (!id) return;

    dispatch(fetchProject(id))
      .unwrap()
      .then((response) => {
        dispatch(updateProjectStatus(response.status));
        dispatch(updateProjectProgress(response.metrica.progress));
        dispatch(getHistoryMessages(response.projectId));
        dispatch(getAgentByIds({ projectId: response.projectId, agentIds: response.agentIds })).unwrap()
          .then(agents => {
            agents.map(a => dispatch(updateAgentStatus({ agent_id: a.agentId, status: a.status, current_task: a.currentTask })))
          })

      });
  }, [dispatch, id]);

  if (isLoadingProject && !error) return <Loading />

  if (error?.response?.data.status === 404) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl mb-4 text-foreground">Проект не найден</h2>
          <Button onClick={() => navigate("/projects")}>Вернуться к проектам</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background">
      <div className="max-w-5xl min-w-[660px] mx-auto p-3">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="tasks">Задачи</TabsTrigger>
            <TabsTrigger value="team">Команда</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <ProjectOverview project={project} />
          </TabsContent>

          <TabsContent value="tasks">
            <ChatCard projectId={project.projectId} messages={messages} restartSSE={chatSSE.restart} />
          </TabsContent>

          <TabsContent value="team">
            <ProjectAgentList agents={agents} />
          </TabsContent>

          <TabsContent value="settings">
            <ProjectSettings
              projectId={project.projectId}
              shortId={id}
              name={project.name}
              description={project.description}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
