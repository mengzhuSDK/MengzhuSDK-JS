/*
   Root, Router 配置
*/
import React from "react";
import { Route, Switch } from "react-router-dom";
import lazyLoad from "./lazyLoad";

const Main = lazyLoad(() => import(/* webpackChunkName: 'main' */"pages/main"));
const Root = () => (
    <Switch>
        <Route path="/" exact component={Main} />
    </Switch>
);

export default Root;
