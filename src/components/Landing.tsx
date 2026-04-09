import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              CHIRAYU
              <br />
              <span>JAYSAWAL</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>Computer Engineering Student | Full Stack Developer | IoT & AI Enthusiast</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Software</div>
              <div className="landing-h2-2">Hardware</div>
            </h2>
            <h2>
              <div className="landing-h2-info">IoT</div>
              <div className="landing-h2-info-1">AI</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;