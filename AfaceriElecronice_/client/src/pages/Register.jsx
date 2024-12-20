import { useState } from "react";
import { toast } from "react-toastify";
import { registerUser } from "../routes/user";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const response = await registerUser(name, email, password);

      if (response.success) {
        navigate("/login");
        toast.success("User registered successfully");
      } else {
        if (response.error === "email_exists") {
          setError("This email is already registered.");
        } else {
          toast.error("Registration failed. Try again.");
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registerDivF">
      <div className="formWrapper">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Your name.."
          onChange={(e) => setName(e.target.value)}
          value={name}
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Your email.."
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Your password.."
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        {error && <p className="error-message">{error}</p>}

        <div>
          <button 
            type="submit" 
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Registering..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
