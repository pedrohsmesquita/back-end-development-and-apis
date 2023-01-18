const mongoose = require('mongoose');

const urlShortenerSchema = mongoose.Schema({
        original_url: String,
        short_url: Number
})

module.exports = mongoose.model("URL", urlShortenerSchema);