import { useContext, useEffect } from 'react';
import { StompContext } from '../../stomp/StompProvider';
import './RoomList.scss';
import { houseColors } from '../../constants/houseColors';
import { useState } from 'react';
import { useStomp } from '../../utils/useStomp';

export const RoomList = ({ selectedHouse }) => {
  const { rooms } = useContext(StompContext);
  const { subscribe, sendMessage } = useStomp();
  useEffect(() => {
    const element = document.querySelector('.room-list');
    const playerInfo = JSON.parse(localStorage.getItem('playerInfo'));
    const house = playerInfo?.house;
  
    if (element && house && houseColors[house]) {
      element.style.setProperty('--house-color', houseColors[house]);
      if (house === 'Hufflepuff') {
        element.style.setProperty('--house-color', 'rgba(255, 206, 58, 0.57)');
        element.style.setProperty('--text-color', 'black');
      } else {
        element.style.setProperty('--text-color', 'white');
      }
      
    }
  }, []);

  const [isRequestingDuel, setIsRequestingDuel] = useState(false);

  const handleJoinDuel = () => {
    const playerInfo = JSON.parse(localStorage.getItem('playerInfo'));
    if (!playerInfo) return;
  
    subscribe('/user/queue/duel', (message) => {
      const data = JSON.parse(message.body);
      console.log('Received room ID:', data.room_id);
      // Handle room ID, e.g., redirect to room
    });
  
    sendMessage('/app/duel', playerInfo);
  };
  
  return (
    <div className='room-list'>
      <div className='fade-in'>
        <h1 className='room-list__title'>¿Listo para el combate?</h1>
        <h2 className='room-list__subtitle'>Elige tu sala</h2>
        <div className='room-list__list'>
          {rooms.map((room, index) => (
            <div className='room-list__list__room' key={index}>
              <div className='room-info'>
                <p className='room-name'>{room.name}</p>
                <p className='players-count'>Jugadores: 1/2</p>
              </div>
              <div className='play-icon'>
                <span role='img' aria-label='play'>
                  ▶️
                </span>
              </div>
            </div>
          ))}
        </div>
        <button className="room-list__request-button" onClick={handleJoinDuel}>Iniciar duelo</button>
      </div>
    </div>
  );
};
