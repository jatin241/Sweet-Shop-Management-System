const Sweet = require("../models/sweetModel")

async function getSweets(req,res) {
    const sweets = await Sweet.find({})
    if (!sweets) {
        res.json({
            msg: "error fetching sweets"
        })
    }
    res.status(200).json({
        sweets
    })
}


async function postSweets(req, res) {
    const { name, category, price, quantity } = req.body;
    try {
        await Sweet.create({ name, category, price, quantity });
        res.status(201).json({ msg: "sweet added successfully" });
    } catch (err) {
        res.status(400).json({ msg: "error adding sweet", error: err.message });
    }
}

async function searchSweets(req,res) {
    const { name, category, minPrice, maxPrice } = req.body;
    const query = {};
    if (name) {
        query.name = { $regex: name, $options: 'i' };
    }
    if (category) {
        query.category = { $regex: category, $options: 'i' };
    }
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    try {
        const sweets = await Sweet.find(query);
        res.status(200).json({ sweets });
    } catch (err) {
        res.status(400).json({ msg: 'Error searching sweets', error: err.message });
    }
}



module.exports={
    getSweets,
    postSweets,
    searchSweets
   
}