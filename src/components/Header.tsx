"use client";
import { useState, useEffect } from "react";
import { Link } from "react-scroll";
import Logo from "/images/site_logo/site_logo.png";
import MobileMenu from "./MobileMenu";
import { CustomConnectButton } from "./common/CustomConnectButton";
import "../styles/header-compact.css";

const Header = () => {
  const [mobailActive, setMobailState] = useState(false);
  const [isSticky, setSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };

  return (
    <header className={`site_header  ${isSticky ? "sticky" : ""}`}>
      <div className="nav_wrapper">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-3 col-5 d-flex align-items-center">
              <div className="site_logo">
                <a className="site_link" href="/" onClick={ClickHandler}>
                  <img
                    loading="lazy"
                    width={210}
                    src={Logo || "/placeholder.svg"}
                    alt="Cipher Site Logo"
                  />
                </a>
              </div>
            </div>
            <div className="col-lg-6 col-2">
              <nav className="main_menu navbar navbar-expand-lg">
                <div
                  className={`main_menu_inner collapse navbar-collapse justify-content-center ${
                    mobailActive ? "show" : ""
                  }`}
                  id="main_menu_dropdown"
                >
                  <ul className="main_menu_list unordered_list text-uppercase main-menu">
                    <li>
                      <a
                        onClick={ClickHandler}
                        className="nav-link"
                        href="/"
                        id="homes_submenu"
                        role="button"
                      >
                        <span className="nav_link_label" data-text="Home">
                          Home
                        </span>
                      </a>
                    </li>
                    <li>
                      <Link
                        to="id_ico_about_section"
                        spy={true}
                        smooth={true}
                        duration={500}
                        offset={-100}
                        className="nav-link scrollspy_btn"
                      >
                        <span
                          className="nav_link_label"
                          data-text="About Cipher"
                        >
                          About Cipher
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="id_ico_service_section"
                        spy={true}
                        smooth={true}
                        duration={500}
                        offset={-100}
                        className="nav-link scrollspy_btn"
                      >
                        <span className="nav_link_label" data-text="Features">
                          Protocol Features
                        </span>
                      </Link>
                    </li>
                  </ul>
                  <MobileMenu />
                </div>
              </nav>
            </div>
            <div className="col-lg-3 col-5">
              <ul className="btns_group unordered_list p-0 justify-content-end">
                <li className="d-lg-none">
                  <button
                    className="mobile_menu_btn"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#main_menu_dropdown"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                    onClick={() => setMobailState(!mobailActive)}
                  >
                    <i className="far fa-bars"></i>
                  </button>
                </li>
                <li>
                  <CustomConnectButton />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;