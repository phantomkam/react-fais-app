import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import decode from 'jwt-decode';
import { getNotes } from '../../functions/notes';

function Home() {
  const [notes, setNotes] = useState([]);

  const login = () => {
    this.props.history.push('/login')
  }

  const checkAdmin = () => {
    const token = sessionStorage.getItem('token');
    if(!token) return false;
    const decoded = decode(token);
    const role = decoded.role;
    if (role !== 'admin') return false;
    return true;
  }

  useEffect(() => {
    let mounted = true;
    getNotes()
      .then(items => {
        console.log(items);
        if (mounted) {
          setNotes(items)
        }
      })
    return () => mounted = false;
  }, [])

  return checkAdmin() ? (
    <Redirect to={{ pathname: '/admin' }} />
  ) : (
    <div>
      <h1>Home</h1>
      <p><button onClick={login}>Logout</button></p>
    </div>
  )
}

export default Home
