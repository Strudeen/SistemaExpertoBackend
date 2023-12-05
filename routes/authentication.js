const { Router } = require("express");
const { signIn, logOut, profileIn } = require("../controllers/authentication");
const router = Router();



router.post("/signIn", signIn);
router.post("/logOut", logOut);
router.post("/profileIn", profileIn);

module.exports = router;