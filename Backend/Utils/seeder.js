const Product = require("../Models/productModel");
const products = require("../Data/products.json");
const dotenv = require("dotenv");
const path = require("path");
const connnectDatabase = require("../Config/dataBase");

dotenv.config({ path: "./backend/Config/config.env" });
connnectDatabase();

const dataSeeder = async () => {
  try {
    await Product.deleteMany();
    console.log("All products deleted successfully!");
    await Product.insertMany(products);
    console.log("All products added successfully!");
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

dataSeeder();
