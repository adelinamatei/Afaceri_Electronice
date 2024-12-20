import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateCart, removeFromCart, clearCart } from "../store/slices/cartSlice";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { stripePromise } from "../utils/stripe"; 
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.global);
  const { cart } = useSelector((state) => state.cart);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });
  const [paymentMethod, setPaymentMethod] = useState('card'); 
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    const reqToken = localStorage.getItem("token");
    if (!reqToken) {
      toast.error("You need to be logged in to checkout");
      return;
    }
  
    if (!formData.name || !formData.phone || !formData.address || !formData.city) {
      toast.error("Please fill in all the required fields.");
      return;
    }
  
    if (!cart.length) {
      toast.error("Your cart is empty.");
      return;
    }
  
    if (paymentMethod === "cash") {
      toast.success("Your order has been placed. Payment will be made in cash on delivery.");
      dispatch(clearCart());
      return;
    }
  
    sessionStorage.setItem("cart", JSON.stringify(cart));
  
    const total = Number(cartTotal());
    const currentUrl = window.location.href;
    console.log("Current URL:", currentUrl);
  
    const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/api/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${reqToken}`,
      },
      body: JSON.stringify({
        items: cart.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          title: item.title,
          price: item.price,
          thumbnail: item.thumbnail,
        })),
        total: total,
        customer: formData,
        cancelUrl: currentUrl,
      }),
    });
  
    if (response.ok) {
      const { id: sessionId } = await response.json();
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });
  
      if (error) {
        toast.error("Failed to redirect to Stripe Checkout.");
      }
    } else {
      toast.error("Failed to create checkout session.");
    }
  };

useEffect(() => {
  const storedCart = JSON.parse(sessionStorage.getItem("cart"));
  if (storedCart && cart.length === 0) {
    storedCart.forEach((item) => {
      dispatch(addToCart(item)); 
    });
  }
}, [cart, dispatch]);

useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get("session_id");
  const canceled = urlParams.get("canceled");

  if (sessionId) {
    const fetchPaymentStatus = async () => {
      try {
        // Verifică statusul plății pe server
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_API_URL}/success?session_id=${sessionId}`
        );
        const data = await response.json();

        console.log("Payment status data:", data); // Debugging

        if (data.payment_status === "paid") {
          toast.success("Payment was successful! Your order has been placed.");
          dispatch(clearCart()); // Golește coșul din Redux

          // Golește coșul și din sessionStorage și localStorage
          sessionStorage.removeItem("cart");
          localStorage.removeItem("cart");

          navigate("/success", { replace: true }); // Redirecționează la o pagină de confirmare
        } else {
          toast.error("Payment was not successful. Please try again.");
        }
      } catch (err) {
        console.error("Error verifying payment:", err);
        toast.error("An error occurred while verifying payment.");
      }
    };

    fetchPaymentStatus();
  } else if (canceled) {
    console.log("Payment was canceled."); // Debugging
    toast.error("Payment was canceled. Returning to the cart.");
    navigate("/cart", { replace: true }); // Redirecționează la coș
  }
}, [dispatch, navigate]);
  
  const handleQuantityChange = (product, quantity) => {
    if (quantity > 0) {
      dispatch(updateCart({ id: product.id, quantity }));
    } else {
      dispatch(removeFromCart({ id: product.id }));
    }
  };

  const cartTotal = () => {
    return cart
      .reduce((total, product) => {
        const productPrice = parseFloat(product.price) || 0;
        const productQuantity = product.quantity || 0;
        return total + productPrice * productQuantity;
      }, 0)
      .toFixed(2);
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div>
      <div className="cart-container">
        <div className="w-1/4 flex flex-col justify-center">
          <label htmlFor="name-input" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
            Name
          </label>
          <input
            type="text"
            id="name-input"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block !w-full p-2.5"
          />
          
          <label htmlFor="phone-input" className="block mt-4 mb-1 text-sm font-medium text-gray-900 dark:text-white">
            Phone
          </label>
          <input
            type="text"
            id="phone-input"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block !w-full p-2.5"
          />

          <label htmlFor="address-input" className="block mt-4 mb-1 text-sm font-medium text-gray-900 dark:text-white">
            Address
          </label>
          <input
            type="text"
            id="address-input"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block !w-full p-2.5"
          />

          <label htmlFor="city-input" className="block mt-4 mb-1 text-sm font-medium text-gray-900 dark:text-white">
            City
          </label>
          <input
            type="text"
            id="city-input"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block !w-full p-2.5"
          />
        </div>

        <div className="payment-method">
          <label>
            <input 
              type="radio" 
              name="paymentMethod" 
              value="card" 
              checked={paymentMethod === 'card'} 
              onChange={() => setPaymentMethod('card')} 
            />
            Card Payment
          </label>
          <label>
            <input 
              type="radio" 
              name="paymentMethod" 
              value="cash" 
              checked={paymentMethod === 'cash'} 
              onChange={() => setPaymentMethod('cash')} 
            />
            Cash on Delivery
          </label>
        </div>

        <div className="cart-items max-h-[400px] overflow-auto">
          {cart.map((product) => (
            <div key={product.id} className="cart-item">
              <img
                src={product.thumbnail || "/default-image.png"}
                alt={product.title || "Unknown Title"}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h3>{product.title || "Unknown Title"}</h3>
                <p>Author: {product.author || "Unknown"}</p>
                <p>Price: ${product.price ? product.price.toFixed(2) : "0.00"}</p>
                <div className="cart-item-buttons">
                  <button onClick={() => handleQuantityChange(product, product.quantity - 1)}>-</button>
                  <span>{product.quantity || 1}</span>
                  <button onClick={() => handleQuantityChange(product, product.quantity + 1)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="cart-summary">
        <div className="cart-total">
          <h3>Total: ${cartTotal()}</h3>
        </div>
        <div className="cart-buttons">
          <button className="cart-button" onClick={handleClearCart}>Clear Cart</button>
          <button className="cart-button" onClick={handleSubmit}>Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
