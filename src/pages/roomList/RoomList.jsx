import { useContext } from 'react';
import { StompContext } from '../../stomp/StompProvider';
import './RoomList.scss';

export const RoomList = () => {
  const { rooms } = useContext(StompContext);

  return (
    <div className='room-list'>
      <div className='fade-in'>
        <h1 className='room-list__title'>¿Listo para el combate?</h1>
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
      </div>
    </div>
  );
};
