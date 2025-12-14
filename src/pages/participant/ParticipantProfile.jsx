import { Link, useParams } from "react-router";
import "../speaker/SpeakerProfile.css";
import { useEffect, useState } from "react";
import { useSpeaker } from "../../hooks/speakers/useSpeaker";

const user = JSON.parse(localStorage.getItem("user")) || {};

export default function ParticipantProfile() {
  const { id } = useParams();
  const { data: speakerData, isLoading, error } = useSpeaker(id);

  const [speaker, setSpeaker] = useState(null);

  // --- Load enriched profile data ---
  useEffect(() => {
    if (speakerData) {
      setSpeaker({
        ...speakerData,
        bio: `Dr. Frost is a globally respected voice in artificial intelligence, with a strong focus on deep learning, neural architecture search, and the ethical challenges that arise as AI systems become more capable. Their work explores how advanced neural structures can be optimised for performance while staying aligned with human values. Beyond research, Dr. Frost actively advocates for responsible AI practices, contributing to global panels, workshops, and policy discussions. Their mission is to build intelligent systems that are not only innovative but also trustworthy, transparent, and beneficial to society.`,
        expertise: ["Artificial Intelligence", "Neural Networks", "Ethics in AI"],
        socials: {
          linkedin: "#",
          twitter: "#",
          website: "#",
        }
      });
    }
  }, [speakerData]);

  // --------------------------
  // LOADING & ERROR STATES
  // --------------------------
  if (error) {
    return (
      <div className="status-screen d-flex flex-column align-items-center">
        <i className="ri-error-warning-line fs-1 text-danger"></i>
        <p className="mt-2 text-danger">Unable to load profile.</p>
      </div>
    );
  }

  if (isLoading || !speaker) {
    return (
      <div className="loader-wrapper">
        <div className="orbit-trail-true"><span></span><span></span><span></span></div>
        <p className="mt-3">Loading profile…</p>
      </div>
    );
  }

  // --------------------------
  // MAIN CLEAN PROFILE PAGE
  // --------------------------
  return (
    <div className="container py-4">

      <div className="row g-4">

        {/* ---------------- LEFT PROFILE CARD ---------------- */}
        <div className="col-lg-8">

          {/* PROFILE CARD */}
          <div className="card shadow-sm border-0 mb-4 fade-up">
            <div className="card-body p-4 d-flex gap-4">

              {/* PHOTO */}
              <img
                src={speaker.photo}
                alt="speaker"
                className="rounded-circle shadow"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />

              {/* DETAILS */}
              <div className="flex-grow-1">

                {/* Social Icons + Message Button */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                  
                  {/* Social Icons */}
                  <div className="d-flex gap-3 fs-4 text-secondary">
                    <a href={speaker.socials.linkedin} className="text-dark">
                      <i className="ri-linkedin-box-fill"></i>
                    </a>
                    <a href={speaker.socials.twitter} className="text-dark">
                      <i className="ri-twitter-x-fill"></i>
                    </a>
                    <a href={speaker.socials.website} className="text-dark">
                      <i className="ri-global-line"></i>
                    </a>
                  </div>

                  {/* Message Button */}
                  <Link
                    to="/inbox"
                    className="btn btn-dark rounded-pill px-3 d-flex align-items-center gap-1"
                    >
                    <i className="ri-chat-1-line"></i>
                    Message
                    </Link>

                </div>

                {/* NAME */}
                <h3 className="mb-1">
                  {speaker.first_name} {speaker.last_name}
                </h3>
                <h6 className="text-muted">{speaker.title}</h6>

                {/* LOCATION + ID */}
                <div className="mt-3 d-flex gap-3 text-secondary flex-wrap">
                  <span>
                    <i className="ri-map-pin-line me-1"></i>
                    La Jolla, California
                  </span>
                  <span>
                    <i className="ri-profile-line me-1"></i>
                    ID: {id}
                  </span>
                </div>

              </div>
            </div>
          </div>

          {/* BIO */}
          <div className="card shadow-sm border-0 fade-up">
            <div className="card-header bg-white">
              <h5 className="mb-0">About</h5>
            </div>
            <div className="card-body">
              <p className="text-secondary" style={{ lineHeight: "1.7" }}>
                {speaker.bio}
              </p>
            </div>
          </div>


          {/* ---------------- EDUCATION + PROFESSIONAL (SIDE BY SIDE) ---------------- */}
            <div className="row mt-4">

            {/* EDUCATION */}
            <div className="col-md-6">
                <div className="card shadow-sm border-0 fade-up h-100">
                <div className="card-header bg-white">
                    <h5 className="mb-0">Education Qualifications</h5>
                </div>
                <div className="card-body">

                    <ul className="list-group list-group-flush">
                    <li className="list-group-item px-0">
                        <h6 className="fw-bold mb-1">Ph.D. in Artificial Intelligence</h6>
                        <p className="text-muted small mb-0">Stanford University • 2017</p>
                    </li>

                    <li className="list-group-item px-0">
                        <h6 className="fw-bold mb-1">M.S. in Computer Science</h6>
                        <p className="text-muted small mb-0">UC Berkeley • 2014</p>
                    </li>

                    <li className="list-group-item px-0">
                        <h6 className="fw-bold mb-1">B.S. in Computational Engineering</h6>
                        <p className="text-muted small mb-0">MIT • 2012</p>
                    </li>
                    </ul>

                </div>
                </div>
            </div>

            {/* PROFESSIONAL */}
            <div className="col-md-6">
                <div className="card shadow-sm border-0 fade-up h-100">
                <div className="card-header bg-white">
                    <h5 className="mb-0">Professional Qualifications</h5>
                </div>
                <div className="card-body">

                    <ul className="list-group list-group-flush">

                    <li className="list-group-item px-0 py-3">
                        <i className="ri-check-line text-success me-2"></i>
                        Senior Research Scientist – DeepMind (2020–present)
                    </li>

                    <li className="list-group-item px-0 py-3">
                        <i className="ri-check-line text-success me-2"></i>
                        Lead AI Ethics Evaluator – OpenAI (2018–2020)
                    </li>

                    <li className="list-group-item px-0 py-3">
                        <i className="ri-check-line text-success me-2"></i>
                        Visiting Faculty – Caltech AI Lab (2023)
                    </li>

                    </ul>

                </div>
                </div>
            </div>

            </div>

            {/* ---------------- AWARDS (FULL WIDTH) ---------------- */}
            <div className="card shadow-sm border-0 fade-up mt-4 mb-4">
            <div className="card-header bg-white">
                <h5 className="mb-0">Awards & Achievements</h5>
            </div>
            <div className="card-body">

                <ul className="list-group list-group-flush">

                <li className="list-group-item px-0 py-3">
                    <i className="ri-award-fill text-warning me-2"></i>
                    ACM Distinguished Researcher Award – 2024
                </li>

                <li className="list-group-item px-0 py-3">
                    <i className="ri-award-fill text-warning me-2"></i>
                    NeurIPS Best Paper Award – 2022
                </li>

                <li className="list-group-item px-0 py-3">
                    <i className="ri-award-fill text-warning me-2"></i>
                    IEEE AI Pioneer Medal – 2021
                </li>

                </ul>

            </div>
            </div>

        </div>

        {/* ---------------- RIGHT SIDEBAR ---------------- */}
        <div className="col-lg-4">

          {/* Latest Posts */}
          <div className="card shadow-sm border-0 fade-up">
            <div className="card-header bg-white">
              <h5 className="mb-0">Latest Posts</h5>
            </div>
            <div className="card-body">

              <div className="list-group small">

                <div className="list-group-item py-3">
                  <h6 className="fw-bold mb-1">New Paper Published</h6>
                  <p className="mb-1 text-muted">Exploring neural efficiency in hybrid models.</p>
                  <span className="text-secondary small">
                    <i className="ri-time-line me-1"></i>2 days ago
                  </span>
                </div>

                <div className="list-group-item py-3">
                  <h6 className="fw-bold mb-1">Keynote at GATC 2026</h6>
                  <p className="mb-1 text-muted">Discussed ethics in next-gen AI systems.</p>
                  <span className="text-secondary small">
                    <i className="ri-time-line me-1"></i>1 week ago
                  </span>
                </div>

                <div className="list-group-item py-3">
                  <h6 className="fw-bold mb-1">Collaboration Call</h6>
                  <p className="mb-1 text-muted">Looking for partners in bio-AI fusion research.</p>
                  <span className="text-secondary small">
                    <i className="ri-time-line me-1"></i>3 weeks ago
                  </span>
                </div>

              </div>

            </div>
          </div>

          {/* ---------------- My Connections ---------------- */}
          <div className="card shadow-sm border-0 fade-up mt-4">
            <div className="card-header bg-white">
              <h5 className="mb-0">Connections</h5>
            </div>

            <div className="card-body">

              <div className="list-group small">

                {/* USER 1 */}
                <div className="list-group-item d-flex align-items-center py-3">
                  <img
                    src="https://i.pravatar.cc/60?img=11"
                    className="rounded-circle me-3 shadow-sm"
                    style={{ width: "45px", height: "45px", objectFit: "cover" }}
                  />
                  <div className="flex-grow-1">
                    <div className="fw-bold">Dr. Sarah Lin</div>
                    <div className="text-muted small">Machine Learning Lab</div>
                  </div>
                  <button className="btn btn-outline-dark btn-sm rounded-pill px-3">
                    <i className="ri-user-line me-1"></i>View
                  </button>
                </div>

                {/* USER 2 */}
                <div className="list-group-item d-flex align-items-center py-3">
                  <img
                    src="https://i.pravatar.cc/60?img=22"
                    className="rounded-circle me-3 shadow-sm"
                    style={{ width: "45px", height: "45px", objectFit: "cover" }}
                  />
                  <div className="flex-grow-1">
                    <div className="fw-bold">Prof. Alan Brooks</div>
                    <div className="text-muted small">AI Ethics Researcher</div>
                  </div>
                  <button className="btn btn-outline-dark btn-sm rounded-pill px-3">
                    <i className="ri-user-line me-1"></i>View
                  </button>
                </div>

                {/* USER 3 */}
                <div className="list-group-item d-flex align-items-center py-3">
                  <img
                    src="https://i.pravatar.cc/60?img=34"
                    className="rounded-circle me-3 shadow-sm"
                    style={{ width: "45px", height: "45px", objectFit: "cover" }}
                  />
                  <div className="flex-grow-1">
                    <div className="fw-bold">Dr. Maya Chen</div>
                    <div className="text-muted small">Deep Learning Systems</div>
                  </div>
                  <button className="btn btn-outline-dark btn-sm rounded-pill px-3">
                    <i className="ri-user-line me-1"></i>View
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}