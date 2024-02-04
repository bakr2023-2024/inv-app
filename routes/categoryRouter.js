const express = require("express");
const router = express.Router();
const { Category, filterInput } = require("../models");
router.get("/", async (req, res) => {
  try {
    const filter = filterInput(req.query);
    const data = await Category.find(filter);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Service Error" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    if (category) return res.json(category);
    else res.status(200).json({ error: "category not found" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "invalid id" });
  }
});
router.post("/", async (req, res) => {
  try {
    const name = req.body.name;
    const description = req.body.description;
    if (!name) {
      return res.status(400).json({ error: "Missing category name" });
    }
    const newCategory = new Category({ name, description });
    await newCategory.save();
    res.json(newCategory);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Service Error" });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;
    const filteredInput = filterInput(req.body);
    const category = await Category.findByIdAndUpdate(
      categoryId,
      filteredInput,
      { new: true }
    );
    if (category) {
      res.json(category);
    } else {
      res.status(200).json({ error: "category not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Service Error" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findByIdAndDelete(categoryId, {
      new: true,
    });
    if (category) {
      return res.json({ result: "successfully deleted" });
    } else {
      return res.status(200).json({ error: "category not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Service Error" });
  }
});
module.exports = router;
