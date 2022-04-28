import './App.css';
import React from 'react';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom'
import Admin from '../pages/admin'
import Home from '../pages/home'
import Login from '../pages/login'
import Signup from '../pages/signup'

function App() {

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

  return (
    <BrowserRouter>
    <Switch>
      <Route exact path="/login" render={props => <Login {...props} />} />
      <Route exact path="/register" render={props => <Signup {...props} />} />
      <Route exact path="/admin" render={props => <Admin {...props} />} />
      <AuthRoute exact path="/" component={Home} />
    </Switch>
  </BrowserRouter>
  )
}

export default App;