import Header from "./Header";
import Hero from "./Hero";
import PartnerSection from "./PartnerSection";
import About from "./About";
import SolutionSection from "./SolutionSection";
import FeaturesSection from "./FeaturesSection.tsx";
import ChooseSection from "./ChooseSection";
import RoadmapSection from "./RoadmapSection";
import FaqSection from "./FAQSection";
import Scrollbar from "./Scrollbar.tsx";
import Footer from "./Footer";

const HomePage = () => {
  return (
    <>
      <Header />
      <main className="page_content">
        <Hero />
        <PartnerSection />
        <About />
        <SolutionSection />
        <FeaturesSection />
        <ChooseSection />
        <RoadmapSection />
        {/* <TeamSection /> */}
        <FaqSection />
        <Scrollbar />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;