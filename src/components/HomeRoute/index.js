import {Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const HomeRoute = () => (
  <div className="home-container">
    <Header />
    <div className="home-content-container">
      <h1 className="heading">
        Find The Job That
        <br />
        Fits Your Life
      </h1>
      <p className="description">
        Millions of people are searching for jobs, salary
        <br />
        information, company reviews. Find the job that fits your
        <br />
        abilities and potential.
      </p>
      <Link to="/jobs">
        <button className="find-jobs-btn" type="button">
          Find Jobs
        </button>
      </Link>
    </div>
  </div>
)

export default HomeRoute
