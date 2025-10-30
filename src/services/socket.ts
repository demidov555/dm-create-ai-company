import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;

  connect(url: string, opts: any = {}) {
    if (this.socket) return this.socket;
    this.socket = io(url, opts);
    return this.socket;
  }

  on(event: string, cb: (...args: any[]) => void) {
    this.socket?.on(event, cb);
  }

  off(event?: string, cb?: (...args: any[]) => void) {
    if (!this.socket) return;
    if (event && cb) this.socket.off(event, cb);
    else if (event) this.socket.off(event);
  }

  emit(event: string, ...args: any[]) {
    this.socket?.emit(event, ...args);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}


export const socketService = new SocketService();