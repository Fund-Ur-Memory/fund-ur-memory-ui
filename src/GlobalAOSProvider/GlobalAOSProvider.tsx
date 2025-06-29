import { useEffect } from "react";
import type { PropsWithChildren } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const GlobalAOSProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
      offset: 120,
    });

    // Refresh AOS on route changes or dynamic content
    AOS.refresh();

    // Optional: Refresh AOS when window resizes
    const handleResize = () => {
      AOS.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return children;
};

export default GlobalAOSProvider;