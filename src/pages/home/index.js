import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { getNotes, decodedToken } from '../../functions/notes';
import config from '../../config'
import axios from 'axios';

function Home(props) {
  const [notes, setNotes] = useState([]);
  const [removed, setRemoved] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    props.history.push('/login')
  }

  const checkAdmin = () => {
    const role = decodedToken ? decodedToken.role : '';
    if (role !== 'admin') return false;
    return true;
  }

  const addNote = () => {
    props.history.push(`/notes/add`)
  }

  const editNote = (id) => {
    props.history.push(`/notes/edit/${id}`)
  }

  const removeNote = (note) => {

    const conf = {
      headers: {
        authorization: sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    };

    axios.delete(`${config.server_url}/api/notes/delete/${note._id}`, conf)
      .then(res => {
        if (res.status === 200) {
          alert('Successfully removed!');
          const newNotes = notes.filter((_note) => _note._id !== note._id )
          setNotes(
            newNotes  
          );
        } else {
          alert('Something went wrong!');
        }
      })

      .catch(function (error) {
        console.log(error);
      });
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
      <hr />
      <h3>Notes</h3>
      <p className='text-right'>
        <button className='btn btn-sm btn-primary' onClick={addNote}>+ Add Note</button>
      </p>
      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note, key) =>
            <tr key={note._id}>
              <td>{note.title}</td>
              <td>{note.content}</td>
              <td style={{ minWidth: 150 }}>
                <button className='btn btn-sm btn-primary' style={{ marginRight: 15 }} onClick={e => editNote(note._id)} >Edit</button>
                <button className='btn btn-sm btn-warning' onClick={e => removeNote(note)} >Delete</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <p><button onClick={logout}>Logout</button></p>
    </div>
  )
}

export default Home
