import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './components/Home/Home'
import Settings from './components/Settings/Settings'
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';


export default (
    <Switch>
        <Route path='/' exact component={ Home } />
        <Route path='/login' component={ Login } />
        <Route path='/dashboard' component={ Dashboard } />
        <Route path='/settings' component={ Settings } />
    </Switch>
)