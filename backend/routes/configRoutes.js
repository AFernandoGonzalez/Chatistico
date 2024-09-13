const express = require("express");
const router = express.Router();
const configController = require("../controllers/configController");
const authenticate = require("../middlewares/authMiddleware");

router.get("/", configController.getConfiguration);

router.post("/", authenticate, configController.saveConfiguration);

module.exports = router;
