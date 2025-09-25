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
async function updateSweets(req,res) {
    const id = req.params.id;
    const { name, category, price, quantity } = req.body;
    try {
        const sweet = await Sweet.findByIdAndUpdate(
            id,
            { name, category, price, quantity },
            { new: true, runValidators: true }
        );
        if (!sweet) {
            return res.status(404).json({ msg: 'Sweet not found' });
        }
        res.status(200).json({ msg: 'Sweet updated successfully', sweet });
    } catch (err) {
        res.status(400).json({ msg: 'Error updating sweet', error: err.message });
    }
}
async function deleteSweets(req,res) {
    const id = req.params.id;
    const mongoose = require('mongoose');
    try {
        console.log('deleteSweets called with id:', id);
        console.log('About to delete sweet with id:', id);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ msg: 'Sweet not found' });
        }
        const sweet = await Sweet.findByIdAndDelete(id);
        if (!sweet) {
            return res.status(404).json({ msg: 'Sweet not found' });
        }
        console.log('Sweet found and deleted:', sweet);
        res.status(200).json({ msg: 'Sweet deleted successfully' });
    } catch (err) {
        console.log('Delete error:', err);
        res.status(500).json({ msg: 'Error deleting sweet', error: err.message });
    }
}

async function purchaseSweets(req,res) {
    const id = req.params.id;
    const { quantity } = req.body; 
    if (!quantity || quantity <= 0) {
        return res.status(400).json({ msg: 'Invalid purchase quantity' });
    }
    try {
        const sweet = await Sweet.findById(id);
        if (!sweet) {
            return res.status(404).json({ msg: 'Sweet not found' });
        }
        if (sweet.quantity < quantity) {
            return res.status(400).json({ msg: 'Not enough stock available' });
        }
        sweet.quantity -= quantity;
        await sweet.save();
        res.status(200).json({ msg: 'Purchase successful', sweet });
    } catch (err) {
        res.status(400).json({ msg: 'Error processing purchase', error: err.message });
    }
}

async function restockSweets(req,res) {
    const id = req.params.id;
    let { quantity } = req.body; 
    quantity = parseInt(quantity, 10);
    if (!quantity || quantity <= 0) {
        return res.status(400).json({ msg: 'Invalid restock quantity' });
    }
    try {
        const sweet = await Sweet.findById(id);
        if (!sweet) {
            return res.status(404).json({ msg: 'Sweet not found' });
        }
        sweet.quantity += quantity;
        await sweet.save();
        res.status(200).json({ msg: 'Restock successful', sweet });
    } catch (err) {
        res.status(400).json({ msg: 'Error processing restock', error: err.message });
    }
}






module.exports={
    getSweets,
    postSweets,
    searchSweets,
    updateSweets,
    deleteSweets,
    purchaseSweets,
    restockSweets
   
}