import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Connect</h4>
            <p>
              <a
                href="https://linkedin.com/in/chirayu-babu-jaysawal-916a6a2a2"
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                LinkedIn — chirayu-babu-jaysawal
              </a>
            </p>
            <p>
              <a
                href="mailto:chirayujayaswal7@gmail.com"
                data-cursor="disable"
              >
                Email — chirayujayaswal7@gmail.com
              </a>
            </p>

            <h4>Education</h4>
            <p>
              B.E. Computer Engineering — Visvesvaraya Technological University (VTU) — 2022–2026
            </p>
          </div>

          <div className="contact-box">
            <h4>Social</h4>
            <a
              href="https://github.com/Crusty-chirayu"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              GitHub <MdArrowOutward />
            </a>
            <a
              href="https://linkedin.com/in/chirayu-babu-jaysawal-916a6a2a2"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              LinkedIn <MdArrowOutward />
            </a>
          </div>

          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>Chirayu Jaysawal</span>
            </h2>
            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;