import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import config from '../../../config'

const axios = require('axios');

function EditUser(props) {

    let { id } = useParams();

    const [user, setUser] = useState({
        email: '',
        username: '',
        password: '',
        role: 'user'
    });

    const [loaded, setLoaded] = useState(false);

    const logout = () => {
        sessionStorage.removeItem('token');
        props.history.push('/login')
    }

    useEffect(() => {
        if(!loaded) {
            loadUser()
        }
    })

    const loadUser = async (e) =>{
        setLoaded(true);
        const conf = {
            headers: {
                authorization: sessionStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        };
        axios.get(`${config.server_url}/api/admin/getUser/${id}`, conf)
			.then(res => {
				if(res.data) {
                    setUser({
                        username: res.data.username,
                        email: res.data.email,
                        password: res.data.password,
                    })
                }
			})

			.catch(function (error) {
				console.log(error);
			});
    }

    const changeUser = (e, _key) => {
        setUser({
            ...user,
            [_key]: e.target.value
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

        axios.put(`${config.server_url}/api/admin/updateUser/${id}`, user, conf)
            .then(res => {
                if (res.status === 200) {
                    alert('Successfully updated!')
                    props.history.push('/')
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
            <h1>Add User <button onClick={logout} className='btn btn-sm btn-default pull-right'>Logout</button></h1>
            <hr />
            <button onClick={ goHome }> &larr; Back</button>
            <div className='row'>
                <div className='col-sm-6 col-sm-offset-3'>
                    <form onSubmit={handleSubmit}>
                        <h4 className='text-center'>User Form</h4>
                        <hr/>
                        <div className='form-group'>
                            <p>Username:</p>
                            <input type="text" className='form-control' id='username' value={user.username} onChange={e => changeUser(e, 'username')} />
                        </div>
                        <div className='form-group'>
                            <p>Email:</p>
                            <input type="email" className='form-control' id='email' value={user.email} onChange={e => changeUser(e, 'email')} />
                        </div>
                        <div className='form-group'>
                            <p>Password:</p>
                            <input type="password" className='form-control' id='password' value={user.password} onChange={e => changeUser(e, 'password')} />
                        </div>
                        <p className='text-center' style={{marginTop: 30}}>
                            <input className='btn btn-md btn-success' type="submit" value="Submit" />
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditUser
