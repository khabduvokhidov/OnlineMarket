const mongoose = require("mongoose")
// sotuv Bolimi

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    price: {
        type: mongoose.Schema.Types.Number,
        ref: "Product"
    },
    count: {
        type: Number,
        default: 1
    },
    city: {
        type: String,
        required: String
    },
    district: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    cerateAt:{
        type: Date,
        default: new Date(),
    }
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Order", OrderSchema)