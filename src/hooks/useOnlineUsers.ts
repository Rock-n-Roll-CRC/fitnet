import { useContext } from "react";

import { OnlineUsersContext } from "@/contexts/OnlineUsersContext";

export const useOnlineUsers = () => useContext(OnlineUsersContext);
