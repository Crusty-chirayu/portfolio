import { useState, useCallback } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

const projects = [
  {
    title: "Envoy",
    category: "AI-Powered Career Platform",
    tools: "Next.js · TypeScript · Supabase · AI Agents · ATS",
    image: "/images/envoy.png",
    link: "https://github.com/Crusty-chirayu/Envoy",
  },
  {
    title: "TrailMate",
    category: "Outdoor Trip Planning & GPS Recording",
    tools: "Next.js · React · TypeScript · Supabase · Leaflet · GPS",
    image: "/images/trailmate.png",
    link: "https://github.com/Crusty-chirayu/TrailMate",
  },
  {
    title: "CartIQ",
    category: "AI-Integrated E-Commerce Platform",
    tools: "Next.js · TypeScript · Supabase · AI · E-Commerce",
    image: "/images/cartiq.png",
    link: "https://github.com/Crusty-chirayu/AI-integrated-Personalized-shopping-platform-",
  },
  {
    title: "ReForge",
    category: "AI-Assisted Software Engineering",
    tools: "TypeScript · Fastify · Static Analysis · AI",
    image: "/images/reforge.png",
    link: "https://github.com/Crusty-chirayu/ReForge",
  },
  {
    title: "EDU-SHARE",
    category: "Academic Knowledge Exchange Platform",
    tools: "PHP · MySQL · JavaScript · AJAX",
    image: "/images/edu-share.png",
    link: "https://github.com/Crusty-chirayu/EDU-SHARE-A-Targeted-Knowledge-Exchange-Platform",
  },
  {
    title: "Confluence",
    category: "AI-Powered Group Communication",
    tools: "Group Chat · AI · Real-Time · Full Stack",
    image: "/images/confluence.png",
    link: "https://group-chatbot.onrender.com/",
  },
  {
    title: "Hotel Management System",
    category: "Desktop Hotel Operations System",
    tools: "Java · Swing · MySQL · Database Integration",
    image: "/images/hms.png",
    link: "https://github.com/Crusty-chirayu/Hotel-Management-System",
  },
  {
    title: "Face Recognition",
    category: "Computer Vision & Identity Verification",
    tools: "Python · FastAPI · OpenCV · Face Recognition · JWT",
    image: "/images/face-recognition.png",
    link: "https://github.com/Crusty-chirayu/Face-Recognition",
  },
];

const Work = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  const goToPrev = useCallback(() => {
    const newIndex =
      currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex =
      currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>

        <div className="carousel-wrapper">
          {/* Navigation Arrows */}
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={goToPrev}
            aria-label="Previous project"
            data-cursor="disable"
          >
            <MdArrowBack />
          </button>
          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={goToNext}
            aria-label="Next project"
            data-cursor="disable"
          >
            <MdArrowForward />
          </button>

          {/* Slides */}
          <div className="carousel-track-container">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {projects.map((project, index) => (
                <div className="carousel-slide" key={index}>
                  <div className="carousel-content">
                    <div className="carousel-info">
                      <div className="carousel-number">
                        <h3>0{index + 1}</h3>
                      </div>
                      <div className="carousel-details">
                        <h4>{project.title}</h4>
                        <p className="carousel-category">
                          {project.category}
                        </p>
                        <div className="carousel-tools">
                          <span className="tools-label">Tools & Features</span>
                          <p>{project.tools}</p>
                        </div>
                      </div>
                    </div>
                    <div className="carousel-image-wrapper">
                      <WorkImage
                        image={project.image}
                        alt={project.title}
                        link={project.link}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="carousel-dots">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${
                  index === currentIndex ? "carousel-dot-active" : ""
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to project ${index + 1}`}
                data-cursor="disable"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;