import './Rules.scss';

export const Rules = ({ closeModal }) => {
  return (
    <div className='rules modal-fade-in'>
      <img className='rules__close' src='/images/Close.svg' alt='Close' onClick={closeModal} />
      <h1 className='rules__title'>
        Expelliarmicus™ es el juego donde los verdaderos magos resuelven sus diferencias. ¿Te
        atreves?
      </h1>
      <h1 className='rules__rules-label'>Reglas</h1>
      <img className='rules__instructions' src='/images/Instructions.webp' alt='Instructions' />
      <p className='rules__written-instructions'>
        Quien conquiste tres rondas, verá su nombre grabado en los
        pergaminos dorados de Hogwarts. Quien pierda... no dejará ni eco en los pasillos encantados.
      </p>
      <button className='rules__close-button' onClick={closeModal}>
        Cerrar
      </button>
    </div>
  );
};
