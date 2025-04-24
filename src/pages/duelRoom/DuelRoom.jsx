import './DuelRoom.scss';
import { DndContext, useDroppable } from '@dnd-kit/core';
import { useState, useRef, useEffect } from 'react';
import { usePageReady } from '../../customHooks/usePageImagesLoaded';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { useStomp } from '../../utils/useStomp';
import FlipClock from '../../components/flipClock/FlipClock';
import Loader from '../../components/loader/Loader';
import Card from '../../components/card/Card';
import DropZone from '../../components/dropZone/DropZone';
import ResultModal from '../../components/resultModal/ResultModal';

const cards = [
  { id: 'Expelliarmus', image: '/images/Expelliarmus.webp' },
  { id: 'Avada Kedavra', image: '/images/Avada Kedavra.webp' },
  { id: 'Protego', image: '/images/Protego.webp' },
];


export const DuelRoom = () => {
  const { roomId } = useParams();
  const { sendMessage, subscribe, sessionId } = useStomp();
  const [spells, setSpells] = useState([]);
  const [gameData, setGameData] = useState({
    round: 0,
    gameOver: false,
    result: null,
    players: [],
  });

  const [zones, setZones] = useState({
    userZone: null,
    rivalZone: null,
  });

  const zonesRef = useRef(zones);

  useEffect(() => {
    zonesRef.current = zones;
  }, [zones]);

  const countdownTo = useRef(Date.now() + 40 * 1000);
  const [showModal, setShowModal] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const navigate = useNavigate();

  const [userLivesLoss, setUserLivesLoss] = useState(0);
  const [rivalLivesLoss, setRivalLivesLoss] = useState(0);
  const [showFinalResult, setShowFinalResult] = useState(false);
  const [finalResultMessage, setFinalResultMessage] = useState('');
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const maxLives = 3;
  const [isUserZoneEnabled, setIsUserZoneEnabled] = useState(true);
  const [rivalCard, setRivalCard] = useState(null);
  const user = JSON.parse(localStorage.getItem('playerInfo'));

  const players = [
        {
            label: 'Jugador (Tú)',
            name: `${user.name}`,
            house: `${user.house}`,
            score: userLivesLoss
        },
        {
            label: 'Oponente',
            name: 'Harry Potter',
            house: 'Gryffindor',
            score: rivalLivesLoss
        }
    ];

  // Fetch spells on component mount
  useEffect(() => {
    const fetchSpells = async () => {
      try {
        const response = await fetch('http://localhost:8080/spells');
        const data = await response.json();
        console.log(data);
        setSpells(data);
      } catch (error) {
        console.error('Error fetching spells:', error);
      }
    };

    fetchSpells();
  }, []);

  const handleTimerComplete = () => {
    const userPlayedCard = zonesRef.current.userZone;
    console.log('Carta en userZone:', userPlayedCard);

    // setShowModal(true);
  };

  const handleDragEnd = event => {
    const { over, active } = event;

    if (over) {
      setZones(prev => ({
        ...prev,
        [over.id]: active.id,
      }));

      const spell = spells.find(spell => spell.name === active.id);
      console.log('Spell ID:', spell.id);
      if (spell) {
        sendMessage(`/app/round/${roomId}`, { spellId: spell.id });
      }
    }
  };

  const getOpponentInfo = (players, currentPlayerId) => {
    return players.find(player => player.id !== currentPlayerId) || null;
  };

  useEffect(() => {    
    const sub = subscribe(`/user/queue/round/result`, message => {
      const data = JSON.parse(message.body);
      setGameData(data);
      console.log(data);
  
      
      const opponentInfo = getOpponentInfo(data.players, sessionId);
      const opponentSpell = spells.find(spell => spell.id === opponentInfo.spellUsed);
      console.log("El hechizo usado por el oponente es:", opponentSpell);
      setIsUserZoneEnabled(false);
      setRivalCard(opponentSpell.name);
      // if (opponentSpell) {
      //   console.log("El oponente usó:", opponentSpell.name);
      // } else {
      //   console.warn("No se encontró el hechizo usado por el oponente.");
      // }      

      const isDraw = data.result?.status === "DRAW";
      if (!isDraw) {
      const isWinner = data.result?.winner === sessionId;
        if (isWinner) {
          setRivalLivesLoss(prev => prev + 1);
          setResultMessage('¡Ganaste esta ronda!');
        }
        else if (!isWinner) {
          setUserLivesLoss(prev => prev + 1);
          setResultMessage('Perdiste esta ronda.');
        }
      } else if (isDraw) {
        setResultMessage('Empate');
      }
      setTimeout(() => {
        setShowModal(true);
        setRivalCard(null);
        setIsUserZoneEnabled(true);
    }, 2000);
    });
  
    return () => {
      sub?.unsubscribe();
    };
  }, [subscribe, sessionId, spells]);

  useEffect(() => {
    if (gameData.gameOver) {
      const isWinner = gameData.result?.winner === sessionId;
      setResultMessage(isWinner ? '¡Felicidades, ganaste!' : 'Perdiste, serás por siempre olvidado');
      setShowModal(true);
    }
  }, [gameData]);

  const handleModalClose = () => {
    setShowModal(false);
    if (gameData.gameOver) {
      navigate('/');
    }
  };

  const isReady = usePageReady(2000, '/images/DuelRoom_Background.webp');

  return (
    <>
    {!isReady && <Loader />}
    <div className='container-room'
    style={{
        opacity: isReady ? 1 : 0,
        visibility: isReady ? 'visible' : 'hidden',
        transition: 'opacity 0.5s ease',
    }}>
    <div className="duel-page">
                <div className='duel-page__players-info'>
                    <div>
                        {players.map((player, index) => (
                        <div key={index}>
                            <h2>{player.label}</h2>
                            <p><strong>{player.name}</strong> ({player.house})</p>
                            {[...Array(maxLives)].map((_, i) => (
                                <img
                                    key={i}
                                    src="/images/Heart.svg"
                                    alt="Heart"
                                    className="heart"
                                    style={{ opacity: i < (maxLives - player.score) ? 1 : 0.3 }}
                                />
                                ))}
                        </div>
                        ))}
                    </div>
                </div>
                <DndContext onDragEnd={handleDragEnd}>
                    <main className="duel-page__zones">
                        <div className="duel-page__zones__rivals">
                            {[1, 2, 3].map((_, i) => (
                            <img
                                key={i}
                                src="/images/Card-reverse.webp"
                                alt="Card rival"
                                className="duel-page__zones__rival"
                            />
                            ))}
                        </div>
            
                        <div className="duel-page__zones__drop-zone">
                        <DropZone id="userZone" disabled={!isUserZoneEnabled}>
                            {zones.userZone ? (
                                <img src={`/images/${zones.userZone}.webp`} alt={zones.userZone} />
                            ) : (
                                <p className="duel-page__zones__placeholder">Suelta tu carta aquí</p>
                            )}
                            </DropZone>
                            <div className='duel-page__zones__timer'>
                                <FlipClock to={countdownTo.current} onComplete={handleTimerComplete} />
                            </div>
                            <DropZone id="rivalZone" disabled={!isUserZoneEnabled}>
                                {rivalCard ? (
                                    <img src={`/images/${rivalCard}.webp`} alt={rivalCard} />
                                ) : (
                                    <h2>Zona Rival</h2>
                                )}
                            </DropZone>
                        </div>
                        <div className="duel-page__zones__cards">
                            {cards.map((card) => (
                                <Card key={card.id} {...card} />
                            ))}
                        </div>
                    </main>
                </DndContext>
                <div className='duel-page__buttons'>
                    <button className='duel-page__buttons__rules' popoverTarget="message" popoverTargetAction="toggle">
                        <img src="/images/Book.svg" alt="Reglas" />
                    </button>
                    <div id="message" popover='auto'>
                        <h1 className='rules__rules-label'>Reglas</h1>
                        <p className='rules__written-instructions'>Tres rondas deciden el destino. Quien conquiste dos, verá su nombre grabado en los pergaminos dorados de Hogwarts. Quien pierda... no dejará ni eco en los pasillos encantados.</p>
                    </div>
                    <button className='duel-page__button' onClick={() => setShowLeaveConfirm(true)}>
                        Abandonar
                    </button>
                </div>
                {showLeaveConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                    <h2>¿Estás seguro que deseas abandonar el duelo?</h2>
                    <p>Perderás la partida automaticamente.</p>
                    <div className="modal-buttons">
                        <button
                        className="modal-content__button"
                        onClick={() => {setShowLeaveConfirm(false)}}
                        >
                        Continuar Duelo
                        </button>
                        <NavLink
                        to="/home"
                        className="modal-content__button secondary"
                        onClick={() => {
                            setShowLeaveConfirm(false)
                            const playerInfo = JSON.parse(localStorage.getItem("playerInfo")) || {};
                            playerInfo.losses = (playerInfo.losses || 0) + 1;
                            localStorage.setItem("playerInfo", JSON.stringify(playerInfo));
                        }
                        }
                        >
                        Abandonar
                        </NavLink>
                    </div>
                    </div>
                </div>
                )}
                    {showModal && (
                    <ResultModal
                        resultMessage={resultMessage}
                        rivalScore={userLivesLoss}
                        userScore={rivalLivesLoss}

                        user={user}
                        onContinue={() => {
                        setShowModal(false);

                        if (userLivesLoss === 3 || rivalLivesLoss === 3) {
                            
                            if (rivalLivesLoss === 3) {
                                setFinalResultMessage('¡Has ganado el duelo!');
                                const playerInfo = JSON.parse(localStorage.getItem("playerInfo")) || {};
                                playerInfo.wins = (playerInfo.wins || 0) + 1;
                                localStorage.setItem("playerInfo", JSON.stringify(playerInfo));
                            }
                            else if (userLivesLoss === 3) {
                                setFinalResultMessage('Has perdido el duelo...');
                                const playerInfo = JSON.parse(localStorage.getItem("playerInfo")) || {};
                                playerInfo.losses = (playerInfo.losses || 0) + 1;
                                localStorage.setItem("playerInfo", JSON.stringify(playerInfo));
                            }
                            setShowFinalResult(true);
                        } else {
                            setZones({ userZone: null, rivalZone: null });
                            countdownTo.current = Date.now() + 40 * 1000;
                        }
                        }}
                    />
                    )}
                {showFinalResult && (
                <div className="modal-overlay">
                    <div className="modal-content">
                    <h2>{finalResultMessage}</h2>
                    <button className='modal-content__button' onClick={() => {
                        setUserLivesLoss(0);
                        setRivalLivesLoss(0);
                        setZones({ userZone: null, rivalZone: null });
                        countdownTo.current = Date.now() + 40 * 1000;
                        setShowFinalResult(false);
                    }}>
                    Revancha
                </button>
                <NavLink to='/home' className='modal-content__button secondary'> Volver al perfil</NavLink>
                </div>
            </div>
            )}
        </div>
        </div>
        </>
  );
};

export default DuelRoom;
