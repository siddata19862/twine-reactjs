import { useState } from "react";
import "./PostDetail.css";

export default function PostDetail() {
  const post = {
    id: 1,
    author: "Dr. Alan Frost",
    avatar: "https://i.pravatar.cc/100?img=11",
    time: "2 hours ago",
    title: "Quantum Session Slides Updated!",
    text: "Here are the revised slides from today's quantum entanglement session.",
    media: [
      "https://images.unsplash.com/photo-1508830524289-0adcbe822b40",
    ],
    likes: 45,
    bookmarked: false,
  };

  const initialComments = [
    {
      id: 1,
      name: "Dr. Maya Rangan",
      avatar: "https://i.pravatar.cc/50?img=32",
      text: "Amazing update! The last slide really helped me understand the entanglement process.",
      time: "1 hour ago",
    },
    {
      id: 2,
      name: "Prof. Samuel Crane",
      avatar: "https://i.pravatar.cc/50?img=44",
      text: "Thank you for uploading this so quickly!",
      time: "45 min ago",
    },
  ];

  const [comments, setComments] = useState(initialComments);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="postdetail-page container-fluid">
      <div className="row">

        {/* -------------------------------
           MAIN CONTENT (LEFT SIDE)
        -------------------------------- */}
        <div className="col-lg-8 p-4">

          {/* BACK BUTTON */}
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={() => window.history.back()}
          >
            <i className="ri-arrow-left-line me-1"></i> Back
          </button>

          {/* AUTHOR */}
          <div className="d-flex align-items-center mb-3">
            <img src={post.avatar} className="pd-avatar me-3" />
            <div>
              <div className="fw-semibold">{post.author}</div>
              <div className="text-muted small">{post.time}</div>
            </div>
          </div>

          {/* TITLE */}
          <h3 className="fw-bold mb-3">{post.title}</h3>

          {/* IMAGE */}
          {post.media?.length > 0 && (
            <div className="pd-media mb-4">
              <img src={post.media[0]} className="pd-img" alt="post" />
            </div>
          )}

          {/* TEXT */}
          <p className="lead">{post.text}</p>

          {/* ACTION BUTTONS */}
          <div className="d-flex align-items-center gap-3 mt-4">

            {/* LIKE */}
            <button
              className={`btn btn-sm ${
                liked ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setLiked(!liked)}
            >
              <i className="ri-thumb-up-line me-1"></i>
              {liked ? post.likes + 1 : post.likes}
            </button>

            {/* BOOKMARK */}
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setBookmarked(!bookmarked)}
            >
              <i
                className={
                  bookmarked ? "ri-bookmark-fill" : "ri-bookmark-line"
                }
              ></i>
            </button>

            {/* SHARE */}
            <button className="btn btn-sm btn-outline-dark">
              <i className="ri-share-forward-line me-1"></i>
              Share
            </button>
          </div>

        </div>

        {/* -------------------------------------------------------
             COMMENTS PANEL (RIGHT SIDE)
        -------------------------------------------------------- */}
        <div className="col-lg-4 border-start p-0 comments-pane">
          <div className="comments-header p-3 border-bottom fw-semibold">
            Comments ({comments.length})
          </div>

          <div className="comments-list p-3">
            {comments.map((c) => (
              <div
                key={c.id}
                className="comment-item d-flex align-items-start mb-3"
              >
                <img src={c.avatar} className="comment-avatar me-3" />
                <div>
                  <div className="fw-semibold small">{c.name}</div>
                  <div className="text-muted small mb-1">{c.time}</div>
                  <div>{c.text}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ADD COMMENT */}
          <div className="add-comment p-3 border-top">
            <textarea
              className="form-control mb-2"
              placeholder="Add a comment..."
              rows={2}
            ></textarea>
            <button className="btn btn-primary w-100">
              Comment
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}