import { useNavigate } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      {/* LEFT */}
      <div className="landing-left">
        <h1>
          Organize your life.
          <br />
          <span>One task at a time.</span>
        </h1>

        <p>
          A simple, fast, and beautiful full-stack Todo app built with React,
          Node.js, and MongoDB.
        </p>

        <button className="cta" onClick={() => navigate("/app")}>
          Get Started →
        </button>
      </div>

      {/* RIGHT */}
      <div className="landing-right">
        <div className="preview-card">
          <div className="preview-sidebar" />
          <div className="preview-main">
            <div className="preview-task" />
            <div className="preview-task" />
            <div className="preview-task small" />

            <div className="preview-progress">
              <div className="bar" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
