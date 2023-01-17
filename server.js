const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const fileUpload = require("express-fileupload")
const cors = require("cors")


dotenv.config()
const app = express()

// Routes
const userRouter = require("./src/routes/userRouter")
const productRouter = require("./src/routes/productRoutes")
const orderRouter = require("./src/routes/orderRouter")
const salesHstoryRouter = require("./src/routes/salesHisRouter")


// PORT on server
const PORT = process.env.PORT || 4000
const MONGO_URL = process.env.MONGO_URL

// Middlewere
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(fileUpload({useTempFiles: true}))
app.use(cors()) 

// usege of routes
app.use("/user", userRouter)
app.use("/product", productRouter)
app.use("/order", orderRouter)
app.use("/salesHis", salesHstoryRouter)

app.get("/", (req, res) => {
    res.send("Online Magazine")
})

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=> {
    app.listen(PORT, ()=> console.log(`server started on port:${PORT}`))

}).catch((error)=> console.error(error) )