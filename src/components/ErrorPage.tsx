import Header from "./Header";
import Footer from "./Footer";

const ErrorPage = () => {
  const handleGoHome = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Reload the page to go back to home
    window.location.href = "/";
  };

  return (
    <div className="index_ico page_wrapper">
      <Header />
      <main className="page_content">
        <section className="error-page section_space" style={{ 
          minHeight: "80vh", 
          display: "flex", 
          alignItems: "center",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
        }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="text-center">
                  <div className="error-page__content">
                    <div
                      className="error-number"
                      style={{
                        fontSize: "clamp(80px, 15vw, 150px)",
                        fontWeight: "bold",
                        background: "linear-gradient(135deg, #6f42c1, #9d5be8)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        marginBottom: "30px",
                        textShadow: "0 4px 20px rgba(111, 66, 193, 0.3)"
                      }}
                    >
                      404
                    </div>

                    {/* Title */}
                    <h2 
                      className="mb-4" 
                      style={{ 
                        color: "#ffffff", 
                        fontSize: "clamp(24px, 4vw, 36px)",
                        fontWeight: "600",
                        marginBottom: "20px"
                      }}
                    >
                      Hi Sorry We Can't Find That Page!
                    </h2>

                    {/* Description */}
                    <p 
                      className="mb-4" 
                      style={{ 
                        color: "#b8b8b8", 
                        fontSize: "18px",
                        lineHeight: "1.6",
                        maxWidth: "500px",
                        margin: "0 auto 20px"
                      }}
                    >
                      Oops! The page you are looking for does not exist. It might have been moved or deleted.
                    </p>

                    {/* Current URL */}
                    <p 
                      className="mb-5" 
                      style={{ 
                        color: "#8a8a8a", 
                        fontSize: "14px" 
                      }}
                    >
                      Requested URL: <code style={{ 
                        color: "#e83e8c", 
                        backgroundColor: "rgba(255,255,255,0.1)", 
                        padding: "4px 8px", 
                        borderRadius: "4px",
                        fontFamily: "monospace"
                      }}>{window.location.pathname}</code>
                    </p>

                    {/* Buttons */}
                    <div className="error-page-buttons mt-4" style={{ 
                      display: "flex", 
                      gap: "20px", 
                      justifyContent: "center",
                      flexWrap: "wrap"
                    }}>
                      <button
                        onClick={handleGoHome}
                        style={{
                          padding: "14px 32px",
                          fontSize: "16px",
                          fontWeight: "600",
                          borderRadius: "8px",
                          border: "none",
                          cursor: "pointer",
                          background: "linear-gradient(135deg, #6f42c1, #9d5be8)",
                          color: "white",
                          transition: "all 0.3s ease",
                          boxShadow: "0 4px 15px rgba(111, 66, 193, 0.3)",
                          minWidth: "150px"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 6px 20px rgba(111, 66, 193, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 4px 15px rgba(111, 66, 193, 0.3)";
                        }}
                      >
                        Go Back Home
                      </button>

                      <button
                        onClick={() => window.history.back()}
                        style={{
                          padding: "14px 32px",
                          fontSize: "16px",
                          fontWeight: "600",
                          borderRadius: "8px",
                          border: "2px solid #6f42c1",
                          cursor: "pointer",
                          backgroundColor: "transparent",
                          color: "#6f42c1",
                          transition: "all 0.3s ease",
                          minWidth: "150px"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#6f42c1";
                          e.currentTarget.style.color = "white";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = "#6f42c1";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        Go Back
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ErrorPage;