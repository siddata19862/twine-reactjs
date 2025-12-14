import { useState } from "react";
import { useNavigate } from "react-router";

import "./Inbox.css";

export default function Inbox() {
    const nav = useNavigate();
  // ----------------------------
  // SAMPLE CONVERSATIONS
  // ----------------------------
  const conversations = [
  {
    id: 1,
    name: "Dr. Alan Frost",
    avatar: "https://i.pravatar.cc/150?img=11",
    lastMessage: "Sure, I’ll send the slides.",
    time: "10:24 AM",
    status: "online",
    messages: [
      { from: "them", text: "Hi! Are you joining the session today?" },
      { from: "me", text: "Yes, I am!" },
      { from: "them", text: "Great! I’ll send the slides." },
    ],
  },
  {
    id: 2,
    name: "Prof. Mia Lark",
    avatar: "https://i.pravatar.cc/150?img=52",
    lastMessage: "Tomorrow works!",
    time: "09:10 AM",
    status: "offline",
    messages: [
      { from: "them", text: "Is the final draft ready?" },
      { from: "me", text: "Almost there—20 mins more." },
      { from: "them", text: "Alright, tomorrow works!" },
    ],
  },
  {
    id: 3,
    name: "Arjun Verma",
    avatar: "https://i.pravatar.cc/150?img=14",
    lastMessage: "Sent the document.",
    time: "Yesterday",
    status: "busy",
    messages: [
      { from: "them", text: "Please review the policy update." },
      { from: "me", text: "On it." },
      { from: "them", text: "Great. Sent the document." },
    ],
  },
  {
    id: 4,
    name: "Dr. Keira Nolan",
    avatar: "https://i.pravatar.cc/150?img=29",
    lastMessage: "Meeting confirmed.",
    time: "Yesterday",
    messages: [
      { from: "me", text: "Can we shift it to 4 PM?" },
      { from: "them", text: "Yep, 4 PM is fine." },
      { from: "them", text: "Meeting confirmed." },
    ],
  },
  {
    id: 5,
    name: "Prof. Victor Hale",
    avatar: "https://i.pravatar.cc/150?img=55",
    lastMessage: "I’ll upload it today.",
    time: "Mon",
    messages: [
      { from: "me", text: "Did you finish the dataset labeling?" },
      { from: "them", text: "Almost done." },
      { from: "them", text: "I’ll upload it today." },
    ],
  },
  {
    id: 6,
    name: "Nora Bennett",
    avatar: "https://i.pravatar.cc/150?img=47",
    lastMessage: "Thanks! Will check.",
    time: "Sun",
    messages: [
      { from: "me", text: "Shared the updated prototype." },
      { from: "them", text: "Thanks! Will check." },
    ],
  },
  {
    id: 7,
    name: "Dr. Ethan Rhodes",
    avatar: "https://i.pravatar.cc/150?img=41",
    lastMessage: "Let's revisit this later.",
    time: "Sun",
    messages: [
      { from: "them", text: "Any update on the simulation run?" },
      { from: "me", text: "It failed midway, debugging now." },
      { from: "them", text: "Okay, let's revisit this later." },
    ],
  },
  {
    id: 8,
    name: "Aisha Karim",
    avatar: "https://i.pravatar.cc/150?img=36",
    lastMessage: "Perfect, thank you!",
    time: "Sat",
    messages: [
      { from: "them", text: "Can you merge the PR?" },
      { from: "me", text: "Merged!" },
      { from: "them", text: "Perfect, thank you!" },
    ],
  }
];

  const [active, setActive] = useState(conversations[0]);

  return (
    <div className="inbox-container d-flex">
      
      {/* -------------------------
      LEFT SIDEBAR
        --------------------------- */}
        <div className="inbox-left border-end slide-left">

        {/* GO BACK BAR */}
        <div className="p-2 border-bottom bg-light d-flex align-items-center">
            <i className="ri-arrow-left-line me-2"></i>
            <button
            className="btn btn-link p-0 text-decoration-none"
            onClick={() => nav("/user")}
            >
            Go Back to My Neuron
            </button>
        </div>

        {/* INBOX HEADER */}
        <div className="p-3 border-bottom fw-bold">Inbox</div>

        {/* CONVERSATIONS LIST */}
        <div className="conversation-list">
            {conversations.map((c) => (
                <div
                key={c.id}
                className={`conversation-item stagger-item d-flex align-items-center p-3 ${
                    active.id === c.id ? "active" : ""
                }`}
                onClick={() => setActive(c)}
                >
                <div className="avatar-wrap position-relative me-3">
                    <img src={c.avatar} alt="" className="inbox-avatar" />

                    {/* Status Dot */}
                    <span className={`status-dot ${c.status}`}></span>
                </div>

                <div className="flex-grow-1">
                    <div className="fw-semibold">{c.name}</div>
                    <div className="text-muted small">{c.lastMessage}</div>
                </div>

                <div className="small text-muted">{c.time}</div>
                </div>
            ))}
            </div>

        </div>

      {/* -------------------------
          RIGHT CHAT WINDOW
      --------------------------- */}
      <div className="inbox-right flex-grow-1 d-flex flex-column slide-right">

        {/* HEADER */}
        <div className="p-3 border-bottom d-flex align-items-center gap-3 fade-in">
          <img src={active.avatar} className="inbox-avatar" />
          <div>
            <h6 className="mb-0">{active.name}</h6>
            <small className="text-muted">Online</small>
          </div>
        </div>

        {/* CHAT BODY */}
        <div className="chat-body flex-grow-1 p-3">
          {active.messages.map((m, i) => (
            <div
              key={`${active.id}-${i}`}
              className={`chat-bubble fade-up ${m.from === "me" ? "me" : "them"}`}
            >
              {m.text}
            </div>
          ))}
        </div>

        {/* CHAT INPUT */}
        <div className="chat-input-area border-top p-3 d-flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="form-control"
          />
          <button className="btn btn-primary px-4">
            <i className="ri-send-plane-2-line"></i>
          </button>
        </div>

      </div>
    </div>
  );
}