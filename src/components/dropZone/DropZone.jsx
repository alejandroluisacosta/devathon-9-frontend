import './dropZone.scss';
import { useDroppable } from '@dnd-kit/core';

const DropZone = ({ id, children, disabled = false }) => {
    const { isOver, setNodeRef } = useDroppable({ id, disabled });

    return (
        <div
        ref={setNodeRef}
        className={`dropzone ${isOver ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
        >
        {children}
        </div>
    );
};

export default DropZone;