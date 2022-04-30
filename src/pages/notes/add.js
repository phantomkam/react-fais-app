import React, { useState } from 'react'
import { decodedToken } from '../../functions';
import config from '../../config'

const axios = require('axios');

function AddNote(props) {

    const [tmpnote, setTmpnote] = useState({
        title: '',
        content: '',
        user: decodedToken ? decodedToken.username : null
    });

    const logout = () => {
        sessionStorage.removeItem('token');
        props.history.push('/login')
    }

    const changeTitle = (e) => {
        setTmpnote({
            ...tmpnote,
            title: e.target.value
        });
    }

    const changeContent = (e) => {
        setTmpnote({
            ...tmpnote,
            content: e.target.value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const conf = {
            headers: {
                authorization: sessionStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        };

        axios.post(`${config.server_url}/api/notes/add`, tmpnote, conf)
            .then(res => {
                if (res.status === 200) {
                    alert('Successfully added!')
                    setTmpnote({
                        title: '',
                        content: '',
                        user: tmpnote.user
                    })
                }
            })

            .catch(function (error) {
                console.log(error);
            });
    }

    const goHome = () => {
        props.history.push('/')
    }

    return (
        <div className='container'>
            <h1>Add Note <button onClick={logout} className='btn btn-sm btn-default pull-right'>Logout</button></h1>
            <hr />

            <div className='row'>
                <div className='col-8'>
                    <button onClick={ goHome }> &larr; Back</button>
                    <form onSubmit={handleSubmit}>
                        <div className='form-group'>
                            <p>Title:</p>
                            <input className='form-control' id='title' value={tmpnote.title} onChange={e => changeTitle(e)} />
                        </div>
                        <div className='form-group'>
                            <p>Content:</p>
                            <textarea className='form-control' id='content' value={tmpnote.content} onChange={e => changeContent(e)} />
                        </div>
                        <p>
                            <input className='btn btn-sm btn-success' type="submit" value="Submit" />
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddNote
