import {emit} from '../../eventBus';
import React, {DragEvent, DragEventHandler, useState, useRef} from 'react';
import {useDrag} from 'react-dnd';
import styles from './Card.module.scss';
import {CardModel} from 'page/Board/Board';

interface CardComponentModel {
    value: CardModel,
    move: string | null;
    index: number;
}
const Card = (props: CardComponentModel) => {
    const {value, move, index} = props;
    const [dragStatus, setDragStatus] = useState<boolean>(false);
    const [timer, setTimer] = useState(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const [{display}, dragRef] = useDrag(() => ({
        type: 'card',
        item: {value},
        collect: (monitor) => {
            // console.log(monitor.getClientOffset());
            return {
                opacity: monitor.isDragging() ? 0 : 1,
                display: monitor.isDragging() ? 'none' : 'block'
            };
        },
        end: (item, monitor) => {
            const result = monitor.getDropResult();
            emit('moveCard', {
                newCardPost: {...item.value, parentId: result?.name, postion: result.hoverIndex},
                oldCardPost: {...value, postion: index}
            });
        },
    }), []);
    const mouseDown = () => {
        setTimer(setTimeout(() => {
            console.log(1);
            setDragStatus(true);
        }, 1000));
    };
    return (
        <div className={styles.cardBox} ref={dragRef} style={{display, transform: typeof move === 'string' ? `translateY(${move === 'down' ? '' : '-'}130px)` : ''}}>
            <div className={styles.cardName}>
                {value.cardName}
            </div>
            <div className={styles.cardContent}>
                {value.cardContent}
            </div>
        </div>
    );
};

export default Card;
