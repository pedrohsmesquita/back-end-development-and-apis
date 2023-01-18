const mongoose = require('mongoose');

const exerciseSchema = mongoose.Schema({
    description: String,
    duration: Number,
    date: Date,
    user_id: String
})

module.exports = mongoose.model("exercises", exerciseSchema);