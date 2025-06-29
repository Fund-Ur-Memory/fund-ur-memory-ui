import { useState } from "react"
import shape1 from "/images/shapes/shape_circle_1.webp"
import shape2 from "/images/shapes/shape_section_divider_2.svg"

// Define types
interface RoadmapData {
  badge: string;
  title: string;
  items: string[];
}

const roadmapData: RoadmapData[] = [
  {
    badge: "Q2 - 2025",
    title: "Protocol Development",
    items: [
      "Smart contract development and auditing.",
      "Integration of AI modules for enhanced functionality.",
      "Implementation of privacy-preserving mechanisms.",
    ],
  },
  {
    badge: "Q3 - 2025",
    title: "Cross-Chain Integration",
    items: [
      "Leveraging Chainlink CCIP for secure cross-chain communication.",
      "Implementation of multi-chain support for broader accessibility.",
      "Rigorous testing and validation of cross-chain functionalities.",
    ],
  },
  {
    badge: "Q4 2025",
    title: "AI Enhancement",
    items: [
      "Development of a multi-agent system for automated decision-making.",
      "Integration of behavioral finance models for personalized strategies.",
      "Implementation of advanced analytics for risk management and optimization.",
    ],
  },
  {
    badge: "Q1 - 2026",
    title: "Mainnet Launch",
    items: [
      "Full deployment of the F.U.M protocol on the mainnet.",
      "Establishment of strategic partnerships with institutional investors.",
      "Ecosystem growth initiatives to foster adoption and community engagement.",
    ],
  },
]

const RoadmapSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const handleMouseOver = (index: number) => {
    setActiveIndex(index)
  }

  return (
    <section id="id_ico_roadmap_section" className="ico_roadmap_section section_space mt-lg-5 section_decoration">
      <div className="container">
        <div className="ico_heading_block text-center mt-lg-5 pt-lg-5" data-aos="fade-up" data-aos-duration="600">
          <h2 className="heading_text mb-0 text-white">Roadmap</h2>
        </div>

        <div className="ico_roadmap_flexbox" data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">
          {roadmapData.map((block, index) => (
            <div
              key={index}
              className={`roadmap_block ${activeIndex === index ? "active" : ""}`}
              onMouseOver={() => handleMouseOver(index)}
            >
              <div className="badge">{block.badge}</div>
              <h3 className="heading_text text-white">{block.title}</h3>
              <ul className="iconlist_block unordered_list_block">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <span className="iconlist_icon">
                      <i className="fa-solid fa-circle"></i>
                    </span>
                    <span className="iconlist_label text-white">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="hover_shape">
                <img src={shape1 || "/placeholder.svg"} alt="Shape Circle" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="decoration_item shape_divider_1">
        <img src={shape2 || "/placeholder.svg"} alt="Shape Divider" />
      </div>
    </section>
  )
}

export default RoadmapSection