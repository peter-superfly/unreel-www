import './scss/Loader.module.scss'

const Loader = () => {
  return (
    <div className="loader-wrapper">
      <span className="dot"></span>
      <div className="dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  )
}

export default Loader;