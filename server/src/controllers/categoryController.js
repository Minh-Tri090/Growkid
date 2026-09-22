const Category = require('../models/Category');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ order: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, slug, description, icon, image, order } = req.body;
    const category = new Category({
      name,
      slug: slug || name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      description,
      icon,
      image,
      order: order || 0,
    });
    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getCategories, createCategory };
