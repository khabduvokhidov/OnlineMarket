const JWT = require("jsonwebtoken")

const userMiddlewere = async (req, res, next) => {
    try {
        const {token} = req.headers

        if(token) {
            const user = await JWT.verify(token, process.env.JWT_SECRET_KEY)
            req.body.userId = user.id
        }

        next()
    } catch (error) {
        console.error(error);
    }
}

module.exports = userMiddlewere