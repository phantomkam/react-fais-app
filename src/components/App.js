import './App.css';
import React from 'react';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom'
import Admin from '../pages/admin'
import AddUser from '../pages/admin/users/add';
import EditUser from '../pages/admin/users/edit';
import Home from '../pages/home'
import Profile from '../pages/profile'
import Login from '../pages/login'
import Signup from '../pages/signup'
import Notes from '../pages/notes'
import AddNote from '../pages/notes/add'
import EditNote from '../pages/notes/edit'

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
        <AuthRoute exact path="/" component={Home} />
        <AuthRoute exact path="/admin" component={Admin} />
        <AuthRoute exact path="/admin/addUser" component={AddUser} />
        <AuthRoute exact path="/admin/editUser/:id" component={EditUser} />
        <AuthRoute exact path="/profile" component={Profile} />
        <AuthRoute exact path="/notes" component={Notes} />
        <AuthRoute exact path="/notes/add" component={AddNote} />
        <AuthRoute path="/notes/edit/:id" component={EditNote} />
      </Switch>
    </BrowserRouter>
  )
}

export default App;