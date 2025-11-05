class SSEService {
  private eventSource: EventSource | null = null;
  private listeners: Map<string, EventListener> = new Map();

  connect(url: string, opts?: EventSourceInit) {
    if (this.eventSource) return this.eventSource;

    this.eventSource = new EventSource(url, opts);
    return this.eventSource;
  }

  on(event: string, cb: (data: any) => void) {
    if (!this.eventSource) {
      console.warn("SSE connection not established. Call connect() first.");
      return;
    }

    const handler = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        cb(data);
      } catch {
        cb(e.data);
      }
    };

    this.eventSource.addEventListener(event, handler);
    // @ts-ignore
    this.listeners.set(event, handler);
  }

  off(event?: string) {
    if (!this.eventSource) return;

    if (event) {
      const handler = this.listeners.get(event);
      if (handler) {
        this.eventSource.removeEventListener(event, handler);
        this.listeners.delete(event);
      }
    } else {
      // убрать всех слушателей
      for (const [evt, handler] of this.listeners) {
        this.eventSource.removeEventListener(evt, handler);
      }
      this.listeners.clear();
    }
  }

  close() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.listeners.clear();
    }
  }
}

export const sseService = new SSEService();
