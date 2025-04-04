import { houseTraits } from '../constants/houseTraits';
import './PlayerBasicInfo.scss';
import { houseColors } from '../constants/houseColors';

export const PlayerBasicInfo = ({ playerName, selectedHouse, className }) => {

    const element = document.querySelector('.main-page');
    element.style.setProperty('--house-color', houseColors[selectedHouse]);
    return (
        <div className={className} style={{ '--house-color': houseColors[selectedHouse]}}>
            <h2 className='main-page__player-name'>{playerName}, el {houseTraits[selectedHouse]}</h2>
            <div className="main-page__house">
            <img className={`main-page__house__logo main-page__houses__logo--${selectedHouse.toLowerCase()} main-page__houses__logo--single`} src={`/images/${selectedHouse}.webp`} alt={selectedHouse} />
            <h3 className="main-page__house__name">{selectedHouse}</h3>
            </div>
        </div>
    )
}

