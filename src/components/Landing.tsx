import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <section className="landing-section" id="landingDiv">
      <div className="landing-container">
        <div className="landing-intro">
          <span className="landing-eyebrow">
            COMPUTER ENGINEERING × SOFTWARE
          </span>

          <h2>Hello! I'm</h2>

          <h1>
            CHIRAYU
            <br />
            <span>BABU JAYSAWAL</span>
          </h1>

          <div className="landing-role">
            AI & FULL-STACK
            <br />
            <span>DEVELOPER</span>
          </div>
        </div>

        <div className="landing-info">
          <p className="landing-description">
            Computer Engineering student building intelligent software,
            full-stack products, and real-world systems.
          </p>

          <div className="landing-capabilities">
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Software</div>
              <div className="landing-h2-2">AI</div>
            </h2>

            <h2>
              <div className="landing-h2-info">Systems</div>
              <div className="landing-h2-info-1">Hardware</div>
            </h2>
          </div>

          <div className="landing-actions">
            <a href="#work" className="landing-cta landing-cta-primary">
              <span>EXPLORE MY WORK</span>
              <span aria-hidden="true">↗</span>
            </a>

            <a
              href="https://github.com/Crusty-chirayu"
              target="_blank"
              rel="noopener noreferrer"
              className="landing-cta landing-cta-secondary"
            >
              <span>GITHUB</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <p className="landing-tagline">
            BUILDING WHERE SOFTWARE, INTELLIGENCE
            <br />
            & ENGINEERING MEET.
          </p>
        </div>
      </div>

      <div className="landing-scroll-indicator" aria-hidden="true">
        <span>SCROLL TO EXPLORE</span>
        <span className="landing-scroll-line" />
        <span>↓</span>
      </div>

      {children}
    </section>
  );
};

export default Landing;