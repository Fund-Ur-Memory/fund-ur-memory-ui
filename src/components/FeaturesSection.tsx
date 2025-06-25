import CountUp from "react-countup"
import icon1 from "../icons/icon_dollar.svg"
import icon2 from "../icons/icon_chart.svg"
import icon3 from "../icons/icon_gift.svg"
import shape1 from "/images/shapes/shape_chart.svg"
import shape2 from "/images/shapes/shape_range.svg"
import shape3 from "/images/shapes/shape_poligon.svg"

// Define types
interface Feature {
  icon: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: icon1,
    title: "Prevents Emotional Trading",
    description: "Commitment contracts eliminate FOMO and panic selling",
  },
  {
    icon: icon2,
    title: "AI-Powered Decisions",
    description: "Multi-agent analysis provides optimal entry/exit strategies",
  },
  {
    icon: icon3,
    title: "Cross-Chain Flexibility",
    description: "Manage assets across 10+ blockchains seamlessly",
  },
]

const FeaturesSection = () => {
  return (
    <section className="ico_feature_section section_space section_decoration">
      <div className="container">
        <div className="row justify-content-lg-between">
          {/* Left Side - Features List */}
          <div className="col-lg-5">
            <div className="ico_heading_block" data-aos="fade-up" data-aos-duration="600">
              <h2 className="heading_text mb-0 text-white">Why F.U.M is Revolutionary?</h2>
            </div>
            <ul className="ico_features_group unordered_list_block">
              {features.map((feature, index) => (
                <li key={index} data-aos="fade-up" data-aos-duration="600" data-aos-delay={`${(index + 1) * 100}`}>
                  <div className="ico_iconbox_icon_left">
                    <div className="iconbox_icon">
                      <img src={feature.icon || "/placeholder.svg"} alt={`Icon ${feature.title}`} />
                    </div>
                    <div className="iconbox_info">
                      <h3 className="iconbox_title">{feature.title}</h3>
                      <p className="iconbox_description mb-0">{feature.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side - Investment Details */}
          <div className="col-lg-6">
            <ul
              className="ico_investment_value unordered_list justify-content-md-between"
              data-aos="fade-up"
              data-aos-duration="600"
            >
              <li>
                <h4 className="heading_text text-white">Total Value Locked</h4>
                <div className="investment_value">
                  <span className="odometer" data-count="60000">
                    <CountUp end={1200000} enableScrollSpy scrollSpyOnce />
                  </span>
                  <span>$</span>
                </div>
              </li>
              <li>
                <h4 className="heading_text text-white">Average APY</h4>
                <div className="investment_value">
                  <span className="odometer" data-count="60000">
                    <CountUp end={15} enableScrollSpy scrollSpyOnce />
                  </span>
                  <span>%</span>
                </div>
              </li>
            </ul>

            {/* Coin Purchase Price */}
            <div className="ico_coin_purchase_price" data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">
              <p className="purchase_price_rate mb-0 text-secondary">
                Average Commitment Duration <strong>90 Days</strong>
              </p>
              <div className="chart_image">
                <img src={shape1 || "/placeholder.svg"} alt="Shape Chart" />
              </div>
              <div className="live_values">
                <span>100$</span>
                <span>100.000$</span>
              </div>
            </div>

            {/* Calculation Range */}
            <div className="ico_calculation_range" data-aos="fade-up" data-aos-duration="600" data-aos-delay="200">
              <div className="live_values">
                <span>AI Analysis Updated</span>
                <span>Continuously</span>
              </div>
              <div className="range_image">
                <img src={shape2 || "/placeholder.svg"} alt="Shape Range" />
              </div>
              <div className="live_values">
                <span>100$</span>
                <span>100.000$</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorations */}
      <div className="decoration_item shape_shadow_1">
        <img src={shape3 || "/placeholder.svg"} alt="Shape Color Shadow" />
      </div>
      <div className="decoration_item shape_shadow_2">
        <img src={shape3 || "/placeholder.svg"} alt="Shape Color Shadow" />
      </div>
    </section>
  )
}

export default FeaturesSection