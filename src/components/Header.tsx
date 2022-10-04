import { useContext } from "react";
import SocketContext from "../context/Socket/SocketContext";

const Header = () => {
  const { username } = useContext(SocketContext).SocketState;
  return (
    <header className="w-full flex justify-between px-10 py-8 text-2xl">
      <span>👊 ✋ 🖖</span>
      {username && <span className="text-zinc-200">Your name: {username}</span>}
    </header>
  );
};

export default Header;
