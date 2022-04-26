import React from 'react'
import { Redirect } from 'react-router-dom'
import decode from 'jwt-decode';

class Home extends React.Component {
  login = () => {
    this.props.history.push('/login')
  }

  checkAdmin = () => {
    const token = sessionStorage.getItem('token');
    if(!token) return false;
    const decoded = decode(token);
    const role = decoded.role;
    if (role !== 'admin') return false;
    return true;
  }

  render() {
    return this.checkAdmin() ? (
      <Redirect to={{ pathname: '/admin' }} />
    ) : (
      <div>
        <h1>Home</h1>
        <p><button onClick={this.login}>Logout</button></p>
      </div>
    )
  }
}

export default Home
