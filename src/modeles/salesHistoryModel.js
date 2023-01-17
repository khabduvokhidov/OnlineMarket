const mongoose = require("mongoose")
// sotilgan mahsulotlar bolima
const SalesHistorySchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    },
    operatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    isActive: {
        type: Boolean,
        default: true,
    },
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model("SalesHis", SalesHistorySchema)