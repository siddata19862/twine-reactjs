import React, { useState } from "react";
import "./ParticipantsList.css";
import { Link } from "react-router";

export default function ParticipantsList() {
  const [participants] = useState([
    {
      id: 1,
      name: "Dr. Alan Frost",
      title: "AI Researcher, MIT",
      badge: "Speaker",
      photo: "https://i.pravatar.cc/100?img=11",
      location: "Boston, USA",
    },
    {
      id: 2,
      name: "Dr. Emily Carter",
      title: "Lead Data Engineer",
      badge: "VIP",
      photo: "https://i.pravatar.cc/100?img=48",
      location: "Toronto, Canada",
    },
    {
      id: 3,
      name: "Raj Mehra",
      title: "Cloud Architect",
      badge: "Attendee",
      photo: "https://i.pravatar.cc/100?img=45",
      location: "Pune, India",
    },
    {
      id: 4,
      name: "Prof. Maya Rangan",
      title: "Quantum Computing Scientist, IISc Bangalore",
      badge: "Speaker",
      photo: "https://i.pravatar.cc/100?img=32",
      location: "Bangalore, India",
    },
    {
        id: 5,
        name: "Dr. Hiro Tanaka",
        title: "Neuroscience Professor, University of Tokyo",
        badge: "Speaker",
        photo: "https://i.pravatar.cc/100?img=12",
        location: "Tokyo, Japan",
        },
        {
        id: 6,
        name: "Laura Mitchell",
        title: "Senior Bioinformatics Engineer",
        badge: "Attendee",
        photo: "https://i.pravatar.cc/100?img=19",
        location: "London, UK",
        },
        {
        id: 7,
        name: "Carlos Ramirez",
        title: "Genomics Data Analyst",
        badge: "VIP",
        photo: "https://i.pravatar.cc/100?img=52",
        location: "Mexico City, Mexico",
        },
        {
        id: 8,
        name: "Dr. Aisha Khan",
        title: "Immunology Research Lead, Max Institute",
        badge: "Speaker",
        photo: "https://i.pravatar.cc/100?img=29",
        location: "New Delhi, India",
        },
        {
        id: 9,
        name: "Michael O’Connor",
        title: "ML Engineer, DeepMind",
        badge: "Attendee",
        photo: "https://i.pravatar.cc/100?img=41",
        location: "Dublin, Ireland",
        },
        {
        id: 10,
        name: "Dr. Sofia Rossi",
        title: "Computational Biology Scientist",
        badge: "VIP",
        photo: "https://i.pravatar.cc/100?img=57",
        location: "Milan, Italy",
        }
  ]);

  return (
  <div className="container py-4">
    <h3 className="mb-4 fw-bold">Participants</h3>

    <div className="participants-grid">
      {participants.map((p, i) => (
        <Link
          key={p.id}
          to={`/participants/19`}
          className="participant-card fade-item text-decoration-none"
          style={{ animationDelay: `${i * 0.06}s` }}
        >
          <img src={p.photo} alt={p.name} className="participant-avatar" />

          <div className="mt-3 text-center">
            <h6 className="fw-bold mb-1 text-dark">{p.name}</h6>
            <div className="text-muted small">{p.title}</div>

            <div className="mt-2">
              <i className="ri-map-pin-line text-muted me-1"></i>
              <span className="small">{p.location}</span>
            </div>

            <span className={`badge rounded-pill mt-3 badge-${p.badge.toLowerCase()}`}>
              {p.badge}
            </span>
          </div>
        </Link>
      ))}
    </div>
  </div>
);
}