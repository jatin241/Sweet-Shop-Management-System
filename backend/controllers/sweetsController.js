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

module.exports={
    getSweets,
    postSweets,
   
}