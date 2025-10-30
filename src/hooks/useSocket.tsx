import { useEffect } from "react";
import { socketService } from "../services/socket";
import { useDispatch } from "react-redux";
import { addMessage, setConnected, addMessages } from "../store/slices/chatSlice";

export function useSocket(url: string, opts: any = {}) {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = socketService.connect(url, opts);

    const onConnect = () => dispatch(setConnected(true));
    const onDisconnect = () => dispatch(setConnected(false));
    const onMessage = (msg: any) => dispatch(addMessage(msg));
    const onBulk = (msgs: any[]) => dispatch(addMessages(msgs));


    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("chat:message", onMessage);
    socket.on("chat:bulk", onBulk);


    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("chat:message", onMessage);
      socket.off("chat:bulk", onBulk);
      socketService.disconnect();
    };
  }, [url, dispatch]);
}