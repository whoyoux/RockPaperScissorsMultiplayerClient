import { useContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Header from "./components/Header";
import SocketContextComponent from "./context/Socket/SocketContextComponent";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>

  <SocketContextComponent>
    <Header />
    <div className="flex flex-col max-w-md mx-auto justify-center mt-[10vh] text-2xl">
      <App />
    </div>
  </SocketContextComponent>
  // </React.StrictMode>
);
