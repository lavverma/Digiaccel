require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const route = require("./routes/route.js")
const cors = require("cors")
const mongoose = require("mongoose")
const app = express()

const {PORT, DATA_BASE_CLUSTER_LINK, CLIENT_URL} = process.env

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))

app.use(cors())

mongoose.set('strictQuery', false)
mongoose.connect(DATA_BASE_CLUSTER_LINK,{
    useNewUrlParser: true
})
.then(()=>console.log(`MongoDB is connected`))
.catch((err)=>console.log(err))

app.use("/" , route)

app.listen(PORT, ()=>{
    console.log(`server is running on ${PORT}`);
})