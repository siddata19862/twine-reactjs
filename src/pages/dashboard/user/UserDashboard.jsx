import { Link } from "react-router";
import "./UserDashboard.css";

export default function UserDashboard() {
  
  const user = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <div className="container py-4 userdash-wrapper">

      <div className="row">
        {/* ------------------------------------------------ */}
        {/* LEFT MAIN CONTENT */}
        {/* ------------------------------------------------ */}
        <div className="col-lg-8 col-xl-9">

          {/* HEADER */}
          <div className="card-box mb-4 p-4 d-flex align-items-center justify-content-between">
  
            {/* LEFT SIDE: TEXT */}
            <div>
                <h4 className="fw-bold mb-1 dashboard-title">
                Welcome back, {user.first_name}
                </h4>
                <div className="text-muted">
                Explore your sessions, papers, and connections.
                </div>
            </div>

            {/* RIGHT SIDE: PHOTO */}
            <img
                src={user.photo || "https://i.pravatar.cc/100"}
                alt="Profile"
                className="rounded-circle shadow-sm dashboard-avatar"
            />
            </div>

          {/* QUICK STATS */}
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="stat-box">
                <div>
                  <div className="h4 mb-0 fw-bold">3</div>
                  <div className="text-muted small">Upcoming Sessions</div>
                </div>
                <i className="ri-calendar-event-line stat-icon"></i>
              </div>
            </div>

            <div className="col-md-4">
              <div className="stat-box">
                <div>
                  <div className="h4 mb-0 fw-bold">12</div>
                  <div className="text-muted small">Saved Papers</div>
                </div>
                <i className="ri-file-list-3-line stat-icon"></i>
              </div>
            </div>

            <div className="col-md-4">
              <div className="stat-box">
                <div>
                  <div className="h4 mb-0 fw-bold">4</div>
                  <div className="text-muted small">Handshake Requests</div>
                </div>
                <i className="ri-hand-heart-line stat-icon"></i>
              </div>
            </div>
          </div>

          {/* UPCOMING SESSIONS */}
          <div className="card-box mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Upcoming Sessions</h5>
              <Link to="/sessions" className="view-link">View all</Link>
            </div>

            <div className="list-group">
              {[
                {
                  title: "AI-assisted Drug Discovery",
                  speaker: "Dr. Maya Rangan",
                  date: "12 Dec",
                  time: "10:00 AM",
                  venue: "Hall A",
                },
                {
                  title: "Gene Editing & CRISPR",
                  speaker: "Dr. Samuel Hart",
                  date: "13 Dec",
                  time: "2:00 PM",
                  venue: "Hall B",
                },
              ].map((s, idx) => (
                <div key={idx} className="list-group-item py-3 session-item">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-semibold">{s.title}</div>
                      <div className="text-muted small">{s.speaker}</div>
                      <div className="text-muted small">
                        {s.date} · {s.time} · {s.venue}
                      </div>
                    </div>
                    <i className="ri-flask-line session-icon"></i>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RECOMMENDATIONS */}
          <div className="card-box mb-4">
            <h5 className="fw-bold mb-3">Recommended for You</h5>

            <div className="row g-3">
              {/* Top Speaker */}
              <div className="col-md-6">
                <div className="recommend-box h-100">
                  <div className="fw-semibold mb-1">Top Speaker to Follow</div>
                  <div className="text-muted small mb-3">
                    Based on your interests
                  </div>

                  <div className="d-flex align-items-center">
                    <img
                      src="https://i.pravatar.cc/100?img=32"
                      className="rounded-circle me-3 shadow-sm"
                      width="48"
                      height="48"
                    />
                    <div>
                      <div className="fw-bold">Dr. Maya Rangan</div>
                      <div className="text-muted small">IISc Bangalore</div>
                    </div>
                  </div>

                  <Link to="/speaker/4" className="btn btn-sm btn-primary mt-3">
                    View Profile
                  </Link>
                </div>
              </div>

              {/* Paper */}
              <div className="col-md-6">
                <div className="recommend-box h-100">
                  <div className="fw-semibold mb-1">Paper Recommendation</div>
                  <div className="text-muted small mb-3">Trending in Biology</div>

                  <div className="fw-semibold">
                    “Protein Folding Models Using Deep Learning”
                  </div>

                  <Link className="btn btn-sm btn-primary mt-3" to="#">
                    Read Paper
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ------------------------------------------------ */}
        {/* RIGHT SIDEBAR CONTENT */}
        {/* ------------------------------------------------ */}
        <div className="col-lg-4 col-xl-3">

          {/* LATEST MESSAGES */}
          <div className="card-box mb-4">
            <h6 className="fw-bold mb-3">Latest Messages</h6>

            <div className="list-group small">
              <div className="list-group-item border-0 px-0 py-2">
                <div className="fw-semibold">Dr. Alan Frost</div>
                <div className="text-muted small">“Let’s connect tomorrow…”</div>
              </div>

              <div className="list-group-item border-0 px-0 py-2">
                <div className="fw-semibold">Dr. Maya Rangan</div>
                <div className="text-muted small">“Sharing the dataset…”</div>
              </div>

              <div className="list-group-item border-0 px-0 py-2">
                <div className="fw-semibold">Conference Admin</div>
                <div className="text-muted small">“Your badge is ready…”</div>
              </div>
            </div>

            <Link to="/messages" className="view-link mt-2 d-inline-block">
              View all messages
            </Link>
          </div>

          {/* LATEST POSTS */}
          <div className="card-box mb-4">
            <h6 className="fw-bold mb-3">Latest Posts</h6>

            <div className="list-group small">
              <div className="list-group-item border-0 px-0 py-2">
                <div className="fw-semibold">
                  “New CRISPR breakthrough announced”
                </div>
                <div className="text-muted small">Today · 214 views</div>
              </div>

              <div className="list-group-item border-0 px-0 py-2">
                <div className="fw-semibold">
                  “AI models outperform traditional protein folding”
                </div>
                <div className="text-muted small">Yesterday · 530 views</div>
              </div>

              <div className="list-group-item border-0 px-0 py-2">
                <div className="fw-semibold">
                  “How novel enzymes are changing bio-fuels”
                </div>
                <div className="text-muted small">2 days ago · 89 views</div>
              </div>
            </div>

            <Link to="/posts" className="view-link mt-2 d-inline-block">
              View all posts
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}