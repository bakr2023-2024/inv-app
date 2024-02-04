const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    default: "",
  },
});
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  url: {
    type: String,
    default: "",
  },
});
const Category = mongoose.model("category", categorySchema);
const Item = mongoose.model("item", itemSchema);
categorySchema.pre("deleteOne", async (next) => {
  await Item.findByIdAndUpdate(this._id, { $unset: { category: 1 } });
  console.log(`deleted category and its refs in items`);
});
const filterInput = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([key, value]) => value&&key!=='id'));

module.exports = { Category, Item, filterInput };
