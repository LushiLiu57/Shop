const mongoose = require('mongoose')

const tribeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Tribe', tribeSchema)