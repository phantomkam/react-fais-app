import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import config from '../../config'
import { Col, FormControl, FormGroup, Button } from 'react-bootstrap'

class Login extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			form: {
				username: '',
				password: '',
			},
		}
	}


	onChange = (key, e) => {
		let { form } = this.state;
		form[key] = e.target.value
		this.setState({ form });
	}

	onSubmit = (evt) => {
		evt.preventDefault();
		const headers = {
			'Content-Type': 'application/json'
		};
		axios.post(`${config.server_url}/api/auth/login`, this.state.form, {headers})
			.then(res => {
				if(res.status === 200) {
					if(res.data.state) {
						sessionStorage.setItem('token', res.data.token);
						window.location.href = '/'
					} else {
						alert(res.data.message)
					}
				}
			})

			.catch(function (error) {
				console.log(error);
			});
	}

	render() {
		return (
			<Col sm={4} smOffset={4} style={{ marginTop: '140px' }}>
				<Col>
					<form className="well" onSubmit={this.onSubmit}>
						<h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h1>
						<FormGroup>
							<FormControl type="text" placeholder="Username" onChange={this.onChange.bind(this, 'username')} style={{ height: '40px' }} />
						</FormGroup>
						<FormGroup>
							<FormControl type="password" placeholder="Password" onChange={this.onChange.bind(this, 'password')} style={{ height: '40px' }} />
						</FormGroup>
						<FormGroup className='text-center'>
							<Button bsStyle="primary" style={{ width: '90%', height: '40px', margin: '10px 0', borderRadius: 15 }} onClick={this.onSubmit} type="submit">submit</Button>
						</FormGroup>
						<FormGroup>
							<Col className='text-center'>
								<Link to="/register">Not a member?</Link>
							</Col>
						</FormGroup>
					</form>
				</Col>
			</Col>
		)
	}
}
export default Login