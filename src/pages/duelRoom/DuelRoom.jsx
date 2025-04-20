import './DuelRoom.scss';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { useState, useRef, useEffect } from 'react';
import FlipClock from '../../components/flipClock/FlipClock';
import { useParams } from 'react-router-dom';
import { useStomp } from '../../utils/useStomp';

const cards = [
  { id: 'Expelliarmus', image: '/images/Expelliarmus.webp' },
  { id: 'Avada Kedavra', image: '/images/Avada Kedavra.webp' },
  { id: 'Protego', image: '/images/Protego.webp' },
];

const Card = ({ id, image }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    cursor: 'grab',
  };

  return (
    <img
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      src={image}
      alt={id}
      style={style}
      className={`card`}
    />
  );
};

const DropZone = ({ id, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div ref={setNodeRef} className={`dropzone ${isOver ? 'active' : ''}`}>
      {children}
    </div>
  );
};

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

  const countdownTo = useRef(Date.now() + 30 * 1000);
  const [showModal, setShowModal] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

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

  useEffect(() => {
    const sub = subscribe(`/user/queue/round/result`, message => {
      const data = JSON.parse(message.body);
      setGameData(data);
  
      const isWinner = data.result?.winner === sessionId;
      setResultMessage(isWinner ? '¡Ganaste!' : 'Perdiste');
      setShowModal(true);
    });
  
    return () => {
      sub?.unsubscribe();
    };
  }, [subscribe, sessionId]);

  useEffect(() => {
    console.log('Updated game data:', gameData);
  }, [gameData]);

  return (
    <div className='container'>
      <div className='duel-page'>
        <div className='duel-page__players-info'>
          <div>
            <h2>User (You)</h2>
            <p>
              <strong>Dumbledore</strong> (Gryffindor){' '}
            </p>
          </div>
          <div>
            <h2>Opponent</h2>
            <p>
              <strong>Harry Potter</strong> (Gryffindor){' '}
            </p>
          </div>
        </div>
        <DndContext onDragEnd={handleDragEnd}>
          <main className='duel-page__zones'>
            <div className='duel-page__zones__rivals'>
              {[1, 2, 3].map((_, i) => (
                <img
                  key={i}
                  src='/images/Card-reverse.webp'
                  alt='Card rival'
                  className='duel-page__zones__rival'
                />
              ))}
            </div>

            <div className='duel-page__zones__drop-zone'>
              <DropZone id='userZone'>
                {zones.userZone ? (
                  <img src={`/images/${zones.userZone}.webp`} alt={zones.userZone} />
                ) : (
                  <p className='duel-page__zones__placeholder'>Suelta tu carta aquí</p>
                )}
              </DropZone>
              <div className='duel-page__zones__timer'>
                <FlipClock to={countdownTo.current} onComplete={handleTimerComplete} />
              </div>
              <DropZone id='rivalZone'>
                <h2>Zona Rival</h2>
              </DropZone>
            </div>
            <div className='duel-page__zones__cards'>
              {cards.map(card => (
                <Card key={card.id} {...card} />
              ))}
            </div>
          </main>
        </DndContext>
        <div className='duel-page__buttons'>
          <button
            className='duel-page__buttons__rules'
            popoverTarget='message'
            popoverTargetAction='toggle'
          >
            <img src='/images/Book.svg' alt='Reglas' />
          </button>
          <div id='message' popover='auto'>
            <h1 className='rules__rules-label'>Reglas</h1>
            <p className='rules__written-instructions'>
              Tres rondas deciden el destino. Quien conquiste dos, verá su nombre grabado en los
              pergaminos dorados de Hogwarts. Quien pierda... no dejará ni eco en los pasillos
              encantados.
            </p>
          </div>
          <button className='duel-page__button'>Exit</button>
        </div>
        {showModal && (
          <div className='modal-overlay'>
            <div className='modal-content'>
              <h2>{resultMessage}</h2>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus, adipisci accusantium
                obcaecati aspernatur nesciunt eveniet deleniti incidunt eum ea! Numquam, vel. Eius
                ipsum, nisi sunt illum vero asperiores exercitationem quas.
              </p>
              <button className='modal-content__button' onClick={() => setShowModal(false)}>
                Regresar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DuelRoom;
