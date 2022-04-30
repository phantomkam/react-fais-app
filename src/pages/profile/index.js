import React, { useState } from 'react'
import { decodedToken } from '../../functions';
import config from '../../config'
import axios from 'axios';

function Profile(props) {
    const [profile, setProfile] = useState({
        username: decodedToken ? decodedToken.username : '',
        email: decodedToken ? decodedToken.email : '',
        role: decodedToken ? decodedToken.role : ''
    });

    const [securityInfo, setSecurityInfo] = useState({
        pw: '',
        npw: '',
        cpw: '',
    })

    const [infoChanged, setInfoChanged] = useState(false)
    const [scrInfoChanged, setScrInfoChanged] = useState(false)

    const logout = () => {
        sessionStorage.removeItem('token');
        props.history.push('/login')
    }

    const changeUsername = (e) => {
        if (e.target.value !== decodedToken.username || profile.email !== decodedToken.email) {
            setInfoChanged(true)
        } else {
            setInfoChanged(false)
        }
        setProfile((prev) => ({
            ...prev,
            username: e.target.value
        }))
    }

    const changeEmail = (e) => {
        if (e.target.value !== decodedToken.email || profile.username !== decodedToken.username) {
            setInfoChanged(true)
        } else {
            setInfoChanged(false)
        }
        setProfile((prev) => ({
            ...prev,
            email: e.target.value
        }))
    }

    const handleUserInfoSubmit = () => {
        if (!infoChanged) return;

        const conf = {
            headers: {
                authorization: sessionStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        };

        axios.post(`${config.server_url}/account/profile/update`, {
            email: decodedToken.email,
            data: {
                username: profile.username,
                email: profile.email
            }
        }, conf)
            .then(res => {
                if (res.status === 200) {
                    alert('Successfully updated!')
                    sessionStorage.setItem('token', res.data.token);
                    setInfoChanged(false);
                }
            })

            .catch(function (error) {
                console.log(error);
            });
    }

    const goHome = () => {
        props.history.push('/')
    }

    const changeSecurityInfo = (e, _key) => {
        setScrInfoChanged(true)
        setSecurityInfo((prev) => ({
            ...prev,
            [_key]: e.target.value
        }))
    }

    const handleSecurityInfoSubmit = (e) => {
        e.preventDefault();
        if (!securityInfo.pw) {
            alert('Insert Current Password!');
            return
        }
        if (!securityInfo.npw) {
            alert('Insert New Password!');
            return
        }
        if (!securityInfo.cpw || securityInfo.cpw !== securityInfo.npw) {
            alert('Insert Right Confirm Password!');
            return
        }

        const conf = {
            headers: {
                authorization: sessionStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        };

        axios.post(`${config.server_url}/account/profile/updatePassword`, {
            email: decodedToken.email,
            current_password: securityInfo.pw,
            new_password: securityInfo.npw
        }, conf)
            .then(res => {
                if (res.status === 200) {
                    if (!res.data.state) {
                        alert(res.data.message);
                        return
                    }
                    setSecurityInfo({
                        pw: '',
                        npw: '',
                        cpw: '',
                    })
                    setScrInfoChanged(false);
                }

                alert(res.data.message);
                return
            })

            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div className='container'>
            <h1>Profile <button className='btn btn-sm btn-default pull-right' onClick={logout}>Logout</button></h1>
            <hr />
            <div className='row'>
                <div className='col-sm-12'>
                    <button onClick={goHome}> &larr; Back</button>
                    <br />
                </div>
                <div className='col-sm-6'>
                    <h4>User Information</h4>
                    <br />
                    <div className="input-group">
                        <span className="input-group-addon" style={{ minWidth: 100 }}>Username</span>
                        <input type="text" className="form-control" aria-describedby="basic-addon1" value={profile.username} onChange={changeUsername} />
                    </div>
                    <br />
                    <div className="input-group">
                        <span className="input-group-addon" style={{ minWidth: 100 }}>Email</span>
                        <input type="email" className="form-control" aria-describedby="basic-addon1" value={profile.email} onChange={changeEmail} />
                    </div>
                    <br />
                    <div className="input-group">
                        <span className="input-group-addon" style={{ minWidth: 100 }}>Role</span>
                        <input type="text" className="form-control" aria-describedby="basic-addon1" value={profile.role} disabled />
                    </div>
                    <br />
                    <button className='btn btn-sm btn-success btn-block' onClick={handleUserInfoSubmit} disabled={!infoChanged}>Save</button>
                </div>
                <div className='col-sm-6'>
                    <h4>Change Password</h4>
                    <br />
                    <div className="input-group">
                        <span className="input-group-addon" style={{ minWidth: 140 }}>Current Password</span>
                        <input type="password" className="form-control" aria-describedby="basic-addon1" value={securityInfo.pw} onChange={e => changeSecurityInfo(e, 'pw')} />
                    </div>
                    <br />
                    <div className="input-group">
                        <span className="input-group-addon" style={{ minWidth: 140 }}>New Password</span>
                        <input type="password" className="form-control" aria-describedby="basic-addon1" value={securityInfo.npw} onChange={e => changeSecurityInfo(e, 'npw')} />
                    </div>
                    <br />
                    <div className="input-group">
                        <span className="input-group-addon" style={{ minWidth: 140 }}>Confirm Password</span>
                        <input type="password" className="form-control" aria-describedby="basic-addon1" value={securityInfo.cpw} onChange={e => changeSecurityInfo(e, 'cpw')} />
                    </div>
                    <br />
                    <button className='btn btn-sm btn-success btn-block' onClick={handleSecurityInfoSubmit} disabled={!scrInfoChanged}>Save</button>
                </div>
            </div>
        </div>
    )
}

export default Profile
