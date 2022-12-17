const mongoose = require('mongoose')

const cardImageBasePath = 'uploads/cardImages'

const path = require('path')

const cardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    tier: {
        type: Number,
        required: true 
    },
    attack: {
        type: Number,
        required: true 
    },
    health: {
        type: Number,
        required: true
    },
    cardText: {
        type: String,
    },
    tribe: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Tribe'
    },
    cardImage: {
        type: String,
        required: true
    }
})

cardSchema.virtual('cardImagePath').get(function() {
    if (this.cardImage != null) {
        return path.join('/', cardImageBasePath, this.cardImage)
    }
})

module.exports = mongoose.model('Card', cardSchema)
module.exports.cardImageBasePath = cardImageBasePath