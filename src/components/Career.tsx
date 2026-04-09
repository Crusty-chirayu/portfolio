import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container" id="career">
      <div className="career-container">
        <h2>
          My career & <span>experience</span>
        </h2>

        <div className="career-content">
          <div className="career-left">
            <h3>Computer Engineering Student</h3>
            <p>Visvesvaraya Technological University (VTU)</p>
          </div>

          <div className="career-middle">
            <h2>2022–26</h2>
          </div>

          <div className="career-right">
            <p>
              Currently pursuing B.E. in Computer Engineering. Actively building
              full stack applications, working on AI-based systems, and exploring
              IoT hardware projects using Arduino and sensors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;