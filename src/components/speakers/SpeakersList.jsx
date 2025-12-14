import React from "react";
import { useNavigate } from "react-router";
import "./SpeakersList.css";
import { useSpeakers } from "../../hooks/speakers/useSpeakers";

const speakers0 = [
  {
    id: 1,
    name: "Dr. Alan Frost",
    title: "AI Researcher, MIT",
    photo: "https://i.pravatar.cc/200?img=11",
  },
  {
    id: 2,
    name: "Selina Andrews",
    title: "Lead Data Engineer",
    photo: "https://i.pravatar.cc/200?img=22",
  },
  {
    id: 3,
    name: "Siddharth Dutta",
    title: "Cloud Architect",
    photo: "https://i.pravatar.cc/200?img=33",
  },
  {
    id: 4,
    name: "Prof. Maya Rangan",
    title: "Quantum Computing Scientist, IISc Bangalore",
    photo: "https://i.pravatar.cc/200?img=32",
  },
  {
    id: 5,
    name: "Dr. Samuel Crane",
    title: "Neuroscience & Robotics Expert, Stanford University",
    photo: "https://i.pravatar.cc/200?img=45",
  },
  {
    id: 6,
    name: "Elena Ruiz",
    title: "Head of Product Innovation, OpenAI",
    photo: "https://i.pravatar.cc/200?img=58",
  },
  {
    id: 7,
    name: "Dr. Hiroshi Tanaka",
    title: "Senior Researcher, Sony AI Labs Tokyo",
    photo: "https://i.pravatar.cc/200?img=67",
  },
  {
    id: 8,
    name: "Sarah O'Connell",
    title: "Chief Data Scientist, Google DeepMind",
    photo: "https://i.pravatar.cc/200?img=12",
  }
];

export default function SpeakersList() {
  const nav = useNavigate();
  
  const {data:speakers,error,isLoading} = useSpeakers();

  if (isLoading)
  return (
    <div className="loading-screen d-flex flex-column justify-content-center align-items-center">
      <div className="spinner"></div>
      <p className="mt-3 text-muted fs-5">Loading speakers...</p>
    </div>
  );

  if (error)
  return (
    <div className="error-screen d-flex flex-column justify-content-center align-items-center">
      <i className="ri-error-warning-line error-icon"></i>
      <p className="text-danger fs-5 mt-2">Error loading speakers.</p>
      <small className="text-muted">Please try again later.</small>
    </div>
  );

  return (
    <div className="container py-3">
      <div className="row g-4">

        {speakers.map((s, i) => (
          <div
            className="col-12 col-sm-6 col-md-2 fade-item"
            style={{ animationDelay: `${i * 0.05}s` }}
            key={s.id}
          >
            <div
              className="text-center p-2"
              style={{ cursor: "pointer" }}
              onClick={() => nav(`/speakers/${s.id}`)}
            >
              <img
                src={s.photo}
                alt={s.name}
                className="speaker-img"
              />
              <h5 className="mt-3 mb-1">{s.first_name} {s.last_name}</h5>
              <p className="text-muted small">{s.title}</p>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}