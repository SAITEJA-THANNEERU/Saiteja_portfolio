import "./styles/WhatIDo.css";
import { whatIBuild } from "../data/whatIBuild";

const WhatIDo = () => {
  return (
    <section className="what-section" id="what-build">
      <div className="what-container">

        {/* Section Header */}
        <div className="what-header">
          <span className="what-eyebrow">
            WHAT I BUILD
          </span>

          <h2>
            Turning ideas into
            <span> intelligent products.</span>
          </h2>

          <p>
            I combine software engineering, artificial intelligence,
            and data analytics to build practical digital solutions
            that solve real-world problems.
          </p>
        </div>

        {/* What I Build Cards */}
        <div className="what-cards">
          {whatIBuild.map((item) => (
            <article
              className="what-card"
              key={item.id}
            >
              {/* Number */}
              <div className="what-card-number">
                {item.number}
              </div>

              {/* Main Content */}
              <div className="what-card-content">

                {/* Heading */}
                <div className="what-card-heading">
                  <h3>{item.title}</h3>

                  <span className="what-card-arrow">
                    ↗
                  </span>
                </div>

                {/* Short Description */}
                <h4>
                  {item.description}
                </h4>

                {/* Details */}
                <p>
                  {item.details}
                </p>

                {/* Technologies & Expertise */}
                <div className="what-card-tools">

                  <span className="what-tools-label">
                    TECHNOLOGIES &amp; EXPERTISE
                  </span>

                  <div className="what-tools-list">
                    {item.tools.map((tool) => (
                      <span
                        className="what-tool"
                        key={tool}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>

                </div>

              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhatIDo;