import { useState } from "react"
import team1 from "/images/avatars/avatar_1.webp"
import team2 from "/images/avatars/avatar_2.webp"
import team3 from "/images/avatars/avatar_3.webp"
import team4 from "/images/avatars/avatar_4.webp"
import team5 from "/images/avatars/avatar_5.webp"
import team6 from "/images/avatars/avatar_6.webp"
import team7 from "/images/avatars/avatar_7.webp"
import team8 from "/images/avatars/avatar_8.webp"
import shape from "/images/shapes/shape_section_divider_1.svg"

// Define types
interface TeamMember {
  name: string;
  designation: string;
  description: string;
  avatar: string;
  linkedin: string;
}

interface TeamData {
  advisoryTeam: TeamMember[];
  managementTeam: TeamMember[];
  marketingTeam: TeamMember[];
}

type TeamType = keyof TeamData;

// Team data for each tab
const teamData: TeamData = {
  advisoryTeam: [
    {
      name: "Levi Harrison",
      designation: "Behavioral Finance Advisor",
      description: "Expert in behavioral finance, advising on DeFi investment strategies and risk assessment.",
      avatar: team1,
      linkedin: "/",
    },
    {
      name: "Luna Seraphine",
      designation: "Privacy Engineer",
      description: "Specializes in privacy-enhancing technologies for secure and anonymous DeFi transactions.",
      avatar: team2,
      linkedin: "/",
    },
    {
      name: "Elias Maverick",
      designation: "Founder & CEO",
      description: "A hands-on founder who loves building scaling businesses with clients.",
      avatar: team3,
      linkedin: "/",
    },
    {
      name: "Atticus Graham",
      designation: "Technical Support",
      description: "Passionate in seeking solutions for your problems.",
      avatar: team4,
      linkedin: "/",
    },
    {
      name: "Amara Noelle",
      designation: "CTO Manager",
      description: "CTO Manager driving tech innovation and overseeing development strategies.",
      avatar: team5,
      linkedin: "/",
    },
    {
      name: "Ethan Mitchell",
      designation: "Cross-Chain Developer",
      description: "Focused on building interoperable DeFi solutions across multiple blockchain networks.",
      avatar: team6,
      linkedin: "/",
    },
    {
      name: "Aurora Selene",
      designation: "Legal Advisor",
      description: "Legal Advisor providing expert guidance on legal matters and risk management.",
      avatar: team7,
      linkedin: "/",
    },
    {
      name: "Orion Maxwell",
      designation: "Project Manager",
      description: "Committed to delivering successful projects consistently.",
      avatar: team8,
      linkedin: "/",
    },
  ],
  managementTeam: [
    {
      name: "Ethan Mitchell",
      designation: "Cross-Chain Developer",
      description: "Focused on building interoperable DeFi solutions across multiple blockchain networks.",
      avatar: team6,
      linkedin: "/",
    },
    {
      name: "Aurora Selene",
      designation: "Legal Advisor",
      description: "Legal Advisor providing expert guidance on legal matters and risk management.",
      avatar: team7,
      linkedin: "/",
    },
    {
      name: "Orion Maxwell",
      designation: "Project Manager",
      description: "Committed to delivering successful projects consistently.",
      avatar: team8,
      linkedin: "/",
    },
    {
      name: "Levi Harrison",
      designation: "Behavioral Finance Advisor",
      description: "Expert in behavioral finance, advising on DeFi investment strategies and risk assessment.",
      avatar: team1,
      linkedin: "/",
    },
    {
      name: "Luna Seraphine",
      designation: "Privacy Engineer",
      description: "Specializes in privacy-enhancing technologies for secure and anonymous DeFi transactions.",
      avatar: team2,
      linkedin: "/",
    },
    {
      name: "Elias Maverick",
      designation: "Founder & CEO",
      description: "A hands-on founder who loves building scaling businesses with clients.",
      avatar: team3,
      linkedin: "/",
    },
    {
      name: "Atticus Graham",
      designation: "Technical Support",
      description: "Passionate in seeking solutions for your problems.",
      avatar: team4,
      linkedin: "/",
    },
    {
      name: "Amara Noelle",
      designation: "CTO Manager",
      description: "CTO Manager driving tech innovation and overseeing development strategies.",
      avatar: team5,
      linkedin: "/",
    },
  ],
  marketingTeam: [
    {
      name: "Elias Maverick",
      designation: "Founder & CEO",
      description: "A hands-on founder who loves building scaling businesses with clients.",
      avatar: team3,
      linkedin: "/",
    },
    {
      name: "Atticus Graham",
      designation: "Technical Support",
      description: "Passionate in seeking solutions for your problems.",
      avatar: team4,
      linkedin: "/",
    },
    {
      name: "Amara Noelle",
      designation: "CTO Manager",
      description: "CTO Manager driving tech innovation and overseeing development strategies.",
      avatar: team5,
      linkedin: "/",
    },
    {
      name: "Ethan Mitchell",
      designation: "Cross-Chain Developer",
      description: "Focused on building interoperable DeFi solutions across multiple blockchain networks.",
      avatar: team6,
      linkedin: "/",
    },
    {
      name: "Aurora Selene",
      designation: "Legal Advisor",
      description: "Legal Advisor providing expert guidance on legal matters and risk management.",
      avatar: team7,
      linkedin: "/",
    },
    {
      name: "Orion Maxwell",
      designation: "Project Manager",
      description: "Committed to delivering successful projects consistently.",
      avatar: team8,
      linkedin: "/",
    },
    {
      name: "Levi Harrison",
      designation: "Behavioral Finance Advisor",
      description: "Expert in behavioral finance, advising on DeFi investment strategies and risk assessment.",
      avatar: team1,
      linkedin: "/",
    },
    {
      name: "Luna Seraphine",
      designation: "Privacy Engineer",
      description: "Specializes in privacy-enhancing technologies for secure and anonymous DeFi transactions.",
      avatar: team2,
      linkedin: "/",
    },
  ],
}

