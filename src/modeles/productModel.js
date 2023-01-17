const mongoose = require("mongoose")
// Mahsulot Bolimi

const productSchema = new mongoose.Schema({
    operatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: Object,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    desc: {
        type: String,
        required: true
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

module.exports = mongoose.model("Product", productSchema)