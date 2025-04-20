import { useStomp } from '../utils/useStomp';
import { useNavigate } from 'react-router-dom';

export const useJoinDuel = () => {
  const { subscribe, sendMessage } = useStomp();
  const navigate = useNavigate();

  const joinDuel = () => {
    const playerInfo = JSON.parse(localStorage.getItem('playerInfo'));
    if (!playerInfo) return;

    subscribe('/user/queue/duel', message => {
      const data = JSON.parse(message.body);
      const roomId = data.room_id;
      if (!roomId) return;
      navigate(`/duel-room/${roomId}`);
    });

    sendMessage('/app/duel', playerInfo);
  };

  return { joinDuel };
};
