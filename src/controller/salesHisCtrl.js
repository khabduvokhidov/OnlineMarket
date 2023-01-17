const SalesHstory = require("../modeles/salesHistoryModel")
const Order = require("../modeles/orderModel")
const JWT = require("jsonwebtoken")
const { default: mongoose } = require("mongoose")

const salesHisCtrl = {
    addSalesHis: async (req, res) => {

        const {operatorId, orderId} = req.body
        try {
            const order = await Order.findById(orderId)
            if(order.isActive){
                await Order.findByIdAndUpdate(orderId, {isActive: false})

                const newSalesHis = await SalesHstory({orderId: orderId, operatorId: operatorId})
                await newSalesHis.save()
                return res.status(201).send({message: "Mahsulot sizga berildi", newSalesHis})
            }
            res.status(404).send({message: "Mahsulotni boshqa operator oldi uzur!"})
        } catch (error) {
            res.status(500).send(error);
        }
    },

    getSalesHistory: async (req, res)=> {
        try {
            const salesHis = await SalesHstory.aggregate([
                {$match: {isActive: true}},
                {
                    $lookup: {  
                        from: "orders",
                        localField: "orderId",
                        foreignField: "_id",
                        as: "orderId",
                        pipeline: [
                            {$match: {isActive: false},},
                            {
                                $lookup: {
                                    from: "products",
                                    localField: 'productId',
                                    foreignField: "_id",
                                    as: "productId",
                                }
                            },
                        ]
                        
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "operatorId",
                        foreignField: "_id",
                        as: "operatorId"
                    },
                    
                },
            ])
            res.status(200).json(salesHis);
            
        } catch (error) {
            res.status(500).send(error);
        }
    },

    getByIdAndOrder: async (req, res) => {
        const {operatorId} = req.params
        const {token} = req.headers
        try {
            if(token){  // operator qanca mahsulotni olgani 
                const user = await JWT.verify(token, process.env.JWT_SECRET_KEY)
                if(user.role === "admin" || user.role === "operator"){
                    const salesHis = await SalesHstory.find({operatorId}).populate({
                        path: "operatorId",
                        select: ["firstname", "lastname", "email", "phone"] 
                    }).populate({
                        path: "orderId",
                        select: ["price", "count", "city", "district"]
                    })
                    return res.status(200).json(salesHis)
                }
                return res.status(400).json({message: "token yoq"})
            }else{
                res.status(401).json({message: "Sizda bunday huquq yo'q"})
            }
        } catch (error) {
            res.status(500).send(error);
        }
    },

    updateSalesHis: async (req, res) => {
        const {salesHisId} = req.params
        const {token} = req.headers
        try {
            if(token){
                const user = await JWT.verify(token, process.env.JWT_SECRET_KEY)
                const salesHis = await SalesHstory.findById(salesHisId)
                if(user.role === "admin"){
                    await SalesHstory.findByIdAndUpdate(salesHisId, {isActive: false})
                    await salesHis.updateOne({$set: req.body})
                    return await res.status(200).json({message: "mahsulot yengilandi", salesHis})
                }
                return res.status(400).json({message: "token yoq"})
            }else{
                res.status(401).json({message: "Sizda bunday huquq yo'q"})
            }
        } catch (error) {
            res.status(500).send(error)
        }
    },

    getIsActive: async (req, res) => { // mahsulot userga yetb bordi !!!
        const {token} = req.headers
        try {
            if(token){
                const user = await JWT.verify(token, process.env.JWT_SECRET_KEY)
                if(user.role === "admin" || user.role === "operator"){
                    const salesHis = await SalesHstory.find({isActive: false}).populate({
                        path: "operatorId",
                        select: ["firstname", "lastname", "email", "phone"]     
                    }).populate({
                        path: "orderId",
                        select: ["price", "count", "city", "district"]
                    })
                    return res.status(200).json(salesHis)
                }
                return res.status(400).json({message: "token yoq"})
            }else{
                res.status(401).json({message: "Sizda bunday huquq yo'q"})
            }
        } catch (error) {
            res.status(500).send(error);
        }
    },

    deleteSalesHis: async (req, res) => {
        const {id} = req.params
        try {
           const delSaleHis = await SalesHstory.findByIdAndDelete(id)

           if(delSaleHis){
            return res.status(201).json({message: "Mahsulot O'chirildi", delSaleHis})
           }
           return res.status(403).json({message: "bunday mahsulot yo'q"})
        } catch (error) {
            res.status(500).json({message: error})
        }
    }

}

module.exports = salesHisCtrl