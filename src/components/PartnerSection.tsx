import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import pimg1 from '/images/partners/Chainlink-Logo-Blue.png';
import pimg2 from '/images/partners/logo_eliza_OS_light.png'; 
import pimg3 from '/images/partners/AvalancheLogo_Horizontal_1C_White.png'; 

// Define types
interface Partner {
    pImg: string;
}

const partners: Partner[] = [
    {
        pImg: pimg1,
    },
    {
        pImg: pimg2,
    },
    {
        pImg: pimg3,
    },

];

const settings = {
    dots: false,
    infinite: true,
    speed: 3000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "ease-in-out",
    arrows: false,

    responsive: [
        {
            breakpoint: 1199,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1
            }
        },
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1
            }
        },
        {
            breakpoint: 767,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
};

const PartnerSection = () => {
    const handlePartnerClick = () => {
        // You can implement navigation logic here
        // For now, just scroll to top or navigate to home
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section className="partner_section">
            <div className="container-fluid">
                <div className="ico_heading_block text-center">
                    <h2 className="highlight_title mb-0 text-white" data-aos="fade-up" data-aos-duration="600">
                        Our Partners
                    </h2>
                </div>
                <div className="partner_logo_carousel z-2 position-relative" data-aos="fade-up" data-aos-duration="600" data-aos-delay="200">
                    <Slider {...settings}>
                        {partners.map((partner, pitem) => (
                            <div className="ico_partner_logo" key={pitem}>
                                <button 
                                    className="logo_wrap" 
                                    onClick={handlePartnerClick}
                                    style={{ 
                                        background: 'none', 
                                        border: 'none', 
                                        cursor: 'pointer',
                                        width: '100%',
                                        display: 'block'
                                    }}
                                >
                                    <img src={partner.pImg} alt="Partner Logo" />
                                    <span className="dot_1"></span>
                                    <span className="dot_2"></span>
                                    <span className="dot_3"></span>
                                    <span className="dot_4"></span>
                                </button>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    );
}

export default PartnerSection;