import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface ProjectInfo {
  project_id: number;
  name: string;
  description?: string;
  status: "active" | "completed" | "in-progress";
  agent_count: number;
  last_updated: string;
}

interface Project {
  projectInfo: ProjectInfo;
  agents: Agent[];
  histroyMessages: Message[];
  metrica: {
    progress: { percent: number; lastUpdate: string };
    componentCounter: number;
    codeStringCoutner: number;
    testOverageCouter: number;
  };
}

interface Message {
  project_id: number;
  user_id: number;
  role: "user" | "agent";
  message: string;
  timestamp?: string;
}

interface Agent {
  id: string;
  name: string;
  role: string;
  status: "idle" | "working" | "completed";
  current_task?: string;
}

@Injectable()
export class ProjectCommonChatApiService {
  private baseUrl = 'https://stunning-pancake-967q4r454rv275xj-8000.app.github.dev';

  private httpClient = inject(HttpClient);

  sendMessageToProjectManager(body: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/message_send`, body);
  }

  getHistoryMessages(userId: number): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/messages_history`, { user_id: userId, project_id: 1 });
  }

}
