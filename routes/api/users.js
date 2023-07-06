const express = require("express");
const {
  isValidId,
  validateBody,
  authenticate,
} = require("../../utils/validator");
const { schemasUser } = require("../../models/user");
const { ctrlUsers } = require("../../controllers/users");

const router = express.Router();

router.post(
  "/register",
  validateBody(schemasUser.registerSchema),
  ctrlUsers.register
);

router.post("/login", validateBody(schemasUser.loginSchema), ctrlUsers.login);

router.use(authenticate);

router.post("/logout", ctrlUsers.logout);

router.get("/current", ctrlUsers.getCurrent);

router.patch(
  "/:id/subscription",
  isValidId,
  validateBody(schemasUser.updateSubscriptionSchema),
  ctrlUsers.updateSubscriptionUser
);

module.exports = router;
