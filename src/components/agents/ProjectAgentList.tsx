import { Agent } from "@store/slices/agentsSlice";
import { AgentCard } from "./AgentCard";
import { selectIsLoadingAgentList } from "@store/selectors/agentSelectors";
import { useAppSelector } from "@store/hooks";
import { Loading } from "@components/Loading";

interface ProjectAgentListProps {
  agents: Agent[]
}

export function ProjectAgentList({ agents }: ProjectAgentListProps) {
  const isLoading = useAppSelector(selectIsLoadingAgentList);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : agents.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <AgentCard
                key={agent.agentId}
                name={agent.name}
                role={agent.role}
                status={agent.status}
                currentTask={agent.currentTask}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="text-lg text-foreground">Список пуст</p>
      )}
    </>
  );
}