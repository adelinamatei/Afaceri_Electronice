const express = require("express");
const prisma = require("../prisma");
const UserSchema = require("../dtos/user.dtos/user.dto");
const { hashPassword } = require("../utils/bcryptUtils");
const { getValidationErrors } = require("../utils/validateUtils");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const validation = UserSchema.safeParse(req.body);

    if (!validation.success) {
      const errors = getValidationErrors(validation);

      if (errors.length > 0) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid data", data: errors });
      }
    }

    const user = await prisma.user.findFirst({
      where: {
        email: validation.data.email,
      },
    });

    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists", data: {} });
    }

    const hashedPassword = hashPassword(validation.data.password);

    const newUser = await prisma.user.create({
      data: {
        ...validation.data,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "User created",
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", data: {} });
  }
});

module.exports = router;
