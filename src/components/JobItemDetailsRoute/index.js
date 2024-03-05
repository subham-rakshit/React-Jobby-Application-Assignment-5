import {Component} from 'react'

import {withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {FaStar} from 'react-icons/fa'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {HiExternalLink} from 'react-icons/hi'

import Header from '../Header'

import './index.css'

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetailsRoute extends Component {
  state = {jobDetailsData: {}, apiStatusJobDetails: apiStatusConstant.initial}

  componentDidMount() {
    this.getJobItemDetailsData()
  }

  getJobItemDetailsData = async onClickId => {
    this.setState({apiStatusJobDetails: apiStatusConstant.inProgress})

    const token = Cookies.get('jwt_token')

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jobDetailsApiUrl = `https://apis.ccbp.in/jobs/${
      onClickId === undefined ? id : onClickId
    }`
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }

    const response = await fetch(jobDetailsApiUrl, options)
    if (response.ok) {
      const data = await response.json()
      // console.log(data)
      const updatedDetails = {
        jobDetails: {
          companyLogoUrl: data.job_details.company_logo_url,
          companyWebsiteUrl: data.job_details.company_website_url,
          employmentType: data.job_details.employment_type,
          id: data.job_details.id,
          jobDescription: data.job_details.job_description,
          lifeAtCompany: {
            description: data.job_details.life_at_company.description,
            imageUrl: data.job_details.life_at_company.image_url,
          },
          location: data.job_details.location,
          packagePerAnnum: data.job_details.package_per_annum,
          rating: data.job_details.rating,
          title: data.job_details.title,
          skills: data.job_details.skills.map(item => ({
            imageUrl: item.image_url,
            name: item.name,
          })),
        },
        similarJobs: data.similar_jobs.map(item => ({
          companyLogoUrl: item.company_logo_url,
          employmentType: item.employment_type,
          id: item.id,
          jobDescription: item.job_description,
          location: item.location,
          rating: item.rating,
          title: item.title,
        })),
      }
      //   console.log(updatedDetails)
      this.setState({
        jobDetailsData: updatedDetails,
        apiStatusJobDetails: apiStatusConstant.success,
      })
    } else {
      this.setState({apiStatusJobDetails: apiStatusConstant.failure})
    }
  }

  renderJobDetailsCard = () => {
    const {jobDetailsData} = this.state
    const {jobDetails, similarJobs} = jobDetailsData
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      skills,
      title,
    } = jobDetails
    const {description, imageUrl} = lifeAtCompany
    console.log(similarJobs)

    return (
      <>
        <div className="job-details-card">
          <div className="job-item-details-logo-and-title-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="job-title-and-rating-container">
              <h1 className="job-item-details-title">{title}</h1>
              <div className="rating-container">
                <FaStar color="#fbbf24" className="star-icon" />
                <p className="rating-count">{rating}</p>
              </div>
            </div>
          </div>

          <div className="job-item-details-location-type-and-salary-container">
            <div className="job-item-details-location-and-type-container">
              <div className="location-icon-and-type-container">
                <MdLocationOn color="#f8fafc" className="icon" />
                <p className="job-item-details-location-and-type-text">
                  {location}
                </p>
              </div>
              <div className="location-icon-and-type-container">
                <BsFillBriefcaseFill color="#f8fafc" className="icon" />
                <p className="job-item-details-location-and-type-text">
                  {employmentType}
                </p>
              </div>
            </div>
            <p className="job-item-details-package">{packagePerAnnum}</p>
          </div>

          <hr color="#7e858e" />

          <div className="description-heading-and-visit-url-container">
            <h1 className="job-item-details-description-heading">
              Description
            </h1>
            <a
              href={companyWebsiteUrl}
              target="__blank"
              className="external-link"
            >
              Visit <HiExternalLink color="#6366f1" />
            </a>
          </div>

          <p className="job-item-details-description">{jobDescription}</p>

          <h1 className="job-item-details-description-heading">Skills</h1>

          <ul className="job-item-details-skills-container">
            {skills.map(skill => (
              <li className="skills-container" key={skill.name}>
                <img
                  src={skill.imageUrl}
                  alt={skill.name}
                  className="skill-img"
                />
                <p className="skill-name">{skill.name}</p>
              </li>
            ))}
          </ul>

          <h1 className="job-item-details-description-heading">
            Life at Company
          </h1>

          <div className="job-item-life-at-company-container">
            <p className="life-at-company-description">{description}</p>
            <img
              src={imageUrl}
              alt="life at company"
              className="life-at-company-img"
            />
          </div>
        </div>
        <div className="similar-jobs-container">
          <h1 className="similar-jobs-heading">Similar Jobs</h1>
          <ul className="similar-jobs-list-container">
            {similarJobs.map(job => {
              const getSimilarJobDetails = () => {
                this.getJobItemDetailsData(job.id)
              }
              return (
                <li
                  key={job.id}
                  className="similar-jobs-card"
                  onClick={getSimilarJobDetails}
                >
                  <div className="similar-jobs-logo-and-title-container">
                    <img
                      src={job.companyLogoUrl}
                      alt="similar job company logo"
                      className="similar-job-company-logo"
                    />
                    <div className="similar-job-title-and-rating-container">
                      <h1 className="similar-job-item-details-title">
                        {job.title}
                      </h1>
                      <div className="rating-container">
                        <FaStar color="#fbbf24" className="star-icon" />
                        <p className="rating-count">{job.rating}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h1 className="similar-job-details-description-heading">
                      Description
                    </h1>
                    <p className="similar-job-details-description">
                      {job.jobDescription}
                    </p>
                  </div>

                  <div className="similar-job-details-location-type-container">
                    <div className="location-icon-and-type-container">
                      <MdLocationOn color="#f8fafc" className="icon" />
                      <p className="job-item-details-location-and-type-text">
                        {job.location}
                      </p>
                    </div>
                    <div className="location-icon-and-type-container">
                      <BsFillBriefcaseFill color="#f8fafc" className="icon" />
                      <p className="job-item-details-location-and-type-text">
                        {job.employmentType}
                      </p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </>
    )
  }

  renderJobDetailsSuccessView = () => <>{this.renderJobDetailsCard()}</>

  onClickedRetry = () => {
    this.getJobItemDetailsData()
  }

  renderJobDetailsFailureView = () => (
    <div className="job-details-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="error-heading">Oops! Something Went Wrong</h1>
      <p className="error-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickedRetry}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="40" width="40" />
    </div>
  )

  renderJobDetailsContent = () => {
    const {apiStatusJobDetails} = this.state

    switch (apiStatusJobDetails) {
      case apiStatusConstant.success:
        return this.renderJobDetailsSuccessView()
      case apiStatusConstant.failure:
        return this.renderJobDetailsFailureView()
      case apiStatusConstant.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-item-details-main-container">
        <Header />
        <div className="job-details-content-area">
          {this.renderJobDetailsContent()}
        </div>
      </div>
    )
  }
}
export default withRouter(JobItemDetailsRoute)
