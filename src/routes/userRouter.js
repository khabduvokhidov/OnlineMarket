const router = require("express").Router()

const userCtrl = require("../controller/userCtrl")

router.post("/signup", userCtrl.registerUser)
router.post("/login", userCtrl.loginUser)
router.get("/users", userCtrl.getAllUsers)
router.get("/operators", userCtrl.getAllOperators)
router.delete("/operators/:id", userCtrl.delUser)



module.exports = router