import './resultModal.scss';

const ResultModal = ({ resultMessage, userScore, rivalScore, user, onContinue }) => {
    const getMessage = () => {
        if (resultMessage === 'Empate')
            return '"¿Qué es la vida sin un poco de riesgo?"';
        if (resultMessage === '¡Ganaste esta ronda!') {
            if (userScore === 1) return `¡Eres un mago, ${user.name}!`;
            if (userScore === 2) return '"No son nuestras habilidades lo que demuestran lo que somos, son nuestras decisiones"';
          }
        
          if (resultMessage === 'Perdiste esta ronda.') {
            if (rivalScore === 1) return `¿Asustado, ${user.name}?`;
            if (rivalScore === 2) return '"Lo que perdemos al final siempre vuelve a nosotros... aunque a veces no del modo que esperamos"';
          }
        }
        
    
        return (
        <div className="modal-overlay">
            <div className="modal-content">
            <h2>{resultMessage}</h2>
            <p>{getMessage()}</p>
            <button className='modal-content__button' onClick={onContinue}>
                Continuar
            </button>
            </div>
        </div>
        );
    };

export default ResultModal;
