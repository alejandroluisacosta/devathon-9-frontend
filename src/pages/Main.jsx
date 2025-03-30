import './Main.scss';
import { useState } from 'react';

export const Main = () => {
  const [playerName, setPlayerName] = useState('');
  const [selectedHouse, setSelectedHouse] = useState('');
  
  const handleNameChange = (e) => setPlayerName(e.target.value);
  
  const handleHouseSelect = (house) => setSelectedHouse(house);
  
  const handleSubmit = () => {
    const playerData = { name: playerName, house: selectedHouse };
    localStorage.setItem("playerInfo", JSON.stringify(playerData));
    
  };

  return (
    <div className="main-page">
      <h1 className="main-page__title">Expelliarmicus</h1>
      
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
            style={{ backgroundColor: selectedHouse === house ? 'lightgrey' : 'transparent' }}  // Optional style for selection
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
      
      <button className="main-page__button" onClick={handleSubmit}>Play</button>
    </div>
  );
};
