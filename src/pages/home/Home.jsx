import './Home.scss';
import { useState, useEffect } from 'react';
import { usePageReady } from '../../customHooks/usePageImagesLoaded';
import Loader from '../../components/loader/Loader';
import { Rules } from '../../components/rules/Rules';
import { NavLink } from 'react-router-dom';

export const Home = () => {
    const [playerName, setPlayerName] = useState("");
    const [selectedHouse, setSelectedHouse] = useState("");
    const [playerWins, setPlayerWins] = useState(0);
    const [playerLosses, setPlayerLosses] = useState(0);
    const [showRules, setShowRules] = useState(false);


    const handleShowRules = () => {
        setShowRules(true);
    };
    
    const handleCloseRules = () => {
        setShowRules(false);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
            setShowRules(false);
            }
        };
    
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const loadPlayerInfo = () => {
        const stored = localStorage.getItem("playerInfo");
        if (stored) {
            const { name, house, wins = 0, losses = 0 } = JSON.parse(stored);
            setPlayerName(name);
            setSelectedHouse(house);
            setPlayerWins(wins);
            setPlayerLosses(losses);
        }
    };
    
    useEffect(() => {
        loadPlayerInfo();
    }, []);
    
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'playerInfo') {
            loadPlayerInfo();
        }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("playerInfo");
    };

    const isReady = usePageReady(2000, '/images/Home.webp');

    

return (
    <>
            {!isReady && <Loader />}
            <div className='container-room'
            style={{
                opacity: isReady ? 1 : 0,
                visibility: isReady ? 'visible' : 'hidden',
                transition: 'opacity 0.5s ease',
            }}>
    <div className='container-home'>
        <main className="profile-page">
            <img className="main-page__rules-icon relative-element" src="/images/Book.svg" alt="Ícono de reglas" onClick={handleShowRules}/>
            <h1 className="profile-page__title">Expelliarmicus</h1>
                {showRules && <Rules closeModal={handleCloseRules}/>}
            <div className="profile-page__container-info">
            <section>
                <h2>Datos</h2>
                <p><strong>Nombre:</strong> {playerName}</p>
                <p><strong>Casa:</strong> {selectedHouse}</p>
            </section>
            <section>
                <h2>Estadisticas</h2>
                <p><strong>Victorias:</strong> {playerWins}</p>
                <p><strong>Derrotas:</strong> {playerLosses}</p>
            </section>
            </div>
            <NavLink to='/duel-room' className='profile-page__button'>Jugar</NavLink>
            <NavLink to='/' className='profile-page__button secondary' onClick={handleLogout}>Cerrar sesión</NavLink>
        </main>
    </div>
    </div>
    </>
    );
}

export default Home;