import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import Root from './router/routes';
import './index.css'

const mountNode = document.getElementById('page');
ReactDOM.render(
    <HashRouter basename="/">
        <Root />
    </HashRouter>
    ,
    mountNode
);