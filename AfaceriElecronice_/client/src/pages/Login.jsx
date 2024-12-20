import { useState } from "react";
import { loginUser } from "../routes/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoggedIn, setToken } from "../store/slices/globalSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setLoading(false);
      setError("Please fill in both fields.");
      return;
    }

    try {
      const response = await loginUser(email, password);

      if (response.success) {
        localStorage.setItem("token", response.data.token);
        navigate("/");
        dispatch(setLoggedIn(true));
        dispatch(setToken(response.data.token));
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("An error occurred, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="formWrapper">
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Your email.."
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Your password.."
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />

        {error && <p className="error-message">{error}</p>}

        <div className="loginButtonsWrapper">
          <button type="submit" disabled={loading || !email || !password}>
            {loading ? "Logging in..." : "Submit"}
          </button>
          <button type="button" onClick={handleRegister}>
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
