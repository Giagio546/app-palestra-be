const express = require("express");
const router = express.Router();
const { getUsers, createUser, loginUser, currentUser, logout, enableUser } = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");
router.route("/").get(validateToken, getUsers).post(createUser);
router.post("/login", loginUser);
router.post("/current",validateToken, currentUser)
router.get('/logout', validateToken, logout)
router.put('/enable-user/:id', validateToken, enableUser)
module.exports = router;