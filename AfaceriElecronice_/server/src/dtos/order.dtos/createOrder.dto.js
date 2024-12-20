const { z } = require("zod");

const CreateOrderSchema = z.object({
  name: z.string(),
  phone: z.string(),
  city: z.string(),
  address: z.string(),
  total: z.number(),
});

module.exports = CreateOrderSchema;
