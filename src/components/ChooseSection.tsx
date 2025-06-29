import icon1 from "../icons/icon_dollar_2.svg"
import icon2 from "../icons/icon_bank_building.svg"
import icon3 from "../icons/icon_scan.svg"

const services = [
  {
    icon: icon1,
    title: "Commitment Vaults",
    description: "Time/price-locked asset storage with customizable release conditions",
    delay: 200,
  },
  {
    icon: icon2,
    title: "AI Risk Analysis",
    description: "Multi-agent system providing predictive analytics and investment recommendations",
    delay: 300,
  },
  {
    icon: icon3,
    title: "Cross-Chain Support",
    description: "Seamless asset management across multiple blockchains via Chainlink CCIP",
    delay: 400,
  },
  {
    icon: "/images/services/icon_pinpoint.png",
    title: "Privacy Layer",
    description: "ZK-proof implementation for transaction privacy and stealth addresses",
    delay: 500,
  },
]

const ChooseSection = () => {
  return (
    <section
      id="id_ico_service_section"
      className="ico_service_section section_space pb-0 section_decoration section_shadow_top"
    >
      <div className="decoration_item shape_divider_1">
        <img src="/images/shapes/shape_section_divider_1.svg" alt="Shape Divider" />
      </div>

      <div className="container">
        <div className="ico_heading_block text-center mt-lg-4" data-aos="fade-up" data-aos-duration="600">
          <h2 className="heading_text mb-0 text-white">Why Choose F.U.M Protocol?</h2>
        </div>

        <div className="row m-lg-0 justify-content-center">
          <div className="col-lg-4 p-lg-0" data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">
            <div className="ico_service_image">
              <img src="/images/services/ico_service_image.webp" alt="ICO Service Icon" />
            </div>
          </div>
          {services.map((service, index) => (
            <div
              key={index}
              className={`col-lg-4 p-lg-0 ${index === 0 ? "order-lg-first" : ""}`}
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay={service.delay}
            >
              <div className="ico_iconbox_block">
                <div className="iconbox_icon">
                  <img src={service.icon || "/placeholder.svg"} alt={service.title} />
                </div>
                <div className="iconbox_info">
                  <h3 className="iconbox_title text-white">{service.title}</h3>
                  <p className="iconbox_description mb-0">{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="decoration_item shape_shadow_1">
        <img src="/images/shapes/shape_poligon.svg" alt="Shape Color Shadow" />
      </div>
      <div className="decoration_item shape_shadow_2">
        <img src="/images/shapes/shape_poligon.svg" alt="Shape Color Shadow" />
      </div>
    </section>
  )
}

export default ChooseSection