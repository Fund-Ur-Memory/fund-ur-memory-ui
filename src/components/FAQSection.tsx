import { useState } from "react"

// Define types
type TabType = "tab_general_question" | "tab_ico_questions" | "tab_tokens_sales" | "tab_clients_releted";

const FAQSection = () => {
  const [activeTab, setActiveTab] = useState<TabType>("tab_general_question")
  const [activeAccordion, setActiveAccordion] = useState("collapse_1")

  const toggleTab = (tabId: TabType) => {
    setActiveTab(tabId)
  }

  const toggleAccordion = (accordionId: string) => {
    setActiveAccordion(accordionId === activeAccordion ? "" : accordionId)
  }

  // Array of FAQ questions
  const faqQuestions = [
    "What is Cipher Protocol?",
    "How do Commitment Vaults work in Cipher?",
    "What are the benefits of using Cipher Protocol?",
    "How does Cipher ensure cross-chain functionality?",
    "What privacy features does Cipher offer?",
  ]

  // Array of Vault questions
  const vaultQuestions = [
    "What are Commitment Vaults in Cipher?",
    "How do I create a Commitment Vault?",
    "What assets can be used in Commitment Vaults?",
    "What are the fees associated with Commitment Vaults?",
    "How secure are Commitment Vaults?",
  ]

  // Array of AI & Privacy questions
  const aiPrivacyQuestions = [
    "How does Cipher use AI analysis?",
    "What data is used for AI analysis?",
    "How does Cipher protect user privacy?",
    "Is my data shared with third parties?",
    "How can I control my privacy settings?",
  ]

  // Array of Platform Related questions
  const platformRelatedQuestions = [
    "How can I contact Cipher support?",
    "What services does Cipher provide?",
    "How secure is the Cipher platform?",
    "What is the dispute resolution process?",
    "Are there any platform usage guides?",
  ]

  // Arrow SVG component for reusability
  const ArrowIcon = () => (
    <svg viewBox="0 0 23 27" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 14.597L10 2.56731C10 1.56579 10.8115 0.753906 11.8125 0.753906C12.8134 0.753906 13.6249 1.56579 13.6249 2.56731L13.6249 14.597C13.6249 15.5985 12.8134 16.4104 11.8125 16.4104C10.8115 16.4104 10 15.5985 10 14.597Z" />
      <path d="M9.71371 25.8348L1.59744 17.7909C1.49009 17.6845 1.42969 17.5396 1.42969 17.3884L1.42969 14.2693C1.42969 13.7658 2.03695 13.5125 2.39443 13.8668L10.5108 21.9106C10.6181 22.017 10.6785 22.1619 10.6785 22.3131L10.6785 25.4323C10.6785 25.9358 10.0712 26.1891 9.71371 25.8348Z" />
      <path d="M21.2273 13.8668L13.1111 21.9106C13.0037 22.017 12.9434 22.1619 12.9434 22.3131L12.9434 25.4323C12.9434 25.9358 13.5506 26.1891 13.9081 25.8348L22.0243 17.7909C22.1317 17.6845 22.1921 17.5396 22.1921 17.3884L22.1921 14.2693C22.1921 13.7658 21.5849 13.5125 21.2273 13.8668Z" />
    </svg>
  )

  // Render accordion items
  const renderAccordionItems = (questions: string[], idPrefix: string, parentId: string) => {
    return questions.map((question, index) => {
      const collapseId = `${idPrefix}_${index + 1}`
      return (
        <div className="accordion-item" key={collapseId}>
          <div
            className={`icon_arrow ${activeAccordion === collapseId ? "collapsed" : ""}`}
            role="button"
            onClick={() => toggleAccordion(collapseId)}
          >
            <ArrowIcon />
          </div>
          <div
            className={`accordion-button ${activeAccordion === collapseId ? "" : "collapsed"}`}
            role="button"
            onClick={() => toggleAccordion(collapseId)}
          >
            {`${index + 1}- ${question}`}
          </div>
          <div
            id={collapseId}
            className={`accordion-collapse collapse ${activeAccordion === collapseId ? "show" : ""}`}
            data-bs-parent={`#${parentId}`}
          >
            <div className="accordion-body">
              {getAccordionContent(idPrefix)}
            </div>
          </div>
        </div>
      )
    })
  }

  // Get content for each accordion based on type and index
  const getAccordionContent = (type: string) => {
    switch (type) {
      case "collapse":
        return (
          <>
            <p>
              Cipher Protocol is a decentralized framework designed to enhance digital interactions through
              commitment vaults, AI-driven analysis, cross-chain functionality, and robust privacy
              features.
            </p>
            <ul className="iconlist_block unordered_list_block">
              <li>
                <span className="iconlist_icon">
                  <i className="fa-solid fa-circle"></i>
                </span>
                <span className="iconlist_label">Commitment Vaults for secure agreements.</span>
              </li>
              <li>
                <span className="iconlist_icon">
                  <i className="fa-solid fa-circle"></i>
                </span>
                <span className="iconlist_label">AI analysis for enhanced decision-making.</span>
              </li>
              <li>
                <span className="iconlist_icon">
                  <i className="fa-solid fa-circle"></i>
                </span>
                <span className="iconlist_label">
                  Cross-chain functionality for broader asset utilization.
                </span>
              </li>
              <li>
                <span className="iconlist_icon">
                  <i className="fa-solid fa-circle"></i>
                </span>
                <span className="iconlist_label">Privacy features to protect user data.</span>
              </li>
            </ul>
          </>
        )
      case "collapse_ico":
        return (
          <p>
            Commitment Vaults are secure, on-chain contracts that allow users to lock assets for a
            specified period, ensuring commitment and enabling various decentralized applications.
          </p>
        )
      case "collapse_token_sales":
        return (
          <p>
            Cipher utilizes AI analysis to enhance decision-making and provide insights. User privacy is
            paramount, and data is anonymized and protected with advanced security measures.
          </p>
        )
      case "collapse_clients":
        return (
          <p>
            Cipher is dedicated to providing a seamless platform experience. Our support team is
            available to assist with any questions, and we offer comprehensive platform usage guides.
          </p>
        )
      default:
        return <p>More information coming soon.</p>
    }
  }

  return (
    <section className="faq_section section_space">
      <div className="container">
        <div className="ico_heading_block text-center" data-aos="fade-up" data-aos-duration="800">
          <h2 className="heading_text mb-0 text-white">FAQ</h2>
        </div>

        <div className="tab_block" data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">
          <div className="d-flex justify-content-center">
            <ul className="nav unordered_list justify-content-md-center" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === "tab_general_question" ? "active" : ""}`}
                  type="button"
                  role="tab"
                  onClick={() => toggleTab("tab_general_question")}
                >
                  General Questions
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === "tab_ico_questions" ? "active" : ""}`}
                  type="button"
                  role="tab"
                  onClick={() => toggleTab("tab_ico_questions")}
                >
                  Vault Questions
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === "tab_tokens_sales" ? "active" : ""}`}
                  type="button"
                  role="tab"
                  onClick={() => toggleTab("tab_tokens_sales")}
                >
                  AI & Privacy
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === "tab_clients_releted" ? "active" : ""}`}
                  type="button"
                  role="tab"
                  onClick={() => toggleTab("tab_clients_releted")}
                >
                  Platform Related
                </button>
              </li>
            </ul>
          </div>

          <div className="tab-content">
            {/* General Question Tab */}
            <div
              className={`tab-pane fade ${activeTab === "tab_general_question" ? "show active" : ""}`}
              role="tabpanel"
              id="tab_general_question"
            >
              <div className="ico_accordion" id="accordion_1">
                {renderAccordionItems(faqQuestions, "collapse", "accordion_1")}
              </div>
            </div>

            {/* Vault Questions Tab */}
            <div
              className={`tab-pane fade ${activeTab === "tab_ico_questions" ? "show active" : ""}`}
              role="tabpanel"
              id="tab_ico_questions"
            >
              <div className="ico_accordion" id="accordion_2">
                {renderAccordionItems(vaultQuestions, "collapse_ico", "accordion_2")}
              </div>
            </div>

            {/* AI & Privacy Tab */}
            <div
              className={`tab-pane fade ${activeTab === "tab_tokens_sales" ? "show active" : ""}`}
              role="tabpanel"
              id="tab_tokens_sales"
            >
              <div className="ico_accordion" id="accordion_3">
                {renderAccordionItems(aiPrivacyQuestions, "collapse_token_sales", "accordion_3")}
              </div>
            </div>

            {/* Platform Related Tab */}
            <div
              className={`tab-pane fade ${activeTab === "tab_clients_releted" ? "show active" : ""}`}
              role="tabpanel"
              id="tab_clients_releted"
            >
              <div className="ico_accordion" id="accordion_4">
                {renderAccordionItems(platformRelatedQuestions, "collapse_clients", "accordion_4")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQSection