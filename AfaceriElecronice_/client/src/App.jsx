import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Navbar from "./components/Navbar";
import useCheckToken from "./hooks/useCheckToken";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { useSelector } from "react-redux";
import Register from "./pages/Register";
import Cart from "./components/Cart";
import SuccessPage from "./components/SuccessPage";


function App() {
  const {checkTokenLoading, loggedIn} = useSelector((state) => state.global);

  useCheckToken();

  return (
    <Router>
      <Navbar />
      <Routes>
        {checkTokenLoading ? (
          <Route path="*" element={<div>Spinner</div>} />
        ) : (
          <>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/success" element={<SuccessPage/>} />
            <Route
              path="/profile"
              element={loggedIn ? <Profile /> : <Navigate to="/login" />}
            />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
