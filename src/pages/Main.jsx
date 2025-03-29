import './Main.scss';

export const Main = () => {
  return (
    <div className="main-page">
      <h1 className="main-page__player-name">Player's Name</h1>
      <input type="text" className='main-page__name-input' placeholder='Dumbledore' />
      <h1 className="main-page__pick-house">Pick your house</h1>
      <div className="main-page__houses">
        <img className='main-page__houses__logo' src="/images/Gryffindor.webp" alt="Gryffindor" />
        <img className='main-page__houses__logo' src="/images/Slytherin.webp" alt="Slytherin" />
        <img className='main-page__houses__logo main-page__houses__logo--hufflepuff' src="/images/Hufflepuff.webp" alt="Huffepuff" />
        <img className='main-page__houses__logo' src="/images/Ravenclaw.webp" alt="Ravenclaw" />
      </div>
      <button className='main-page__button'>Play</button>
    </div>
  );
}