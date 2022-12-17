const express = require('express')
const router = express.Router()
const Item = require('../model/item')
const Seller = require('../model/seller')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const uploadPath = path.join('public', Item.cardImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req,file,callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

router.get('/', async (req, res) => {
    let query = Item.find()
    if (req.query.name != null && req.query.name != '') {
        query = query.regex('name', new RegExp(req.query.name, 'i'))
    }
    try {
        const items = await query.exec()
        res.render('items/index', {
            items: items,
            searchOptions: req.query
        })
    }
    catch {
        res.redirect('/')
    }
    
})

//New Route
router.get('/new', async (req, res) => {
    loadNewPage(res, new Item())
})

//Create
router.post('/', upload.single('itemImage'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const item = new Item({
        name: req.body.name,
        datePosted: new Date(req.body.datePosted),
        seller: req.body.seller,
        price: req.body.price,
        grade: req.body.grade,
        cardText: req.body.cardText,
        itemImage: fileName
    })

    try {
        const newItem = await item.save()
        //res.redirect(`item/${newItem.id}`)
        res.redirect('items')
    } catch {
        if (item.itemImage != null) {
            removeImage(item.itemImage)
        }
        loadNewPage(res, item, true)
    }
})

async function loadNewPage (res, item, hasError = false) {
    try {
        const sellers = await Seller.find({})
        const param = {
            sellers: sellers,
            item: item
        }
        if (hasError) param.errorMessage = 'Error Creating Item'
        res.render('items/new', param)
    } catch {
        res.redirect('/items')
    }
}

function removeImage(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}

module.exports = router