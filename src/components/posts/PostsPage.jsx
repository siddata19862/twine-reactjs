import { useState } from "react";
import "./PostsPage.css";
import { Link } from "react-router";

export default function PostsPage() {
  const initialPosts = [
    {
        id: 1,
        author: "Dr. Alan Frost",
        avatar: "https://i.pravatar.cc/100?img=11",
        text: "The quantum session slides have now been thoroughly updated with the latest insights and refinements. Please take a moment to review the revised deck so we can ensure everything is accurate, clear, and ready for the upcoming discussion.",
        likes: 12,
        liked: false,
        bookmarked: false,
        time: "10:24 AM",
        media: ["https://images.unsplash.com/photo-1508830524289-0adcbe822b40"],
    },
    {
        id: 2,
        author: "Dr. Maya Rangan",
        avatar: "https://i.pravatar.cc/100?img=32",
        text: "I’m currently working on refining the new speaker dashboard layout, focusing on a cleaner structure, improved navigation, and a more intuitive experience overall. The goal is to make the interface smoother and visually consistent so speakers can access their tools and session details effortlessly.",
        likes: 5,
        liked: true,
        bookmarked: true,
        time: "09:10 AM",
        media: [
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        "https://images.unsplash.com/photo-1508830524289-0adcbe822b40",
        ],
    },
    {
        id: 3,
        author: "Prof. Samuel Crane",
        avatar: "https://i.pravatar.cc/100?img=45",
        text: "Pushed backend updates for the handshake API.",
        likes: 18,
        liked: false,
        bookmarked: false,
        time: "Yesterday",
        media: [],
    },
    ];
  const [posts, setPosts] = useState(initialPosts);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  // LIKE HANDLER
  const handleLike = (id) => {
    setPosts((old) =>
      old.map((p) =>
        p.id === id
          ? {
              ...p,
              liked: !p.liked,
              likes: p.likes + (p.liked ? -1 : 1),
            }
          : p
      )
    );
  };

  // BOOKMARK HANDLER
  const handleBookmark = (id) => {
    setPosts((old) =>
      old.map((p) =>
        p.id === id ? { ...p, bookmarked: !p.bookmarked } : p
      )
    );
  };

  // SEARCH + SORT
  const filtered = posts
    .filter((p) => p.text.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sort === "likes"
        ? b.likes - a.likes
        : sort === "author"
        ? a.author.localeCompare(b.author)
        : b.id - a.id
    );

  return (
    <div className="posts-layout container-fluid py-4 fade-up">
      <div className="row">

        {/* -------------------------------
            LEFT SIDEBAR
        -------------------------------- */}
        <div className="col-12 col-md-3 mb-4 fade-item">
            <div className="card shadow-sm border-0 p-3">
                <h5 className="fw-bold mb-3">Impulse Menu</h5>

                <div className="list-group small">
                <a className="list-group-item list-group-item-action">
                    <i className="ri-rss-line me-2"></i> All Posts
                </a>
                <a className="list-group-item list-group-item-action">
                    <i className="ri-flashlight-line me-2"></i> Trending
                </a>
                <a className="list-group-item list-group-item-action">
                    <i className="ri-book-open-line me-2"></i> Research Updates
                </a>
                <a className="list-group-item list-group-item-action">
                    <i className="ri-user-voice-line me-2"></i> Shared with me
                </a>
                </div>
            </div>

            {/* NEW IMPULSE BUTTON */}
            <button className="btn btn-primary w-100 mt-3 py-2">
                <i className="ri-add-line me-1"></i> New Impulse
            </button>
            </div>

        {/* -------------------------------
            CENTER FEED
        -------------------------------- */}
        <div className="col-12 col-md-6">

          {/* SEARCH + SORT BAR */}
          <div className="d-flex align-items-center mb-4 fade-item">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Search impulses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="form-select w-auto"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="latest">Latest</option>
              <option value="likes">Most Liked</option>
              <option value="author">By Author</option>
            </select>
          </div>

          {/* POSTS LIST */}
          {filtered.map((post) => (
            <div className="post-card shadow-sm p-3 mb-4 fade-item" key={post.id}>

              {/* USER HEADER */}
              <div className="d-flex align-items-center mb-2">
                <img src={post.avatar} className="post-avatar me-3" alt="" />
                <div>
                  <div className="fw-semibold">{post.author}</div>
                  <div className="text-muted small">{post.time}</div>
                </div>
              </div>

              {/* TEXT */}
              <div className="mb-3">{post.text}</div>

              {/* MEDIA GRID */}
              {post.media && post.media.length > 0 && (
                <div className="post-media-grid mb-3">
                  {post.media.map((img, i) => (
                    <img key={i} src={img} className="post-media-img" alt="" />
                  ))}
                </div>
              )}

              {/* COMMENT BOX */}
<div className="comment-box mb-3">
  <input
    type="text"
    className="form-control form-control-sm"
    placeholder="Write a comment..."
  />
</div>
              {/* FOOTER */}
                <div className="d-flex justify-content-between align-items-center">

                    {/* ---------------- LEFT GROUP: LIKE + BOOKMARK ---------------- */}
                    <div className="d-flex align-items-center gap-2">

                        {/* LIKE BUTTON */}
                        <button
                        className={`btn btn-sm ${
                            post.liked ? "btn-primary" : "btn-outline-primary"
                        }`}
                        onClick={() => handleLike(post.id)}
                        >
                        <i className="ri-heart-3-line me-1"></i>
                        {post.likes}
                        </button>

                        {/* BOOKMARK BUTTON */}
                        <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleBookmark(post.id)}
                        >
                        <i
                            className={
                            post.bookmarked ? "ri-bookmark-fill" : "ri-bookmark-line"
                            }
                        ></i>
                        </button>

                    </div>

                    {/* ---------------- RIGHT GROUP: COMMENT + VIEW ---------------- */}
                    <div className="d-flex align-items-center gap-2">

                        {/* COMMENT */}
                        <button className="btn btn-sm btn-light">
                        <i className="ri-chat-1-line"></i> Comment
                        </button>

                        {/* VIEW POST (EYE ICON ONLY) */}
                        <Link
                            to={`/posts/${post.id}`}
                            className="btn btn-sm btn-outline-dark"
                            >
                            <i className="ri-eye-line"></i>
                        </Link>

                    </div>

                </div>
            </div>
          ))}
        </div>

        {/* -------------------------------
            RIGHT SIDEBAR
        -------------------------------- */}
        <div className="col-12 col-md-3 fade-item">

          {/* TRENDING TAGS */}
          <div className="card shadow-sm border-0 p-3 mb-4">
            <h5 className="fw-bold mb-3">Trending Tags</h5>
            <div>
              <span className="badge bg-primary me-2 mb-2">#quantum</span>
              <span className="badge bg-success me-2 mb-2">#neuroscience</span>
              <span className="badge bg-danger me-2 mb-2">#machinelearning</span>
              <span className="badge bg-warning text-dark me-2 mb-2">#myneuron</span>
            </div>
          </div>

          {/* ONLINE USERS */}
          <div className="card shadow-sm border-0 p-3 mb-4 online-card">
            <h5 className="fw-bold mb-3">Online Users</h5>

            {[
              {
                name: "Dr. Maya Rangan",
                avatar: "https://i.pravatar.cc/50?img=40",
                status: "online",
              },
              {
                name: "Prof. Samuel Crane",
                avatar: "https://i.pravatar.cc/50?img=48",
                status: "busy",
              },
              {
                name: "Dr. Yan Lee",
                avatar: "https://i.pravatar.cc/50?img=51",
                status: "offline",
              },
            ].map((u, idx) => (
              <div key={idx} className="online-user-item d-flex align-items-center mb-3">
                <div className="position-relative">
                  <img src={u.avatar} className="online-avatar me-3" alt="" />
                  <span className={`status-dot ${u.status}`}></span>
                </div>
                <div className="small fw-semibold">{u.name}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}