import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import decode from 'jwt-decode';
import { getUsers, decodedToken } from '../../functions';
import axios from 'axios';
import config from '../../config'

function Admin(props) {
    const [users, setUsers] = useState([]);
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
        getUsers()
            .then(users => {
                if (mounted) {
                    setUsers(users)
                }
            })
        return () => mounted = false;
    }, [])

    const editUser = (id) => {
        props.history.push(`/admin/editUser/${id}`)
    }

    const removeUser = (user) => {
        const conf = {
            headers: {
                authorization: sessionStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        };

        axios.delete(`${config.server_url}/api/admin/deleteUser/${user._id}`, conf)
            .then(res => {
                if (res.status === 200) {
                    alert('Successfully removed!');
                    const newUsers = users.filter((_user) => _user._id !== user._id)
                    setUsers(
                        newUsers
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

    return !checkAdmin() ? (
        <Redirect to={{ pathname: '/' }} />
    ) : (
        <div className='container'>
            <div className='row'>
                <div className='col-sm-12'>
                    <h1>Admin Dashboard <button className='btn btn-sm btn-default pull-right' onClick={goProfile}>Profile</button></h1>
                </div>
            </div>
            <hr />
            <div className='row'>
                <div className='col-sm-3'>
                    <ul className="list-group" style={{ marginTop: 20 }}>
                        <button className="list-group-item active">Users</button>
                        <button className="list-group-item" onClick={e=> logout()}>Logout</button>
                    </ul>
                </div>
                <div className='col-sm-9'>
                    <div className='users'>
                        <h3>User List <a className='btn btn-sm btn-default pull-right' href="/admin/addUser">+ Add User</a></h3>
                        <table className='table table-hover'>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, key) => {
                                    return decodedToken.email !== user.email && (
                                        <tr key={key}>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role}</td>
                                            <td>
                                                <button className='btn btn-sm btn-primary' style={{ marginRight: 15 }} onClick={e => editUser(user._id)} >Edit</button>
                                                <button className='btn btn-sm btn-warning' onClick={e => removeUser(user)} >Delete</button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Admin
