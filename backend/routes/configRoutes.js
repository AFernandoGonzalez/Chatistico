const express = require("express");
const router = express.Router();
const configController = require("../controllers/configController");
const authenticate = require("../middlewares/authMiddleware");
const { fileUploadMiddleware } = require("../middlewares/fileUploadService");

router.get("/", configController.getConfiguration);
router.post("/", authenticate,
    fileUploadMiddleware,
    configController.saveConfiguration,
);

module.exports = router;
