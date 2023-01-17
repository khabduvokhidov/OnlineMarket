const cloundinary = require("cloudinary")
const JWT = require("jsonwebtoken")
const fs = require("fs")
const dotenv = require("dotenv")
const Product = require("../modeles/productModel")

dotenv.config()

cloundinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

const productCtrl = {
    createProduct: async (req, res) => {
        const {token} = req.headers
        const user = await JWT.verify(token, process.env.JWT_SECRET_KEY)
        const file = req.files.image
        if (token){
            if(user.role === "operator" || user.role === "admin") {
                const {price, desc, name } = req.body
                
                try {
                    await cloundinary.v2.uploader.upload(file.tempFilePath, {folder: "internet magazine"}, async(err, result) => { // cloundinary qowib qoydm
                        if(err){
                            console.log(err);
                        }
                        removeTemp(file.tempFilePath)// tmp papkani ichdagni coptm function

                        req.body.image = {public_id: result.public_id, url: result.secure_url}
    
                        image = req.body.image
    
                    })
    
                    const newProduct = new Product({operatorId: user.id, price, desc, image, name})
    
                    newProduct.save()
    
                    res.status(201).json({message: "Yangi mahsulot qo'shildi", newProduct})
    
                } catch (error) {
                    removeTemp(file.tempFilePath)
                    console.log(error);
                    res.status(400).json({message: "Mahsulot xaqida toliq malumot brmadingiz!!!"})
                }
            }else{
                res.status(400).json({message: "mahsulotlarni faqatgina Operatr qo'sha olishi mumkin"})
                removeTemp(file.tempFilePath)
            }
        }else{
            res.status(400).json({message: "mahsulotlarni faqatgina Operatr qo'sha olishi mumkin"})
            removeTemp(file.tempFilePath)
        }
    },
    getAllProduct: async (req, res) => {
        try {
            const {token} = req.headers
            if(token){
                const user = await JWT.verify(token, process.env.JWT_SECRET_KEY)
                if(user.role === "admin"){
                    const products = await Product.find().populate({
                        path: "operatorId", 
                        select: ["role", "email", "phone", "firstname", "lastname"]
                    })
                    res.status(200).json(products)
                } else{
                    const products = await Product.find().populate({
                        path: "operatorId",   
                        select: ["firstname", "lastname", "email", "phone"]
                    })
                    res.status(200).json(products)
                }
            }else{
                const products = await Product.find().populate({
                    path: "operatorId", 
                    select: ["firstname", "lastname", "email", "phone"]
                })
                res.status(200).json(products)
            }
        } catch (error) {
            res.status(500).json({message: error})
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const {id} = req.params
            const deletProduct = await Product.findByIdAndDelete(id)
            
            if(deletProduct.image.public_id){
                await cloundinary.v2.uploader.destroy(deletProduct.image.public_id, (err, reslut)=> {
                    if(err){
                       return console.log(err);
                    }
                })
            }

            if(deletProduct){
               return res.status(200).json({message: "Mahsulot o'chirildi", deletProduct})
            }

            res.status(403).json({message: "Bunday Mahsulot yo'q!"}) 

        } catch (error) {
            res.status(500).json({message: error})
        }
    },

    // uploadProduct: async (req, res) => {
    //     try {
    //         const product = await Product.findById(req.params.id)

    //         await cloundinary.v2.uploader.destroy(product.cloundinary_id)
    //         const result = await cloundinary.v2.uploader.upload(req.file.path);
    //         const data = {
    //             name
    //         }

    //     } catch (error) {
    //         res.status(500).json({message: error})
    //     }
    // },

    getByIdProduct: async (req, res) => {
        const {operatorId} = req.params
        const {token} = req.headers
        try {
            if(token){
                const user = await JWT.verify(token, process.env.JWT_SECRET_KEY)
                if(user.role === "admin"){
                    const product = await Product.find({operatorId}).populate({
                        path: "operatorId", 
                        select: ["role", "email", "phone", "firstname", "lastname"]
                    })
                    return res.status(201).json(product)
                }
                return res.status(400).json({message: "Sizdan bunday huquq yoq"})
            }else{
                return res.status(400).json({message: "Sizda JWT yo'q"})
            }
        } catch (error) {
            res.status(500).json({message: error})
        }
    },

    getByIdOneProduct: async (req, res)=> {
        const {id} = req.params
        try {
            const product = await Product.findById(id).populate({
                path: "operatorId", 
                select: ["role", "email", "phone", "firstname", "lastname"]
            })
            if(product){
                return res.status(200).json(product)
            }
            res.status(404).json("no such User")
        } catch (error) {
            res.status(500).json({message: error})
        }
    }
}

function removeTemp(path){
  
    fs.unlink(path, (err)=> {
        if(err)throw err;
    })
}

module.exports = productCtrl