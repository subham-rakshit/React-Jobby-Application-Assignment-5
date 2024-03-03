import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  const onClickLogoutButton = () => {
    const {history} = props

    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="navbar-container">
      <div className="navbar-content-area">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo-home"
          />
        </Link>
        <ul className="navigation-item-container">
          <li className="nav-link">
            <Link to="/" className="link">
              Home
            </Link>
          </li>
          <li className="nav-link">
            <Link to="/jobs" className="link">
              Jobs
            </Link>
          </li>
        </ul>
        <button
          type="button"
          className="logout-btn"
          onClick={onClickLogoutButton}
        >
          Logout
        </button>
        <div className="navigation-item-container-small-device">
          <Link to="/">
            <AiFillHome size="20" color="#ffffff" />
          </Link>
          <Link to="/jobs">
            <BsBriefcaseFill size="20" color="#ffffff" />
          </Link>
          <FiLogOut size="20" color="#ffffff" onClick={onClickLogoutButton} />
        </div>
      </div>
    </div>
  )
}
export default withRouter(Header)
