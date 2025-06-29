import check from "../icons/icon_check.svg"
import sIcon1 from "../icons/icon_man_question.svg"
import sIcon2 from "../icons/icon_bulb.svg"

// Define types for problem and solution items
interface ProblemSolutionItem {
  label: string;
  info: string;
}

const SolutionSection = () => {
  // Problem items data
  const problemItems: ProblemSolutionItem[] = [
    {
      label: "Decision Fatigue",
      info: "Wealthy investors making hundreds of micro-decisions daily",
    },
    {
      label: "Emotional Trading",
      info: "Even sophisticated investors fall prey to FOMO and panic selling",
    },
    {
      label: "Time Inefficiency",
      info: "Constantly monitoring positions across multiple chains",
    },
    {
      label: "Privacy Concerns",
      info: "Large wallet movements tracked by MEV bots",
    },
  ];

  // Solution items data
  const solutionItems: ProblemSolutionItem[] = [
    {
      label: "Commitment Contracts",
      info: "Smart contracts that execute future self's rational decisions",
    },
    {
      label: "AI Oracle Network",
      info: "Multi-agent system analyzing 50+ data sources",
    },
    {
      label: "Privacy-First Architecture",
      info: "ZK-proofs hide vault amounts and conditions",
    },
    {
      label: "Cross-Chain Automation",
      info: "Seamless management across multiple blockchains",
    },
  ];

  return (
    <section className="problem_solution_section section_space pb-0">
      <div className="container">
        <div className="ico_heading_block text-center" data-aos="fade-up" data-aos-duration="600">
          <h2 className="heading_text mb-0 text-white">Cipher Protocol Problem & Solution</h2>
        </div>

        <div className="ico_problem_solution_table" data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">
          <div className="column_wrapper">
            {/* ICO Problem Section */}
            <div className="column_problem">
              <h3 className="heading_text">
                <span className="icon">
                  <img src={sIcon1 || "/placeholder.svg"} alt="Icon Man With Question" />
                </span>
                <span className="text text-white">Cipher Problem</span>
              </h3>
              <ul className="iconlist_block unordered_list_block">
                {problemItems.map((item, index) => (
                  <li key={index}>
                    <span className="iconlist_icon">
                      <img src={check || "/placeholder.svg"} alt="Icon Check" />
                    </span>
                    <span className="iconlist_label">
                      {item.label}
                      <small className="iconlist_info">{item.info}</small>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ICO Solution Section */}
            <div className="column_solution">
              <h3 className="heading_text">
                <span className="icon">
                  <img src={sIcon2 || "/placeholder.svg"} alt="Icon Bulb" />
                </span>
                <span className="text text-white">Cipher Solution</span>
              </h3>
              <ul className="iconlist_block unordered_list_block">
                {solutionItems.map((item, index) => (
                  <li key={index}>
                    <span className="iconlist_icon">
                      <img src={check || "/placeholder.svg"} alt="Icon Check" />
                    </span>
                    <span className="iconlist_label">
                      {item.label}
                      <small className="iconlist_info">{item.info}</small>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SolutionSection