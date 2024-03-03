import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class LoginRoute extends Component {
  state = {username: '', password: '', submitErrorStatus: false, errorMsg: ''}

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    const {history} = this.props
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    const msgArray = errorMsg.split(' ')
    this.setState({submitErrorStatus: true, errorMsg: msgArray})
  }

  onFromSubmit = async event => {
    event.preventDefault()

    const {username, password} = this.state
    const userDetails = {username, password}
    const loginApiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginApiUrl, options)
    const data = await response.json()
    console.log(data)

    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  getUsernameUpdate = event => {
    this.setState({username: event.target.value})
  }

  getPasswordUpdate = event => {
    this.setState({password: event.target.value})
  }

  renderUsernameInput = () => {
    const {username} = this.state
    return (
      <>
        <label htmlFor="username" className="label-text">
          USERNAME
        </label>
        <input
          type="text"
          className="input-box"
          id="username"
          placeholder="Username"
          onChange={this.getUsernameUpdate}
          value={username}
        />
      </>
    )
  }

  renderPasswordInput = () => {
    const {password} = this.state

    return (
      <>
        <label htmlFor="password" className="label-text">
          PASSWORD
        </label>
        <input
          type="password"
          className="input-box"
          id="password"
          placeholder="Password"
          onChange={this.getPasswordUpdate}
          value={password}
        />
      </>
    )
  }

  render() {
    const {submitErrorStatus, errorMsg} = this.state
    if (errorMsg[0] === 'username') {
      errorMsg[0] = 'Username'
      errorMsg[2] = 'Password'
    } else if (errorMsg[0] === 'invalid') {
      errorMsg[0] = 'Invalid'
      errorMsg[1] = 'Username'
    }
    console.log(errorMsg)

    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-main-container">
        <div className="login-card">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          <form className="form-container" onSubmit={this.onFromSubmit}>
            {this.renderUsernameInput()}
            {this.renderPasswordInput()}
            <button type="submit" className="login-btn">
              Login
            </button>
            {submitErrorStatus && (
              <p className="error-msg">*{errorMsg.join(' ')}</p>
            )}
          </form>
        </div>
      </div>
    )
  }
}
export default LoginRoute
