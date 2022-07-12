import './App.css';
import { Route, Routes } from "react-router-dom";
import ChatPage from "./Pages/ChatPage";
import HomePage from "./Pages/HomePage";
import VideoPlayer from "./components/VideoPlayer"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatPage />} />
        <Route path="/videochat" element={<VideoPlayer />} />
      </Routes>
    </div>
  );
}

export default App;
