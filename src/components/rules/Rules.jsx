import './Rules.scss';

export const Rules = () => {
    return (
        <div className="rules">
            <h1 className='rules__title'>El juego donde los verdaderos magos resuelven sus diferencias. ¿Te atreves?</h1>
            <h1 className='rules__rules-label'>Reglas</h1>
            <img className='rules__instructions' src="/images/Instructions.webp" alt="Instructions" />
            <p className='rules__written-instructions'>Tres rondas deciden el destino. Quien conquiste dos, verá su nombre grabado en los pergaminos dorados de Hogwarts. Quien pierda... no dejará ni eco en los pasillos encantados.</p>
        </div>
    )
}