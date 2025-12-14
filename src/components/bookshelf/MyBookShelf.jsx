import { useState } from "react";
import "./MyBookShelf.css";
import data from "./MyBookShelf.json";

export default function MyBookShelf() {
  const [shelf] = useState(data);
  const [path, setPath] = useState([shelf]);
  const [loading, setLoading] = useState(false);

  const currentFolder = path[path.length - 1];

  const enterFolder = (folder) => {
    setLoading(true);
    setTimeout(() => {
      setPath([...path, folder]);
      setLoading(false);
    }, 400);
  };

  const goTo = (index) => {
    setLoading(true);
    setTimeout(() => {
      setPath(path.slice(0, index + 1));
      setLoading(false);
    }, 400);
  };

  const renameItem = (item) => alert(`Rename: ${item.name}`);
  const deleteItem = (item) => alert(`Delete: ${item.name}`);
  const moveItem = (item) => alert(`Move: ${item.name}`);
  const copyLink = (item) => navigator.clipboard.writeText(item.url || "");

  // ======================================
  // TREE COMPONENT (RECURSIVE)
  // ======================================
  const renderTree = (node, level = 0) => {
    const isActive = path[path.length - 1].id === node.id;

    return (
      <div key={node.id} className="tree-node">
        <div
          className={`tree-label ${isActive ? "active" : ""}`}
          style={{ paddingLeft: `${level === 0 ? 12 : level * 26}px` }}
          onClick={() => {
            // Build new path to this folder
            const newPath = findPathToNode(shelf, node.id);
            if (newPath) setPath(newPath);
          }}
        >
          <i className="ri-folder-2-line me-1"></i>
          {node.name}
        </div>

        {node.children?.map((child) =>
          child.type === "folder" ? renderTree(child, level + 1) : null
        )}
      </div>
    );
  };

  // ---------------------------------------------------------
  // Find full path to a node so clicking in sidebar syncs UI
  // ---------------------------------------------------------
  const findPathToNode = (root, targetId, current = []) => {
    if (root.id === targetId) return [...current, root];

    for (const child of root.children || []) {
      if (child.type === "folder") {
        const result = findPathToNode(child, targetId, [...current, root]);
        if (result) return result;
      }
    }
    return null;
  };

  return (
    <div className="bookshelf-layout">

      {/* ---------------------------------- */}
      {/* LEFT SIDEBAR TREE */}
      {/* ---------------------------------- */}
      <div className="bookshelf-sidebar">
        <h5 className="px-3 mt-3 mb-2">Folders</h5>
        <div className="tree-container">
          {renderTree(shelf)}
        </div>
      </div>

      {/* ---------------------------------- */}
      {/* RIGHT MAIN CONTENT */}
      {/* ---------------------------------- */}
      <div className="bookshelf-main">

        <h2 className="mb-4">
          <i className="ri-folder-2-line me-2"></i> My BookShelf
        </h2>

        {/* Breadcrumb */}
        <div className="breadcrumb-area mb-3">
          {path.map((p, index) => (
            <span key={p.id}>
              <span
                className={`breadcrumb-link ${
                  index === path.length - 1 ? "active" : ""
                }`}
                onClick={() => goTo(index)}
              >
                {p.name}
              </span>
              {index < path.length - 1 && <span className="mx-1">/</span>}
            </span>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="folder-loader fade-in">
            <i className="ri-folder-2-line spin me-2"></i> Opening folder...
          </div>
        ) : (
          <div key={currentFolder.id} className="bookshelf-grid fade-in-up">

            {currentFolder.children?.length > 0 ? (
              currentFolder.children.map((item) => (
                <div key={item.id} className="item-wrapper">
                  
                  {/* 3-dot menu */}
                  <div className="item-menu dropdown">
                    <button
                      className="btn btn-sm btn-light rounded-circle item-menu-btn"
                      data-bs-toggle="dropdown"
                    >
                      <i className="ri-more-2-fill"></i>
                    </button>

                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <button className="dropdown-item" onClick={() => renameItem(item)}>
                          <i className="ri-edit-line me-2"></i> Rename
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={() => moveItem(item)}>
                          <i className="ri-share-forward-line me-2"></i> Move To…
                          </button>
                      </li>
                      <li>
                        <button className="dropdown-item text-danger" onClick={() => deleteItem(item)}>
                          <i className="ri-delete-bin-line me-2"></i> Delete
                        </button>
                      </li>

                      {item.type === "file" && (
                        <>
                          <li><hr className="dropdown-divider" /></li>
                          <li>
                            <button className="dropdown-item" onClick={() => copyLink(item)}>
                              <i className="ri-link-m me-2"></i> Copy PDF Link
                            </button>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>

                  {/* Folder / File */}
                  {item.type === "folder" ? (
                    <div className="folder-card" onClick={() => enterFolder(item)}>
                      <i className="ri-folder-fill folder-icon"></i>
                      <div className="file-title">{item.name}</div>
                    </div>
                  ) : (
                    <div className="file-card">
                      <i className="ri-file-pdf-2-line file-icon text-danger"></i>
                      <div className="file-title">{item.name}</div>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-light mt-2 w-100"
                      >
                        <i className="ri-external-link-line me-1"></i> Open PDF
                      </a>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-muted small ps-1 fade-in-up">
                This folder is empty.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}