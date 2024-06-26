import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'

import Header from '../Header'
import AllTypesOfJobsRoute from '../AllTypesOfJobsRoute'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobsRoute extends Component {
  state = {
    profileData: {},
    apiProfileStatus: apiStatusConstant.initial,
    apiJobsStatus: apiStatusConstant.initial,
    minimumPackage: '',
    employmentType: [],
    searchInput: '',
    allJobsData: [],
  }

  componentDidMount() {
    this.getProfileData()
    this.getAllJobsData()
  }

  //   Profile & Jobs API CALLS Starts --->
  getProfileData = async () => {
    this.setState({apiProfileStatus: apiStatusConstant.inProgress})

    const token = Cookies.get('jwt_token')
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const response = await fetch(profileApiUrl, options)
    // console.log(response)
    if (response.ok) {
      const data = await response.json()
      // console.log(data)
      const updatedData = {
        profileDetails: {
          name: data.profile_details.name,
          profileImageUrl: data.profile_details.profile_image_url,
          shortBio: data.profile_details.short_bio,
        },
      }
      //   console.log(updatedData)
      this.setState({
        profileData: updatedData,
        apiProfileStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({apiProfileStatus: apiStatusConstant.failure})
    }
  }

  getAllJobsData = async () => {
    const {searchInput, employmentType, minimumPackage} = this.state

    this.setState({apiJobsStatus: apiStatusConstant.inProgress})

    // const apiUrl = 'https://apis.ccbp.in/jobs?employment_type=FULLTIME,PARTTIME&minimum_package=1000000&search='
    const token = Cookies.get('jwt_token')
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join()}&minimum_package=${minimumPackage}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobsApiUrl, options)
    if (response.ok) {
      const data = await response.json()
      // console.log(data)
      const updatedData = data.jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))
      //   console.log(updatedData)
      this.setState({
        allJobsData: updatedData,
        apiJobsStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({apiJobsStatus: apiStatusConstant.failure})
    }
  }
  //   Profile & Jobs API CALLS Ends --->

  //   Failure OnClick Retry Button Starts --->
  onClickRetryProfileContent = () => {
    this.getProfileData()
  }

  onClickedRetry = () => {
    this.getAllJobsData()
  }
  //   Failure OnClick Retry Button Ends --->

  //   SearchInput Button Clicks --->
  onClickedSearchButton = () => {
    this.getAllJobsData()
  }

  //   Update employmentType List & minimumPackage & searchInput in State Starts --->
  onChangeTypeOfEmployment = event => {
    const {employmentType} = this.state

    if (employmentType.includes(event.target.id)) {
      const updatedList = employmentType.filter(
        item => item !== event.target.id,
      )
      this.setState({employmentType: updatedList}, this.getAllJobsData)
    } else {
      this.setState(
        prevState => ({
          employmentType: [...prevState.employmentType, event.target.id],
        }),
        this.getAllJobsData,
      )
    }
  }

  salaryFilterIsChecked = event => {
    this.setState(
      {
        minimumPackage: event.target.id,
      },
      this.getAllJobsData,
    )
  }

  updateSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }
  //   Update employmentType List & minimumPackage & searchInput in State Ends --->

  //   Render SearchInput Box in Small & Large Devices Starts --->
  renderSearchInputInSmallDevices = () => {
    const {searchInput} = this.state
    return (
      <div className="search-box-container-sm">
        <input
          type="search"
          className="job-search-box-sm"
          placeholder="Search"
          value={searchInput}
          onChange={this.updateSearchInput}
        />
        <button
          type="button"
          data-testid="searchButton"
          aria-label="searchIcon"
          onClick={this.onClickedSearchButton}
          className="search-btn-sm"
        >
          <BsSearch className="search-icon-sm" color="#cbd5e1" size="15" />
        </button>
      </div>
    )
  }

  renderSearchInputInLargeDevices = () => {
    const {searchInput} = this.state
    return (
      <div className="search-box-container">
        <input
          type="search"
          className="job-search-box"
          placeholder="Search"
          onChange={this.updateSearchInput}
        />
        <button
          type="button"
          data-testid="searchButton"
          aria-label="searchIcon"
          value={searchInput}
          className="search-btn"
          onClick={this.onClickedSearchButton}
        >
          <BsSearch className="search-icon" color="#cbd5e1" size="15" />
        </button>
      </div>
    )
  }
  //   Render SearchInput Box in Small & Large Devices Ends --->

  //   Render the Success, Failure, InProgress View for Profile & Jobs Content Starts --->
  renderProfileSuccessView = () => {
    const {profileData} = this.state
    const {profileDetails} = profileData
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  renderProfileFailureView = () => (
    <div className="profile-failure-container">
      <button
        type="button"
        className="retry-btn"
        onClick={this.onClickRetryProfileContent}
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

  renderAllJobsListSuccessView = () => {
    const {allJobsData} = this.state
    return (
      <>
        {allJobsData.length > 0 ? (
          <ul className="all-job-lists-container">
            {allJobsData.map(data => (
              <AllTypesOfJobsRoute data={data} key={data.id} />
            ))}
          </ul>
        ) : (
          <div className="failure-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
              className="failure-img"
            />
            <h1 className="error-heading">No Jobs Found</h1>
            <p className="error-description">
              We could not find any jobs. Try other filters.
            </p>
          </div>
        )}
      </>
    )
  }

  renderAllJobsListFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="error-heading">Oops! Something Went Wrong</h1>
      <p className="error-description">
        We cannot seem to find the page you are looking for
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
  //   Render the Success, Failure, InProgress View for Profile & Jobs Content Ends --->

  //   Render Type of Employment List & Salary Range Starts --->
  renderTypeOfEmploymentLists = () => (
    <ul className="filter-type-lists-container">
      {employmentTypesList.map(item => (
        <li className="each-list-container" key={item.employmentTypeId}>
          <input
            type="checkbox"
            id={item.employmentTypeId}
            className="input-elem"
            name={item.employmentTypeId}
            onChange={this.onChangeTypeOfEmployment}
          />
          <label htmlFor={item.employmentTypeId} className="filter-label-text">
            {item.label}
          </label>
        </li>
      ))}
    </ul>
  )

  renderSalaryRangeLists = () => {
    const {minimumPackage} = this.state

    return (
      <ul className="filter-type-lists-container">
        {salaryRangesList.map(item => {
          const isChecked = item.salaryRangeId === minimumPackage ? 1 : 0
          return (
            <li className="each-list-container" key={item.salaryRangeId}>
              <input
                type="radio"
                id={item.salaryRangeId}
                className="input-elem"
                value={item.label}
                checked={isChecked}
                onChange={this.salaryFilterIsChecked}
              />
              <label htmlFor={item.salaryRangeId} className="filter-label-text">
                {item.label}
              </label>
            </li>
          )
        })}
      </ul>
    )
  }
  //   Render Type of Employment List & Salary Range Ends --->

  //   Render Views according to apiStatus with SWITCH Cases for Profile & Jobs Content Starts --->
  renderProfileContent = () => {
    const {apiProfileStatus} = this.state

    switch (apiProfileStatus) {
      case apiStatusConstant.success:
        return this.renderProfileSuccessView()
      case apiStatusConstant.failure:
        return this.renderProfileFailureView()
      case apiStatusConstant.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderAllJobsDetailsList = () => {
    const {apiJobsStatus} = this.state

    switch (apiJobsStatus) {
      case apiStatusConstant.success:
        return this.renderAllJobsListSuccessView()
      case apiStatusConstant.failure:
        return this.renderAllJobsListFailureView()
      case apiStatusConstant.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
  //   Render Views according to apiStatus with SWITCH Cases for Profile & Jobs Content Ends --->

  //   Main render() METHOD --->
  render() {
    const {employmentType} = this.state
    console.log(employmentType)
    return (
      <div className="jobs-main-container">
        <Header />
        <div className="jobs-content-area">
          {this.renderSearchInputInSmallDevices()}
          <div className="profile-and-filters-container">
            {this.renderProfileContent()}
            <hr color="#7e858e" />
            <h1 className="filter-type-heading">Type of Employment</h1>
            {this.renderTypeOfEmploymentLists()}
            <hr color="#7e858e" />
            <h1 className="filter-type-heading">Salary Range</h1>
            {this.renderSalaryRangeLists()}
          </div>
          <div className="search-and-job-lists-container">
            {this.renderSearchInputInLargeDevices()}
            {this.renderAllJobsDetailsList()}
          </div>
        </div>
      </div>
    )
  }
}
export default JobsRoute
