import {
  FC,
  PropsWithChildren,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useSocket } from "../../hooks/useSocket";
import {
  defaultSocketContextState,
  SocketContextProvider,
  SocketReducer,
  TRoomStatus,
} from "./SocketContext";

const SERVER_URL = "ws://localhost:3000";

export interface ISocketContextComponentProps extends PropsWithChildren {}

const SocketContextComponent: FC<ISocketContextComponentProps> = (props) => {
  const { children } = props;

  const [SocketState, SocketDispatch] = useReducer(
    SocketReducer,
    defaultSocketContextState
  );
  const [loading, setLoading] = useState(true);

  const socket = useSocket(SERVER_URL, {
    reconnection: false,
    // reconnectionAttempts: 5,
    // reconnectionDelay: 5000,
    autoConnect: false,
  });

  useEffect(() => {
    // Connect to web socket
    socket.connect();

    // Save the socket in context
    SocketDispatch({ type: "update_socket", payload: socket });

    // Start event listeners
    StartListeners();

    // Now handshake is sending when user type his username, then server is checking if anyone exist with this username
    // SendHandshake();
  }, []);

  const StartListeners = () => {
    socket.on(
      "joined",
      ({ username, users }: { username: string; users: string[] }) => {
        SocketDispatch({ type: "set_username", payload: username });
        SocketDispatch({ type: "update_uid", payload: username });
        SocketDispatch({ type: "update_users", payload: users });

        setLoading(false);
      }
    );

    // User connected event
    socket.on("user_connected", (users: string[]) => {
      console.info("User connected, new user list reveived.");
      SocketDispatch({ type: "update_users", payload: users });
    });

    // Created room event
    socket.on("created_room", (roomId: string) => {
      console.info(`User created and joined to a room with id: ${roomId}`);
      SocketDispatch({ type: "update_roomId", payload: roomId });
      SocketDispatch({ type: "set_room_owner", payload: true });
      SocketDispatch({ type: "change_room_status", payload: "created" });
    });

    // Joined room event
    socket.on("joined_room", (roomId: string) => {
      console.info(`User created and joined to a room with id: ${roomId}`);
      SocketDispatch({ type: "update_roomId", payload: roomId });
      SocketDispatch({ type: "set_room_owner", payload: false });
    });

    // User kicked out from a room
    socket.on("kick", (message?: string) => {
      console.info("User leaved from a room.");
      message && alert(message);
      SocketDispatch({ type: "update_roomId", payload: "" });
      SocketDispatch({ type: "set_room_owner", payload: false });
      SocketDispatch({ type: "change_room_status", payload: "notInRoom" });
    });

    // Ready to start event
    socket.on("change_room_status", (roomStatus) => {
      console.info("Room owner can start the game.");
      SocketDispatch({
        type: "change_room_status",
        payload: roomStatus as TRoomStatus,
      });
    });

    // User disconnected event
    socket.on("user_disconnected", (uid: string) => {
      console.info("User disconnected.");
      SocketDispatch({ type: "remove_user", payload: uid });
    });

    socket.on("error", (message: string) => {
      alert(message);
    });

    // Reconnect event
    socket.io.on("reconnect", (attempt) => {
      console.info(`Reconnected on attempt: ${attempt}`);
    });

    // Reconnect attempt event
    socket.io.on("reconnect_attempt", (attempt) => {
      console.info(`Reconnection attempt: ${attempt}`);
    });

    // Reconnection error
    socket.io.on("reconnect_error", (error) => {
      console.info(`Reconnection error: ${error}`);
    });

    // Reconnection failed
    socket.io.on("reconnect_failed", () => {
      console.info(`Reconnection failed`);
      alert("We are unable to connect you to the websocket.");
    });
  };

  const SendHandshake = () => {
    console.info("Sending handshake");

    const username = getAndCheckUsername();
    if (!username) return;

    socket.emit("handshake", username);
  };

  const usernameRef = useRef<HTMLInputElement>(null);

  const getAndCheckUsername = () => {
    const usernameRegex = /^[a-z0-9]+$/i;

    try {
      const username = usernameRef.current?.value;
      if (!username) throw new Error("You cant leave blank username field!");
      if (typeof username !== "string")
        throw new Error("Username must be a string!");

      const trimmedUsername = username.trimStart().trimEnd();
      if (!trimmedUsername)
        throw new Error("You cant leave blank username field!");

      if (trimmedUsername.length < 3 || trimmedUsername.length >= 10)
        throw new Error(
          "Username must be more than 3 characters and less or equal 10!"
        );

      if (!usernameRegex.test(trimmedUsername))
        throw new Error("Username can be only letters and numbers!");

      return trimmedUsername;
    } catch (err) {
      alert(err);
      return null;
    }
  };

  if (loading)
    return (
      <div className="flex flex-col max-w-md mx-auto justify-center mt-[10vh] text-2xl">
        <div className="w-full pb-10 mb-10 flex flex-col gap-5">
          <input
            type="text"
            placeholder="Your username"
            className="placeholder:italic p-4 rounded-md bg-zinc-600 w-full"
            maxLength={10}
            ref={usernameRef}
          />
          <button className="button" onClick={SendHandshake}>
            Set and check your username
          </button>
        </div>
      </div>
    );

  return (
    <SocketContextProvider value={{ SocketState, SocketDispatch }}>
      {children}
    </SocketContextProvider>
  );
};

export default SocketContextComponent;
