const router = require("express").Router()

const orderCtrl = require("../controller/orderCtrl")

router.post("/neworder", orderCtrl.addOrderProduct)
router.get("/sales", orderCtrl.getSales)
router.get("/sales/:productId", orderCtrl.getByIdOrder)
router.delete("/sales/:id", orderCtrl.deleteSales)
router.get("/sales/one/:orderId", orderCtrl.getByIdAndOne)


module.exports = router