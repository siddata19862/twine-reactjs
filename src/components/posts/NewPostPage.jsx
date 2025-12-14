import { useState } from "react";
import "./NewPostPage.css";

export default function NewPostPage() {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // build form data to send to API
    const formData = new FormData();
    formData.append("text", text);

    files.forEach((file) => {
      formData.append("files[]", file);
    });

    console.log("POST PAYLOAD:", { text, files });

    // axios.post("/posts", formData); etc
  };

  const isImage = (file) => file.type.startsWith("image/");

  return (
    <div className="container py-4 new-post-page fade-in">
      <h4 className="fw-bold mb-4">Create New Post</h4>

      {/* CARD */}
      <div className="card shadow-sm">
        <div className="card-body">

          {/* TEXTAREA */}
          <textarea
            className="form-control mb-3"
            rows="4"
            placeholder="Share something with your network..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>

          {/* FILE INPUT */}
          <div className="mb-3">
            <label className="btn btn-outline-primary px-4">
              Add Images / Files
              <input
                type="file"
                multiple
                className="d-none"
                onChange={handleFileSelect}
              />
            </label>
          </div>

          {/* PREVIEW SECTION */}
          {files.length > 0 && (
            <div className="file-preview-grid">
              {files.map((file, index) => (
                <div className="file-item shadow-sm" key={index}>
                  {isImage(file) ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="file-thumb"
                    />
                  ) : (
                    <div className="file-generic d-flex flex-column justify-content-center align-items-center">
                      <i className="ri-file-3-line fs-2 text-secondary"></i>
                      <span className="small text-muted">{file.name}</span>
                    </div>
                  )}

                  <button
                    className="btn-close remove-btn"
                    onClick={() => removeFile(index)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* POST BUTTON */}
          <div className="text-end mt-4">
            <button
              className="btn btn-primary px-4"
              disabled={!text && files.length === 0}
              onClick={handleSubmit}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}