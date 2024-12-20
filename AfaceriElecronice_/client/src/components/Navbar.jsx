import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setLoggedIn } from "../store/slices/globalSlice";

function Navbar() {
  const { loggedIn } = useSelector((state) => state.global);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const logoutUser = () => {
    dispatch(setLoggedIn(false));
    localStorage.removeItem("token");
  };

  const getCartLength = () => {
    return cart?.reduce((acc, item) => acc + item.quantity, 0);
  };

  return (
    <div className="navbarWrapper">
      <Link to="/" aria-label="Homepage" className="home-link">
        Home
      </Link>

      <div className="auth-links">
        {loggedIn ? (
          <>
            <Link to="/" onClick={() => logoutUser()}>
              Logout
            </Link>
            <Link to="/cart">
              <i className="fas fa-shopping-cart"></i>
              <span style={{ paddingLeft: "4px" }}>Cart {getCartLength()}</span>
            </Link>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
