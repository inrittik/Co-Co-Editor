const mongoose = require("mongoose");


const roomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: new Date
    }
})

const Room = mongoose.model("room", roomSchema);

module.exports = Room;
