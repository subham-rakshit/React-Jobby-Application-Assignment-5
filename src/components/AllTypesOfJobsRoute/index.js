import {Link} from 'react-router-dom'

import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'

import './index.css'

const AllTypesOfJobsRoute = props => {
  const {data} = props
  return (
    <Link to={`/jobs/${data.id}`} className="link-style">
      <li className="each-job-details-card" key={data.id}>
        <div className="job-logo-and-title-container">
          <img
            src={data.companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="job-title-and-rating-container">
            <h1 className="job-title">{data.title}</h1>
            <div className="rating-container">
              <FaStar color="#fbbf24" className="icon" />
              <p className="rating-count">{data.rating}</p>
            </div>
          </div>
        </div>
        <div className="job-location-type-and-salary-container">
          <div className="location-and-type-container">
            <div className="location-icon-and-type-container">
              <MdLocationOn color="#f8fafc" className="icon" />
              <p className="location-and-type-text">{data.location}</p>
            </div>
            <div className="location-icon-and-type-container">
              <BsFillBriefcaseFill color="#f8fafc" className="icon" />
              <p className="location-and-type-text">{data.employmentType}</p>
            </div>
          </div>
          <p className="job-package">{data.packagePerAnnum}</p>
        </div>
        <hr color="#7e858e" />
        <h1 className="description-heading">Description</h1>
        <p className="job-description">{data.jobDescription}</p>
      </li>
    </Link>
  )
}
export default AllTypesOfJobsRoute
