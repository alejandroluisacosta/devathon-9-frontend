import { useState, useEffect } from 'react';
import { sendPlayerDataToServer } from '../utils/sendPlayerDataToServer';
import './Main.scss';
import { PlayerBasicInfo } from '../components/PlayerBasicInfo';

export const Main = () => {

  const [playerName, setPlayerName] = useState("");
  const [selectedHouse, setSelectedHouse] = useState("");

  const [isPlayerInfoLoaded, setIsPlayerInfoLoaded] = useState(false);

  useEffect(() => {
    const storedPlayer = localStorage.getItem('playerInfo');
    if (storedPlayer) {
      const { name, house } = JSON.parse(storedPlayer);
      setPlayerName(name);
      setSelectedHouse(house);
      setIsPlayerInfoLoaded(true);
    }
  }, []);
  
  const handleNameChange = (e) => setPlayerName(e.target.value);
  
  const handleHouseSelect = (house) => setSelectedHouse(house);

  const handlePlay = () => {

  }
  
  const handleConfirm = () => {
    const playerData = { name: playerName, house: selectedHouse };
    sendPlayerDataToServer(playerData);
    localStorage.setItem("playerInfo", JSON.stringify(playerData));

    setIsPlayerInfoLoaded(true);
  };

  return (

    <div className={`main-page ${isPlayerInfoLoaded ? "with-background" : ""}`}>
      <h1 className="main-page__title relative-element">Expelliarmicus</h1>
      {isPlayerInfoLoaded ? 
      <>
        <PlayerBasicInfo playerName={playerName} selectedHouse={selectedHouse} className="fade-in relative-element"/>
      </>
      :
      <div className={"main-page__form relative-element"}>
        <input 
          type="text" 
          className="main-page__name-input" 
          placeholder="Dumbledore" 
          value={playerName} 
          onChange={handleNameChange} 
        />
        
        <h2 className="main-page__pick-house">Pick your house</h2>
        <div className="main-page__houses">
          {['Gryffindor', 'Slytherin', 'Hufflepuff', 'Ravenclaw'].map((house) => (
            <div 
              key={house} 
              className="main-page__houses__house"
              onClick={() => handleHouseSelect(house)}
              style={{ 
                boxShadow: selectedHouse === house ? '0 4px 40px rgba(0, 0, 0, 0.8)' : 'none',
                backgroundColor: selectedHouse === house ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
                border: selectedHouse === house ? '1px solid rgb(135, 135, 135)' : 'none',
                transform: selectedHouse === house ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s ease-in-out'
              }}
              
            >
              <img 
                className={`main-page__houses__logo main-page__houses__logo--${house.toLowerCase()}`} 
                src={`/images/${house}.webp`} 
                alt={house} 
              />
              <h3 className="main-page__houses__name">{house}</h3>
            </div>
          ))}
        </div>
      </div>}
      <button className="main-page__button relative-element" onClick={isPlayerInfoLoaded ? handlePlay : handleConfirm}>

        {isPlayerInfoLoaded ? 'Jugar' : 'Confirmar'}
      </button>
    </div>
  );
};
