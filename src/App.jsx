import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import { StompProvider } from './stomp/StompProvider.jsx';
import { Main } from './pages/Main/Main.jsx';
import { DuelRoom } from './pages/duelRoom/DuelRoom';
import { Home } from './pages/home/Home';
// import { RoomList } from './pages/roomList/RoomList';

function App() {
  const user = localStorage.getItem("playerInfo");

  return (
    <StompProvider>
      <Routes>
        <Route path="/" element={!user ? <Main /> : <Navigate to="/home" />} />
        <Route path="/duel-room/:roomId" element={<DuelRoom />} />
        <Route path="/home" element={<Home />} />
        <Route path='/duel-room' element={<DuelRoom />} />
        {/* 
          <Route path="/create-room" element={<CreateRoom />} />
           */}
      </Routes>
    </StompProvider>
  );
}

export default App;
