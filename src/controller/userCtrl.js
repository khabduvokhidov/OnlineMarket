const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")

const User = require("../modeles/userModel")

const userCtrl = {
    registerUser: async (req, res) => {
        const {email, password} = req.body
        try {
            const oldUser = await User.findOne({email})
            if(oldUser) {
                return res.status(400).json({message: "User oldin royhatdan o'tgan"})
            }
            const heshPassword = await bcrypt.hash(password, 10)

            req.body.password = heshPassword

            const newUser = new User(req.body)

            await newUser.save()

            const token = JWT.sign({email, id: newUser._id, role: newUser.role}, process.env.JWT_SECRET_KEY)

            res.status(201).json({message: "Ro'yhatdan o'tish muvaffaqiyatli amalga oshirildi", newUser, token})

        } catch (error) {
            res.status(500).json({message: error.message})
        }
    },

    loginUser: async (req, res) => {
        const {email, password} = req.body
        try {
            const user = await User.findOne({email})
            if(user){
                const validate = await bcrypt.compare(password, user.password)

                if(validate) {
                    const token = JWT.sign({email, id: user._id, role: user.role}, process.env.JWT_SECRET_KEY)
                    return res.status(200).json({message: "Kirish muvaffaqiyatli amalga oshirildi", user, token})
                }
                return res.status(400).json({message: "Paro'lingiz notog'ri"})
            }
            return res.status(404).json({message: "User not found"})
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await User.find({})

            res.status(200).json({message: "Barcha Userlar Royhat", users})
        } catch (error) {
            res.status(403).json(error)
        }
    },

    getAllOperators: async(req, res) => {
        try {
            const users = await User.find({role: "operator"})

            res.status(200).json(users)
        } catch (error) {
            res.status(500).json({message: error})
        }
    },
    
    delUser: async(req, res) => {
        const {id} = req.params
        const deluserId = await User.findByIdAndDelete(id)
        try {
            if(deluserId){
                res.status(201).json({message: "User O'chirildi", deluserId})
            }
        } catch (error) {
            res.status(500).json(error.message)
        }
    }
}

module.exports = userCtrl