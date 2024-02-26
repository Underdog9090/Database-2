// const MongoClient = require('mongodb').MongoClient;
// const readline = require('readline');
// const url = 'mongodb://localhost:27017';
// const dbName = 'productManagementSystem';
// const client = new MongoClient(url);
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// async function main() {
//     try {
//         await client.connect();
//         console.log("Connected successfully to server");
//         const db = client.db(dbName);

//         async function addNewCategory() {
//             rl.question("Enter category name: ", function(name) {
//                 rl.question("Enter category description: ", async function(description) {
//                     await db.collection('categories').insertOne({ name, description });
//                     console.log("Category added successfully.");
//                     showMenu();
//                 });
//             });
//         }

//         async function addNewProduct() {
//             const categories = await db.collection('categories').find().toArray();
//             const suppliers = await db.collection('suppliers').find().toArray();
        
//             console.log("Select a category:");
//             categories.forEach((category, index) => {
//                 console.log(`${index + 1}. ${category.name}`);
//             });
        
//             rl.question("Category number: ", async function(categoryIndex) {
//                 const category = categories[parseInt(categoryIndex) - 1];
        
//                 console.log("Select a supplier:");
//                 suppliers.forEach((supplier, index) => {
//                     console.log(`${index + 1}. ${supplier.name}`);
//                 });
        
//                 rl.question("Supplier number: ", async function(supplierIndex) {
//                     const supplier = suppliers[parseInt(supplierIndex) - 1];
        
//                     rl.question("Enter product name: ", function(name) {
//                         rl.question("Enter price: ", function(price) {
//                             rl.question("Enter cost: ", function(cost) {
//                                 rl.question("Enter stock: ", async function(stock) {
//                                     await db.collection('products').insertOne({
//                                         name,
//                                         category: category.name,
//                                         price: parseFloat(price),
//                                         cost: parseFloat(cost),
//                                         stock: parseInt(stock),
//                                         supplier: supplier.name
//                                     });
//                                     console.log("Product added successfully.");
//                                     showMenu();
//                                 });
//                             });
//                         });
//                     });
//                 });
//             });
//         }

//         async function viewProductsCat() {
//             rl.question("Enter category name: ", async function(categoryName) {
//                 const products = await db.collection('products').find({ category: categoryName }).toArray();
//                 if (products.length) {
//                     console.log(`Products in ${categoryName}:`);
//                     products.forEach((product, index) => {
//                         console.log(`${index + 1}. Name: ${product.name}, Price: ${product.price}, Stock: ${product.stock}`);
//                     });
//                 } else {
//                     console.log("No products found in this category.");
//                 }
//                 showMenu();
//             });
//         }

//         async function viewProductsSup() {
//             rl.question("Enter supplier name: ", async function(supplierName) {
//                 const products = await db.collection('products').find({ "supplier": supplierName }).toArray();
//                 if (products.length) {
//                     console.log(`Products from ${supplierName}:`);
//                     products.forEach((product, index) => {
//                         console.log(`${index + 1}. Name: ${product.name}, Price: ${product.price}, Stock: ${product.stock}`);
//                     });
//                 } else {
//                     console.log("No products found for this supplier.");
//                 }
//                 showMenu();
//             });
//         }
        
//         async function viewAllOffersPrice() {
//             rl.question("Enter minimum price: ", function(minPrice) {
//                 rl.question("Enter maximum price: ", async function(maxPrice) {
//                     const offers = await db.collection('offers').find({
//                         price: {
//                             $gte: parseFloat(minPrice),
//                             $lte: parseFloat(maxPrice)
//                         }
//                     }).toArray();
//                     if (offers.length) {
//                         console.log("Offers within price range:");
//                         offers.forEach((offer, index) => {
//                             console.log(`${index + 1}. Offer ID: ${offer._id}, Price: ${offer.price}`);
//                             // Assuming offer.products is an array of product names or IDs
//                             console.log(`Products: ${offer.products.join(', ')}`);
//                         });
//                     } else {
//                         console.log("No offers found within this price range.");
//                     }
//                     showMenu();
//                 });
//             });
//         }

//         async function viewAllProductsCat() {
//             rl.question("Enter category name: ", async function(categoryName) {

//                 const productsInCategory = await db.collection('products').find({ category: categoryName }).toArray();
//                 const productNames = productsInCategory.map(product => product.name);
//                 const offersContainingProducts = await db.collection('offers').find({
//                     products: { $in: productNames }
//                 }).toArray();
        
