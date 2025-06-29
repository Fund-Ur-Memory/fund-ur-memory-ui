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
    title: "ElizaOS AI Agents",
    description: "Multi-agent behavioral analysis using advanced LLMs for real-time market psychology and commitment optimization",
  },
  {
    icon: icon2,
    title: "Chainlink CCIP Integration",
    description: "Cross-chain interoperability with automated price feeds, data streams, and smart contract automation",
  },
  {
    icon: icon3,
    title: "Smart Commitment Contracts",
    description: "Avalanche-deployed vaults with cryptographic commitment mechanisms and emergency withdrawal protocols",
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
              <h2 className="heading_text mb-0 text-white">Hackathon-Grade Innovation</h2>
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
                  <span className="odometer" data-count="40">
                    <CountUp end={40} enableScrollSpy scrollSpyOnce />
                  </span>
                  <span>$ <small className="text-success">(Target: $4.75M)</small></span>
                </div>
              </li>
              <li>
                <h4 className="heading_text text-white">Success Rate</h4>
                <div className="investment_value">
                  <span className="odometer" data-count="80">
                    <CountUp end={80} enableScrollSpy scrollSpyOnce />
                  </span>
                  <span>% <small className="text-success">(8/10 Vaults)</small></span>
                </div>
              </li>
            </ul>

            {/* Coin Purchase Price */}
            <div className="ico_coin_purchase_price" data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">
              <p className="purchase_price_rate mb-0 text-secondary">
                Average Commitment Duration <strong>30 Days</strong> <small className="text-success">(Real Data)</small>
              </p>
              <div className="chart_image">
                <img src={shape1 || "/placeholder.svg"} alt="Shape Chart" />
              </div>
              <div className="live_values">
                <span>$0.025</span>
                <span>$6.50 <small className="text-success">Avg</small></span>
              </div>
            </div>

            {/* Calculation Range */}
            <div className="ico_calculation_range" data-aos="fade-up" data-aos-duration="600" data-aos-delay="200">
              <div className="live_values">
                <span>Total Vaults Created</span>
                <span>10 <small className="text-success">Real</small></span>
              </div>
              <div className="range_image">
                <img src={shape2 || "/placeholder.svg"} alt="Shape Range" />
              </div>
              <div className="live_values">
                <span>Min: $0.025</span>
                <span>Max: $13 <small className="text-success">Testnet</small></span>
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