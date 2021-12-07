import React, {useState} from 'react';
import styles from './Section.module.scss';
import Card from '../Card';
import {useDrag, useDrop} from 'react-dnd';
import {CardModel, SectionModel} from 'page/Board/Board';
import {emit} from '../../eventBus';
interface SectionComponentModel {
    value: SectionModel;
    move: string | null;
}

const getHoverIndex = (yPostion) => {
    return Math.max(Math.floor((yPostion - 90) / 110), 0);
};
const Section = (props: SectionComponentModel) => {
    const {value, move} = props;
    const [hoverIndex, setHoverIndex] = useState(null);
    const [hoverItem, setHoverItem] = useState(null);
    const [{canDrop, isOver}, drop] = useDrop(() => ({
        accept: 'card',
        drop: (item, monitor) => {
            setHoverIndex(null);
            setHoverItem(null);
            let y = monitor.getClientOffset().y;
            let hoverIndexlocal = getHoverIndex(y);
            return {name: value.sectionId, hoverIndex: hoverIndexlocal};
        },
        hover: (item, monitor) => {
            let height = monitor.getClientOffset().y;
            height = height - 90;
            height = height / 120;
            setHoverItem(item);
            setHoverIndex(Math.max(Math.floor(height), 0));
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        }),
    }));
    const [{display, opacity}, drag] = useDrag(() => ({
        type: 'section',
        item: {value},
        end: (item, monitor) => {
            console.log(item);
            const result = monitor.getDropResult();
            console.log('栏目拖动结果', result);
            emit('moveSection', {
                newSectionPost: {...item.value, postion: result.sectionHoverIndex},
                oldSectionPost: {...value}
            });
        },
        collect: (monitor) => {
            return {
                opacity: monitor.isDragging() ? 0 : 1,
                display: monitor.isDragging() ? 'none' : 'inline-block'
            };
        }
    }));

    return (
        <div className={styles.transformBox} ref={drag} style={{display, transform: typeof move === 'string' ? `translateX(${move === 'left' ? '-' : ''}320px)` : ''}}>
            <div className={styles.sectionBox} ref={drop} role={'Dustbin'} >

                <div className={styles.sectionName}>
                    {value.sectionName}
                </div>
                <div className={styles.sectionContent}>
                    {
                        value.cardList.map((card: CardModel, index) => {
                            let move = null;
                            //  同列
                            // console.log(card, value.cardList);

                            if (card?.parentId === hoverItem?.value?.parentId) {
                                let cardIndex = value.cardList.findIndex(item => item.cardId === hoverItem?.value.cardId);

                                let moveD = hoverIndex > cardIndex ? 'up' : 'down';
                                move = hoverIndex < index ? moveD : null;

                            } else if (card?.parentId !== hoverItem?.value?.parentId) {
                                move = typeof hoverIndex === 'number' ? hoverIndex <= index ? 'down' : null : null;
                            }
                            move = (move === null) ? null : (move ? 'down' : 'up');
                            if (move === 'up' && index === 0) {
                                move = null;
                            }
                            console.log(value.sectionId, index, hoverIndex, move, isOver);

                            return (
                                <Card key={card.cardId} index={index} value={card} move={(move && isOver) ? move : null}>
                                </Card>
                            );
                        })
                    }
                </div>
                <div className={styles.footer}>

                </div>
            </div>
        </div>

    );
};

export default Section;
