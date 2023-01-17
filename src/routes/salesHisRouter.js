const router = require("express").Router()

const salesHisCtrl = require("../controller/salesHisCtrl")

router.post("/newsales", salesHisCtrl.addSalesHis)
router.get("/saleshstory", salesHisCtrl.getSalesHistory)
router.delete("/saleshstory/:id", salesHisCtrl.deleteSalesHis)
router.get("/saleshstory/operators/:operatorId", salesHisCtrl.getByIdAndOrder)
router.put("/salesupdate/:salesHisId", salesHisCtrl.updateSalesHis)
router.get("/salessoltout", salesHisCtrl.getIsActive)

module.exports = router