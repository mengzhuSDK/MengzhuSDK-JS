import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Root from './router/routes';

const mountNode = document.getElementById('page');
ReactDOM.render(
    <BrowserRouter basename="/">
        <Root />
    </BrowserRouter>
    ,
    mountNode
);