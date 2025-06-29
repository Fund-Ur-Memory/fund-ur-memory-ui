const Scrollbar = () => {
  const scrollToTop = () => {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  }

  return (
    <ul className="smothscroll">
      <li>
        <button 
          onClick={scrollToTop}
          className="scroll-to-top-btn"
          aria-label="Scroll to top"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0',
            color: 'inherit',
            font: 'inherit'
          }}
        >
          <i className="far fa-arrow-up"></i>
        </button>
      </li>
    </ul>
  )
}

export default Scrollbar