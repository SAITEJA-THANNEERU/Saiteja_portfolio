import "./styles/Landing.css";
import { config } from "../config";

const Landing = () => {
  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hi there! I'm</h2>
            <h1>
              {firstName.toUpperCase()}
              {" "}
              <br />
              {lastName && (
                <span>{lastName.toUpperCase()}</span>
              )}
            </h1>
          </div>

          <div className="landing-info">
            <h3>An</h3>

            <h2 className="landing-info-h2">
              <div className="landing-h2-1">
                AI ENGINEER
              </div>
            </h2>

            <h2>
              <div className="landing-h2-info">
                DATA ANALYST
              </div>
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;