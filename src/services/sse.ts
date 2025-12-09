export class SSEService {
  private eventSource: EventSource | null = null;
  private listeners: Map<string, Set<EventListener>> = new Map();

  connect(url: string, opts?: EventSourceInit) {
    if (!this.eventSource) {
      this.eventSource = new EventSource(url, opts);
    }
    return this.eventSource;
  }

  on(event: string, cb: (data: any) => void) {
    if (!this.eventSource) {
      console.warn("SSE connection not established. Call connect() first.");
      return;
    }

    const handler = (e: MessageEvent) => {
      try {
        cb(JSON.parse(e.data));
      } catch {
        cb(e.data);
      }
    };

    this.eventSource.addEventListener(event, handler);

    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }

  off(event?: string) {
    if (!this.eventSource) return;

    if (event) {
      const handlers = this.listeners.get(event);
      if (handlers) {
        handlers.forEach(h => this.eventSource!.removeEventListener(event, h));
        this.listeners.delete(event);
      }
      return;
    }

    for (const [evt, handlers] of this.listeners) {
      handlers.forEach(h => this.eventSource!.removeEventListener(evt, h));
    }
    this.listeners.clear();
  }

  close() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.listeners.clear();
    }
  }
}
