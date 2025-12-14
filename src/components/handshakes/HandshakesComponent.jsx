import { useState, useMemo, useEffect } from "react";
import "./HandshakesComponent.css";
import { useGetMyHandshakes } from "../../hooks/handshake/useGetMyHandshakes";
import { useNavigate } from "react-router";
import { paths } from "../../router/paths";
import { useUpdateHandshakeStatus } from "../../hooks/handshake/useUpdateHandshake";
import AsyncButton from "../ui/AsyncButton";
import { useCreateHandshake } from "../../hooks/handshake/useCreateHandshake";

export default function HandshakesComponent() {
  //const user = JSON.parse(localStorage.getItem("user")); // to know who is sender/receiver
  const [user, setUser] = useState(null);
  

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    setUser(stored);
  }, []);

  const { data: handshakes } = useGetMyHandshakes();

  const [tab, setTab] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState("gatc2025");

  const navigate = useNavigate();
  
  //const ch = useCreateHandshake();
  const {mutate:updateHandshakeStatus, isPending} = useUpdateHandshakeStatus();
  

  const events = [
    { id: "gatc2025", name: "GATC 2025" },
    { id: "gatc2024", name: "GATC 2024" },
    { id: "gatc2023", name: "GATC 2023" },
  ];

  const tabs = ["all","pending", "accepted", "rejected"];

  // -------------------------------------------------------
  // TRANSFORM API DATA
  // -------------------------------------------------------
  const normalized = useMemo(() => {
    if (!handshakes) return [];

    return handshakes.map((h) => {
      const amSender = h.sender_id === user?.id;

      
      const name = amSender
        ? `${h.receiver_first_name} ${h.receiver_last_name}`
        : `${h.sender_first_name} ${h.sender_last_name}`;

      const avatar = amSender ? h.receiver_photo : h.sender_photo;

      return {
        id: h.id,
        status: h.status,
        created_at: h.date_created?.split(" ")[0] ?? "",
        receiver: {
          
          id: amSender ? h.receiver_id : h.sender_id,
          name,
          title: "",
          avatar: avatar || "https://i.pravatar.cc/100?img=1",
        },
        sender: {
          
          id: h.sender_id,
          
        }
      };
    });
  }, [handshakes, user]);

  // -------------------------------------------------------
  // STATUS FILTER
  // -------------------------------------------------------
  const filtered =
    tab === "all" ? normalized : normalized.filter((h) => h.status === tab);

  

  return (
    <>
      {/* -------------------------------------------------- */}
      {/* EVENT SELECTOR BAR                                */}
      {/* -------------------------------------------------- */}
      <div className="event-bar-fullwidth py-3 mb-4">
        <div className="container d-flex gap-2 flex-wrap">
          {events.map((ev) => (
            <div
              key={ev.id}
              className={`event-pill ${selectedEvent === ev.id ? "active" : ""}`}
              onClick={() => setSelectedEvent(ev.id)}
            >
              {ev.name}
            </div>
          ))}
        </div>
      </div>

      {/* -------------------------------------------------- */}
      {/* MAIN CONTENT                                       */}
      {/* -------------------------------------------------- */}
      <div className="container py-4 handshakes-page">
        <div className="row">
          <div className="col-md-9 col-lg-9">
            <h3 className="mb-4 fw-bold">Handshakes</h3>

            {/* TABS */}
            <div className="handshake-tabs mb-4 d-flex gap-4">
              {tabs.map((t) => (
                <button
                  key={t}
                  className={`tab-btn ${tab === t ? "active" : ""}`}
                  onClick={() => setTab(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {/* LIST */}
            <div className="list-group">
              {filtered.map((h) => (
                <div
                  key={h.id}
                  className="list-group-item handshake-item d-flex align-items-center"
                >
                  {/* Avatar */}
                  <img src={h.receiver.avatar} className="avatar me-3" />

                  {/* Details */}
                  <div className="flex-grow-1">
                    <div className="fw-bold">{h.receiver.name}</div>

                    {h.receiver.title && (
                      <div className="text-muted small">{h.receiver.title}</div>
                    )}

                    <div className="text-muted small">
                      Sent on: {h.created_at}
                    </div>
                  </div>

                  {/* Status */}
                  <span className={`status-badge status-${h.status}`}>
                    {h.status.toUpperCase()}
                  </span>

                  {/* View Profile */}
                    <button
                      className="btn btn-sm btn-outline-dark rounded-pill ms-3 px-3 d-flex align-items-center gap-1"
                      onClick={() => {
                        
                        if (user?.type === "speaker") {
                          navigate(`/participants/${h?.receiver?.id}`);
                        } else {
                          navigate(`/speakers/${h?.receiver?.id}`);
                        }
                      }}
                    >
                      <i className="ri-user-line"></i> View Profile
                    </button>

                  {/* Cancel Request */}
                  {user?.type=="user" && h.status === "pending" && (
                    <button
  className="btn btn-sm btn-outline-danger rounded-pill ms-2 px-3 d-flex align-items-center gap-1"
  onClick={() => cancelHandshake(h.id)}
>
  <i className="ri-close-circle-line"></i> Cancel
</button>
                  )}
                  {user?.type === "speaker" && h.status === "pending" && (
                    <div className="d-flex align-items-center gap-2 ms-2">

                      {/* Accept */}
                      <AsyncButton icon="ri-check-line" hook={useUpdateHandshakeStatus} payload={{id:h.id,status:"accepted"}} caption={"Accept"} success="Request Sent" buttonClassName="btn btn-sm btn-outline-success rounded-pill px-3 d-flex align-items-center gap-1"></AsyncButton>
                      

                      {/* Reject */}
                      <AsyncButton icon="ri-close-line" hook={useUpdateHandshakeStatus} payload={{id:h.id,status:"rejected"}} caption={"Reject"} success="Request Sent" buttonClassName="btn btn-sm btn-outline-danger rounded-pill px-3 d-flex align-items-center gap-1"></AsyncButton>
                      

                    </div>
                  )}
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="text-center py-5 text-muted">
                  No {tab} handshakes found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}