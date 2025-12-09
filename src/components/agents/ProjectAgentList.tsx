import { Agent } from "@store/slices/agentsSlice";
import { AgentCard } from "./AgentCard";
import { selectIsLoadingAgentList } from "@store/selectors/agentSelectors";
import { useAppSelector } from "@store/hooks";
import { Loading } from "@components/Loading";
import { selectAgentsStatusMap } from "@store/selectors/projectStatusSelectors";
import { AgentStatusEnum } from "@store/slices/projectStatusSlice";

interface ProjectAgentListProps {
  agents: Agent[]
}

export function ProjectAgentList({ agents }: ProjectAgentListProps) {
  const isLoading = useAppSelector(selectIsLoadingAgentList);
  const agentsMap = useAppSelector(selectAgentsStatusMap);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : agents.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => {
              const live = agentsMap[agent.agentId];
              const status = live?.status ?? agent.status ?? AgentStatusEnum.IDLE;
              const currentTask = live?.current_task ?? agent.currentTask;

              return (<AgentCard
                key={agent.agentId}
                agentId={agent.agentId}
                name={agent.name}
                role={agent.role}
                status={status}
                currentTask={currentTask}
              />)
            })}
          </div>
        </>
      ) : (
        <p className="text-lg text-foreground">Список пуст</p>
      )}
    </>
  );
}