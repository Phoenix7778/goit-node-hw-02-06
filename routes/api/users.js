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

router.post(
  "/register",
  [validateBody(schemasUser.registerSchema), upload.single("avatar")],
  ctrlUsers.register
);
router.post("/login", [validateBody(schemasUser.loginSchema)], ctrlUsers.login);
router.post("/logout", authenticate, ctrlUsers.logout);

router.get("/verify/:verificationToken", ctrlUsers.verifyEmail);
router.get("/current", authenticate, ctrlUsers.getCurrent);

router.patch(
  "/:id/subscription",
  [authenticate, isValidId, validateBody(schemasUser.updateSubscriptionSchema)],
  ctrlUsers.updateSubscription
);
router.patch(
  "/avatars",
  [authenticate, upload.single("avatar")],
  ctrlUsers.updateAvatar
);

module.exports = router;
