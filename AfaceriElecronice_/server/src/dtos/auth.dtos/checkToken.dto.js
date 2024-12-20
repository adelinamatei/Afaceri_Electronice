const { z } = require("zod");

const CheckTokenSchema = z.object({
  token: z.string(),
});

module.exports = CheckTokenSchema;
