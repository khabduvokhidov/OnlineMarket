const router = require("express").Router()
// const userMidd = require("../middlewere/userMidlewere")

const productCtrl = require("../controller/productCtrl")

router.post("/newproduct", productCtrl.createProduct)
router.get("/products", productCtrl.getAllProduct)
router.delete("/products/:id", productCtrl.deleteProduct)
router.get("/products/:operatorId", productCtrl.getByIdProduct)
router.get("/products/one/:id", productCtrl.getByIdOneProduct)


module.exports = router