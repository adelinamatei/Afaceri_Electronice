const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const orderRoutes = require("./routes/order.routes");
const { verifyToken } = require("./utils/tokenUtils");
const stripeRoutes = require("./routes/stripe");
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); 

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3001;

app.use(morgan("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/orders", verifyToken, orderRoutes);
app.use("/api", stripeRoutes);

app.get("/success", async (req, res) => {
  const sessionId = req.query.session_id;

  if (!sessionId) {
    return res.status(400).json({ error: "Session ID is missing." });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid") {
      return res.json({ payment_status: "paid", session_id: sessionId });
    } else {
      return res.status(400).json({ error: "Payment was not successful." });
    }
  } catch (error) {
    console.error("Error retrieving session:", error);
    res.status(500).json({ error: "An error occurred while processing your payment." });
  }
});


app.get("/cancel", (req, res) => {
  const clientCartUrl = process.env.VITE_CLIENT_URL || "http://localhost:5173/cart";

  res.send(`
    <html>
      <body>
        <h1>Payment was canceled. Please try again.</h1>
        <script>
          setTimeout(() => {
            window.location.href = "${clientCartUrl}";
          }, 3000);
        </script>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
