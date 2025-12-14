import { Link, useParams } from "react-router";
import "./SpeakerProfile.css";
import { useEffect, useMemo, useState } from "react";
import useFakeHandshake from "../../hooks/useFakeHandshake";
import { useSpeaker } from "../../hooks/speakers/useSpeaker";
import { useGetMyHandshakes } from "../../hooks/handshake/useGetMyHandshakes";

import { useCreateHandshake } from "../../hooks/handshake/useCreateHandshake";
import AsyncButton from "../../components/ui/AsyncButton";



//const user = JSON.parse(localStorage.getItem("user")) || {};




export default function SpeakerProfile() {
  const [user, setUser] = useState(null);

useEffect(() => {
  const u = JSON.parse(localStorage.getItem("user"));
  setUser(u);
}, []);

  const { id } = useParams();
  const { loading, sendRequest } = useFakeHandshake();

  const [activeTab, setActiveTab] = useState("profile");
  
  const [selectedYear, setSelectedYear] = useState(2026);

    const {mutate, isPending} = useCreateHandshake();
    
    const ch = useCreateHandshake();

    const createHandshake = (receiver_id)=> {
      mutate({receiver_id});
    };

    const {data:speakerData, isLoading,error} = useSpeaker(id);
    const [speaker, setSpeaker] = useState(null);
    

    const {data:handshakes} = useGetMyHandshakes();


    const handshake = useMemo(()=>{
      if(!speaker) return {};
      //if(!handshakes) return {};
      if (!Array.isArray(handshakes)) return {};
      //console.log("handshakes",handshakes);

      
      //return;
      //return;
        const matched = handshakes.find((e)=>{
            
            if(e.sender_id==speaker.id) return true;
            else if(e.receiver_id==speaker.id) return true;
          });

          console.log("matched",matched);
          return matched?matched:{};
          //return {...sp, handshake_status:matched?matched.status:'none'};


    },[speaker,handshakes]);


    useEffect(() => {
        if (speakerData) {
            setSpeaker({
            ...speakerData,                // DB values
            handshake_status: "none",      // override demo
            bio: `Dr. Frost is a leading researcher in artificial intelligence 
                    focusing on deep learning, neural architecture search, 
                    and computational ethics.`,
            expertise: ["Artificial Intelligence", "Neural Networks", "Ethics in AI"],
            socials: {
                linkedin: "#",
                twitter: "#",
                website: "#",
            },
            sessions_2026: [
                {
                topic: "Future of AI Ethics in a Hyper-Automated World",
                date: "12 Dec",
                day: "Thursday",
                start: "10:00 AM",
                end: "11:30 AM",
                venue: "Innovation Hall A"
                },
                {
                topic: "Neural Architecture Search – Beyond Deep Learning",
                date: "13 Dec",
                day: "Friday",
                start: "3:00 PM",
                end: "4:30 PM",
                venue: "Tech Theatre B"
                }
            ],
            handshakes:[
  {
    name: "Dr. Irene Schultz",
    title: "Lead Computational Neuroscientist, Max Planck Institute",
    photo: "https://i.pravatar.cc/300?img=47",
    status: "accepted",
  },
  {
    name: "Dr. Karan Vyas",
    title: "Molecular Biologist, Cambridge University",
    photo: "https://i.pravatar.cc/300?img=41",
    status: "pending",
  },
  {
    name: "Prof. Maya Rangan",
    title: "Quantum Scientist, IISc",
    photo: "https://i.pravatar.cc/300?img=32",
    status: "pending",
  },
]
            });
        }
        }, [speakerData]);

  // -----------------------------------
  // SAMPLE SPEAKER DATA
  // -----------------------------------
  /*const [speaker0, setSpeaker] = useState({
    name: "Dr. Alan Frost",
    title: "AI Researcher, MIT",
    location: "Boston, USA",
    photo: "https://i.pravatar.cc/300?img=12",
    handshake_status: "none",
    bio: `Dr. Frost is a leading researcher in artificial intelligence 
          focusing on deep learning, neural architecture search, 
          and computational ethics.`,
    expertise: ["Artificial Intelligence", "Neural Networks", "Ethics in AI"],
    socials: {
      linkedin: "#",
      twitter: "#",
      website: "#",
    },

    sessions_2026: [
    {
        topic: "Future of AI Ethics in a Hyper-Automated World",
        date: "12 Dec",
        day: "Thursday",
        start: "10:00 AM",
        end: "11:30 AM",
        venue: "Innovation Hall A"
    },
    {
        topic: "Neural Architecture Search – Beyond Deep Learning",
        date: "13 Dec",
        day: "Friday",
        start: "3:00 PM",
        end: "4:30 PM",
        venue: "Tech Theatre B"
    }
    ],

  });*/

  /*const handshakes = [
  {
    name: "Dr. Irene Schultz",
    title: "Lead Computational Neuroscientist, Max Planck Institute",
    photo: "https://i.pravatar.cc/300?img=47",
    status: "accepted",
  },
  {
    name: "Dr. Karan Vyas",
    title: "Molecular Biologist, Cambridge University",
    photo: "https://i.pravatar.cc/300?img=41",
    status: "pending",
  },
  {
    name: "Prof. Maya Rangan",
    title: "Quantum Scientist, IISc",
    photo: "https://i.pravatar.cc/300?img=32",
    status: "pending",
  },
];*/

  // -----------------------------------
  // REQUEST HANDSHAKE
  // -----------------------------------
  const requestHandshake = async () => {

    const newStatus = await sendRequest();
    setSpeaker(prev => ({ ...prev, handshake_status: newStatus }));
  };

  // -----------------------------------
  // HANDSHAKE UI
  // -----------------------------------
  const renderHandshakeSection = () => {
    //if (loading || !handshake) {
    if (isPending || !handshake) {
      return (
        <div className="handshake-loader px-2 py-2 fade-handshake fade-delay-1">
          <span></span><span></span><span></span>
        </div>
      );
    }
    

    switch (handshake.status) {
      case "none":
        return (
          <button
            className="btn btn-primary px-4 fade-handshake fade-delay-1"
            disabled={isPending}
            onClick={()=> createHandshake(speaker.id)}
          >
            Request Handshake
          </button>
        );

      case "pendingOld":
        return (
          <div className="alert alert-warning mb-0 px-3 py-2 fade-handshake fade-delay-1">
            Your Request is <strong>pending</strong>.
          </div>
        );
      case "pending":
        return (
          <div className="d-flex flex-column fade-handshake fade-delay-1">
            <button
  className="
    btn
    d-flex align-items-center gap-2
    px-4 py-2
    rounded-pill
    fw-semibold
    disabled
    border-0
    text-success
    bg-success-subtle
  "
>
  <i className="ri-check-line fs-5"></i>
  Handshake Requested
</button>

            <small className="text-muted mt-2">
              Sent on {(handshake.date_created)}
            </small>

            <small
              className="text-danger mt-1"
              style={{ cursor: "pointer", textDecoration: "underline", width: "fit-content" }}
              onClick={() => cancelHandshake(handshake.id)}
            >
              Revoke Request
            </small>
          </div>
        );

      case "accepted":
        return (
          <div class="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill border border-success text-success bg-success-subtle small">
  <i class="ri-check-line"></i>
  <span>Request <strong>accepted</strong></span>
</div>
        );

      case "rejected":
        return (
          <div class="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill border border-danger text-danger bg-danger-subtle small">
  <i class="ri-close-circle-fill"></i>
  <span>Request <strong>rejected</strong></span>
</div>
        );

      default:
        return (<AsyncButton buttonClassName="btn
    d-flex align-items-center gap-2
    px-4 py-2
    rounded-pill
    fw-semibold
    
    border-0
    text-success
    bg-success-subtle" lockOnLoad={true} hook={useCreateHandshake} payload={{receiver_id:speaker.id}} caption={"Send Handshake Request"}></AsyncButton>);
    }
  };

  // -----------------------------------
  // SAMPLE POSTS (RIGHT SIDEBAR)
  // -----------------------------------
  const samplePosts = [
    {
      text: "Published new research paper on neural architecture search.",
      time: "2 days ago",
    },
    {
      text: "Spoke at MIT Tech Forum on AI Ethics.",
      time: "1 week ago",
    },
  ];

  // -----------------------------------
  // SIMILAR PROFILES (RIGHT SIDEBAR)
  // -----------------------------------
 const similarProfiles = [
  {
    name: "Prof. Maya Rangan",
    title: "Quantum Scientist, IISc",
    photo: "https://i.pravatar.cc/100?img=32",
  },
  {
    name: "Dr. Samuel Crane",
    title: "Robotics Expert, Stanford",
    photo: "https://i.pravatar.cc/100?img=45",
  },
  {
    name: "Dr. Elena Kovacs",
    title: "Computational Biologist, ETH Zurich",
    photo: "https://i.pravatar.cc/100?img=12",
  },
  {
    name: "Prof. Hiroshi Tanaka",
    title: "Nanomaterials Researcher, University of Tokyo",
    photo: "https://i.pravatar.cc/100?img=57",
  },
  {
    name: "Dr. Liora Ben-Shahar",
    title: "Molecular Neuroscientist, Weizmann Institute",
    photo: "https://i.pravatar.cc/100?img=28",
  },
];
    



   // ERROR
    if (error) {
    return (
        <div className="status-screen d-flex flex-column justify-content-center align-items-center">
        <i className="ri-error-warning-line status-error-icon"></i>
        <p className="text-danger fs-5 mt-2">Unable to load speaker.</p>
        <small className="text-muted">Please try again later.</small>
        </div>
    );
    }

    // MAIN LOADING
    if (isLoading) {
    return (
        <div className="loader-wrapper">
          <div className="orbit-trail-true">
            <span></span><span></span><span></span><span></span>
          </div>
          <p className="status-text mt-4">Loading speaker profile…</p>
        </div>
    );
    }

    // SPEAKER NOT YET AVAILABLE (data empty)
    if (!speaker) {
    return (
        <div className="status-screen d-flex flex-column justify-content-center align-items-center">
        <div className="status-spinner"></div>
        <p className="mt-3 text-muted fs-5">Preparing profile...</p>
        </div>
    );
    }
    
    
    //console.log("speaker",speaker);
    
    const years = [2026, 2025, 2024];

    

    const yearlyData = {
    2026: speaker?.sessions_2026 || [],
    2025: speaker?.sessions_2025 || [],
    2024: speaker?.sessions_2024 || [],
    };

    

  return (
    <div className="container py-4">
      <div className="row">



        
        
        {/* -----------------------------------
            LEFT MAIN PROFILE CONTENT
        ----------------------------------- */}
        <div className="col-md-8">

          
          

            {/* ---------- TABS ---------- */}
            <ul className="nav nav-tabs modern-tabs mb-4">
                <li className="nav-item">
                <button
                    className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
                    onClick={() => setActiveTab("profile")}
                >
                    Profile
                </button>
                </li>

                

                <li className="nav-item">
                <button
                    className={`nav-link ${activeTab === "programs" ? "active" : ""}`}
                    onClick={() => setActiveTab("programs")}
                >
                    GATC Programs
                </button>
                </li>
            </ul>


            {/* ---------- TAB PANELS ---------- */}
            {activeTab === "profile" && <>
                {/* HEADER */}
                <div className="card shadow-sm border-0 mb-4 fade-up fade-delay-1">
                    <div className="card-body p-4 d-flex align-items-start gap-4">

                        {/* LEFT — PHOTO */}
                        <img
                        src={speaker.photo}
                        alt="speaker"
                        className="rounded-circle shadow"
                        style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                        }}
                        />

                        {/* RIGHT — EVERYTHING ELSE */}
                        <div className="flex-grow-1">

                        {/* SOCIAL + HANDSHAKE */}
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex gap-3 fs-4 text-secondary">
                            <a href={speaker.socials.linkedin} className="text-decoration-none text-dark">
                                <i className="ri-linkedin-box-fill"></i>
                            </a>

                            <a href={speaker.socials.twitter} className="text-decoration-none text-dark">
                                <i className="ri-twitter-x-fill"></i>
                            </a>

                            <a href={speaker.socials.website} className="text-decoration-none text-dark">
                                <i className="ri-global-line"></i>
                            </a>
                            </div>

                            {user?.type=="user" && <div key={speaker.handshake_status}>
                              {renderHandshakeSection()}
                            </div>}
                        </div>

                        {/* NAME */}
                        <h3 className="mb-1">
                            {speaker.first_name} {speaker.last_name}
                        </h3>

                        {/* TITLE */}
                        <h6 className="text-muted">{speaker.title}</h6>

                        {/* LOCATION + ID */}
                        <div className="mt-3 d-flex gap-3 text-secondary flex-wrap">
                            <span>
                                <i className="ri-map-pin-line me-1"></i>
                                La Jolla, California, USA
                                </span>

                            <span>
                            <i className="ri-profile-line me-1"></i>
                            ID: {id}
                            </span>
                        </div>


                        

                        {/* INLINE EXPERTISE */}
                        <div className="mt-3 d-flex flex-wrap gap-2">
                            {speaker.expertise?.map((item, index) => (
                            <span
                                key={index}
                                className="badge bg-primary px-3 py-2"
                                style={{ fontSize: "0.85rem" }}
                            >
                                {item}
                            </span>
                            ))}
                        </div>

                        </div>

                    </div>
                    </div>

          

                  

          
          {/* BIO */}
          <div className="card shadow-sm border-0 mb-4 fade-up fade-delay-2">
            <div className="card-header bg-white">
              <h5 className="mb-0">About</h5>
            </div>
            <div className="card-body">
              <p className="text-secondary" style={{ lineHeight: "1.7" }}>
                {speaker.bio}
              </p>
            </div>
          </div>

          {/* SESSIONS / PROGRAMS */}
            <div className="card shadow-sm border-0 fade-up fade-delay-5 mb-4">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Programs at GATC</h5>
                </div>

                <div className="card-body">

                    {/* ---- YEAR SELECTOR ---- */}
                    <div className="mb-3 d-flex gap-2 flex-wrap">
                    {years.map((year) => (
                        <button
                        key={year}
                        className={`btn ${
                            year === selectedYear ? "btn-primary" : "btn-outline-primary"
                        } btn-sm`}
                        onClick={() => setSelectedYear(year)}
                        >
                        GATC {year}
                        </button>
                    ))}
                    </div>

                    {/* ---- SESSIONS FOR SELECTED YEAR ---- */}
                    {yearlyData[selectedYear] && yearlyData[selectedYear].length > 0 ? (
                    <div className="d-flex flex-column gap-3">

                        {yearlyData[selectedYear].map((s, i) => (
                        <div
                            key={i}
                            className="session-card p-3 rounded border d-flex align-items-center gap-4"
                        >
                            {/* LEFT - DATE */}
                            <div className="text-center px-3">
                            <div className="fw-bold fs-5">{s.date}</div>
                            <div className="text-muted small">{s.day}</div>
                            </div>

                            {/* VERTICAL DIVIDER */}
                            <div className="vr" />

                            {/* CENTER - DETAILS */}
                            <div className="flex-grow-1">
                            <h6 className="mb-1">{s.topic}</h6>
                            <div className="text-muted small">
                                <i className="ri-time-line me-1"></i>
                                {s.start} – {s.end}
                            </div>
                            <div className="text-muted small">
                                <i className="ri-map-pin-2-line me-1"></i>
                                {s.venue}
                            </div>
                            </div>

                            {/* RIGHT - ICON */}
                            <i className="ri-mic-2-line fs-3 text-primary"></i>
                        </div>
                        ))}

                    </div>
                    ) : (
                    <p className="text-muted mb-0">No sessions for this year.</p>
                    )}

                </div>
            </div>


            </>}
            
            {activeTab === "programs" && <>

                {/* SESSIONS / PROGRAMS */}
            <div className="card shadow-sm border-0 fade-up fade-delay-5 mb-4">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Programs at GATC</h5>
                </div>

                <div className="card-body">

                    {/* ---- YEAR SELECTOR ---- */}
                    <div className="mb-3 d-flex gap-2 flex-wrap">
                    {years.map((year) => (
                        <button
                        key={year}
                        className={`btn ${
                            year === selectedYear ? "btn-primary" : "btn-outline-primary"
                        } btn-sm`}
                        onClick={() => setSelectedYear(year)}
                        >
                        GATC {year}
                        </button>
                    ))}
                    </div>

                    {/* ---- SESSIONS FOR SELECTED YEAR ---- */}
                    {yearlyData[selectedYear] && yearlyData[selectedYear].length > 0 ? (
                    <div className="d-flex flex-column gap-3">

                        {yearlyData[selectedYear].map((s, i) => (
                        <div
                            key={i}
                            className="session-card p-3 rounded border d-flex align-items-center gap-4"
                        >
                            {/* LEFT - DATE */}
                            <div className="text-center px-3">
                            <div className="fw-bold fs-5">{s.date}</div>
                            <div className="text-muted small">{s.day}</div>
                            </div>

                            {/* VERTICAL DIVIDER */}
                            <div className="vr" />

                            {/* CENTER - DETAILS */}
                            <div className="flex-grow-1">
                            <h6 className="mb-1">{s.topic}</h6>
                            <div className="text-muted small">
                                <i className="ri-time-line me-1"></i>
                                {s.start} – {s.end}
                            </div>
                            <div className="text-muted small">
                                <i className="ri-map-pin-2-line me-1"></i>
                                {s.venue}
                            </div>
                            </div>

                            {/* RIGHT - ICON */}
                            <i className="ri-mic-2-line fs-3 text-primary"></i>
                        </div>
                        ))}

                    </div>
                    ) : (
                    <p className="text-muted mb-0">No sessions for this year.</p>
                    )}

                </div>
            </div>
            </>}

            

          

          
          

            

        </div>

        {/* -----------------------------------
            RIGHT SIDEBAR COLUMN
        ----------------------------------- */}
        <div className="col-md-4">

        {/* POSTS */}
        <div className="card shadow-sm border-0 mb-4 fade-up fade-delay-2">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h6 className="mb-0">Recent Posts</h6>
            <i className="ri-article-line text-muted"></i>
        </div>

        <div className="card-body">

            {samplePosts.map((p, i) => {
            const firstLetter = p.text.charAt(0).toUpperCase();
            const letterClass = `post-icon-${firstLetter}`;

            return (
                <div key={i} className="d-flex align-items-start mb-3 post-item">
                
                {/* LEFT ICON BOX */}
                <div className={`post-icon shadow-sm ${letterClass}`}>
                    {firstLetter}
                </div>

                {/* TEXT */}
                <div className="flex-grow-1 ms-3">
                    <p className="mb-1">{p.text}</p>
                    <small className="text-muted">{p.time}</small>
                </div>
                </div>
            );
            })}

            <button className="btn btn-sm btn-light border mt-3 w-100 hover-lift">
            <i className="ri-list-unordered me-2"></i>
            See All Posts
            </button>
        </div>
        </div>

        {/* HANDSHAKES SECTION */}
        <div className="card border-0 shadow mb-4 fade-up fade-delay-25">
            <div className="card-header bg-white d-flex align-items-center gap-2">
            <i className="ri-handshake-line text-primary fs-5"></i>
            <h6 className="mb-0">Handshakes</h6>
            </div>

            <div className="card-body">
            {speaker.handshakes?.length > 0 && Array.isArray(speaker.handshakes) ? (
                speaker.handshakes.map((h, i) => (
                <div
                    key={i}
                    className="d-flex align-items-center justify-content-between mb-3 p-2 rounded border"
                    style={{ background: "#f8f9fa" }}
                >
                    <div className="d-flex align-items-center gap-3">
                    <img
                        src={h.photo}
                        alt="avatar"
                        className="rounded-circle"
                        style={{ width: "42px", height: "42px", objectFit: "cover" }}
                    />
                    <div>
                        <strong>{h.name}</strong>
                        <div className="text-muted small">{h.title}</div>
                    </div>
                    </div>

                    {/* Status Badge */}
                    <span
                    className={`badge px-3 py-2 rounded-pill ${
                        h.status === "accepted"
                        ? "bg-success"
                        : h.status === "pending"
                        ? "bg-warning text-dark"
                        : "bg-danger"
                    }`}
                    >
                    {h.status}
                    </span>
                </div>
                ))
            ) : (
                <div className="text-muted small">No handshakes yet.</div>
            )}
            </div>
        </div>

        {/* SIMILAR PROFILES */}
        <div className="card shadow-sm border-0 mb-4 fade-up fade-delay-3">
            <div className="card-header bg-white">
            <h6 className="mb-0">Similar Profiles</h6>
            </div>
            <div className="card-body">
            {similarProfiles.map((p, i) => (
                <div
                key={i}
                className="d-flex align-items-center gap-3 mb-3"
                style={{ cursor: "pointer" }}
                >
                <img
                    src={p.photo}
                    alt="avatar"
                    className="rounded-circle"
                    style={{ width: "45px", height: "45px", objectFit: "cover" }}
                />
                <div>
                    <strong>{p.name}</strong>
                    <div className="text-muted small">{p.title}</div>
                </div>
                </div>
            ))}
            </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="card shadow-sm border-0 mb-4 fade-up fade-delay-4">
            <div className="card-header bg-white">
            <h6 className="mb-0">Quick Actions</h6>
            </div>
            <div className="card-body d-grid gap-2">
            <Link 
                to={`/inbox/`} 
                className="btn btn-outline-primary w-100"
                >
                <i className="ri-send-plane-line me-2"></i>
                Message
                </Link>
            <button className="btn btn-outline-secondary w-100">
                <i className="ri-bookmark-line me-2"></i>Save Profile
            </button>
            </div>
        </div>

        </div>
      </div>
    </div>
  );
}