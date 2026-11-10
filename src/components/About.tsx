import {
  FiCode,
  FiBarChart2,
  FiCpu,
} from "react-icons/fi";

import "./styles/About.css";

const About = () => {
  return (
    <section className="about-section" id="about">
      <div className="about-me">

        {/* Section label */}
        <h3 className="title">ABOUT ME</h3>

        {/* Main headline */}
        <h2 className="about-headline">
          Turning ideas and complex challenges into{" "}
          <span>meaningful digital solutions.</span>
        </h2>

        {/* Professional introduction */}
        <p className="para">
          I'm Sai Teja Thanneeru, a Computer Science graduate with
          a strong interest in software engineering, data analytics,
          and artificial intelligence. I enjoy designing and developing
          scalable applications, transforming data into actionable
          insights, and applying technology to solve practical
          problems. My experience spans full-stack development,
          database management, API integration, and AI-powered
          applications.
        </p>

        {/* Areas of expertise */}
        <div className="about-expertise">

          <div className="expertise-item">
            <FiCode />
            <span>Full-Stack Development</span>
          </div>

          <div className="expertise-item">
            <FiBarChart2 />
            <span>Data Analytics</span>
          </div>

          <div className="expertise-item">
            <FiCpu />
            <span>Artificial Intelligence</span>
          </div>

        </div>

        {/* Closing statement */}
        <div className="about-statement">
          <p>
            I value continuous learning, thoughtful problem-solving,
            and attention to detail. My goal is to build reliable,
            efficient, and user-focused technology that delivers
            measurable value.
          </p>
        </div>

      </div>
    </section>
  );
};

export default About;