const express = require('express')
const router = express.Router()
const Tribe = require('../model/tribe')

router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }

    try {
        const tribes = await Tribe.find(searchOptions)
        res.render('tribes/index', {tribes: tribes, searchOptions: req.query })
    }
    catch {
        res.redirect('/')

    }
})

//New Route
router.get('/new', (req, res) => {
    res.render('tribes/new', { tribe: new Tribe() })
})

//Create
router.post('/', async (req, res) => {
    const tribe = new Tribe({
        name: req.body.name
    })

    try {
        const newTribe = await tribe.save()
        res.redirect(`tribes`)
    } catch {
        res.render('tribes/new', {
            tribe: tribe,
            errorMessage: "Create ERROR"
        })
    }
})

module.exports = router