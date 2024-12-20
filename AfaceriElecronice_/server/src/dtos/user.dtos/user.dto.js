const { z } = require("zod");

const UserSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string().min(8),
});

module.exports = UserSchema;
