import { MongoClient } from "mongodb";
import mongoose from "mongoose";

async function main() {
  const url = "mongodb://127.0.0.1:27017/Alex";
  const dbName = "productManagementSystem";
  let client;

  try {
    await mongoose.connect(url);
    console.log("Connected successfully to server");

    const client = new MongoClient(url);
    await client.connect();
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    async function createData() {
      await db.collection("suppliers").insertMany([
        {
          name: "Electronics Supplier Inc.",
          contact: "John Doe",
          email: "john@electronicsupplier.com",
        },
        {
          name: "Fashion Supplier Co.",
          contact: "Jane Smith",
          email: "jane@fashionsupplier.com",
        },
      ]);

      await db.collection("categories").insertMany([
        { name: "Electronics", description: "Electronic devices" },
        { name: "Clothing", description: "Wearable items" },
        { name: "Home Appliances", description: "Appliances for home" },
        {
          name: "Beauty & Personal Care",
          description: "Beauty and personal care products",
        },
        {
          name: "Sports & Outdoors",
          description: "Sporting goods and outdoor equipment",
        },
      ]);

      await db.collection("products").insertMany([
        {
          name: "Laptop",
          category: "Electronics",
          price: 1000,
          cost: 800,
          stock: 50,
          supplier: "Electronics Supplier Inc.",
        },
        {
          name: "Smartphone",
          category: "Electronics",
          price: 800,
          cost: 600,
          stock: 40,
          supplier: "Electronics Supplier Inc.",
        },
        {
          name: "T-shirt",
          category: "Clothing",
          price: 20,
          cost: 10,
          stock: 100,
          supplier: "Fashion Supplier Co.",
        },
        {
          name: "Refrigerator",
          category: "Home Appliances",
          price: 1200,
          cost: 1000,
          stock: 30,
          supplier: "Electronics Supplier Inc.",
        },
        {
          name: "Shampoo",
          category: "Beauty & Personal Care",
          price: 10,
          cost: 5,
          stock: 80,
          supplier: "Fashion Supplier Co.",
        },
        {
          name: "Soccer Ball",
          category: "Sports & Outdoors",
          price: 30,
          cost: 20,
          stock: 60,
          supplier: "Fashion Supplier Co.",
        },
      ]);

      await db.collection("offers").insertMany([
        { products: ["Laptop", "Smartphone"], price: 1800, active: true },
        { products: ["T-shirt", "Shampoo"], price: 30, active: true },
        {
          products: ["Refrigerator", "Smartphone", "Soccer Ball"],
          price: 1830,
          active: false,
        },
      ]);

      console.log("Database setup complete.");
    }

    await createData();
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    // Close the database connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    if (client && client.isConnected()) {
      await client.close();
      console.log("Databass connection closed!");
    }
  }
}

main()
  .then(() => console.log("Application ended."))
  .catch((err) => console.error(err));
mongoose.connection.close();
