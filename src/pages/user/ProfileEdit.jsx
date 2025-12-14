import { useState } from "react";
import "./ProfileEdit.css";

export default function ProfileEdit() {
  const [activeTab, setActiveTab] = useState("basic");

  return (
    <div className="container py-4">
      <h2 className="mb-4">Edit Profile</h2>

      <div className="profile-edit-wrapper">

        {/* TAB HEADERS */}
        <ul className="nav nav-tabs mb-3 modern-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "basic" ? "active" : ""}`}
              onClick={() => setActiveTab("basic")}
            >
              Basic Information
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "education" ? "active" : ""}`}
              onClick={() => setActiveTab("education")}
            >
              Education
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "work" ? "active" : ""}`}
              onClick={() => setActiveTab("work")}
            >
              Work Experience
            </button>
          </li>
        </ul>

        {/* CONTENT CARD */}
        <div className="card p-4 shadow-sm border-0">

          {/* ---------------- BASIC TAB ---------------- */}
          {activeTab === "basic" && (
            <div className="tab-content-section">
              <h5 className="mb-3">Basic Information</h5>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control" placeholder="Your name" />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Username</label>
                  <input type="text" className="form-control" placeholder="Preferred username" />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" placeholder="Your email" />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Phone Number</label>
                  <input type="text" className="form-control" placeholder="+91 99999 99999" />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Location</label>
                  <input type="text" className="form-control" placeholder="City, Country" />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Date of Birth</label>
                  <input type="date" className="form-control" />
                </div>

              </div>
            </div>
          )}

          {/* ---------------- EDUCATION TAB ---------------- */}
          {activeTab === "education" && (
            <div className="tab-content-section">
              <h5 className="mb-3">Education</h5>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Highest Qualification</label>
                  <input type="text" className="form-control" placeholder="B.Tech, M.Sc, etc." />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Specialization</label>
                  <input type="text" className="form-control" placeholder="Computer Science, etc." />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Institute</label>
                  <input type="text" className="form-control" placeholder="University/College" />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Passing Year</label>
                  <input type="number" className="form-control" placeholder="YYYY" />
                </div>
              </div>
            </div>
          )}

          {/* ---------------- WORK TAB ---------------- */}
          {activeTab === "work" && (
            <div className="tab-content-section">
              <h5 className="mb-3">Work Experience</h5>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Company</label>
                  <input type="text" className="form-control" placeholder="Company Name" />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Role / Position</label>
                  <input type="text" className="form-control" placeholder="Your Position" />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Years of Experience</label>
                  <input type="number" className="form-control" placeholder="e.g., 4" />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Current Salary (Optional)</label>
                  <input type="number" className="form-control" placeholder="Your salary" />
                </div>

                <div className="col-12">
                  <label className="form-label">Summary</label>
                  <textarea className="form-control" rows="3" placeholder="Describe your role, achievements, etc." />
                </div>
              </div>
            </div>
          )}

          {/* SAVE BUTTON */}
          <div className="text-end mt-4">
            <button className="btn btn-primary px-4">Save Changes</button>
          </div>

        </div>
      </div>
    </div>
  );
}