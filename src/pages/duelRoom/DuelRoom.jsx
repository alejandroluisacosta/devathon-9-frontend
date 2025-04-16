import './DuelRoom.scss'
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { useState } from 'react';

const cards = [
    { id: 'Expelliarmus', image: '/images/Expelliarmus.webp' },
    { id: 'Avada_Kedavra', image: '/images/Avada_Kedavra.webp' },
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
        className={`card`}      />
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
    const [zones, setZones] = useState({
    userZone: null,
    rivalZone: null,
    });

    const handleDragEnd = (event) => {
    const { over, active } = event;

    if (over) {
        setZones((prev) => ({
        ...prev,
        [over.id]: active.id,
        }));
    }
    };
  

    return (
        <div className='container'>
        <div className="duel-page">
                <div className='duel-page__players-info'>
                    <div>
                        <h2>User (You)</h2>
                        <p><strong>Dumbledore</strong> (Gryffindor) </p>
                    </div>
                    <div>
                        <h2>Opponent</h2>
                        <p><strong>Harry Potter</strong> (Gryffindor) </p>
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
                            <DropZone id="userZone">
                                {zones.userZone ? (
                                    <img src={`/images/${zones.userZone}.webp`} alt={zones.userZone} />
                                ) : (
                                    <p className="duel-page__zones__placeholder">Suelta tu carta aquí</p>
                                )}
                            </DropZone>
                            <DropZone id="rivalZone">
                                <h2>Zona Rival</h2>
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
                    <button className='duel-page__button'>
                        Exit
                    </button>
                </div>
        </div>
    </div>

    )
}

export default DuelRoom;