//                 if (offersContainingProducts.length) {
//                     console.log(`Offers containing products from category '${categoryName}':`);
//                     offersContainingProducts.forEach((offer, index) => {
//                         console.log(`${index + 1}. Offer ID: ${offer._id}, Products: ${offer.products.join(', ')}, Price: ${offer.price}`);
//                     });
//                 } else {
//                     console.log(`No offers found containing products from category '${categoryName}'.`);
//                 }
//                 showMenu();
//             });
//         }

//         async function viewNumbersOfOffersNumberInStock() {
//             const offers = await db.collection('offers').find().toArray();
//             let allInStock = 0, someInStock = 0, noneInStock = 0;
        
//             for (let offer of offers) {
//                 const productDetails = await db.collection('products').find({ name: { $in: offer.products }}).toArray();
//                 const stockLevels = productDetails.map(product => product.stock > 0);
        
//                 if (stockLevels.every(inStock => inStock)) {
//                     allInStock++;
//                 } else if (stockLevels.some(inStock => inStock)) {
//                     someInStock++;
//                 } else {
//                     noneInStock++;
//                 }
//             }
        
//             console.log(`Offers with all products in stock: ${allInStock}`);
//             console.log(`Offers with some products in stock: ${someInStock}`);
//             console.log(`Offers with no products in stock: ${noneInStock}`);
//             showMenu();
//         }

//         async function createOrderProducts() {
//             rl.question("Enter product name: ", function(productName) {
//                 rl.question("Enter quantity: ", async function(quantity) {
//                     const product = await db.collection('products').findOne({ name: productName });
        
//                     if (product && product.stock >= parseInt(quantity)) {
//                         await db.collection('orders').insertOne({
//                             productName,
//                             quantity: parseInt(quantity),
//                             status: 'pending'
//                         });
//                         console.log(`Order for ${quantity} ${productName}(s) created.`);
//                     } else {
//                         console.log(`Not enough stock for ${productName}.`);
//                     }
//                     showMenu();
//                 });
//             });
//         }

//         async function createOrderOffers() {
//             rl.question("Enter offer ID: ", function(offerId) {
//                 rl.question("Enter quantity: ", async function(quantity) {
//                     const offer = await db.collection('offers').findOne({ _id: offerId });
        
//                     if (offer && offer.active) {
//                         await db.collection('orders').insertOne({
//                             offerId,
//                             quantity: parseInt(quantity),
//                             status: 'pending'
//                         });
//                         console.log(`Order for ${quantity} of offer ID ${offerId} created.`);
//                     } else {
//                         console.log(`Offer ID ${offerId} is not available.`);
//                     }
//                     showMenu();
//                 });
//             });
//         }

//         async function shipOrders() {
//             rl.question("Enter order ID to ship: ", async function(orderId) {
//                 const order = await db.collection('orders').findOne({ _id: orderId });
//                 if (order) {
//                     await db.collection('orders').updateOne({ _id: orderId }, { $set: { status: 'shipped' } });
//                     console.log(`Order ID ${orderId} shipped.`);
//                 } else {
//                     console.log(`Order ID ${orderId} not found.`);
//                 }
//                 showMenu();
//             });
//         }

//         async function addNewSupplier() {
//             rl.question("Enter supplier name: ", function(name) {
//                 rl.question("Enter contact person: ", function(contact) {
//                     rl.question("Enter email address: ", async function(email) {
//                         await db.collection('suppliers').insertOne({ name, contact, email });
//                         console.log("Supplier added successfully.");
//                         showMenu();
//                     });
//                 });
//             });
//         }

//         async function viewSuppliers() {
//             const suppliers = await db.collection('suppliers').find().toArray();
//             if (suppliers.length) {
//                 console.log("Suppliers:");
//                 suppliers.forEach((supplier, index) => {
//                     console.log(`${index + 1}. Name: ${supplier.name}, Contact: ${supplier.contact}, Email: ${supplier.email}`);
//                 });
//             } else {
//                 console.log("No suppliers found.");
//             }
//             showMenu();
//         }
        
//         async function viewAllSales() {
//             const orders = await db.collection('orders').find().toArray();
//             if (orders.length) {
//                 console.log("Sales Orders:");
//                 orders.forEach((order, index) => {
//                     console.log(`${index + 1}. Order ID: ${order._id}, Product/Offer: ${order.productName || order.offerId}, Quantity: ${order.quantity}, Status: ${order.status}`);
//                 });
//             } else {
//                 console.log("No sales orders found.");
//             }
//             showMenu();
//         }

