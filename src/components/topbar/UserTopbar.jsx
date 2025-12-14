import { Link, useRevalidator } from "react-router";
import './UserTopbar.css';
import useLogout from "../../hooks/logout";
import { useQueryClient } from "@tanstack/react-query";
//import useAuthUser from "../../hooks/auth/useAuthUser";

export default function UserTopbar() {

  const logout = useLogout();
  //const { data: user } = useAuthUser(); // 👈 get user info
  const user = JSON.parse(localStorage.getItem("user"));
  const queryClient = useQueryClient();
  const reload = () =>
  {
    queryClient.invalidateQueries();
  }
  return (
    <header className="user-topbar shadow-sm">
      <div className="container-fluid d-flex align-items-center justify-content-between">

        {/* Left */}
        <div className="d-flex align-items-center gap-2">
          <img src="https://aditechsolutions.com/sid/gatc/neuron1.png" style={{"width":"30px","marginLeft":"10px"}} />
          <Link className="navbar-brand fw-bold" to="/" style={{"fontSize":"22px"}}>
            My Neuron
          </Link>
        </div>

        {/* Center */}
        <div className="flex-grow-1 d-flex justify-content-center">
          <div className="search-box d-flex align-items-center">
            <i className="ri-search-line me-2"></i>
            <input
              type="text"
              placeholder="Search..."
              className="form-control border-0 shadow-none"
            />
          </div>
        </div>

        {/* Right */}
        <div className="d-flex align-items-center gap-3">

          <button
  className="btn btn-light rounded-circle icon-btn"
  onClick={() => {
    reload();
    const btn = document.querySelector(".icon-btn");
    btn.classList.add("spin-once");

    setTimeout(() => btn.classList.remove("spin-once"), 600);
  }}
  title="Refresh Page"
>
  <i className="ri-refresh-line"></i>
</button>
          <button className="btn btn-light rounded-circle icon-btn">
            <i className="ri-notification-3-line"></i>
          </button>

          

          <Link to="/inbox" className="btn btn-light rounded-circle icon-btn">
            <i className="ri-message-3-line"></i>
          </Link>

          {/* Profile + Name */}
          <div className="dropdown">
            <button
              className="btn d-flex align-items-center gap-2"
              data-bs-toggle="dropdown"
            >
              <img
                src={user?.photo || "https://i.pravatar.cc/100?img=12"}
                className="rounded-circle avatar"
                alt=""
                />

              {/* Show user name */}
               <div className="d-flex flex-column text-start lh-1">
                <span className="fw-semibold">{user?.first_name} {user?.last_name}</span>
                <small className="text-muted">{user?.type}</small>
              </div>

              <i className="ri-arrow-down-s-line"></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end shadow-sm">
              <li>
                <Link className="dropdown-item" to="user/profile/edit">
                  Profile
                </Link>
              </li>

              <li>
                <Link className="dropdown-item" to="/settings">
                  Settings
                </Link>
              </li>

              <li><hr className="dropdown-divider" /></li>

              <li>
                <button className="dropdown-item text-danger" onClick={logout}>
                  Logout
                </button>
              </li>
            </ul>

          </div>
        </div>
      </div>
    </header>
  );
}