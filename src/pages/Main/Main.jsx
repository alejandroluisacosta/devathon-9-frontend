import { useState, useEffect } from 'react';
import './Main.scss';
import { PlayerBasicInfo } from '../../components/playerBasicInfo/PlayerBasicInfo';
import { Rules } from '../../components/rules/Rules';
import { registerUser } from '../../utils/registerUser';
import { useStomp } from '../../utils/useStomp';
import { useJoinDuel } from '../../utils/useJoinDuel';

export const Main = () => {
  const [playerName, setPlayerName] = useState('');
  const [selectedHouse, setSelectedHouse] = useState('');
  const { subscribe, sendMessage, sessionId, updateSessionId } = useStomp();
  const [isPlayerInfoLoaded, setIsPlayerInfoLoaded] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const { joinDuel } = useJoinDuel();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const storedPlayer = localStorage.getItem('playerInfo');

    if (storedPlayer) {
      const { name, house } = JSON.parse(storedPlayer);
      setPlayerName(name);
      setSelectedHouse(house);
      setIsPlayerInfoLoaded(true);
    }
  }, []);

  useEffect(() => {
    const sub = subscribe('/user/queue/register-user', msg => {
      const { sessionId } = JSON.parse(msg.body);
      updateSessionId(sessionId);
      console.log('✅ Session ID set:', sessionId);
    });

    return () => {
      sub?.unsubscribe();
    };
  }, [subscribe, updateSessionId]);

  useEffect(() => {
    const sub = subscribe('/user/queue/list-players', msg => {
      const data = JSON.parse(msg.body);
      console.log('👥 List of Players:', data);
    });

    return () => {
      sub?.unsubscribe();
    };
  }, [subscribe]);

  const handleShowRules = () => {
    setShowRules(true);
  };

  const handleCloseRules = () => {
    setShowRules(false);
  };

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        setShowRules(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNameChange = e => setPlayerName(e.target.value);

  const handleHouseSelect = house => setSelectedHouse(house);

  const redirectToRoomList = () => {
    joinDuel();
  };

  const handleConfirm = async () => {
    const playerData = {
      sessionId: sessionId,
      name: playerName,
      house: selectedHouse,
    };

    if (playerName.trim().length < 3) {
      setErrorMessage('El nombre de mago debe tener al menos 3 caracteres.');
      return;
    }
    if (!selectedHouse) {
      setErrorMessage('Por favor elige una casa.');
      return;
    }
    setErrorMessage('');

    registerUser(playerData, sendMessage, subscribe, updateSessionId, sessionId);

    localStorage.setItem('playerInfo', JSON.stringify({ ...playerData }));

    setIsPlayerInfoLoaded(true);
  };

  return (
    <div className={`main-page ${isPlayerInfoLoaded ? 'with-background' : ''}`}>
      <img
        className='main-page__rules-icon relative-element'
        src='/images/Book.svg'
        alt='Ícono de reglas'
        onClick={handleShowRules}
      />
      <h1 className='main-page__title relative-element'>Expelliarmicus</h1>
      <p className='main-page__subtitle relative-element'>
        Donde los verdaderos magos resuelven sus diferencias
      </p>
      {showRules && <Rules closeModal={handleCloseRules} />}
      {isPlayerInfoLoaded ? (
        <>
          <PlayerBasicInfo
            playerName={playerName}
            selectedHouse={selectedHouse}
            className='fade-in relative-element'
          />
        </>
      ) : (
        <div className={'main-page__form relative-element'}>
          <h2 className='main-page__name-label'>Nombre de mago</h2>
          <input
            type='text'
            className='main-page__name-input'
            placeholder='Dumbledore'
            value={playerName}
            onChange={handleNameChange}
          />

          <h2 className='main-page__pick-house'>Elige tu casa</h2>
          <div className='main-page__houses'>
            {['Gryffindor', 'Slytherin', 'Hufflepuff', 'Ravenclaw'].map(house => (
              <div
                key={house}
                className='main-page__houses__house'
                onClick={() => handleHouseSelect(house)}
                style={{
                  boxShadow: selectedHouse === house ? '0 4px 40px rgba(0, 0, 0, 0.8)' : 'none',
                  backgroundColor: selectedHouse === house ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
                  border: selectedHouse === house ? '1px solid rgb(135, 135, 135)' : 'none',
                  transform: selectedHouse === house ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <img
                  className={`main-page__houses__logo main-page__houses__logo--${house.toLowerCase()}`}
                  src={`/images/${house}.webp`}
                  alt={house}
                />
                <h3 className='main-page__houses__name'>{house}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
      {errorMessage && (
        <p className="main-page__error-message">{errorMessage}</p>
      )}
      <button
        className='main-page__button relative-element'
        onClick={isPlayerInfoLoaded ? redirectToRoomList : handleConfirm}
      >
        {isPlayerInfoLoaded ? 'Buscar duelo' : 'Confirmar'}
      </button>
    </div>
  );
};
