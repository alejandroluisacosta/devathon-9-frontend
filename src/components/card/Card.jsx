import './card.scss';
import { useDraggable } from '@dnd-kit/core';

const Card = ({ id, image }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

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
      className="card"
    />
  );
};

export default Card;
