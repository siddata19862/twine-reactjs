import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="nf-container">
      {/* Floating Icon */}
      <i className="ri-search-eye-line nf-icon"></i>

      <h1 className="nf-title">404</h1>

      <p className="nf-subtitle">Oops… the page you're looking for doesn’t exist.</p>

      <p className="nf-desc">
        It may have been moved, renamed, or simply never existed.  
        Let’s help you get back on track.
      </p>

      <a href="/" className="btn btn-dark px-4 py-2 rounded-pill nf-btn">
        Go Home
      </a>
    </div>
  );
}