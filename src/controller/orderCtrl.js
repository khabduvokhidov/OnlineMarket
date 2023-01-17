const Order = require("../modeles/orderModel")
const Product = require("../modeles/productModel")
const User = require("../modeles/userModel")
const JWT = require("jsonwebtoken")

const orderCtrl = {
    addOrderProduct: async (req, res) =>{
        try {
            const {productId, userId, count, address, district, city} = req.body
            
            const product = await Product.findById(productId)

            if(product){
                const price = product.price * count

                const newOrder = new Order({productId: productId, userId: userId, count, price, address, district, city, })
                
                newOrder.save()
            
                return res.status(201).json({message: "Zakazingiz qabul qilindi tez orada operatormiz siz bn bog'lanadi ", newOrder})
            }
            res.status(404).json({message: "Ushbu mahsulot sotilgan uzur!"})

        } catch (error) {
            res.status(500).json({message: error})
        }
    },

    getSales: async (req, res) => {
        try {
            const {token} = req.headers
            if(token){
                const user = await JWT.verify(token, process.env.JWT_SECRET_KEY)
                if(user.role === "admin" || user.role === "operator") {
                    const orders = await Order.find({isActive: true}).populate({
                        path: "productId",
                        select: ["image", "name",]
                    }).populate({
                        path: "userId",
                        select: ["phone", "email", "firstname", "lastname"]
                    })
                    return res.status(200).json(orders)
                }else{
                    return res.status(400).json({message: "Buyerga faqatgina admin kira oladi!"})
                }
            }else{
                res.status(404).json({message: "JWT User Not Fount"})
            }
        } catch (error) {
            res.status(500).json({message: error})
        }
    },

    deleteSales: async (req, res) => {
        const {id} = req.params
        const delSalesHis = await Order.findByIdAndDelete(id)

        if(delSalesHis){
            return res.status(200).json({message: "Mahsulot o'chirildi", delSalesHis})
        }

        res.status(403).json({message: "Bunday Mahsulot yo'q!"}) 
    },

    getByIdOrder: async (req, res) => {
        const {productId} = req.params
        const {token} = req.headers
        try {
            if(token){
                const user = await JWT.verify(token, process.env.JWT_SECRET_KEY)
                if(user.role === "admin" || user.role === "operator"){
                    const order = await Order.find({productId}).populate({
                        path: "productId",
                        select: ["image", "name", "desc"]
                    }).populate({
                        path: "userId",
                        select: ["email", "firstname", "lastname", "phone"]
                    })
                    return res.status(200).json({message: "Sotilgan mahsulot", order})
                }
                return res.status(400).json({message: "Sizda JWT yo'q"})
            }else{
                res.status(400).json({message: "Sizda bunday huquq yo'q"})
            }            
        } catch (error) {
            res.status(500).json({message: error})
        }
    },

    getByIdAndOne: async (req, res) => {
        const {orderId} = req.params
        const {token} = req.headers
        try {
            if(token){
                const user = await JWT.verify(token, process.env.JWT_SECRET_KEY)
                if(user.role === "admin" || user.role === "operator"){
                    const order = await Order.findById(orderId).populate({
                        path: "productId",
                        select: ["image", "name", "desc"]
                    }).populate({
                        path: "userId",
                        select: ["email", "firstname", "lastname", "phone"]
                    })
                    return res.status(200).json({message: "Zakaz qilingan mahsulot", order})
                }
                return res.status(400).json({message: "Sizda JWT yo'q"})
            }else{
                res.status(400).json({message: "Sizda bunday huquq yo'q"})
            }
        } catch (error) {
            res.status(500).json({message: error})
        }
    }
}

module.exports = orderCtrl