import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { validateLogin } from "../../api/authApi";
import { useNavigate } from "react-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // -------------------------
  // DEV SAMPLE USERS
  // -------------------------
  const sampleUsers = [
    {
      email: "rahuldravid@gmail.com",
      password: "123",
      first_name: "Rahul",
      last_name: "Dravid",
      type: "user",
    },
    {
      email: "markwaugh@gmail.com",
      password: "123",
      first_name: "Mark",
      last_name: "Waugh",
      type: "user",
    },
    {
      email: "adamgilchrist@gmail.com",
      password: "123",
      first_name: "Adam",
      last_name: "Gilchrist",
      type: "user",
    },
    {
      email: "marktaylor@gmail.com",
      password: "123",
      first_name: "Mark",
      last_name: "Taylor",
      type: "speaker",
    },
    {
      email: "carlosalcaraz@gmail.com",
      password: "123",
      first_name: "Carlos",
      last_name: "Alcaraz",
      type: "speaker",
    },
  ];

  const fillUser = (usr) => {
    setEmail(usr.email);
    setPassword(usr.password);
  };

  // -------------------------
  // LOGIN MUTATION
  // -------------------------
  const loginMutation = useMutation({
    mutationFn: validateLogin,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      navigate("/", { replace: true });
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Invalid email or password");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      
      <div className="card shadow p-4" style={{ width: "680px" }}>
        <h3 className="text-center mb-4 fw-bold">Login</h3>

        <div className="row">
          {/* ------------------------------ */}
          {/* LEFT: Login Form */}
          {/* ------------------------------ */}
          <div className="col-7 border-end pe-3">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="•••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 mt-2"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing In…" : "Sign In"}
              </button>
            </form>
          </div>

          {/* ------------------------------ */}
          {/* RIGHT: SAMPLE USERS */}
          {/* ------------------------------ */}
          <div className="col-5 ps-3">
            <div className="fw-bold mb-2 small text-muted">Sample Users</div>

            <div className="list-group small">
              {sampleUsers.map((u, i) => (
                <button
                  key={i}
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  onClick={() => fillUser(u)}
                >
                  <span>{u.first_name} {u.last_name}</span>

                  <span
                    className={`badge rounded-pill ${
                      u.type === "speaker"
                        ? "bg-warning text-dark"
                        : "bg-secondary"
                    }`}
                  >
                    {u.type}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}