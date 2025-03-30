import './Main.scss';

export const Main = () => {
  return (
    <div className="main-page">
      <h1 className="main-page__title">Expelliarmicus</h1>
      <h2 className="main-page__player-name">Player's Name</h2>
      <input type="text" className='main-page__name-input' placeholder='Dumbledore' />
      <h2 className="main-page__pick-house">Pick your house</h2>
      <div className="main-page__houses">
        <div className="main-page__houses__house">
          <img className="main-page__houses__logo" src="/images/Gryffindor.webp" alt="Gryffindor" />
          <h3 className="main-page__houses__name">Gryffindor</h3>
        </div>
        <div className="main-page__houses__house">
          <img className="main-page__houses__logo main-page__houses__logo--slytherin" src="/images/Slytherin.webp" alt="Slytherin" />
          <h3 className="main-page__houses__name">Slytherin</h3>
        </div>
        <div className="main-page__houses__house">
          <img className="main-page__houses__logo main-page__houses__logo--hufflepuff" src="/images/Hufflepuff.webp" alt="Hufflepuff" />
          <h3 className="main-page__houses__name">Hufflepuff</h3>
        </div>
        <div className="main-page__houses__house">
          <img className="main-page__houses__logo main-page__houses__logo--ravenclaw" src="/images/Ravenclaw.webp" alt="Ravenclaw" />
          <h3 className="main-page__houses__name">Ravenclaw</h3>
        </div>
      </div>
      <button className='main-page__button'>Play</button>
    </div>
  );
}