//         async function viewSumProfits() {
//             const orders = await db.collection('orders').find({ status: 'shipped' }).toArray();
//             let totalProfit = 0;
        
//             for (const order of orders) {
//                 const productOrOffer = await db.collection(order.productName ? 'products' : 'offers').findOne({ _id: order.productName ? order.productName : order.offerId });
//                 if (productOrOffer) {
//                     const profitPerUnit = (productOrOffer.price * 0.2);
//                     totalProfit += profitPerUnit * order.quantity;
//                 }
//             }
        
//             console.log(`Total profit from all sales: $${totalProfit.toFixed(2)}`);
//             showMenu();
//         }
        

//         function showMenu() {
//             console.log("\nMenu:");
//             console.log("1. Add new category");
//             console.log("2. Add new product");
//             console.log("3. View products by category");
//             console.log("4. View products by supplier");
//             console.log("5. View all offer within a price range");
//             console.log("6. Vew all offer that contain a product from a specific category");
//             console.log("7. View the number of offers based on the number of its products in stock");
//             console.log("8. Create order for products");
//             console.log("9. Create order for offers");
//             console.log("10. Ship orders");
//             console.log("11. Add a new supplier");
//             console.log("12. View suppliers");
//             console.log("13. View all sales")
//             console.log("14. View sum of all profits")
//             console.log("Enter your choice: ");

//             rl.question("Option: ", function(option) {
//                 switch (option) {
//                     case '1':
//                         addNewCategory();
//                         break;
//                     case '2':
//                         addNewProduct();
//                         break;
//                     case '3':
//                         viewProductsCat();
//                         break;
//                     case '4':
//                         viewProductsSup();
//                         break;
//                     case '5':
//                         viewAllOffersPrice();
//                         break;
//                     case '6':
//                         viewAllProductsCat();
//                         break;
//                     case '7':
//                         viewNumbersOfOffersNumberInStock();
//                         break;
//                     case '8':
//                         createOrderProducts();
//                         break;
//                     case '9':
//                         createOrderOffers();
//                         break;
//                     case '10':
//                         shipOrders();
//                         break;
//                     case '11':
//                         addNewSupplier();
//                         break;
//                     case '12':
//                         viewSuppliers();
//                         break;
//                     case '13':
//                         viewAllSales();
//                         break;
//                     case '14':
//                         viewSumProfits();
//                         break;
//                     default:
//                         console.log("Invalid option selected.");
//                         showMenu();
//                 }
//             });
//         }

//         showMenu();
//     } catch (err) {
//         console.error("An error occurred:", err);
//     }
// }

// main().then(() => console.log("Application ended.")).catch(err => console.error(err));


import { MongoClient } from 'mongodb';
import readline from 'readline';

