const mongoose = require('mongoose')

const cardImageBasePath = 'uploads/cardImages'

const path = require('path')

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    datePosted: {
        type: Date,
        required: true,
        default: Date.now
    },
    price: {
        type: Number,
        required: true 
    },
    grade: {
        type: Number,
        required: true
    },
    cardText: {
        type: String,
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Seller'
    },
    itemImage: {
        type: String,
        required: true
    }
})

itemSchema.virtual('itemImagePath').get(function() {
    if (this.itemImage != null) {
        return path.join('/', cardImageBasePath, this.itemImage)
    }
})

module.exports = mongoose.model('Item', itemSchema)
module.exports.cardImageBasePath = cardImageBasePath