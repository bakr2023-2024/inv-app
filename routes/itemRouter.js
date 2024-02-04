const express = require("express");
const router = express.Router();
const { Category, Item, filterInput } = require("../models");
const { ObjectId } = require("mongodb");
router.get("/", async (req, res) => {
  try {
    const filteredInput = filterInput(req.query);
    const data = await Item.find(filteredInput).populate({
      path: "category",
      model: Category,
      select: "name -_id",
    });
    if (data) res.json(data);
    else res.status(200).json({ error: "item(s) not found" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Service Error" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Item.findById(id).populate({
        path: "category",
        model: Category,
        select: "name -_id", 
    })
    if (data) return res.json(data);
    return res.status(200).json({ error: "item not found" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Service Error" });
  }
});
router.post("/", async (req, res) => {
  try {
    const filter = filterInput(req.body);
    if (!filter.name || !filter.price || !filter.category) {
      return res.status(400).json({ error: "missing name/price/category" });
    }
    const categoryId = await Category.findOne({ name: filter.category });
    if (!categoryId) return res.status(400).json({ error: "Invalid category" });
    filter["category"] = categoryId._id;
    const newItem = new Item(filter)
    await newItem.save();
    return res.json(newItem);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Service Error" });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    const filter = filterInput(req.body);
    if (filter.category) {
      const categoryId = await Category.findOne({ name: filter.category });
      if (!categoryId)
        return res.status(400).json({ error: "Invalid category" });
      filter["category"] = categoryId._id;
    }
    const newItem = await Item.findByIdAndUpdate(itemId, filter, {
      new: true,
    })
    if (newItem) return res.json(newItem);
    else return res.status(200).json({ error: "item not found" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Service Error" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Item.findByIdAndDelete(itemId, { new: true });
    if (item) return res.json({ result: "successfully deleted" });
    else return res.status(200).json({ error: "item not found" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Service Error" });
  }
});
module.exports = router;
