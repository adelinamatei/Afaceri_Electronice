const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const router = express.Router();
const clientUrl = process.env.VITE_CLIENT_URL || 'http://localhost:5173';

console.log("Base URL: ", process.env.BASE_URL);
console.log("Stripe Secret Key: ", process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { items, total, customer, cancelUrl } = req.body;
    console.log("Cancel URL received from client:", cancelUrl);

    items.forEach((item) => {
      if (isNaN(item.price) || item.price <= 0) {
        throw new Error(`Invalid price for item: ${item.title}`);
      }
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            images: [item.thumbnail],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${clientUrl}/cart?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/cart?canceled=true`,
      customer_email: customer.email,
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
