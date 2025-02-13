import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import decode from 'jwt-decode';
import { getNotes } from '../../functions';

function Notes(props) {
    const [notes, setNotes] = useState([]);

    const logout = () => {
        sessionStorage.removeItem('token')
        props.history.push('/login')
    }

    const checkAdmin = () => {
        const token = sessionStorage.getItem('token');
        if (!token) return false;
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
            <h1>Notes</h1>
            <a href='add'>+Add</a>
            <ul>
                {notes.map((note, key) =>
                    <li key={key}> {note.title} </li>
                )}
            </ul>
            <p><button onClick={logout}>Logout</button></p>
        </div>
    )
}

export default Notes