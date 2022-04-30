import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { getNotes, decodedToken } from '../../functions';
import config from '../../config'
import axios from 'axios';

function Home(props) {
  const [notes, setNotes] = useState([]);

  const logout = () => {
    sessionStorage.removeItem('token');
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

  const goProfile = () => {
    props.history.push(`/profile`)
  }
  
  useEffect(() => {
    let mounted = true;
    getNotes()
      .then(items => {
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
      <h1>Home <button className='btn btn-sm btn-default pull-right' onClick={logout}>Logout</button> <button className='btn btn-sm btn-default pull-right' onClick={ goProfile } style={{ marginRight: 15 }}>Profile</button></h1>
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
    </div>
  )
}

export default Home
