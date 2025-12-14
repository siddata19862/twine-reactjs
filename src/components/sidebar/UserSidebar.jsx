import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import "./UserSidebar.css";

export default function UserSidebar() {
  const nav = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // OPEN/CLOSE DROPDOWNS
  const [openMap, setOpenMap] = useState({});
  const toggle = (label) =>
    setOpenMap((old) => ({ ...old, [label]: !old[label] }));

  // MENU TREE
  const menuTree = [
    {
      label: "Dashboard",
      icon: "ri-dashboard-line",
      color: "#0d6efd",
      path: "/",
    },
    {
      label: "Profile",
      icon: "ri-user-3-line",
      color: "#6f42c1",
      path: "/user/profile/edit",
    },
    {
      label: "Messages",
      icon: "ri-message-3-line",
      color: "#20c997",
      path: "/inbox",
    },

    // My Neuron
    {
      label: "My Neuron",
      icon: "ri-brain-line",
      color: "#ff8c00",
      children: [
        { label: "My Handshakes", path: "/handshakes" },
        { label: "My Bookmarks", path: "/my-bookmarks" },
      ],
    },

    {
      label: "My Bookshelf",
      icon: "ri-book-shelf-line",
      color: "#b5651d",
      path: "/my-bookshelf",
    },
    {
      label: "PubMed Search",
      icon: "ri-search-eye-line",
      color: "#d63384",
      path: "/scholar",
    },
    {
      label: "Impulse",
      icon: "ri-flashlight-line",
      color: "#0d6efd",
      path: "/posts",
    },

    // GATC
    {
      label: "GATC",
      icon: "ri-building-4-line",
      color: "#0abde3",
      children: [
        { label: "Dashboard", path: "/gatc/dashboard" },
        { label: "Programs", path: "/gatc/programs" },
        { label: "Speakers", path: "/gatc/speakers" },
        { label: "Participants", path: "/gatc/participants" },
      ],
    },

    // Divider
    { type: "divider" },

    {
      label: "Logout",
      icon: "ri-logout-box-line",
      color: "red",
      path: "/logout",
    },
  ];

  // AUTO-OPEN ANY PARENT WHOSE CHILD MATCHES THE URL
  useEffect(() => {
    const openState = {};

    menuTree.forEach((item) => {
      if (!item.children) return;

      const childMatch = item.children.some(
        (c) => currentPath.startsWith(c.path)
      );

      if (childMatch) openState[item.label] = true;
    });

    setOpenMap((prev) => ({ ...prev, ...openState }));
  }, [currentPath]);

  return (
    <aside className="sidebar p-3">
      <h5 className="text-muted mb-4">Menu</h5>

      <ul className="list-unstyled">
        {menuTree.map((item, i) => (
          <MenuItem
            key={item.label || `divider-${i}`}
            item={item}
            nav={nav}
            openMap={openMap}
            toggle={toggle}
            currentPath={currentPath}
          />
        ))}
      </ul>
    </aside>
  );
}

/* ======================================================
   RECURSIVE MENU ITEM COMPONENT
====================================================== */
function MenuItem({ item, nav, openMap, toggle, currentPath }) {
  // Divider Row
  if (item.type === "divider") {
    return <hr className="sidebar-divider" />;
  }

  const hasChildren = Array.isArray(item.children);
  const isOpen = openMap[item.label] || false;

  // Active exact match
  const isActive = item.path === currentPath;

  // Active if any child matches URL prefix
  const isParentActive =
    hasChildren &&
    item.children.some((c) => currentPath.startsWith(c.path));

  return (
    <>
      <li
        className={`sidebar-item d-flex align-items-center mb-2 
          ${isActive ? "active" : ""} 
          ${isParentActive ? "active-parent" : ""}
        `}
        onClick={() => {
          if (hasChildren) toggle(item.label);
          else nav(item.path);
        }}
      >
        {/* Icon */}
        <i
          className={`${item.icon} sidebar-icon me-3`}
          style={{ color: item.color }}
        ></i>

        {/* Label */}
        <span className="flex-grow-1">{item.label}</span>

        {/* Dropdown Arrow */}
        {hasChildren && (
          <i
            className={`ri-arrow-right-s-line arrow ${
              isOpen ? "rotate" : ""
            }`}
          ></i>
        )}
      </li>

      {/* Submenu */}
      {hasChildren && (
        <ul className={`submenu-wrapper ${isOpen ? "open" : ""}`}>
          <div className="submenu-inner">
            {item.children.map((child) => (
              <MenuItem
                key={child.label}
                item={child}
                nav={nav}
                openMap={openMap}
                toggle={toggle}
                currentPath={currentPath}
              />
            ))}
          </div>
        </ul>
      )}
    </>
  );
}