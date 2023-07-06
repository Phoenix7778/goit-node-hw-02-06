const express = require("express");
const {
  validateBody,
  authenticate,
  isValidId,
} = require("../../utils/validator");
const { upload } = require("../../utils/upload");
const { schemasUser } = require("../../models/user");
const { ctrlUsers } = require("../../controllers/users");

const router = express.Router();

const post = (path, ...middlewares) => {
  router.post(path, ...middlewares, ctrlUsers.register);
};

const patch = (path, ...middlewares) => {
  router.patch(path, ...middlewares, ctrlUsers.updateSubscriptionUser);
};

post(
  "/register",
  validateBody(schemasUser.registerSchema),
  upload.single("avatar")
);
post("/login", validateBody(schemasUser.loginSchema));
router.post("/logout", authenticate);
router.get("/current", authenticate);

patch(
  "/:id/subscription",
  authenticate,
  isValidId,
  validateBody(schemasUser.updateSubscriptionSchema)
);
patch("/avatars", authenticate, upload.single("avatar"));

module.exports = router;
