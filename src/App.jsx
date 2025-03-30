import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Main } from './pages/Main';


function App() {
  return (
    <>
        <Routes>
          <Route path="/" element={<Main />} />
          {/* <Route path="/mode-selection" element={<ModeSelection />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/create-room" element={<CreateRoom />} />
          <Route path="/duel-room" element={<Game />} /> */}
        </Routes>
    </>
  );
}

export default App;
