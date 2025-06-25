import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import "@rainbow-me/rainbowkit/styles.css";

// External CSS imports
import 'aos/dist/aos.css';
import 'react-toastify/dist/ReactToastify.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Local CSS imports (in order of importance)
import './styles/fontawesome.css';
import './styles/themify-icons.css';
import './styles/animate.css';
import './styles/animate.min.css';
import './styles/aos.css';
import './styles/cursor.css';
import './styles/custom-animation.css';
import './styles/flaticon.css';
import './styles/fontawesome.css';
import './styles/Home.module.css';
import './styles/BackgroundVideo.module.css';
import './styles/style.css';
import './styles/main.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)