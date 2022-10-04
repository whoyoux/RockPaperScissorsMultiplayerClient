import { useContext, useRef } from "react";
import Room from "./components/Room";
import SocketContext from "./context/Socket/SocketContext";

function App() {
  const { socket, uid, users, roomId, isRoomOwner, currentRoom } =
    useContext(SocketContext).SocketState;

  const roomIdRef = useRef<HTMLInputElement>(null);

  const createRoom = () => {
    socket?.emit("create_room");
  };

  const joinRoom = () => {
    const roomId = roomIdRef.current?.value.toUpperCase().trimStart().trimEnd();
    if (!roomId || roomId.length !== 6)
      return alert(
        "Room id input can't be empty and must be 6 characters length!"
      );
    socket?.emit("join_room", roomId);
  };
  return (
    <>
      {roomId !== "" ? (
        <Room />
      ) : (
        <>
          <div className="w-full border-b border-zinc-500 pb-10 mb-10">
            <button className="button w-full" onClick={createRoom}>
              Create room
            </button>
          </div>
          <div className="flex flex-col gap-5 w-full">
            <input
              type="text"
              placeholder="123456"
              className="placeholder:italic p-4 rounded-md bg-zinc-600"
              maxLength={6}
              ref={roomIdRef}
            />
            <button className="button" onClick={joinRoom}>
              Join room
            </button>
          </div>
        </>
      )}

      <div className="absolute bottom-5 left-5 right-5 text-xs">
        <h1 className="italic">DEBUG INFO</h1>
        <p>UID: {uid}</p>
        <p>Users connected: {users.length}</p>
        <p>Socket id: {socket?.id}</p>
        <p>Actual room info: {roomId}</p>
        <p>isOwnerOfRoom: {isRoomOwner ? "true" : "false"}</p>
        <p>Room status: {currentRoom.status}</p>
      </div>
    </>
  );
}

export default App;
