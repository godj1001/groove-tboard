import React, {useEffect, useState} from 'react';
import styles from './Board.module.scss';
import Section from '../../components/Section';
import {on} from '../../eventBus';
import {useDrop} from 'react-dnd';

interface BoardModel {

}
interface BoardInfoModel {
    sectionList: SectionModel[];
}

export interface SectionModel {
    sectionId: number;
    sectionName: string;
    cardList: CardModel[];
}

export interface CardModel {
    cardId: number;
    parentId: number;
    cardName: string;
    cardContent: string;
}
interface UpdataModel {
    cardId: number;
    cardName: string;
    cardContent: string;
    parentId: number;
    postion: number;
}

const moveChild = (arr: any[], oldP: number, newP: number) => {
    if (arr.length === 1 || oldP === newP) {
        return arr;
    }
    let tm = arr[oldP];
    if (newP > oldP) {
        for (let i = oldP; i < newP; i++) {
            arr[i] = arr[i + 1];
        }
    } else if (newP < oldP) {
        for (let i = oldP; i > newP; i--) {
            arr[i] = arr[i - 1];
        }
    }
    arr[newP] = tm;
    return arr;
};

const updateData = (sectionList: SectionModel[], oldData: UpdataModel, newData: UpdataModel) => {
    console.log('更新函数', sectionList, oldData, newData);

    if (oldData.parentId === newData.parentId) {
        let section = sectionList.find(item => item.sectionId === oldData.parentId);
        let cardList = section.cardList;
        let length = section.cardList.length;
        let newPosition = Math.min(length - 1, newData.postion);
        let oldPosition = cardList.findIndex(item => item.cardId === oldData.cardId);
        let newArr = [];
        newArr = moveChild(cardList, oldPosition, newPosition);
        section.cardList = newArr;
        return sectionList;
    } else {
        let oldSource = sectionList.findIndex(item => item.sectionId === oldData.parentId);
        let newSource = sectionList.findIndex(item => item.sectionId === newData.parentId);
        oldData.postion = sectionList[oldSource].cardList.findIndex(item => item.cardId === oldData.cardId);
        let length = sectionList[newSource].cardList.length;
        let newPosition = Math.min(length, newData.postion);
        let tmp = sectionList[oldSource].cardList[oldData.postion];
        tmp.parentId = newData.parentId;
        let oldArr = [];
        for (let i = 0; i < sectionList[oldSource].cardList.length; i++) {
            if (i === oldData.postion) {
                continue;
            }
            oldArr.push(sectionList[oldSource].cardList[i]);
        }
        let newArr = [];
        if (length === 0) {
            newArr.push(tmp);
        } else {
            for (let j = 0; j < sectionList[newSource].cardList.length; j++) {
                if (newPosition === 0 && j === 0 || j === newPosition) {
                    newArr.push(tmp);
                }
                newArr.push(sectionList[newSource].cardList[j]);
                if (newPosition === length && j === length - 1) {
                    newArr.push(tmp);
                }
            }
        }
        sectionList[oldSource].cardList = oldArr;
        sectionList[newSource].cardList = newArr;
        return sectionList;
    }
};
const getXHover = (x) => {
    return Math.max(Math.floor((x - 10) / 310), 0);
};
const Board = (props: BoardModel) => {
    const [sectionHover, setSectionHover] = useState(null);
    const [sectionItem, setSectionItem] = useState(null);
    const [{canDrop, isOver}, drop] = useDrop(() => ({
        accept: 'section',
        drop: (item, monitor) => {
            let x = monitor.getClientOffset().x;
            console.log(item);
            setSectionHover(null);
            setSectionItem(null);
            return {sectionHoverIndex: getXHover(x)};
        },
        hover: (item, monitor) => {
            let x = monitor.getClientOffset().x;
            setSectionItem(item);
            setSectionHover(getXHover(x));
        }
    }));
    const [boardInfo, setBoardInfo] = useState(
        {
            sectionList: [
                {
                    sectionId: 1,
                    sectionName: '测试',
                    cardList: [
                        {
                            cardId: 1,
                            parentId: 1,
                            cardName: '卡片1',
                            cardContent: '内容1'
                        },
                        {
                            cardId: 2,
                            parentId: 1,
                            cardName: '卡片2',
                            cardContent: '内容2'
                        }
                    ]
                },
                {
                    sectionId: 2,
                    sectionName: '测试2',
                    cardList: [
                        {
                            cardId: 3,
                            parentId: 2,
                            cardName: '卡片3',
                            cardContent: '内容3'
                        }
                    ]
                },
                {
                    sectionId: 3,
                    sectionName: '测试3',
                    cardList: [
                        {
                            cardId: 4,
                            parentId: 3,
                            cardName: '卡片4',
                            cardContent: '内容4'
                        }
                    ]
                }
            ]
        }
    );

    useEffect(() => {
        on('moveCard', (data) => {
            console.log('on', data);

            let newSectionList = updateData(boardInfo.sectionList, data.oldCardPost, data.newCardPost);
            console.log('处理过的', newSectionList);

            setBoardInfo({
                sectionList: newSectionList
            });
        });

        on('moveSection', (data) => {
            console.log();
            const oldPosition = boardInfo.sectionList.findIndex(item => item.sectionId === data.newSectionPost.sectionId);


            let newSectionList = moveChild(boardInfo.sectionList, oldPosition, data.newSectionPost.postion);
            setBoardInfo({
                sectionList: newSectionList
            });
        });
    }, []);


    return (
        <div className={styles.boardPage} ref={drop}>
            {
                boardInfo.sectionList.map((item, index) => {
                    let move = null;
                    if (sectionHover !== null) {
                        const sectionIndex = boardInfo.sectionList.findIndex(section => section.sectionId === sectionItem?.value?.sectionId);

                        if (sectionIndex < index) {
                            if (sectionHover < index) {
                                move = 'right';
                            }
                        } else {
                            if (sectionHover <= index) {
                                move = 'right';
                            }
                        }

                        console.log(sectionHover, sectionIndex, index);
                    }
                    return (
                        <Section key={item.sectionId} value={item} move={move}></Section>
                    );
                })
            }
        </div>
    );
};

export default Board;
