/*
   Root, Router 配置
*/
import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import lazyLoad from "./lazyLoad";

const Main = lazyLoad(() => import("pages/main"));
const Home = lazyLoad(() => import("pages/home"));


const Root = () => (
    <Switch>
        <Route path="/home" exact component={Home} />
        <Route path="/main/:ticketId" exact component={Main} />
        <Redirect to="/home" />

    </Switch>
);

export default Root;
