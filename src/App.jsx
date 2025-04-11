import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import { StompProvider } from './stomp/StompProvider.jsx';
import { Main } from './pages/Main';
import { DuelRoom } from './pages/duelRoom/DuelRoom';



function App() {
  return (
    <StompProvider>

        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/duel-room" element={<DuelRoom />} />
          {/* 
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/create-room" element={<CreateRoom />} />
           */}
        </Routes>

    </StompProvider>

  );
}

export default App;
