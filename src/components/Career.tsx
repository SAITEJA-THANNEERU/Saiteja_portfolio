import "./styles/Career.css";
import { config } from "../config";

const Career = () => {
  return (
    <div
  className="career-section section-container"
  id="career"
>
      <div className="career-container">

        {/* Section Heading */}
        <h2>
          My career <span>&</span>
          <br />
          experience
        </h2>

        <div className="career-info">

          {/* KEEP EXISTING TIMELINE */}
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>

          {/* Experience Items */}
          {config.experiences.map((exp, index) => (
            <div
              key={index}
              className={`career-info-box ${
                index % 2 === 0
                  ? "career-left"
                  : "career-right"
              }`}
            >

              {/* LEFT SIDE */}
              <div className="career-info-in">

                <div className="career-index">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="career-role">
                  <h4>{exp.position}</h4>

                  <div className="career-company-row">
  <h5>{exp.company}</h5>

  {exp.company === "SKAITE Technologies" && (
    <a
      href="https://skaitetechnologies.in/"
      target="_blank"
      rel="noopener noreferrer"
      className="career-company-link"
      aria-label="Visit SKAITE Technologies website"
    >
      Visit Website ↗
    </a>
  )}
</div>

                  <span className="career-period">
                    {exp.period}
                  </span>
                </div>

              </div>

              {/* RIGHT SIDE */}
              <div className="career-description">

                <span className="career-description-label">
                  Overview
                </span>

                <p>{exp.description}</p>

              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default Career;