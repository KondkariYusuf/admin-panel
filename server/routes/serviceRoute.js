// // routes/serviceRoute.js
// const express = require("express");
// const router = express.Router();
// const multer = require("multer");

// const upload = multer({ storage: multer.memoryStorage() });

// // const { protect } = require("./middleware/authMiddleware");
// const { protect } = require("../middleware/authMiddleware");


// const serviceController = require("../controller/serviceController");


// // GET singleton service content (first document)
// router.get("/", protect, serviceController.getAllServiceContents);

// // GET one service content by ID (if you ever need a specific one)
// router.get("/:id", serviceController.getServiceContentById);

// // POST create or update singleton service content (multipart: payload + leftImage/rightImage)
// router.post("/", upload.any(), serviceController.createServiceContent);

// // PUT update existing service content by ID (multipart optional)
// router.put("/:id", upload.any(), serviceController.updateServiceContent);

// // DELETE remove service content by ID
// router.delete("/:id", serviceController.deleteServiceContent);

// module.exports = router;



// routes/serviceRoute.js
const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });
const serviceController = require("../controller/serviceController");

// Protect all routes below this line
const { protect } = require("../middleware/authMiddleware");
router.use(protect);

// Now all of these need a token
router.get("/", serviceController.getAllServiceContents);
router.get("/:id", serviceController.getServiceContentById);
router.post("/", upload.any(), serviceController.createServiceContent);
router.put("/:id", upload.any(), serviceController.updateServiceContent);
router.delete("/:id", serviceController.deleteServiceContent);

module.exports = router;
