import { Message, sendSSEMessage } from "@store/slices/chatSlice";
import { store } from "@store/store";
import { debounce } from "@utils/debounce";

export const debouncedSendMessage = debounce((msg: Message) => store.dispatch(sendSSEMessage(msg)), 600);