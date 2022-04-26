import React from 'react';

import Admin from '../admin'
import Home from '../home'
import Login from '../login'
import Signup from '../signup'
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom'


const checkAuth = () => {
  const token = sessionStorage.getItem('token');
  return !!token
}

const AuthRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    checkAuth() ? (
      <Component {...props} />
    ) : (
      <Redirect to={{ pathname: '/login' }} />
    )
  )} />
)

export default () => (

  <BrowserRouter>
    <Switch>
      <Route exact path="/login" render={props => <Login {...props} />} />
      <Route exact path="/register" render={props => <Signup {...props} />} />
      <Route exact path="/admin" render={props => <Admin {...props} />} />
      <AuthRoute exact path="/" component={Home} />
    </Switch>
  </BrowserRouter>

)








