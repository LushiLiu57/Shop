const express = require('express')
const router = express.Router()
const Card = require('../model/card')
const Tribe = require('../model/tribe')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const uploadPath = path.join('public', Card.cardImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req,file,callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

router.get('/', async (req, res) => {
    let query = Card.find()
    if (req.query.name != null && req.query.name != '') {
        query = query.regex('name', new RegExp(req.query.name, 'i'))
    }
    try {
        const cards = await query.exec()
        res.render('cards/index', {
            cards: cards,
            searchOptions: req.query
        })
    }
    catch {
        res.redirect('/')
    }
    
})

//New Route
router.get('/new', async (req, res) => {
    loadNewPage(res, new Card())
})

//Create
router.post('/', upload.single('cardImage'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const card = new Card({
        name: req.body.name,
        tribe: req.body.tribe,
        tier: req.body.tier,
        attack: req.body.attack,
        health: req.body.health,
        cardText: req.body.cardText,
        cardImage: fileName
    })

    try {
        const newCard = await card.save()
        //res.redirect(`card/${newCard.id}`)
        res.redirect('cards')
    } catch {
        if (card.cardImage != null) {
            removeImage(card.cardImage)
        }
        loadNewPage(res, card, true)
    }
})

async function loadNewPage (res, card, hasError = false) {
    try {
        const tribes = await Tribe.find({})
        const param = {
            tribes: tribes,
            card: card
        }
        if (hasError) param.errorMessage = 'Error Creating Card'
        res.render('cards/new', param)
    } catch {
        res.redirect('/cards')
    }
}

function removeImage(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}

module.exports = router