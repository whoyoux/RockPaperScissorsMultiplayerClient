import { createContext, Dispatch } from "react";
import { Socket } from "socket.io-client";

export type TRoomStatus =
  | "created"
  | "waiting"
  | "ready"
  | "playing"
  | "canceled"
  | "notInRoom";

export type TChangeRoomStatus = {
  status: TRoomStatus;
  firstPlayerUsername?: string;
  secondPlayerUsername?: string;
};

export interface ISocketContextState {
  username: string;
  socket: Socket | undefined;
  uid: string;
  users: string[];
  roomId: string;
  isRoomOwner: boolean;
  currentRoom: TChangeRoomStatus;
}

export const defaultSocketContextState: ISocketContextState = {
  username: "",
  socket: undefined,
  uid: "",
  users: [],
  roomId: "",
  isRoomOwner: false,
  currentRoom: { status: "notInRoom" },
};

export type TSocketContextActions =
  | "set_username"
  | "update_socket"
  | "update_uid"
  | "update_users"
  | "remove_user"
  | "update_roomId"
  | "set_room_owner"
  | "change_room_status";

export type TSocketContextPayload =
  | string
  | string[]
  | Socket
  | boolean
  | TChangeRoomStatus;

export interface ISocketContextActions {
  type: TSocketContextActions;
  payload: TSocketContextPayload;
}

export const SocketReducer = (
  state: ISocketContextState,
  action: ISocketContextActions
) => {
  console.log(`Message Received - Action ${action.type} with payload: `);
  console.log(action?.payload);

  switch (action.type) {
    case "set_username":
      return { ...state, username: action.payload as string };
    case "update_socket":
      return { ...state, socket: action.payload as Socket };
    case "update_uid":
      return { ...state, uid: action.payload as string };
    case "update_users":
      return { ...state, users: action.payload as string[] };
    case "remove_user":
      return {
        ...state,
        users: state.users.filter((uid) => uid !== (action.payload as string)),
      };
    case "update_roomId":
      return {
        ...state,
        roomId: action.payload as string,
      };
    case "set_room_owner":
      return {
        ...state,
        isRoomOwner: action.payload as boolean,
      };
    case "change_room_status":
      return {
        ...state,
        currentRoom: action.payload as TChangeRoomStatus,
      };
    default:
      return { ...state };
  }
};

export interface ISocketContextProps {
  SocketState: ISocketContextState;
  SocketDispatch: Dispatch<ISocketContextActions>;
}

const SocketContext = createContext<ISocketContextProps>({
  SocketState: defaultSocketContextState,
  SocketDispatch: () => {},
});

export const SocketContextConsumer = SocketContext.Consumer;
export const SocketContextProvider = SocketContext.Provider;

export default SocketContext;
