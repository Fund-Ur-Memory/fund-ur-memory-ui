import shapeIconBottom from "/images/shapes/shape_ico_hero_section_bottom.svg"
import { Link } from "react-scroll"

const Footer = () => {
  return (
    <footer className="ico_site_footer section_decoration section_shadow_top">
      <div className="decoration_item shape_top">
        <img src={shapeIconBottom || "/placeholder.svg"} alt="Bottom Line Shape" />
      </div>
      <div className="container">
        <ul className="pagelist_block unordered_list justify-content-center text-uppercase">
          <li>
            <Link
              spy={true}
              smooth={true}
              duration={500}
              offset={-100}
              className="nav-link scrollspy_btn"
              to="id_ico_about_section"
            >
              <span className="pagelist_label">About</span>
            </Link>
          </li>
        </ul>
        <div className="footer_bottom text-center">
          <p className="copyright_text m-0 text-secondary">Copyright© 2025 F.U.M Protocol. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer