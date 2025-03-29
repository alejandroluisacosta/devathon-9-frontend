import './Main.scss';

export const Main = () => {
  return (
    <div className="main-page">
      <h1 className='main-page__title'>Player's Name</h1>
      <input type="text" className='main-page__name-input' placeholder='Dumbledore' />
    </div>
  );
}