import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as myLib from './myLib.js';
import DashBoard from "./dashBoard";

ReactDOM.render(
    <DashBoard/>,
    document.getElementById('root')
);

myLib.darkTheme();

