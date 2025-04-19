import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import { StompProvider } from './stomp/StompProvider.jsx';
import { Main } from './pages/Main';
import { DuelRoom } from './pages/duelRoom/DuelRoom';
// import { RoomList } from './pages/roomList/RoomList';

function App() {
  return (
    <StompProvider>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/duel-room' element={<DuelRoom />} />
        <Route path='/duel-room/:roomId' element={<DuelRoom />} />
        {/* 
          <Route path="/create-room" element={<CreateRoom />} />
           */}
      </Routes>
    </StompProvider>
  );
}

export default App;
