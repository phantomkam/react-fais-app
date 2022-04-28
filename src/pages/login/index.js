import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { withRouter } from 'react-router'

import { Col, FormControl, FormGroup, Button, Checkbox } from 'react-bootstrap'
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
			'Content-Type': 'text/plain'
		};
		axios.post(`https://majedra.tk/api/auth/login`, this.state.form, {headers})
			.then(res => {
				sessionStorage.setItem('token', res.data.token);
				sessionStorage.setItem('role', res.data.role);
				this.props.history.push('/');
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
export default withRouter(Login)