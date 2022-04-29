import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import decode from 'jwt-decode';
import { getNotes } from '../../functions/notes';

function Home(props) {
  const [notes, setNotes] = useState([]);

  const logout = () => {
    localStorage.removeItem('token');
    props.history.push('/login')
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
    <div className='container'>
      <h1>Home</h1>
      <hr/>
      <h3>Notes</h3>
      <a href='/notes/add'>+Add</a>
      <ul className='list-group'>
        { notes.map((note, key) => 
          <li className='list-group-item' key={key}>
            <h5>{note.title}</h5>
            <p>{note.content}</p>
          </li>
        )}
      </ul>
      <p><button onClick={logout}>Logout</button></p>
    </div>
  )
}

export default Home
