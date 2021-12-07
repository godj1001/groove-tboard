import * as React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {useState} from 'react';
import './App.scss';
import Board from './page/Board';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
const App = () => {
    const [name, setName] = useState('groove react template');
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="App" id='wrapper'>
                <Board></Board>
            </div>
        </DndProvider>

    );
};

export default App;
