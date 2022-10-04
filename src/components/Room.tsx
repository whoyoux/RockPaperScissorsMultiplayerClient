import { useContext, useEffect, useState } from "react";
import SocketContext from "../context/Socket/SocketContext";

const Room = () => {
  const { socket, roomId, isRoomOwner, roomStatus } =
    useContext(SocketContext).SocketState;

  const [roomStatusText, setRoomStatusText] = useState("");

  const leaveRoom = () => {
    socket?.emit("leave_room", roomId);
  };

  useEffect(() => {
    switch (roomStatus) {
      case "created":
        setRoomStatusText("Created and waiting for second player");
        break;
      case "waiting":
        setRoomStatusText("Waiting for second player");
        break;
      case "ready":
        setRoomStatusText("Ready to play!");
        break;
      case "canceled":
        setRoomStatusText("Cancelled");
        break;
      default:
        setRoomStatusText("Room status.");
        break;
    }
  }, [roomStatus]);

  return (
    <div className="text-zinc-300">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl">
          Room ID: <span className="font-bold">{roomId}</span>
        </h1>
      </div>
      <div className="flex flex-col gap-5 mt-10">
        <h1
          className={`text-3xl ${roomStatus === "ready" && "text-green-500"}`}
        >
          {roomStatusText}
        </h1>
        <div>
          {/* <h2 className="text-2xl mb-5">Players:</h2> */}
          <div className="flex flex-row gap-5">
            <div className="flex-1 bg-zinc-600 rounded-md p-5">
              <div className="flex flex-col">
                <span className="text-sm">Owner</span>
                <h1>nickname</h1>
              </div>
            </div>
            <div className="flex-1 bg-zinc-600 rounded-md p-5">
              <div className="flex flex-col">
                <span className="text-sm">Client</span>
                <h1>Waiting</h1>
              </div>
            </div>
          </div>
        </div>

        {roomStatus === "ready" && isRoomOwner && (
          <button className="button bg-green-500 hover:bg-green-600">
            Start!
          </button>
        )}
        <button
          className="small__button mt-5 bg-red-500 hover:bg-red-600"
          onClick={leaveRoom}
        >
          Leave room
        </button>
      </div>
    </div>
  );
};

export default Room;
