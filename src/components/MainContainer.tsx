import {
  PropsWithChildren,
  useEffect,
} from "react";

import Certifications from "./Certifications";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Education from "./Education";
import Work from "./Work";
import TechStackNew from "./TechStackNew";
import CallToAction from "./CallToAction";
import ChatWithSai from "./ChatWithSai";
import setSplitText from "./utils/splitText";

const MainContainer = ({
  children,
}: PropsWithChildren) => {

  useEffect(() => {
    const resizeHandler = () => {
      setSplitText();
    };

    resizeHandler();

    window.addEventListener(
      "resize",
      resizeHandler
    );

    return () => {
      window.removeEventListener(
        "resize",
        resizeHandler
      );
    };
  }, []);

  return (
    <div className="container-main">

      <Cursor />

      <Navbar />

      <SocialIcons />

      {/* ==================================================
          3D CHARACTER
      ================================================== */}

      <div className="character-layer">
        {children}
      </div>

      {/* ==================================================
          MAIN PORTFOLIO SECTIONS
      ================================================== */}

      <Landing />

      <About />

      <WhatIDo />

      <Career />

      {/* ==================================================
          EDUCATION
      ================================================== */}

      <Education />

      <TechStackNew />

      <Certifications />

      <Work />

      <CallToAction />

      <ChatWithSai />

      <Contact />

    </div>
  );
};

export default MainContainer;