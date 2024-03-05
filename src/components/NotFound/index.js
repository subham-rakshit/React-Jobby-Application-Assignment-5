import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
      alt="not found"
      className="failure-img"
    />
    <h1 className="error-heading">Page Not Found</h1>
    <p className="error-description">
      We are sorry, the page you requested could not be found
    </p>
  </div>
)
export default NotFound
