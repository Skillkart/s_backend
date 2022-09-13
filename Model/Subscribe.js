const mongoose = require('mongoose')

const SubscribeModel = new mongoose.Schema({
    email: String,
    createdAt :{
        type: Date ,
        default : Date.now()
    }
})

const Subcribe = mongoose.model("subscribe" , SubscribeModel)

module.exports = Subcribe