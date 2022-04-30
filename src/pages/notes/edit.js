import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import config from '../../config'

const axios = require('axios');

function EditNote(props) {
    let { id } = useParams();
    const [tmpnote, setTmpnote] = useState({
        title: '',
        content: ''
    });

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if(!loaded) {
            loadNote()
        }
    })

    const loadNote = async (e) =>{
        setLoaded(true);
        const conf = {
            headers: {
                authorization: sessionStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        };
        axios.get(`${config.server_url}/api/notes/get/${id}`, conf)
			.then(res => {
				if(res.data) {
                    setTmpnote({
                        title: res.data.title,
                        content: res.data.content
                    })
                }
			})

			.catch(function (error) {
				console.log(error);
			});
    }

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

    const handleSubmit = (e, id) => {
        e.preventDefault();
        const conf = {
            headers: {
                authorization: sessionStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        };

        axios.put(`${config.server_url}/api/notes/update/${id}`, tmpnote, conf)
            .then(res => {
                if (res.status === 200) {
                    alert('Successfully updated!')
                    setTmpnote({
                        title: res.data.title,
                        content: res.data.content
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
            <h1>Edit Note <button onClick={logout} className='btn btn-sm btn-default pull-right'>Logout</button></h1>
            <hr />

            <div className='row'>
                <div className='col-8'>
                    <button onClick={ goHome }> &larr; Back</button>
                    <form onSubmit={ e => handleSubmit(e, id) }>
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

export default EditNote
