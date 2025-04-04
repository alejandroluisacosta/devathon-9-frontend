import { useState, useEffect } from 'react';
import { sendPlayerDataToServer } from '../utils/sendPlayerDataToServer';
import './Main.scss';
import { PlayerBasicInfo } from '../components/PlayerBasicInfo';

export const Main = () => {
  const [playerName, setPlayerName] = useState('');
  const [selectedHouse, setSelectedHouse] = useState('');
  const [isPlayerInfoLoaded, setIsPlayerInfoLoaded] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const storedPlayer = localStorage.getItem('playerInfo');
    if (storedPlayer) {
      const { name, house } = JSON.parse(storedPlayer);
      setPlayerName(name);
      setSelectedHouse(house);
      setIsPlayerInfoLoaded(false);
    }
  }, []);

  const handleNameChange = e => {
    /*setPlayerName(e.target.value);*/
    const value = e.target.value.replace(/[^a-zA-Z]/g, '');
    setPlayerName(value);
    setError(""); 
    // Clear error when user types
  }

  const handleHouseSelect = house => setSelectedHouse(house);

  const handlePlay = () => {};

  const handleBlur = () => {
    if (playerName.trim() === "") {
      setError("The field cannot be empty");
    }
  }

  const handleConfirm = () => {
    const playerData = { name: playerName, house: selectedHouse };
    sendPlayerDataToServer(playerData);
    localStorage.setItem('playerInfo', JSON.stringify(playerData));
    setIsPlayerInfoLoaded(true);
  };

  return (
    <div className={`main-page ${isPlayerInfoLoaded ? 'with-background' : ''}`}>
      <h1 className='main-page__title relative-element'>Expelliarmicus</h1>
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
          <input
            type='text'
            className='main-page__name-input'
            placeholder='Dumbledore'
            value={playerName}
            onChange={handleNameChange}
            onBlur={handleBlur}
            maxLength={20}
          />

          {error && <div style={{ color: 'red' }}>{error}</div>}

          <h2 className='main-page__pick-house'>Pick your house</h2>
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
      <button
        className='main-page__button relative-element'
        onClick={isPlayerInfoLoaded ? handlePlay : handleConfirm}
      >
        {isPlayerInfoLoaded ? 'Jugar' : 'Confirmar'}
      </button>
    </div>
  );
};