const url = 'mongodb://localhost:27017';
const dbName = 'productManagementSystem';
const client = new MongoClient(url);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    try {
        await client.connect();
        console.log("Connected successfully to server");
        const db = client.db(dbName);

        async function addNewCategory() {
            rl.question("Enter category name: ", function(name) {
                rl.question("Enter category description: ", async function(description) {
                    await db.collection('categories').insertOne({ name, description });
                    console.log("Category added successfully.");
                    showMenu();
                });
            });
        }

        async function addNewProduct() {
            const categories = await db.collection('categories').find().toArray();
            const suppliers = await db.collection('suppliers').find().toArray();
        
            console.log("Select a category:");
            categories.forEach((category, index) => {
                console.log(`${index + 1}. ${category.name}`);
            });
        
            rl.question("Category number: ", async function(categoryIndex) {
                const category = categories[parseInt(categoryIndex) - 1];
        
                console.log("Select a supplier:");
                suppliers.forEach((supplier, index) => {
                    console.log(`${index + 1}. ${supplier.name}`);
                });
        
                rl.question("Supplier number: ", async function(supplierIndex) {
                    const supplier = suppliers[parseInt(supplierIndex) - 1];
        
                    rl.question("Enter product name: ", function(name) {
                        rl.question("Enter price: ", function(price) {
                            rl.question("Enter cost: ", function(cost) {
                                rl.question("Enter stock: ", async function(stock) {
                                    await db.collection('products').insertOne({
                                        name,
                                        category: category.name,
                                        price: parseFloat(price),
                                        cost: parseFloat(cost),
                                        stock: parseInt(stock),
                                        supplier: supplier.name
                                    });
                                    console.log("Product added successfully.");
                                    showMenu();
                                });
                            });
                        });
                    });
                });
            });
        }

        async function viewProductsCat() {
            rl.question("Enter category name: ", async function(categoryName) {
                const products = await db.collection('products').find({ category: categoryName }).toArray();
                if (products.length) {
                    console.log(`Products in ${categoryName}:`);
                    products.forEach((product, index) => {
                        console.log(`${index + 1}. Name: ${product.name}, Price: ${product.price}, Stock: ${product.stock}`);
                    });
                } else {
                    console.log("No products found in this category.");
                }
                showMenu();
            });
        }

        async function viewProductsSup() {
            rl.question("Enter supplier name: ", async function(supplierName) {
                const products = await db.collection('products').find({ "supplier": supplierName }).toArray();
                if (products.length) {
                    console.log(`Products from ${supplierName}:`);
                    products.forEach((product, index) => {
                        console.log(`${index + 1}. Name: ${product.name}, Price: ${product.price}, Stock: ${product.stock}`);
                    });
                } else {
                    console.log("No products found for this supplier.");
                }
                showMenu();
            });
        }
        
        async function viewAllOffersPrice() {
            rl.question("Enter minimum price: ", function(minPrice) {
                rl.question("Enter maximum price: ", async function(maxPrice) {
                    const offers = await db.collection('offers').find({
                        price: {
                            $gte: parseFloat(minPrice),
                            $lte: parseFloat(maxPrice)
                        }
                    }).toArray();
                    if (offers.length) {
                        console.log("Offers within price range:");
                        offers.forEach((offer, index) => {
                            console.log(`${index + 1}. Offer ID: ${offer._id}, Price: ${offer.price}`);
                            // Assuming offer.products is an array of product names or IDs
                            console.log(`Products: ${offer.products.join(', ')}`);
                        });
                    } else {
                        console.log("No offers found within this price range.");
                    }
                    showMenu();
                });
            });
        }

        async function viewAllProductsCat() {
            rl.question("Enter category name: ", async function(categoryName) {

                const productsInCategory = await db.collection('products').find({ category: categoryName }).toArray();
                const productNames = productsInCategory.map(product => product.name);
                const offersContainingProducts = await db.collection('offers').find({
                    products: { $in: productNames }
                }).toArray();
        
                if (offersContainingProducts.length) {
                    console.log(`Offers containing products from category '${categoryName}':`);
                    offersContainingProducts.forEach((offer, index) => {
                        console.log(`${index + 1}. Offer ID: ${offer._id}, Products: ${offer.products.join(', ')}, Price: ${offer.price}`);
                    });
                } else {
                    console.log(`No offers found containing products from category '${categoryName}'.`);
                }
                showMenu();
            });
        }

        async function viewNumbersOfOffersNumberInStock() {
            const offers = await db.collection('offers').find().toArray();
            let allInStock = 0, someInStock = 0, noneInStock = 0;
        
            for (let offer of offers) {
                const productDetails = await db.collection('products').find({ name: { $in: offer.products }}).toArray();
                const stockLevels = productDetails.map(product => product.stock > 0);
        
                if (stockLevels.every(inStock => inStock)) {
                    allInStock++;
                } else if (stockLevels.some(inStock => inStock)) {
                    someInStock++;
                } else {
                    noneInStock++;
                }
            }
        
            console.log(`Offers with all products in stock: ${allInStock}`);
            console.log(`Offers with some products in stock: ${someInStock}`);
            console.log(`Offers with no products in stock: ${noneInStock}`);
            showMenu();
        }

        async function createOrderProducts() {
            rl.question("Enter product name: ", function(productName) {
                rl.question("Enter quantity: ", async function(quantity) {
                    const product = await db.collection('products').findOne({ name: productName });
        
                    if (product && product.stock >= parseInt(quantity)) {
                        await db.collection('orders').insertOne({
                            productName,
                            quantity: parseInt(quantity),
                            status: 'pending'
                        });
                        console.log(`Order for ${quantity} ${productName}(s) created.`);
                    } else {
                        console.log(`Not enough stock for ${productName}.`);
                    }
                    showMenu();
                });
            });
        }

        async function createOrderOffers() {
            rl.question("Enter offer ID: ", function(offerId) {
                rl.question("Enter quantity: ", async function(quantity) {
                    const offer = await db.collection('offers').findOne({ _id: offerId });
        
                    if (offer && offer.active) {
                        await db.collection('orders').insertOne({
                            offerId,
                            quantity: parseInt(quantity),
                            status: 'pending'
                        });
                        console.log(`Order for ${quantity} of offer ID ${offerId} created.`);
                    } else {
                        console.log(`Offer ID ${offerId} is not available.`);
                    }
                    showMenu();
                });
            });
        }

        async function shipOrders() {
            rl.question("Enter order ID to ship: ", async function(orderId) {
                const order = await db.collection('orders').findOne({ _id: orderId });
                if (order) {
                    await db.collection('orders').updateOne({ _id: orderId }, { $set: { status: 'shipped' } });
                    console.log(`Order ID ${orderId} shipped.`);
                } else {
                    console.log(`Order ID ${orderId} not found.`);
                }
                showMenu();
            });
        }

        async function addNewSupplier() {
            rl.question("Enter supplier name: ", function(name) {
                rl.question("Enter contact person: ", function(contact) {
                    rl.question("Enter email address: ", async function(email) {
                        await db.collection('suppliers').insertOne({ name, contact, email });
                        console.log("Supplier added successfully.");
                        showMenu();
                    });
                });
            });
        }

        async function viewSuppliers() {
            const suppliers = await db.collection('suppliers').find().toArray();
            if (suppliers.length) {
                console.log("Suppliers:");
                suppliers.forEach((supplier, index) => {
                    console.log(`${index + 1}. Name: ${supplier.name}, Contact: ${supplier.contact}, Email: ${supplier.email}`);
                });
            } else {
                console.log("No suppliers found.");
            }
            showMenu();
        }
        
        async function viewAllSales() {
            const orders = await db.collection('orders').find().toArray();
            if (orders.length) {
                console.log("Sales Orders:");
                orders.forEach((order, index) => {
                    console.log(`${index + 1}. Order ID: ${order._id}, Product/Offer: ${order.productName || order.offerId}, Quantity: ${order.quantity}, Status: ${order.status}`);
                });
            } else {
                console.log("No sales orders found.");
            }
            showMenu();
        }

        async function viewSumProfits() {
            const orders = await db.collection('orders').find({ status: 'shipped' }).toArray();
            let totalProfit = 0;
        
            for (const order of orders) {
                const productOrOffer = await db.collection(order.productName ? 'products' : 'offers').findOne({ _id: order.productName ? order.productName : order.offerId });
                if (productOrOffer) {
                    const profitPerUnit = (productOrOffer.price * 0.2);
                    totalProfit += profitPerUnit * order.quantity;
                }
            }
        
            console.log(`Total profit from all sales: $${totalProfit.toFixed(2)}`);
            showMenu();
        }
        

        function showMenu() {
            console.log("\nMenu:");
            console.log("1. Add new category");
            console.log("2. Add new product");
            console.log("3. View products by category");
            console.log("4. View products by supplier");
            console.log("5. View all offer within a price range");
            console.log("6. Vew all offer that contain a product from a specific category");
            console.log("7. View the number of offers based on the number of its products in stock");
            console.log("8. Create order for products");
            console.log("9. Create order for offers");
            console.log("10. Ship orders");
            console.log("11. Add a new supplier");
            console.log("12. View suppliers");
            console.log("13. View all sales")
            console.log("14. View sum of all profits")
            console.log("Enter your choice: ");

            rl.question("Option: ", function(option) {
                switch (option) {
                    case '1':
                        addNewCategory();
                        break;
                    case '2':
                        addNewProduct();
                        break;
                    case '3':
                        viewProductsCat();
                        break;
                    case '4':
                        viewProductsSup();
                        break;
                    case '5':
                        viewAllOffersPrice();
                        break;
                    case '6':
                        viewAllProductsCat();
                        break;
                    case '7':
                        viewNumbersOfOffersNumberInStock();
                        break;
                    case '8':
                        createOrderProducts();
                        break;
                    case '9':
                        createOrderOffers();
                        break;
                    case '10':
                        shipOrders();
                        break;
                    case '11':
                        addNewSupplier();
                        break;
                    case '12':
                        viewSuppliers();
                        break;
                    case '13':
                        viewAllSales();
                        break;
                    case '14':
                        viewSumProfits();
                        break;
                    default:
                        console.log("Invalid option selected.");
                        showMenu();
                }
            });
        }

        showMenu();
    } catch (err) {
        console.error("An error occurred:", err);
    }
}

main().then(() => console.log("Application ended.")).catch(err => console.error(err));
