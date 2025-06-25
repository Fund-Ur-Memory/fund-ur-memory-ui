import about1 from "/images/about/about_image.svg"
import shape from "/images/shapes/shape_poligon.svg"

// Define props interface
interface AboutProps {
  abClass?: string;
}

const About: React.FC<AboutProps> = ({ abClass = "" }) => {
  return (
    <section
      id="id_ico_about_section"
      className={`ico_about_section section_space pb-0 section_decoration ${abClass}`}
    >
      <div className="container">
        <div className="row justify-content-lg-between">
          <div className="col-lg-6">
            <div className="ico_heading_block" data-aos="fade-up" data-aos-duration="600">
              <h2 className="heading_text mb-0 text-white">Introducing F.U.M Protocol</h2>
            </div>
            <ul className="about_ico_block unordered_list_block">
              <li data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">
                <h3 className="title_text text-white">What is F.U.M?</h3>
                <p className="info_description mb-0">
                  F.U.M is a privacy-preserving, AI-powered cross-chain DeFi platform that enables wealthy investors to
                  create 'commitment contracts' - smart contracts that execute predetermined investment strategies while
                  preventing emotional trading decisions.
                </p>
              </li>
              <li data-aos="fade-up" data-aos-duration="600" data-aos-delay="200">
                <h3 className="title_text text-white">Why Commitment Contracts?</h3>
                <p className="info_description mb-0">
                  Commitment contracts prevent emotional trading and decision fatigue for wealthy investors by
                  automating investment strategies based on pre-defined rules and market conditions.
                </p>
              </li>
              <li data-aos="fade-up" data-aos-duration="600" data-aos-delay="300">
                <h3 className="title_text text-white">Why AI-Powered?</h3>
                <p className="info_description mb-0">
                  AI analysis and multi-agent systems enhance investment decisions by providing data-driven insights,
                  identifying market trends, and optimizing portfolio allocation for better risk-adjusted returns.
                </p>
              </li>
            </ul>
          </div>
          <div className="col-lg-5 d-lg-flex flex-lg-column-reverse">
            <ul className="about_ico_block unordered_list_block">
              <li data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">
                <h3 className="title_text text-white">Market Opportunity</h3>
                <p className="info_description mb-0">
                  F.U.M's market opportunity lies in the underserved High-Net-Worth Individual (HNWI) DeFi market,
                  offering sophisticated investment tools and strategies tailored to their unique needs and risk
                  profiles.
                </p>
              </li>
            </ul>
            <div className="ico_about_image text-center">
              <div className="ripple_shape mb-lg-5">
                <svg viewBox="0 0 501 455" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M500.5 227.5C500.5 352.824 388.618 454.5 250.5 454.5C112.382 454.5 0.5 352.824 0.5 227.5C0.5 102.176 112.382 0.5 250.5 0.5C388.618 0.5 500.5 102.176 500.5 227.5Z"
                    stroke="url(#sro_paint0)"
                  />
                  <path
                    d="M463.5 247.5C463.5 361.81 368.15 454.5 250.5 454.5C132.85 454.5 37.5 361.81 37.5 247.5C37.5 133.19 132.85 40.5 250.5 40.5C368.15 40.5 463.5 133.19 463.5 247.5Z"
                    stroke="url(#sro_paint1)"
                  />
                  <path
                    d="M425.5 268C425.5 371.031 347.12 454.5 250.5 454.5C153.88 454.5 75.5 371.031 75.5 268C75.5 164.969 153.88 81.5 250.5 81.5C347.12 81.5 425.5 164.969 425.5 268Z"
                    stroke="url(#sro_paint2)"
                  />
                  <path
                    d="M379.5 268C379.5 343.97 321.715 405.5 250.5 405.5C179.285 405.5 121.5 343.97 121.5 268C121.5 192.03 179.285 130.5 250.5 130.5C321.715 130.5 379.5 192.03 379.5 268Z"
                    stroke="url(#sro_paint3)"
                  />
                  <defs>
                    <linearGradient
                      id="sro_paint0"
                      x1="250.5"
                      y1="0"
                      x2="250.5"
                      y2="455"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0" stopColor="#2A246D" />
                      <stop offset="1" stopColor="#2A246D" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient
                      id="sro_paint1"
                      x1="250.5"
                      y1="40"
                      x2="250.5"
                      y2="455"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0" stopColor="#2A246D" />
                      <stop offset="1" stopColor="#2A246D" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient
                      id="sro_paint2"
                      x1="250.5"
                      y1="81"
                      x2="250.5"
                      y2="455"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0" stopColor="#2A246D" />
                      <stop offset="1" stopColor="#2A246D" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient
                      id="sro_paint3"
                      x1="250.5"
                      y1="130"
                      x2="250.5"
                      y2="406"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0" stopColor="#2A246D" />
                      <stop offset="1" stopColor="#2A246D" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="coin_image">
                <img src={about1 || "/placeholder.svg"} alt="About" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="decoration_item shape_shadow_1">
        <img src={shape || "/placeholder.svg"} alt="Shape Color Shadow" />
      </div>
      <div className="decoration_item shape_shadow_2">
        <img src={shape || "/placeholder.svg"} alt="Shape Color Shadow" />
      </div>
    </section>
  )
}

export default About