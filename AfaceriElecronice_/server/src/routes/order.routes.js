const express = require("express");
const prisma = require("../prisma");
const { getValidationErrors } = require("../utils/validateUtils");
const CreateOrderSchema = require("../dtos/order.dtos/createOrder.dto");

const router = express.Router();

router.post("/create", async (req, res) => {
  const validation = CreateOrderSchema.safeParse(req.body);

  if (!validation.success) {
    const errors = getValidationErrors(validation);

    if (errors.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: errors.join(", "), data: errors });
    }
  }

  const user = await prisma.user.findUnique({
    where: {
      id: req.userId,
    },
  });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "User not found", data: {} });
  }

  const order = await prisma.order.create({
    data: {
      userId: req.userId,
      ...validation.data,
      status: "PENDING",
    },
  });

  return res
    .status(200)
    .json({ success: true, message: "Order created", data: order });
});

module.exports = router;
