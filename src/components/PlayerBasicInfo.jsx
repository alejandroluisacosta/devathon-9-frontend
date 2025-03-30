import { houseTraits } from '../constants/houseTraits';
import './PlayerBasicInfo.scss';

export const PlayerBasicInfo = ({ playerName, selectedHouse }) => {
    return (
        <>
            <h2 className='main-page__player-name'>{playerName}, el {houseTraits[selectedHouse]}</h2>
            <div className="main-page__house">
            <img className={`main-page__house__logo main-page__houses__logo--${selectedHouse.toLowerCase()} main-page__houses__logo--single`} src={`/images/${selectedHouse}.webp`} alt={selectedHouse} />
            <h3 className="main-page__house__name">{selectedHouse}</h3>
            </div>
        </>
    )
}