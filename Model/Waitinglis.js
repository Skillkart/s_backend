const mongoose = require('mongoose')

const WaitingSchema = new mongoose.Schema({
    Name: String, 
    Email : String,
    phone : String
})

const Waitinglist = mongoose.model("waitinglist" , WaitingSchema)
module.exports = Waitinglist