const TeamSection = () => {
  const [activeTab, setActiveTab] = useState<TeamType>("advisoryTeam") // Default active tab

  const handleTabChange = (tab: TeamType) => {
    setActiveTab(tab)
  }

  const handleLinkedInClick = (url: string) => {
    if (url && url !== "/") {
      window.open(url, '_blank');
    }
  }

  const renderTeamMembers = (team: TeamMember[]) => {
    return team.map((member, index) => (
      <div key={index} className="col-lg-3 col-md-6 col-sm-6">
        <div className="ico_team_block">
          <div className="ico_team_block_inner">
            <div className="front_side_content">
              <div
                className="team_avatar"
                style={{ backgroundImage: `url('/images/shapes/shape_circle_${index + 1}.svg')` }}
              >
                <div className="avatar_wrap">
                  <img src={member.avatar || "/placeholder.svg"} alt={member.name} />
                </div>
              </div>
              <h3 className="team_member_name">{member.name}</h3>
              <span className="team_member_designation mb-0">{member.designation}</span>
            </div>
            <div className="back_side_content">
              <p className="team_member_description">{member.description}</p>
              <ul className="social_block unordered_list justify-content-center">
                <li>
                  <button 
                    onClick={() => handleLinkedInClick(member.linkedin)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <i className="fa-brands fa-linkedin"></i>
                  </button>
                </li>
              </ul>
              <h4 className="team_member_name">{member.name}</h4>
              <span className="team_member_designation mb-0">{member.designation}</span>
            </div>
          </div>
        </div>
      </div>
    ))
  }

  return (
    <section id="id_ico_team_section" className="ico_team_section section_decoration section_shadow_top section_space">
      <div className="decoration_item shape_divider_1">
        <img src={shape || "/placeholder.svg"} alt="Shape Divider" />
      </div>
      <div className="container">
        <div className="ico_heading_block text-center" data-aos="fade-up" data-aos-duration="800">
          <h2 className="heading_text mb-0">Active Team & Advisors</h2>
        </div>

        <div className="tab_block" data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">
          <div className="d-flex justify-content-center">
            <ul className="nav unordered_list justify-content-md-center" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === "advisoryTeam" ? "active" : ""}`}
                  onClick={() => handleTabChange("advisoryTeam")}
                  type="button"
                  role="tab"
                >
                  Advisory Team
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === "managementTeam" ? "active" : ""}`}
                  onClick={() => handleTabChange("managementTeam")}
                  type="button"
                  role="tab"
                >
                  Management Team
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === "marketingTeam" ? "active" : ""}`}
                  onClick={() => handleTabChange("marketingTeam")}
                  type="button"
                  role="tab"
                >
                  Marketing Team
                </button>
              </li>
            </ul>
          </div>

          <div className="tab-content">
            <div className={`tab-pane fade ${activeTab === "advisoryTeam" ? "show active" : ""}`} role="tabpanel">
              <div className="row justify-content-center">{renderTeamMembers(teamData.advisoryTeam)}</div>
            </div>
            <div className={`tab-pane fade ${activeTab === "managementTeam" ? "show active" : ""}`} role="tabpanel">
              <div className="row justify-content-center">{renderTeamMembers(teamData.managementTeam)}</div>
            </div>
            <div className={`tab-pane fade ${activeTab === "marketingTeam" ? "show active" : ""}`} role="tabpanel">
              <div className="row justify-content-center">{renderTeamMembers(teamData.marketingTeam)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TeamSection